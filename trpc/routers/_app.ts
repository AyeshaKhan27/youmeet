import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const appRouter = createTRPCRouter({
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
