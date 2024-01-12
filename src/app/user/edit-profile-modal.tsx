"use client";

import { toast } from "sonner";
import { api } from "~/trpc/react";
import { type FormEvent, useState } from "react";
import { useBoundStore } from "~/lib/use-bound-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";

import { type User } from "~/lib/types";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { Button } from "~/app/_components/ui/button";
import { useRouter } from "next/navigation";

type EditUserModalProps = {
  user: User;
};

export function EditUserModal({ user }: EditUserModalProps) {
  const router = useRouter();
  const setSession = useBoundStore((state) => state.setSession);

  const [name, setName] = useState(user.name ?? "");
  const [slug, setSlug] = useState("@" + user.slug ?? "");

  const editUser = api.user.editUser.useMutation({
    onSuccess: () => {
      toast.success("Profile Updated!");
      setSession({ ...user, slug: slug ?? null, name } as User);
      router.replace(`/user/${slug ?? user.id}`);
    },
    onMutate: () => {
      toast.loading("Updating profile...");
      router.prefetch(`/user/${slug ?? user.id}`);
    },
    onError: () => {
      toast.error("Something went wrong. Try again later.");
    },
  });

  const handleEditUser = (e: FormEvent) => {
    e.preventDefault();

    const _slug = slug.startsWith("@") ? slug.split("@").at(1) : slug;

    if (name !== user.name || _slug !== user.slug) {
      editUser.mutate({
        name: name,
        slug: _slug!,
      });
    }
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

        <form onSubmit={(e) => handleEditUser(e)}>
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
