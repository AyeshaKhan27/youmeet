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
import { agents, meetings } from "@/db/schema";
import {
  meetingsInsertSchema,
  meetingsUpdateSchema,
} from "@/modules/meetings/schemas";
import { MeetingStatus } from "@/modules/meetings/types";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

type MeetingRow = typeof meetings.$inferSelect;
type AgentRow = typeof agents.$inferSelect;
type MeetingWithDetails = MeetingRow & {
  agent: AgentRow;
  duration: number;
};

export const meetingsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }): Promise<MeetingWithDetails> => {
      const [existingMeeting] = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (${meetings.endedAt} - ${meetings.startedAt}))`.as(
            "duration",
          ),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, ctx.auth.user.id),
          ),
        );

      if (!existingMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return existingMeeting;
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
        agentId: z.string().nullish(),
        status: z
          .enum([
            MeetingStatus.Upcoming,
            MeetingStatus.Active,
            MeetingStatus.Completed,
            MeetingStatus.Processing,
            MeetingStatus.Cancelled,
          ])
          .nullish(),
      }),
    )
    .query(
      async ({
        ctx,
        input,
      }): Promise<{
        items: MeetingWithDetails[];
        total: number;
        totalPages: number;
      }> => {
        const { search, page, pageSize, status, agentId } = input;

        const whereClause = and(
          eq(meetings.userId, ctx.auth.user.id),
          search ? ilike(meetings.name, `%${search}%`) : undefined,
          status ? eq(meetings.status, status) : undefined,
          agentId ? eq(meetings.agentId, agentId) : undefined,
        );

        const data = await db
          .select({
            ...getTableColumns(meetings),
            agent: agents,
            duration: sql<number>`EXTRACT(EPOCH FROM (${meetings.endedAt} - ${meetings.startedAt}))`.as(
              "duration",
            ),
          })
          .from(meetings)
          .innerJoin(agents, eq(meetings.agentId, agents.id))
          .where(whereClause)
          .orderBy(desc(meetings.createdAt), desc(meetings.id))
          .limit(pageSize)
          .offset((page - 1) * pageSize);

        const [totalRow] = await db
          .select({ count: count() })
          .from(meetings)
          .innerJoin(agents, eq(meetings.agentId, agents.id))
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
    .input(meetingsInsertSchema)
    .mutation(async ({ ctx, input }): Promise<MeetingRow> => {
      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          name: input.name,
          agentId: input.agentId,
          userId: ctx.auth.user.id,
        })
        .returning();

      return createdMeeting;
    }),

  update: protectedProcedure
    .input(meetingsUpdateSchema)
    .mutation(async ({ ctx, input }): Promise<MeetingRow> => {
      const [updatedMeeting] = await db
        .update(meetings)
        .set({
          name: input.name,
          agentId: input.agentId,
        })
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, ctx.auth.user.id),
          ),
        )
        .returning();

      if (!updatedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return updatedMeeting;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }): Promise<MeetingRow> => {
      const [removedMeeting] = await db
        .delete(meetings)
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, ctx.auth.user.id),
          ),
        )
        .returning();

      if (!removedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return removedMeeting;
    }),
});
