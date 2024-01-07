"use client";

import { useEffect } from "react";
import { type Session } from "next-auth";

import {
  type User,
  useTempPosts,
  useSetSession,
  useDeletedPosts,
} from "~/lib/useStore";

import { api } from "~/trpc/react";
import { PostItem } from "./post-item";
import { CreatePost } from "./create-post";
import { DeletePostModal } from "../modals";
import { useInView } from "react-intersection-observer";
import React from "react";
import Loading from "~/app/loading";

type PostsProps = {
  session?: Session | null;
};

export function Posts({ session }: PostsProps) {
  const { ref, inView } = useInView();

  const {
    data: posts,
    isLoading,
    // isFetchingNextPage,
    fetchNextPage,
    // isError,
    // error,
  } = api.post.inifiniteFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextPageCursor ?? undefined,
    },
  );

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

  useEffect(() => {
    if (inView) {
      fetchNextPage().catch((err) => console.log(err));
    }
  }, [fetchNextPage, inView]);

  if (isLoading) return <Loading />;

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

      {posts?.pages.map((page) => (
        <React.Fragment key={page.nextPageCursor?.toDateString()}>
          {page.posts
            .filter(
              (post) =>
                !deletedPosts.includes(post.id) && !existsInTempPosts(post.id),
            )
            .map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
        </React.Fragment>
      ))}

      <div ref={ref} />
    </div>
  );
}
