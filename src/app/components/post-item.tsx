import { type Post, useUser } from "~/lib/useStore";
import { PiChatCircle, PiHeart } from "react-icons/pi";
import { formatDistance } from "~/hooks/format-distance";
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
import { api } from "~/trpc/react";
import { toast } from "sonner";

export function PostItem({ post }: { post: Post }) {
  const user = useUser();
  const isAuthor = user?.id === post.authorId;

  const toggleLike = api.post.toggleLike.useMutation({
    onSuccess: (data) => {
      if (data.addedLike === true) {
        toast.success("Liked");
      } else {
        toast.success("Unliked");
      }
    },
    onError: () => {
      toast.error("Something went wrong. Try again later.");
    },
  });

  return (
    <div className="flex items-start justify-between border-b py-5 text-[#f2f4f6]">
      <div className="flex w-full items-start gap-3">
        <Avatar className="relative top-1">
          <AvatarImage
            className="rounded-full"
            src={post.author.image as string | undefined}
          />
          <AvatarFallback>{post.author.name?.split(" ").at(0)}</AvatarFallback>
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
              onClick={() => toggleLike.mutate({ postId: post.id })}
            >
              <PiHeart className="text-2xl" />
            </button>

            <button
              type="button"
              className="rounded-full p-[0.4rem] transition-colors duration-200 hover:bg-zinc-900"
            >
              <PiChatCircle className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
