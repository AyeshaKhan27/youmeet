import { agentsRouter } from "@/modules/agents/server/procedures";
import { meetingsRouter } from "@/modules/meetings/server/procedures";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter,
  health: baseProcedure.query(() => ({
    status: "ok",
  })),
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(({ input }) => ({
      greeting: `hello ${input.text}`,
    })),
});

export type AppRouter = typeof appRouter;
