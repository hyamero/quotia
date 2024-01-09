import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/components/ui/avatar";
import { Button } from "~/app/components/ui/button";

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await getServerAuthSession();
  const user = await api.user.getUser.query({ id: params.slug });

  const isCurrentUser = session?.user?.id === user?.id;

  if (!user) return <NoUser />;

  const slug = () => {
    if (user.slug) {
      return "@" + user.slug;
    } else {
      if (isCurrentUser) {
        return "Edit slug";
      } else {
        return null;
      }
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between py-5">
        <div>
          <p className="text-3xl font-bold">{user.name}</p>
          <span className="text-zinc-400">{slug()}</span>
        </div>
        <Avatar className="h-24 w-24">
          <AvatarImage
            className="rounded-full"
            src={user.image as string | undefined}
            alt={`${user.name}'s avatar`}
          />
          <AvatarFallback className="text-xs">
            {user.name?.split(" ").at(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      <Button variant="outline" className="w-full">
        Edit Profile
      </Button>
    </section>
  );
}

const NoUser = () => {
  return (
    <div className="container flex h-screen flex-col items-center justify-center gap-12 px-4 py-16 ">
      <p className="text-center text-2xl text-white">User not found</p>
      <Link
        href={"/api/auth/signin"}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        Sign in
      </Link>
    </div>
  );
};
