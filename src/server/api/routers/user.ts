import { z } from "zod";
import {
  createTRPCRouter,
  //   protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { eq, or } from "drizzle-orm";
import { users } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.users.findFirst({
        where: or(eq(users.id, input.id), eq(users.slug, input.id)),
        columns: {
          id: true,
          slug: true,
          name: true,
          email: true,
          image: true,
        },
      });
    }),

  getUserSlug: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, input.id),
        columns: {
          slug: true,
        },
      });
    }),
});
