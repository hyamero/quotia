"use client";

import * as z from "zod";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBoundStore } from "~/lib/use-bound-store";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "~/app/_components/ui/dialog";

import { type User } from "~/lib/types";
import { Input } from "~/app/_components/ui/input";
import { Button } from "~/app/_components/ui/button";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from "~/app/_components/ui/form";

type EditUserModalProps = {
  user: User;
};

export function EditUserModal({ user }: EditUserModalProps) {
  const router = useRouter();
  const setSession = useBoundStore((state) => state.setSession);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [name, setName] = useState(user.name ?? "");
  const [slug, setSlug] = useState(user.slug ?? "");

  const {
    mutate: editUser,
    isSuccess,
    isLoading,
    isError,
  } = api.user.editUser.useMutation();

  useEffect(() => {
    if (isLoading) {
      toast.loading("Updating profile...");
      router.prefetch(`/user/${slug ?? user.id}`);
    }

    if (isSuccess) {
      toast.success("Profile Updated!");
      setModalIsOpen(false);
      setSession({
        ...user,
        slug: slug ?? null,
        name: name,
      } as User);
      router.replace(`/user/${slug ?? user.id}`);
    }

    if (isError) {
      toast.error("Something went wrong. Try again later.");
    }
  }, [isLoading, isSuccess, isError]);

  const charWarning = (value: "max" | "min") => {
    if (value === "max") {
      return "The username must be 30 characters or less";
    } else {
      return "The username must be 3 characters or more";
    }
  };

  const formSchema = z.object({
    name: z
      .string()
      .min(3, { message: charWarning("min") })
      .max(30, { message: charWarning("max") })
      .regex(/^[a-z A-Z]+$/, "The name must contain only letters"),

    slug: z
      .string()
      .min(3, { message: charWarning("min") })
      .max(30, { message: charWarning("max") })
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "The username must contain only letters, numbers, period, and underscore (_)",
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name ?? "",
      slug: user.slug ?? "",
    },
  });

  const slugAvailable = api.user.slugAvaliable.useQuery(form.watch("slug"), {
    enabled: !!form.watch("slug"),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!slugAvailable.data) {
      toast.error("Username already taken.");
      return;
    }

    if (data.name !== user.name || data.slug !== user.slug) {
      editUser({
        name: data.name,
        slug: data.slug,
      });

      setName(data.name);
      setSlug(data.slug);
    } else {
      toast.info("No changes made.");
      setModalIsOpen(false);
    }
  };

  return (
    <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Display name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button title="submit" type="submit" className="w-full">
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
