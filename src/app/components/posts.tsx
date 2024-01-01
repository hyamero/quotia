"use client";

import { PostItem } from "./post-item";
import { type Session } from "next-auth";
import { type Post, useTempPosts } from "~/lib/usePostStore";
import { CreatePost } from "./create-post";

type PostsProps = {
  session?: Session | null;
  allPosts: Post[] | null;
};

export function Posts({ session, allPosts }: PostsProps) {
  const tempPosts = useTempPosts();

  return (
    <div className="mt-24 w-full max-w-lg xl:max-w-xl">
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
