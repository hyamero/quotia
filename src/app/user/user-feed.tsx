"use client";

import React, { useEffect } from "react";
import { type Session } from "next-auth";
import { api } from "~/trpc/react";
import { toast } from "sonner";

import { useInView } from "react-intersection-observer";
import { DeletePostModal } from "../components/modals";
import { PostItem } from "../components/post/post-item";
import Loading, { LoadingSkeleton } from "~/app/feed-loading";
import { type User, useTempPosts, useDeletedPosts } from "~/lib/useStore";

type PostsProps = {
  session?: Session | null;
  authorId?: string;
};

export function UserFeed({ session, authorId }: PostsProps) {
  const tempPosts = useTempPosts();
  const { ref, inView } = useInView();
  const deletedPosts = useDeletedPosts();

  const {
    data: posts,
    isLoading,
    isError,
    error,
    fetchNextPage,
    isFetchingNextPage,
  } = api.post.inifiniteFeed.useInfiniteQuery(
    { author: authorId },
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
    <section className="pb-24 md:pb-0">
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
    </section>
  );
}
