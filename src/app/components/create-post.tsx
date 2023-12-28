"use client";

import {
  type FormEvent,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";

import { useStore } from "~/lib/useStore";
import { api } from "~/trpc/react";
import { toast } from "sonner";

import { type Session } from "next-auth";
import useMediaQuery from "~/hooks/use-media-query";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/app/components/ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "./ui/drawer";

import { Button } from "./ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/components/ui/avatar";

type CreatePostFormProps = {
  session?: Session;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreatePostForm({ session, setOpen }: CreatePostFormProps) {
  const [inputValue, setInputValue] = useState("");
  const { setTempPosts } = useStore();
  const textAreaRef = useRef<HTMLTextAreaElement>();

  function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
    if (textArea == null) return;
    textArea.style.height = "3rem";
    textArea.style.height = `${textArea.scrollHeight}px`;
  }

  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  useEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  const createPost = api.post.create.useMutation({
    onSuccess: (data) => {
      setTempPosts(data);
      toast.success("Post created!");
      setInputValue("");
    },
    onMutate: () => toast.info("Creating post..."),
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (inputValue.trim() === "") return;
    createPost.mutate({ content: inputValue });
    setOpen(false);
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="mx-auto flex w-full max-w-screen-sm flex-col gap-4"
    >
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage
            className="rounded-full"
            src={session?.user.image as string | undefined}
          />
          <AvatarFallback>{session?.user.name}</AvatarFallback>
        </Avatar>
        <div className="w-full">
          <p className="text-base font-semibold">{session?.user.name}</p>
          <textarea
            ref={inputRef}
            value={inputValue}
            style={{ height: 0 }}
            maxLength={500}
            placeholder="Start a quote..."
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full flex-grow resize-none overflow-hidden bg-background pb-4 pr-4 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="cursor-pointer text-gray-500">This is a button</p>
        <Button
          type="submit"
          variant="outline"
          className="disabled:cursor-not-allowed disabled:text-gray-500"
          disabled={createPost.isLoading || inputValue.trim() === ""}
        >
          {createPost.isLoading ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
}

export function CreatePost({ session }: { session?: Session }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="rounded-xl border border-white px-5 py-1">
          Start a Quote...
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {/* Form Component */}
          <CreatePostForm session={session} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="rounded-xl border border-white px-5 py-1">
        Start a Quote...
      </DrawerTrigger>
      <DrawerContent className="px-7 pb-20">
        <DrawerHeader className="text-left"></DrawerHeader>
        {/* Form Component */}
        <CreatePostForm session={session} setOpen={setOpen} />
      </DrawerContent>
    </Drawer>
  );
}
