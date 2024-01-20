"use client";

import { PostForm } from "./post-form";
import useMediaQuery from "~/lib/use-media-query";
import { useBoundStore } from "~/lib/use-bound-store";

import { Drawer, DrawerContent } from "../ui/drawer";
import { Dialog, DialogContent } from "~/app/_components/ui/dialog";
import { PostItem } from "./post-item";

export function CreateComment() {
  const user = useBoundStore((state) => state.user);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const setCommentFormIsOpen = useBoundStore(
    (state) => state.modalActions.setCommentFormIsOpen,
  );

  const commentFormIsOpen = useBoundStore((state) => state.commentFormIsOpen);

  if (!user || !commentFormIsOpen.post || !commentFormIsOpen.isOpen) {
    return null;
  }

  const _post = {
    postId: commentFormIsOpen.post.id,
    author: commentFormIsOpen.post.author.slug
      ? "@" + commentFormIsOpen.post.author.slug
      : commentFormIsOpen.post.author.name!,
  };

  if (isDesktop) {
    return (
      <Dialog
        open={commentFormIsOpen.isOpen}
        onOpenChange={setCommentFormIsOpen}
      >
        <DialogContent>
          <PostItem postType="comment" post={commentFormIsOpen.post} />

          {/* Form Component */}
          <PostForm formType="comment" user={user} post={_post} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={commentFormIsOpen.isOpen} onOpenChange={setCommentFormIsOpen}>
      <DrawerContent className="px-7 pb-20">
        <PostItem postType="comment" post={commentFormIsOpen.post} />

        {/* Form Component */}
        <PostForm formType="comment" user={user} post={_post} />
      </DrawerContent>
    </Drawer>
  );
}
