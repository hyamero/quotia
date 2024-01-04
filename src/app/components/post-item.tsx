import { toast } from "sonner";
import { useState } from "react";
import { api } from "~/trpc/react";
import { type Post, useUser } from "~/lib/useStore";
import { formatDistance } from "~/hooks/format-distance";
import { PiChatCircle, PiHeart, PiHeartFill } from "react-icons/pi";
import { formatDistanceToNowStrict, formatRelative } from "date-fns";

import { PostDropdownMenu } from "./post-dropdown-menu";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "~/app/components/ui/avatar";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "~/app/components/ui/tooltip";
import { useRouter } from "next/navigation";

export function PostItem({ post }: { post: Post }) {
  const user = useUser();

  const isAuthor = user?.id === post.authorId;

  const [likedByUser, setLikedByUser] = useState(post.likedByUser);
  const [likeCount, setLikeCount] = useState(post.likes ? post.likes : 0);

  const toggleLike = api.post.toggleLike.useMutation({
    onError: () => {
      toast.error("Something went wrong. Please try again.");
      setLikedByUser(!likedByUser);
    },
  });

  const router = useRouter();

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

    if (likedByUser) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    toggleLike.mutate({ postId: post.id });
  };

  return (
    <div className="flex items-start justify-between border-b py-5 text-[#f2f4f6]">
      <div className="flex w-full items-start gap-3">
        <Avatar className="relative top-1">
          <AvatarImage
            className="rounded-full"
            src={post.author.image as string | undefined}
          />
          <AvatarFallback className="text-xs">
            {post.author.name?.split(" ").at(0)}
          </AvatarFallback>
        </Avatar>

        <div className="w-full">
          <div className="flex justify-between">
            <span className="font-semibold">{post.author.name}</span>
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
              <PostDropdownMenu isAuthor={isAuthor} />
            </div>
          </div>

          <p>{post.content}</p>

          <div className="relative right-[0.4rem] mt-[6px] text-[#e6e8ea]">
            <button
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
              type="button"
              className="rounded-full p-[0.4rem] transition-colors duration-200 hover:bg-zinc-900"
            >
              <PiChatCircle className="text-2xl" />
            </button>
          </div>
          <span className="text-zinc-500">{likeCount} likes </span>
        </div>
      </div>
    </div>
  );
}
