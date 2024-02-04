"use client";

import { useSession } from "next-auth/react";
import { PostItem } from "~/app/_components/post/post-item";
import { type Post } from "~/lib/types";
import { useBoundStore } from "~/lib/use-bound-store";

export default function TempComments() {
  const { data: session } = useSession();
  const tempComments = useBoundStore((state) => state.tempComments);

  const deletedPosts = useBoundStore((state) => state.deletedPosts);

  return (
    <div>
      {session && tempComments.length !== 0
        ? tempComments
            .filter((post) => !deletedPosts.includes(post.id))
            .map((post) => {
              return <PostItem key={post.id} post={post as Post} />;
            })
        : null}
    </div>
  );
}
