"use client";

import React, { useEffect } from "react";
import { toast } from "sonner";

import { api } from "~/trpc/react";
import { PostItem } from "./post-item";
import { CreatePost } from "./create-post";
import { DeletePostModal } from "../modals";
import { useInView } from "react-intersection-observer";
import Loading, { LoadingSkeleton } from "~/app/feed-loading";
import { useBoundStore } from "~/lib/use-bound-store";

type PostsProps = {
  authorId?: string;
};

export function Posts({ authorId }: PostsProps) {
  const user = useBoundStore((state) => state.user);
  const tempPosts = useBoundStore((state) => state.tempPosts);
  const deletedPosts = useBoundStore((state) => state.deletedPosts);

  const { ref, inView } = useInView();

  const {
    data: posts,
    isLoading,
    isError,
    error,
    fetchNextPage,
    isFetchingNextPage,
  } = api.post.inifiniteFeed.useInfiniteQuery(
    { author: authorId ?? undefined },
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
    <div className="pb-24 md:pb-0">
      <CreatePost onProfilePage={authorId ? true : false} />
      <DeletePostModal />

      {user && tempPosts.length !== 0
        ? tempPosts
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

      {posts?.pages.map((page, i) => (
        <React.Fragment key={page.nextPageCursor?.id ?? i}>
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
