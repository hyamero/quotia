import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";

/**
 * Primary router for the server.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
