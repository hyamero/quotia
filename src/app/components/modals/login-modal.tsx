"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/app/components/ui/dialog";
import { Button } from "../ui/button";
import Link from "next/link";
import { useLoginModal, useModalActions } from "~/lib/useStore";

export function LoginModal() {
  const { toggleLoginModalIsOpen } = useModalActions();
  const loginModalIsOpen = useLoginModal();

  return (
    <Dialog open={loginModalIsOpen} onOpenChange={toggleLoginModalIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Not signed in?</DialogTitle>
          <DialogDescription>
            You must be signed to access this feature.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => toggleLoginModalIsOpen()} variant="outline">
            Cancel
          </Button>
          <Button onClick={() => toggleLoginModalIsOpen()}>
            <Link href="/api/auth/signin">Sign in</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
