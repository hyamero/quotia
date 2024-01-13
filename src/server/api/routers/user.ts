import { z } from "zod";
import { eq, or } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { users } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        columns: z.object({
          id: z.boolean().optional(),
          slug: z.boolean().optional(),
          name: z.boolean().optional(),
          email: z.boolean().optional(),
          image: z.boolean().optional(),
        }),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.users.findFirst({
        where: or(eq(users.id, input.id), eq(users.slug, input.id)),
        columns: {
          id: input.columns?.id,
          slug: input.columns?.slug,
          name: input.columns?.name,
          email: input.columns?.email,
          image: input.columns?.image,
        },
      });
    }),

  editUser: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(30),
        slug: z.string().min(3).max(30),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({
          name: input.name,
          slug: input.slug,
        })
        .where(eq(users.id, ctx.session.user.id));
    }),

  slugAvaliable: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: or(eq(users.id, input), eq(users.slug, input)),
        columns: {
          id: true,
          slug: true,
        },
      });

      return user ? false : true;
    }),
});
