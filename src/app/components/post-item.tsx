import type { Session } from "next-auth";
import type { Post, PostItem } from "~/lib/useStore";
import { formatDistanceToNowStrict, formatRelative } from "date-fns";
import { formatDistance } from "~/hooks/format-distance";
import { PiChatCircle, PiHeart } from "react-icons/pi";

import { PostDropdownMenu } from "./post-dropdown-menu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/components/ui/avatar";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/app/components/ui/tooltip";

type PostItemProps = {
  session?: Session;
  post: Post;
};

export function PostItem({ session, post }: PostItemProps) {
  const authorPost = post.authorId === session?.user.id;

  return (
    <div className="flex items-start justify-between border-t py-5">
      <div className="flex w-full items-start gap-3">
        <Avatar className="relative top-1">
          <AvatarImage
            className="rounded-full"
            src={
              authorPost
                ? (session.user.image as string | undefined)
                : (post.author.image as string | undefined)
            }
          />
          <AvatarFallback>
            {authorPost
              ? session.user.name
              : post.author.name?.split(" ").at(0)}
          </AvatarFallback>
        </Avatar>

        <div className="w-full">
          <div className="flex justify-between">
            <span className="font-semibold">
              {authorPost ? session.user.name : post.author.name}
            </span>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {" "}
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

              <PostDropdownMenu session={session} post={post} />
            </div>
          </div>

          <p>{post.content}</p>

          <div className="relative right-[0.4rem] mt-[6px]">
            <button
              type="button"
              className="rounded-full p-[0.4rem] transition-colors duration-200 hover:bg-zinc-900"
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
