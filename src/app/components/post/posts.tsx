"use client";

import React, { useEffect } from "react";
import { type Session } from "next-auth";
import { toast } from "sonner";

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
import Loading, { LoadingSkeleton } from "~/app/loading";
import { nanoid } from "nanoid";

type PostsProps = {
  session?: Session | null;
};

export function Posts({ session }: PostsProps) {
  const tempPosts = useTempPosts();
  const setSession = useSetSession();
  const { ref, inView } = useInView();
  const deletedPosts = useDeletedPosts();

  useEffect(() => {
    if (session) setSession(session.user);
    else setSession(null);
  }, [session]);

  const {
    data: posts,
    isLoading,
    isError,
    error,
    fetchNextPage,
    isFetchingNextPage,
  } = api.post.inifiniteFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextPageCursor ?? undefined,
    },
  );

  /**
   * Fetch next page when the user scrolls to the bottom of the page.
   */
  useEffect(() => {
    if (inView) {
      fetchNextPage().catch((err) => console.log(err));
    }
  }, [fetchNextPage, inView]);

  if (isLoading) return <Loading />;
  if (isError) toast.error(error.message);

  const existsInTempPosts = (postId: string) => {
    const tempPostId = tempPosts.find((post) => post.id === postId);

    if (tempPostId) return true;
    else return false;
  };

  return (
    <div className="mt-24 w-full max-w-lg pb-24 md:pb-0 xl:max-w-xl">
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
        <React.Fragment key={nanoid()}>
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

      {/* Ref for react-intersection-observer */}
      <div ref={ref} className="pt-2"></div>

      {isFetchingNextPage && (
        <div className="py-5">
          <LoadingSkeleton />
        </div>
      )}
    </div>
  );
}
