import Link from "next/link";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await getServerAuthSession();
  const user = await api.user.getUser.query({ id: params.slug });

  if (!user)
    return (
      <div className="container flex h-screen flex-col items-center justify-center gap-12 px-4 py-16 ">
        <p className="text-center text-2xl text-white">User not found</p>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          Sign in
        </Link>
      </div>
    );

  if (user.id === session?.user?.id)
    return (
      <div className="container flex h-screen flex-col items-center justify-center gap-12 px-4 py-16 ">
        <p className="text-center text-2xl text-white">
          Logged in as {user.name}
        </p>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          Sign out
        </Link>
      </div>
    );
}
