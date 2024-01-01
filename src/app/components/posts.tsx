"use client";

import { PostItem } from "./post-item";
import { type Session } from "next-auth";
import { useStore, type Post } from "~/lib/useStore";
import { CreatePost } from "./create-post";

type PostsProps = {
  session?: Session | null;
  allPosts: Post[] | null;
};

export function Posts({ session, allPosts }: PostsProps) {
  const { tempPosts } = useStore();

  return (
    <div className="w-full max-w-screen-sm">
      <CreatePost session={session} />

      {session && tempPosts
        ? tempPosts.map((post) => {
            return (
              <PostItem key={post!.id} session={session} post={post as Post} />
            );
          })
        : null}

      {allPosts?.length !== 0 ? (
        allPosts?.map((post) => {
          return <PostItem key={post.id} post={post} />;
        })
      ) : (
        <p className="text-3xl font-bold text-white">No posts yet.</p>
      )}
    </div>
  );
}
