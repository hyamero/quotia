"use client";

import Link from "next/link";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import type { Post } from "~/lib/types";
import { PiChatCircle, PiHeart, PiHeartFill } from "react-icons/pi";
import { formatDistance } from "~/lib/format-distance";
import { formatDistanceToNowStrict, formatRelative } from "date-fns";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { PostDropdownMenu } from "./post-dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";

import { useBoundStore } from "~/lib/use-bound-store";
import { ProfileHoverCard } from "../profile/profile-hovercard";
import { ViewLikes } from "./view-likes";
import { useSession } from "next-auth/react";

type PostItemProps = {
  post: Post;
  postType?: "post" | "comment";
};

export function PostItem({ post, postType = "post" }: PostItemProps) {
  const { data: session } = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const toggleCommentFormIsOpen = useBoundStore(
    (state) => state.modalActions.toggleCommentFormIsOpen,
  );

  const [likedByUser, setLikedByUser] = useState(post.likedByUser);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [likes, setLikes] = useState(
    likeCount === 0 ? "" : likeCount === 1 ? "like" : "likes",
  );

  const toggleLike = api.post.toggleLike.useMutation({
    onError: () => {
      toast.error("Something went wrong. Please try again.");
      setLikedByUser(!likedByUser);
    },
  });

  useEffect(() => {
    setLikes(likeCount === 0 ? "" : likeCount === 1 ? "like" : "likes");
  }, [likeCount]);

  const handleToggleLikeCount = () => {
    if (!session) {
      toast("Not logged in?", {
        description: "You must be logged in to like a post.",
        action: {
          label: "Sign In",
          onClick: () => router.push("/api/auth/signin"),
        },
      });

      return;
    }

    setLikedByUser(!likedByUser);
    setLikeCount(likedByUser ? likeCount - 1 : likeCount + 1);

    toggleLike.mutate({ postId: post.id });
  };

  const repliesWord =
    post.replies === 0 ? "" : post.replies === 1 ? "reply" : "replies";

  const handleReply = () => {
    if (!session) {
      toast("Not logged in?", {
        description: "You must be logged in to like a post.",
        action: {
          label: "Sign In",
          onClick: () => router.push("/api/auth/signin"),
        },
      });

      return;
    }

    toggleCommentFormIsOpen(post);

    toggleLike.mutate({ postId: post.id });
  };

  const userSlug = post.author.slug ? "@" + post.author.slug : post.authorId;

  const [likesModalIsOpen, setLikesModalIsOpen] = useState(false);
  likesModalIsOpen;

  return (
    <>
      <ViewLikes
        postId={post.id}
        likesModalIsOpen={likesModalIsOpen}
        setLikesModalIsOpen={setLikesModalIsOpen}
      />
      <div className="flex items-start justify-between border-b py-5 text-[#f2f4f6] last:border-0">
        <div className="flex w-full items-start gap-3">
          <Link href={`/user/${userSlug}`} className="font-semibold">
            <Avatar className="relative top-1">
              <AvatarImage
                className="rounded-full"
                src={post.author.image as string | undefined}
                alt={`${post.author.name}'s avatar`}
              />
              <AvatarFallback className="text-xs">
                {post.author.name?.split(" ").at(0)}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="w-full">
            <div className="flex justify-between">
              <ProfileHoverCard author={post.author} userId={session?.user.id}>
                <Link
                  href={`/user/${userSlug}`}
                  className="font-semibold hover:underline"
                >
                  {post.author.name}
                </Link>
              </ProfileHoverCard>

              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="select-none text-zinc-500">
                        {formatDistanceToNowStrict(post.createdAt, {
                          addSuffix: false,
                          locale: {
                            formatDistance: (...props) =>
                              formatDistance(...props),
                          },
                        })}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>{formatRelative(post.createdAt, new Date())}</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {/* 
               DropDownMenu
              */}
                {postType === "post" && (
                  <PostDropdownMenu
                    postId={post.id}
                    postAuthor={post.authorId}
                  />
                )}
              </div>
            </div>

            {!pathname.includes("/post") && postType === "post" ? (
              <Link
                href={`/user/${userSlug}/post/${post.id}`}
                className="whitespace-pre-wrap"
              >
                {post.content}
              </Link>
            ) : (
              <p className="whitespace-pre-wrap">{post.content}</p>
            )}

            {postType === "post" && (
              <>
                <div className="relative right-[0.4rem] mt-[6px] text-[#e6e8ea]">
                  <button
                    title="like"
                    type="button"
                    className="rounded-full p-[0.4rem] transition-colors duration-200 hover:bg-zinc-900"
                    onClick={handleToggleLikeCount}
                  >
                    {likedByUser ? (
                      <PiHeartFill className="transform text-2xl text-red-500 transition-transform active:scale-90" />
                    ) : (
                      <PiHeart className="transform text-2xl transition-transform active:scale-90" />
                    )}
                  </button>

                  <button
                    title="comment"
                    type="button"
                    className="rounded-full p-[0.4rem] transition-colors duration-200 hover:bg-zinc-900"
                    onClick={handleReply}
                  >
                    <PiChatCircle className="text-2xl" />
                  </button>
                </div>

                <div className="space-x-3">
                  {!pathname.includes(post.id) && post.replies ? (
                    <Link
                      className="text-zinc-500"
                      href={`/user/${post.author.slug ?? post.authorId}/post/${
                        post.id
                      }`}
                    >
                      {post.replies + " " + repliesWord}
                    </Link>
                  ) : null}
                  <span
                    className="cursor-pointer text-zinc-500"
                    onClick={() => setLikesModalIsOpen(!likesModalIsOpen)}
                  >
                    {(likeCount ? likeCount : "") + " " + likes}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
