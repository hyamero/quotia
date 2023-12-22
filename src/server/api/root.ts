import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * Primary router for the server.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
});

export type AppRouter = typeof appRouter;
