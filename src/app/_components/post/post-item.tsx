"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import Link from "next/link";

import type { Post, User } from "~/lib/types";
import { PiChatCircle, PiHeart, PiHeartFill } from "react-icons/pi";
import { formatDistance } from "~/lib/format-distance";
import { formatDistanceToNowStrict, formatRelative } from "date-fns";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { PostDropdownMenu } from "./post-dropdown-menu";
import { CalendarDays } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Button } from "../ui/button";
import { useBoundStore } from "~/lib/use-bound-store";
import { Dialog, DialogContent } from "../ui/dialog";

type PostItemProps = {
  post: Post;
  postType?: "post" | "comment";
};

export function PostItem({ post, postType = "post" }: PostItemProps) {
  const user = useBoundStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  const toggleCommentFormIsOpen = useBoundStore(
    (state) => state.modalActions.toggleCommentFormIsOpen,
  );

  const [likedByUser, setLikedByUser] = useState(post.likedByUser);
  const [likeCount, setLikeCount] = useState(post.likes ? post.likes : 0);
  const [likes, setLikes] = useState(
    likeCount === 0 ? "" : likeCount === 1 ? "like" : "likes",
  );

  const toggleLike = api.post.toggleLike.useMutation({
    onError: () => {
      toast.error("Something went wrong. Please try again.");
      setLikedByUser(!likedByUser);
    },
  });

  const handleToggleLikeCount = () => {
    if (!user) {
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

  useEffect(() => {
    setLikes(likeCount === 0 ? "" : likeCount === 1 ? "like" : "likes");
  }, [likeCount]);

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
      <div className="flex items-start justify-between border-b py-5 text-[#f2f4f6]">
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
              <HoverCardProfile author={post.author} userId={user?.id}>
                <Link
                  href={`/user/${userSlug}`}
                  className="font-semibold hover:underline"
                >
                  {post.author.name}
                </Link>
              </HoverCardProfile>

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
                    onClick={() => {
                      handleToggleLikeCount();
                    }}
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
                    onClick={() => toggleCommentFormIsOpen(post)}
                  >
                    <PiChatCircle className="text-2xl" />
                  </button>
                </div>

                <div className="space-x-3">
                  {!pathname.includes(post.id) && (
                    <Link
                      className="text-zinc-500"
                      href={`/user/${post.author.slug ?? post.authorId}/post/${
                        post.id
                      }`}
                    >
                      replies
                    </Link>
                  )}
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

type ViewLikesProps = {
  postId: string;
  likesModalIsOpen: boolean;
  setLikesModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ViewLikes = ({
  postId,
  likesModalIsOpen,
  setLikesModalIsOpen,
}: ViewLikesProps) => {
  const { data: postLikes } = api.post.viewLikes.useQuery({ postId });

  return (
    <Dialog open={likesModalIsOpen} onOpenChange={setLikesModalIsOpen}>
      <DialogContent>
        <ul>
          {postLikes?.map((like) => (
            <li key={like.postId + like.userId}>
              {like.user.slug ? "@" + like.user.slug : like.user.name}
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

type HoverCardProfileProps = {
  children: React.ReactNode;
  author: User;
  userId: string | undefined;
};

export function HoverCardProfile({
  children,
  author,
  userId,
}: HoverCardProfileProps) {
  const userSlug = author.slug ? "@" + author.slug : author.id;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex items-center justify-between space-x-4">
          <div className="space-y-3">
            <div>
              <h4 className="text-lg font-semibold">{author.name}</h4>
              {author.slug && (
                <h4 className="text-sm font-normal text-zinc-200">
                  {"@" + author.slug}
                </h4>
              )}
            </div>
            <div className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>

          <Link href={`/user/${userSlug}`} className="font-semibold">
            <Avatar className="h-16 w-16">
              <AvatarImage
                className="rounded-full"
                src={author.image as string | undefined}
                alt={`${author.name}'s avatar`}
              />
              <AvatarFallback className="text-xs">
                {author.name?.split(" ").at(0)}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
        {author.id !== userId && (
          <Button
            title="follow"
            onClick={() => toast.info("Feature coming soon!")}
            className="mt-4 w-full"
          >
            Follow
          </Button>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
