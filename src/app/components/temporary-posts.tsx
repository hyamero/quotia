"use client";

import { type Session } from "next-auth";
import { useStore } from "~/lib/useStore";
import { PostItem } from "./post-item";

export function TemporaryPosts({ session }: { session: Session }) {
  const { tempPosts } = useStore();

  return (
    <div>
      {tempPosts
        ? tempPosts.map((post) => {
            return <PostItem key={post!.id} session={session} post={post} />;
          })
        : null}
    </div>
  );
}
