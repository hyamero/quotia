"use client";

import { useEffect } from "react";
import Link from "next/link";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/components/ui/avatar";

import { type User, useUser } from "~/lib/useStore";
import { Button } from "~/app/components/ui/button";
import { UserFeed } from "./user-feed";

export default function UserProfile({ user }: { user?: User }) {
  if (!user) {
    return <NoUser />;
  }

  const currentUser = useUser();
  const isCurrentUser = currentUser?.id === user?.id;

  useEffect(() => {
    if (user?.slug) {
      const newUrl = `@${user.slug}`;

      window.history.replaceState(
        { ...window.history.state, as: newUrl, url: newUrl },
        "",
        newUrl,
      );
    }
  }, [user?.slug]);

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
    <main>
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

      <UserFeed authorId={user.id} />
    </main>
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
