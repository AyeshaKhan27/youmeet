import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { db } from "@/db";
import { agents } from "@/db/schema";
import {
  agentsInsertSchema,
  agentsUpdateSchema,
} from "@/modules/agents/schemas";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

type AgentRow = typeof agents.$inferSelect;
type AgentWithCount = AgentRow & { meetingCount: number };

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }): Promise<AgentWithCount> => {
      const [existingAgent] = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: sql<number>`0`,
        })
        .from(agents)
        .where(
          and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id)),
        );

      if (!existingAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      return existingAgent;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      }),
    )
    .query(
      async ({
        ctx,
        input,
      }): Promise<{
        items: AgentWithCount[];
        total: number;
        totalPages: number;
      }> => {
        const { search, page, pageSize } = input;

        const whereClause = and(
          eq(agents.userId, ctx.auth.user.id),
          search ? ilike(agents.name, `%${search}%`) : undefined,
        );

        const data = await db
          .select({
            ...getTableColumns(agents),
            meetingCount: sql<number>`0`,
          })
          .from(agents)
          .where(whereClause)
          .orderBy(desc(agents.createdAt), desc(agents.id))
          .limit(pageSize)
          .offset((page - 1) * pageSize);

        const [totalRow] = await db
          .select({ count: count() })
          .from(agents)
          .where(whereClause);

        const total = totalRow?.count ?? 0;
        const totalPages = Math.ceil(total / pageSize);

        return {
          items: data,
          total,
          totalPages,
        };
      },
    ),

  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ ctx, input }): Promise<AgentRow> => {
      const [createdAgent] = await db
        .insert(agents)
        .values({
          name: input.name,
          instructions: input.instructions,
          userId: ctx.auth.user.id,
        })
        .returning();

      return createdAgent;
    }),

  update: protectedProcedure
    .input(agentsUpdateSchema)
    .mutation(async ({ ctx, input }): Promise<AgentRow> => {
      const [updatedAgent] = await db
        .update(agents)
        .set({
          name: input.name,
          instructions: input.instructions,
        })
        .where(
          and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id)),
        )
        .returning();

      if (!updatedAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      return updatedAgent;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }): Promise<AgentRow> => {
      const [removedAgent] = await db
        .delete(agents)
        .where(
          and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id)),
        )
        .returning();

      if (!removedAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      return removedAgent;
    }),
});
