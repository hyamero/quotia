"use client";

import { useLoginModal, useModalActions } from "~/lib/useStore";
import { Modal } from "./modal";

export function LoginModal() {
  const { toggleLoginModalIsOpen } = useModalActions();
  const loginModalIsOpen = useLoginModal();

  return (
    <Modal
      modalState={loginModalIsOpen}
      modalAction={toggleLoginModalIsOpen}
      title="Not signed in?"
      description="You must be signed in to access this feature"
      confirmButton="Sign in"
    />
  );
}
