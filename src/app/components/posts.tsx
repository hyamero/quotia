"use client";

import { useEffect } from "react";
import { type Session } from "next-auth";

import {
  type Post,
  type User,
  useTempPosts,
  useSetSession,
  useDeletedPosts,
} from "~/lib/useStore";

import { PostItem } from "./post-item";
import { CreatePost } from "./create-post";
import { DeletePostModal } from "./modals";

type PostsProps = {
  session?: Session | null;
  allPosts: Post[] | null;
};

export function Posts({ session, allPosts }: PostsProps) {
  const tempPosts = useTempPosts();
  const setSession = useSetSession();

  const deletedPosts = useDeletedPosts();

  useEffect(() => {
    if (session) setSession(session.user);
    else setSession(null);
  }, [session]);

  const existsInTempPosts = (postId: string) => {
    const tempPostId = tempPosts.find((post) => post.id === postId);

    if (tempPostId) return true;
    else return false;
  };

  return (
    <div className="mt-24 w-full max-w-lg xl:max-w-xl">
      <CreatePost />
      <DeletePostModal />

      {session && tempPosts.length !== 0
        ? tempPosts
            .filter((post) => !deletedPosts.includes(post.id))
            .map((post) => {
              return (
                <PostItem
                  key={post.id}
                  post={{
                    ...post,
                    authorId: session.user.id,
                    author: session.user as User,
                  }}
                />
              );
            })
        : null}

      {allPosts?.length !== 0 ? (
        allPosts
          ?.filter(
            (post) =>
              !deletedPosts.includes(post.id) && !existsInTempPosts(post.id),
          )
          .map((post) => {
            return <PostItem key={post.id} post={post} />;
          })
      ) : (
        <p className="text-3xl font-bold text-white">No posts yet.</p>
      )}
    </div>
  );
}
