import { z } from "zod";
import { eq, or } from "drizzle-orm";

import {
  createTRPCRouter,
  //   protectedProcedure,
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
});
