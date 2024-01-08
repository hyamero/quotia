import { z } from "zod";
import { nanoid } from "nanoid";
import { eq, and, desc, lte, ne } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { likes, posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  inifiniteFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.posts.findMany({
        orderBy: [desc(posts.createdAt)],
        limit: input.limit + 1,
        where: and(
          lte(posts.createdAt, input.cursor?.createdAt ?? new Date()),
          ne(posts.id, input.cursor?.id ?? ""),
        ),
        with: {
          author: true,
          likes: true,
        },
      });

      let nextPageCursor: typeof input.cursor | undefined;

      if (data.length > input.limit) {
        const pointerItem = data[data.length - 1];

        if (pointerItem !== null && pointerItem !== undefined) {
          nextPageCursor = {
            id: pointerItem.id,
            createdAt: pointerItem.createdAt,
          };
        }
      }

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
        nextPageCursor,
      };
    }),

  create: protectedProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        authorId: ctx.session.user.id,
        content: input.content,
        id: nanoid(),
      });

      return await ctx.db.query.posts.findFirst({
        where: eq(posts.authorId, ctx.session.user.id),
        orderBy: [desc(posts.createdAt)],
        columns: {
          id: true,
          authorId: true,
          content: true,
          createdAt: true,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(posts).where(eq(posts.id, input.postId));
    }),

  toggleLike: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingLike = await ctx.db.query.likes.findFirst({
        where: and(
          eq(likes.postId, input.postId),
          eq(likes.userId, ctx.session.user.id),
        ),
      });

      if (existingLike == undefined || existingLike == null) {
        await ctx.db.insert(likes).values({
          userId: ctx.session.user.id,
          postId: input.postId,
        });
      } else {
        await ctx.db
          .delete(likes)
          .where(
            and(
              eq(likes.postId, input.postId),
              eq(likes.userId, ctx.session.user.id),
            ),
          );
      }
    }),
});
