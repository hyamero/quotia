import { api } from "~/trpc/server";
import { TemporaryPosts } from "./temporary-posts";
import { formatDistance } from "date-fns";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/components/ui/avatar";
import { type Session } from "next-auth";
import { PiChatCircle, PiHeart, PiDotsThree } from "react-icons/pi";

export async function Posts({ session }: { session: Session }) {
  const allPosts = await api.post.getAll.query();

  return (
    <div className="w-full">
      <TemporaryPosts />

      {allPosts ? (
        allPosts.map((post) => {
          return (
            <div
              key={post.id}
              className="flex items-start justify-between border-t py-5"
            >
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage
                    className="rounded-full"
                    src={session.user.image as string | undefined}
                  />
                  <AvatarFallback>
                    {session.user.name?.split(" ").at(0)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="font-semibold">{session.user.name}</h3>
                  <p>{post.content}</p>
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

              <div className="flex items-center gap-2">
                <span className="text-zinc-500">
                  {formatDistance(post.createdAt, new Date(), {
                    addSuffix: true,
                  })}
                </span>
                <button type="button">
                  <PiDotsThree className="text-2xl" />
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p>You have no posts yet.</p>
      )}
    </div>
  );
}
