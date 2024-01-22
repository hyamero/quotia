"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar";

import { type User } from "~/lib/types";
import { Posts } from "../post/posts";
import { EditUserModal } from "./edit-profile-modal";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useBoundStore } from "~/lib/use-bound-store";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/_components/ui/tabs";

export default function UserProfile({ user }: { user?: User }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user) {
    return <NoUser />;
  }

  const currentUser = useBoundStore((state) => state.user);
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
      return null;
    }
  };

  return (
    mounted && (
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
          {isCurrentUser ? (
            <EditUserModal user={user} />
          ) : (
            <div className="flex gap-2">
              <Button
                title="Follow"
                type="button"
                variant="outline"
                onClick={() => toast.info("Feature coming soon!")}
                className=" w-full"
              >
                Follow
              </Button>

              <Button
                title="Mention"
                type="button"
                variant="outline"
                onClick={() => toast.info("Feature coming soon!")}
                className=" w-full"
              >
                Mention
              </Button>
            </div>
          )}
        </section>

        <Tabs defaultValue="posts" className="mt-5 w-full">
          <TabsList className="w-full border-b bg-transparent">
            <TabsTrigger value="posts" className="w-full">
              Posts
            </TabsTrigger>
            <TabsTrigger value="replies" className="w-full">
              Replies
            </TabsTrigger>
            <TabsTrigger value="likes" className="w-full">
              Likes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            {/* User Feed with authorId param
       to list user's posts */}
            <Posts authorId={user.id} />
          </TabsContent>

          <TabsContent value="replies">
            <div className="flex justify-center pt-10 text-xl font-semibold">
              Replies tab coming soon..
            </div>
          </TabsContent>

          <TabsContent value="likes">
            <div className="flex justify-center pt-10 text-xl font-semibold">
              Likes tab coming soon..
            </div>
          </TabsContent>
        </Tabs>
      </main>
    )
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
