"use client";

import { PostItem } from "~/app/_components/post/post-item";
import { useBoundStore } from "~/lib/use-bound-store";

export default function TempComments() {
  const user = useBoundStore((state) => state.user);
  const tempComments = useBoundStore((state) => state.tempComments);

  const deletedPosts = useBoundStore((state) => state.deletedPosts);

  return (
    <div>
      {user && tempComments.length !== 0
        ? tempComments
            .filter((post) => !deletedPosts.includes(post.id))
            .map((post) => {
              return (
                <PostItem
                  key={post.id}
                  post={{
                    ...post,
                    authorId: user.id,
                    author: user,
                  }}
                />
              );
            })
        : null}
    </div>
  );
}
