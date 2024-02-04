"use client";

import React, { useEffect } from "react";
import { toast } from "sonner";

import { api } from "~/trpc/react";
import { PostItem } from "./post-item";
import { CreatePost } from "./create-post";
import { DeletePostModal } from "../modal/modals";
import { useInView } from "react-intersection-observer";
import Loading, { LoadingSkeleton } from "~/app/feed-loading";
import { useBoundStore } from "~/lib/use-bound-store";
import { CreateComment } from "../comment/create-comment";
import { useSession } from "next-auth/react";
import { type Post } from "~/lib/types";

type PostsProps = {
  authorId?: string;
  postId?: string;
};

export function Posts({ authorId, postId }: PostsProps) {
  const { data: session } = useSession();
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
    { author: authorId ?? undefined, postId: postId ?? undefined },
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

  if (isError) toast.error(error.message);
  if (isLoading) return <Loading />;
  if (posts?.pages.length === 0) return <p>No posts found.</p>;

  const existsInTempPosts = (postId: string) => {
    const tempPostId = tempPosts.find((post) => post.id === postId);

    if (tempPostId) return true;
    else return false;
  };

  return (
    <div className="pb-24 md:pb-0">
      <CreatePost onProfilePage={authorId ?? postId ? true : false} />
      <CreateComment />
      <DeletePostModal />

      {session && tempPosts.length !== 0
        ? tempPosts
            .filter((post) => !deletedPosts.includes(post.id))
            .map((post) => {
              return <PostItem key={post.id} post={post as Post} />;
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
