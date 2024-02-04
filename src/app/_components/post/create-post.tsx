"use client";

import { PostForm } from "./post-form";
import type { Session } from "next-auth";
import useMediaQuery from "~/lib/use-media-query";
import { useBoundStore } from "~/lib/use-bound-store";

import { Button } from "../ui/button";
import { Drawer, DrawerContent } from "../ui/drawer";
import { Dialog, DialogContent } from "~/app/_components/ui/dialog";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "~/app/_components/ui/avatar";
import { useSession } from "next-auth/react";

export function CreatePost({ onProfilePage }: { onProfilePage?: boolean }) {
  const { data: session } = useSession();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const setPostFormIsOpen = useBoundStore(
    (state) => state.modalActions.setPostFormIsOpen,
  );
  const postFormIsOpen = useBoundStore((state) => state.postFormIsOpen);

  if (!session) {
    return !onProfilePage && <CreatePostTrigger />;
  }

  if (isDesktop) {
    return (
      <Dialog open={postFormIsOpen} onOpenChange={setPostFormIsOpen}>
        {!onProfilePage && <CreatePostTrigger user={session.user} />}
        <DialogContent>
          {/* Form Component */}
          <PostForm user={session.user} formType="post" />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={postFormIsOpen} onOpenChange={setPostFormIsOpen}>
      {!onProfilePage && <CreatePostTrigger user={session.user} />}
      <DrawerContent className="px-7 pb-20">
        {/* Form Component */}
        <PostForm user={session.user} formType="post" />
      </DrawerContent>
    </Drawer>
  );
}

const CreatePostTrigger = ({ user }: { user?: Session["user"] }) => {
  const toggleLoginModalIsOpen = useBoundStore(
    (state) => state.modalActions.toggleLoginModalIsOpen,
  );
  const togglePostFormIsOpen = useBoundStore(
    (state) => state.modalActions.togglePostFormIsOpen,
  );

  return (
    <div className="hidden items-center gap-4 py-5 md:flex">
      <Avatar className="pointer-events-none">
        <AvatarImage
          className="rounded-full"
          src={user?.image as string | undefined}
        />
        <AvatarFallback>{user?.name?.split(" ").at(0)}</AvatarFallback>
      </Avatar>

      <button
        title="Start a quote..."
        className="w-full cursor-text select-none text-left text-zinc-500"
        onClick={() => {
          if (user) {
            togglePostFormIsOpen();
          } else {
            toggleLoginModalIsOpen();
          }
        }}
      >
        Start a quote...
      </button>

      <Button
        disabled
        title="Post"
        className="rounded-full font-semibold disabled:cursor-not-allowed disabled:text-zinc-500"
      >
        Post
      </Button>
    </div>
  );
};
