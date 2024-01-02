"use client";

import { toast } from "sonner";
import { PiDotsThree } from "react-icons/pi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/app/components/ui/dropdown-menu";

export function PostDropdownMenu({ isAuthor }: { isAuthor?: boolean }) {
  return (
    <>
      {isAuthor ? (
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
