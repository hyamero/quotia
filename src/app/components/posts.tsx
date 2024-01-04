"use client";

import { type Session } from "next-auth";

import { type Post, useTempPosts, useSetSession } from "~/lib/useStore";

import { PostItem } from "./post-item";
import { CreatePost } from "./create-post";
import { useEffect } from "react";

type PostsProps = {
  session?: Session | null;
  allPosts: Post[] | null;
};

export function Posts({ session, allPosts }: PostsProps) {
  const tempPosts = useTempPosts();
  const setSession = useSetSession();

  useEffect(() => {
    if (session) setSession(session.user);
    else setSession(null);
  }, [session]);

  return (
    <div className="mt-24 w-full max-w-lg xl:max-w-xl">
      <CreatePost />

      {session && tempPosts.length !== 0
        ? tempPosts.map((post) => {
            /**
             * TODO: Fix this type casting.
             */
            return <PostItem key={post.id} post={post as Post} />;
          })
        : null}

      {allPosts?.length !== 0 ? (
        allPosts?.map((post) => {
          if (tempPosts.map((tempPost) => tempPost.id).includes(post.id))
            return null;

          return <PostItem key={post.id} post={post} />;
        })
      ) : (
        <p className="text-3xl font-bold text-white">No posts yet.</p>
      )}
    </div>
  );
}
