"use client";

import { toast } from "sonner";
import { api } from "~/trpc/react";
import { PiDotsThree } from "react-icons/pi";
import { usePostActions, useUser } from "~/lib/useStore";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/app/components/ui/dropdown-menu";

type PostDropdownMenuProps = {
  postId: string;
  postAuthor: string;
};

export function PostDropdownMenu({
  postId,
  postAuthor,
}: PostDropdownMenuProps) {
  const user = useUser();
  const isAuthor = user?.id === postAuthor;
  const { setDeletedPosts } = usePostActions();

  const deletePost = api.post.delete.useMutation({
    onSettled: () => {
      toast.info("Post Deleted.");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleDeletePost = () => {
    deletePost.mutate({ postId });
    setDeletedPosts(postId);
  };

  return (
    <>
      {isAuthor ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <PiDotsThree className="text-2xl" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="font-semibold [&>*]:cursor-pointer">
            <button
              type="button"
              onClick={() => {
                toast.error("Not implemented yet");
              }}
            >
              <DropdownMenuItem>Pin to profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Who can reply</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Hide count</DropdownMenuItem>
            </button>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDeletePost}
              className=" text-red-500"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <PiDotsThree className="text-2xl" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            onClick={() => {
              toast.error("Not implemented yet");
            }}
            className="font-semibold [&>*]:cursor-pointer"
          >
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Hide</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">Block</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
