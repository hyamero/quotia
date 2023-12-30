"use client";

import type { Session } from "next-auth";
import type { Post } from "~/lib/useStore";
import { PiDotsThree } from "react-icons/pi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/app/components/ui/dropdown-menu";
import { toast } from "sonner";

type PostDropdownMenuProps = {
  session?: Session;
  post?: Post;
};

export function PostDropdownMenu({ session, post }: PostDropdownMenuProps) {
  return (
    <>
      {session?.user.id === post?.authorId ? (
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
            <DropdownMenuItem>Pin to profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Who can reply</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Hide count</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className=" text-red-500">
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
