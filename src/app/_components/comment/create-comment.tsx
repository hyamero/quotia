"use client";

import { PostForm } from "../post/post-form";
import useMediaQuery from "~/lib/use-media-query";
import { useBoundStore } from "~/lib/use-bound-store";

import { Drawer, DrawerContent } from "../ui/drawer";
import { Dialog, DialogContent } from "~/app/_components/ui/dialog";
import { PostItem } from "../post/post-item";
import { useSession } from "next-auth/react";

export function CreateComment() {
  const { data: session } = useSession();

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const setCommentFormIsOpen = useBoundStore(
    (state) => state.modalActions.setCommentFormIsOpen,
  );

  const commentFormIsOpen = useBoundStore((state) => state.commentFormIsOpen);

  if (!session || !commentFormIsOpen.post || !commentFormIsOpen.isOpen) {
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
          <PostForm formType="comment" user={session.user} post={_post} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={commentFormIsOpen.isOpen} onOpenChange={setCommentFormIsOpen}>
      <DrawerContent className="px-7 pb-20">
        <PostItem postType="comment" post={commentFormIsOpen.post} />

        {/* Form Component */}
        <PostForm formType="comment" user={session.user} post={_post} />
      </DrawerContent>
    </Drawer>
  );
}
