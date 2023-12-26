"use client";

import { useStore } from "~/lib/useStore";

export function TemporaryPosts() {
  const { tempPosts } = useStore();

  return (
    <div className="w-full max-w-xs">
      {tempPosts
        ? tempPosts.map((tempPosts) => {
            return <p key={tempPosts?.id}>{tempPosts?.content}</p>;
          })
        : null}
    </div>
  );
}
