import { z } from "zod";
import { nanoid } from "nanoid";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        authorId: ctx.session.user.id,
        content: input.content,
        id: nanoid(),
      });

      return ctx.db.query.posts.findFirst({
        where: (posts, { eq }) => eq(posts.authorId, ctx.session.user.id),
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),
});
