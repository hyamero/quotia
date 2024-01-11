"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";

import { type User } from "~/lib/useStore";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { Button } from "~/app/_components/ui/button";

type EditUserModalProps = {
  user: User;
};

export function EditUserModal({ user }: EditUserModalProps) {
  const editUser = api.user.editUser.useMutation({
    onSuccess: () => {
      toast.success("Profile Updated!");
    },
    onMutate: () => toast.loading("Updating profile..."),
    onError: () => {
      toast.error("Something went wrong. Try again later.");
    },
  });

  const [name, setName] = useState(user.name ?? "");
  const [slug, setSlug] = useState("@" + user.slug ?? "");

  const handleEditUser = () => {
    const _slug = slug.startsWith("@") ? slug.split("@").at(1) : slug;

    editUser.mutate({
      name: name,
      slug: _slug!,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button title="Edit Profile" variant="outline" className="w-full">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditUser}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                className="col-span-3"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogTrigger asChild>
              <Button title="Save profile changes" type="submit">
                Save changes
              </Button>
            </DialogTrigger>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
