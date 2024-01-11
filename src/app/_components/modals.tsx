"use client";

import { toast } from "sonner";
import { Modal } from "./modal";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

import {
  useLoginModal,
  usePostActions,
  useModalActions,
  useDeletePostId,
  useDeletePostModal,
} from "~/lib/useStore";

export function LoginModal() {
  const loginModalIsOpen = useLoginModal();
  const { toggleLoginModalIsOpen } = useModalActions();

  const router = useRouter();

  const signInAction = () => {
    router.push("/api/auth/signin");
  };

  return (
    <Modal
      modalState={loginModalIsOpen}
      modalAction={toggleLoginModalIsOpen}
      title="Not signed in?"
      description="You must be signed in to access this feature"
      confirmButton="Sign in"
      confirmAction={signInAction}
    />
  );
}

export function DeletePostModal() {
  const DeletePostModalIsOpen = useDeletePostModal();
  const { toggleDeletePostModalIsOpen } = useModalActions();

  const deletePostId = useDeletePostId();
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
    setDeletedPosts(deletePostId);
    deletePost.mutate({ postId: deletePostId });
  };

  return (
    <Modal
      modalState={DeletePostModalIsOpen}
      modalAction={toggleDeletePostModalIsOpen}
      title="Are you absolutely sure?"
      description="This action cannot be undone. This will permanently delete your post from our servers."
      confirmButton="Delete"
      confirmAction={handleDeletePost}
      buttonVariant="destructive"
    />
  );
}
