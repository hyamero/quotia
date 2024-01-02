"use client";

import { type Session } from "next-auth";

import { type Post, useTempPosts, useSetSession } from "~/lib/useStore";

import { PostItem } from "./post-item";
import { CreatePost } from "./create-post";

type PostsProps = {
  session?: Session | null;
  allPosts: Post[] | null;
};

export function Posts({ session, allPosts }: PostsProps) {
  const tempPosts = useTempPosts();
  const setSession = useSetSession();

  if (session) setSession(session.user);
  else setSession(null);

  return (
    <div className="mt-24 w-full max-w-lg xl:max-w-xl">
      <CreatePost />

      {session && tempPosts.length !== 0
        ? tempPosts.map((post) => {
            return <PostItem key={post.id} post={post} />;
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
