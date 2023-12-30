import type { Session } from "next-auth";
import type { Post } from "~/lib/useStore";
import { formatDistanceToNowStrict } from "date-fns";
import { formatDistance } from "~/hooks/format-distance";
import { PiChatCircle, PiHeart } from "react-icons/pi";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/components/ui/avatar";
import { PostDropdownMenu } from "./post-dropdown-menu";

type PostItemProps = {
  session: Session;
  post: Post;
};

export function PostItem({ session, post }: PostItemProps) {
  if (!session.user || !post) return;

  return (
    <div className="flex items-start justify-between border-t py-5">
      <div className="flex w-full items-start gap-3">
        <Avatar className="relative top-1">
          <AvatarImage
            className="rounded-full"
            src={session.user.image as string | undefined}
          />
          <AvatarFallback>{session.user.name?.split(" ").at(0)}</AvatarFallback>
        </Avatar>

        <div className="w-full">
          <div className="flex justify-between">
            <span className="font-semibold">{session.user.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">
                {formatDistanceToNowStrict(post.createdAt, {
                  addSuffix: false,
                  locale: {
                    formatDistance: (...props) => formatDistance(...props),
                  },
                })}
              </span>
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
