"use client";

import { PostForm } from "./post-form";
import useMediaQuery from "~/lib/use-media-query";
import { useBoundStore } from "~/lib/use-bound-store";

import { Drawer, DrawerContent } from "../ui/drawer";
import { Dialog, DialogContent } from "~/app/_components/ui/dialog";

export function CreateComment() {
  const user = useBoundStore((state) => state.user);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const setCommentFormIsOpen = useBoundStore(
    (state) => state.modalActions.setCommentFormIsOpen,
  );
  const commentFormIsOpen = useBoundStore((state) => state.commentFormIsOpen);

  if (!user) {
    return null;
  }

  if (isDesktop) {
    return (
      <Dialog
        open={commentFormIsOpen.isOpen}
        onOpenChange={setCommentFormIsOpen}
      >
        <DialogContent>
          {/* Form Component */}
          <PostForm
            formType="comment"
            user={user}
            postId={commentFormIsOpen.postId}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={commentFormIsOpen.isOpen} onOpenChange={setCommentFormIsOpen}>
      <DrawerContent className="px-7 pb-20">
        {/* Form Component */}
        <PostForm
          formType="comment"
          user={user}
          postId={commentFormIsOpen.postId}
        />
      </DrawerContent>
    </Drawer>
  );
}
