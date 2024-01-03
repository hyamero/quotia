import { z } from "zod";
import { nanoid } from "nanoid";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { likes, posts } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

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

        with: {
          author: true,
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      with: {
        author: true,
        likes: true,
      },
    });

    return {
      posts: data.map((post) => {
        return {
          ...post,
          likes: post.likes.length,
          likedByUser: post.likes.some(
            (like) => like.userId === ctx.session?.user.id,
          ),
        };
      }),
    };
  }),

  toggleLike: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingLike = await ctx.db.query.likes.findFirst({
        where: (likes, { and, eq }) =>
          and(
            eq(likes.postId, input.postId),
            eq(likes.userId, ctx.session.user.id),
          ),
      });

      if (existingLike == undefined || existingLike == null) {
        await ctx.db.insert(likes).values({
          userId: ctx.session.user.id,
          postId: input.postId,
        });

        return { addedLike: true };
      } else {
        await ctx.db
          .delete(likes)
          .where(
            and(
              eq(likes.postId, input.postId),
              eq(likes.userId, ctx.session.user.id),
            ),
          );

        return { addedLike: false };
      }
    }),
});
