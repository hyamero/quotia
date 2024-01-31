"use client";

import { toast } from "sonner";
import { PiDotsThree } from "react-icons/pi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { useBoundStore } from "~/lib/use-bound-store";
import React from "react";

type PostDropdownMenuProps = {
  postId: string;
  postAuthor: string;
};

export function PostDropdownMenu({
  postId,
  postAuthor,
}: PostDropdownMenuProps) {
  const user = useBoundStore((state) => state.user);
  const isAuthor = user?.id === postAuthor;
  const setDeletePostId = useBoundStore(
    (state) => state.tempPostActions.setDeletePostId,
  );
  const toggleDeletePostModalIsOpen = useBoundStore(
    (state) => state.modalActions.toggleDeletePostModalIsOpen,
  );

  const handleDeletePost = () => {
    setDeletePostId(postId);
    toggleDeletePostModalIsOpen();
  };

  type PostMenu = {
    title: string;
    onClick?: () => void;
    className?: string;
  };

  const authorMenu: PostMenu[] = [
    {
      title: "Pin to profile",
      onClick: () => {
        toast.error("Not implemented yet");
      },
    },
    {
      title: "Who can reply",
      onClick: () => {
        toast.error("Not implemented yet");
      },
    },
    {
      title: "Hide count",
      onClick: () => {
        toast.error("Not implemented yet");
      },
    },
    {
      title: "Delete",
      onClick: handleDeletePost,
      className: "text-red-500",
    },
  ];

  const userMenu: PostMenu[] = [
    {
      title: "Profile",
      onClick: () => {
        toast.error("Not implemented yet");
      },
    },
    {
      title: "Hide",
      onClick: () => {
        toast.error("Not implemented yet");
      },
    },
    {
      title: "Block",
      onClick: () => {
        toast.error("Not implemented yet");
      },
      className: "text-red-500",
    },
    {
      title: "Report",
      onClick: () => {
        toast.error("Not implemented yet");
      },
      className: "text-red-500",
    },
  ];

  return (
    <>
      {isAuthor ? (
        <DropdownMenu>
          <DropdownMenuTrigger title="post menu" className="outline-none">
            <PiDotsThree className="text-2xl" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="font-semibold [&>*]:cursor-pointer">
            {authorMenu.map((item, i) => (
              <>
                <DropdownMenuItem
                  key={item.title}
                  onClick={item.onClick}
                  className={item.className}
                >
                  {item.title}
                </DropdownMenuItem>
                {i + 1 !== authorMenu.length && <DropdownMenuSeparator />}
              </>
            ))}
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
            className="font-semibold [&>*]:cursor-pointer [&>*]:border-b [&>*]:last:border-0"
          >
            {userMenu.map((item, i) => (
              <React.Fragment key={item.title}>
                <DropdownMenuItem
                  onClick={item.onClick}
                  className={item.className}
                >
                  {item.title}
                </DropdownMenuItem>
                {i + 1 !== userMenu.length && <DropdownMenuSeparator />}
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
