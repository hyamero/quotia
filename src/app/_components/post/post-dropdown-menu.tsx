"use client";

import { toast } from "sonner";
import { PiDotsThree } from "react-icons/pi";
import { useModalActions, usePostActions, useUser } from "~/lib/useStore";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";

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
  const { setDeletePostId } = usePostActions();
  const { toggleDeletePostModalIsOpen } = useModalActions();

  const handleDeletePost = () => {
    setDeletePostId(postId);
    toggleDeletePostModalIsOpen();
  };

  return (
    <>
      {isAuthor ? (
        <DropdownMenu>
          <DropdownMenuTrigger title="post menu" className="outline-none">
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
