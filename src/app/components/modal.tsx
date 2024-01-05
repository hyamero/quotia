"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/app/components/ui/dialog";
import { Button } from "./ui/button";
import Link from "next/link";

type ModalProps = {
  modalState: boolean;
  modalAction: () => void;

  title: string;
  description: string;
  confirmButton: string;
  cancelButton?: string;
};

export function Modal({
  modalAction,
  modalState,

  title,
  description,
  cancelButton,
  confirmButton,
}: ModalProps) {
  return (
    <Dialog open={modalState} onOpenChange={modalAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => modalAction()} variant="outline">
            {cancelButton}
          </Button>
          <Button onClick={() => modalAction()}>
            <Link href="/api/auth/signin">{confirmButton}</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
