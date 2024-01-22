"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/app/_components/ui/dialog";
import { Button } from "../ui/button";

type ModalProps = {
  modalState: boolean;
  modalAction: () => void;

  title: string;
  description: string;
  confirmButton: string;
  cancelButton?: string;
  confirmAction?: () => void;
  buttonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
};

export function Modal({
  modalAction,
  modalState,

  title,
  description,
  cancelButton,
  confirmButton,
  confirmAction,
  buttonVariant,
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
            {cancelButton ? cancelButton : "Cancel"}
          </Button>
          <Button
            onClick={() => {
              modalAction();
              if (confirmAction) confirmAction();
            }}
            variant={buttonVariant}
          >
            {confirmButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
