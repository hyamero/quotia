"use client";

import Link from "next/link";
import { toast } from "sonner";
import { api } from "~/trpc/react";

import { PiHeartFill } from "react-icons/pi";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { ProfileHoverCard } from "../profile/profile-hovercard";
import { LoadingSkeleton } from "~/app/feed-loading";

type ViewLikesProps = {
  postId: string;
  likesModalIsOpen: boolean;
  setLikesModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ViewLikes({
  postId,
  likesModalIsOpen,
  setLikesModalIsOpen,
}: ViewLikesProps) {
  const { data: postLikes, isLoading } = api.post.viewLikes.useQuery(
    { postId },
    {
      enabled: likesModalIsOpen,
    },
  );

  return (
    <Dialog open={likesModalIsOpen} onOpenChange={setLikesModalIsOpen}>
      <DialogContent className="max-h-[70vh]">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <ul className="flex flex-col">
            {postLikes?.map((like) => {
              {
                like.user.slug ? "@" + like.user.slug : like.user.name;
              }

              const user = like.user;
              const userSlug = user.slug ? "@" + user.slug : user.id;

              return (
                <li
                  key={like.postId + like.userId}
                  className="border-b py-5 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 font-medium">
                      <Link href={`/user/${userSlug}`} className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            className="rounded-full"
                            src={user.image as string | undefined}
                            alt={`${user.name}'s avatar`}
                          />
                          <AvatarFallback className="text-xs">
                            {user.name?.split(" ").at(0)}
                          </AvatarFallback>
                        </Avatar>
                        <PiHeartFill className="absolute -bottom-2 right-0 transform rounded-full bg-red-500 p-1  text-xl text-white transition-transform active:scale-90" />
                      </Link>

                      <div>
                        <ProfileHoverCard author={user} userId={user?.id}>
                          <Link
                            href={`/user/${userSlug}`}
                            className="font-semibold hover:underline"
                          >
                            {user.slug ?? user.name}
                          </Link>
                        </ProfileHoverCard>
                        <p className="text-zinc-500">Quotia User</p>
                      </div>
                    </div>

                    <Button
                      title="follow"
                      variant="outline"
                      onClick={() => toast.info("Feature coming soon!")}
                    >
                      Follow
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
