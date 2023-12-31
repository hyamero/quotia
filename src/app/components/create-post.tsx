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

import { Dialog, DialogContent } from "~/app/components/ui/dialog";

import { Drawer, DrawerContent, DrawerHeader } from "./ui/drawer";

import { Button } from "./ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/components/ui/avatar";

export function CreatePost({ session }: { session?: Session }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <CreatePostTrigger session={session} setOpen={setOpen} open={open} />
        <DialogContent>
          {/* Form Component */}
          <CreatePostForm session={session} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <CreatePostTrigger session={session} setOpen={setOpen} open={open} />
      <DrawerContent className="px-7 pb-20">
        <DrawerHeader className="text-left"></DrawerHeader>
        {/* Form Component */}
        <CreatePostForm session={session} setOpen={setOpen} />
      </DrawerContent>
    </Drawer>
  );
}

type CreatePostFormProps = {
  session?: Session;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreatePostForm = ({ session, setOpen }: CreatePostFormProps) => {
  const [inputValue, setInputValue] = useState("");
  const { setTempPosts } = useStore();

  // Dynamic Textarea Height

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

  // ------

  const createPost = api.post.create.useMutation({
    onSuccess: (data) => {
      setTempPosts(data);
      toast.success("Post created!");
      setInputValue("");
    },
    onMutate: () => toast.loading("Creating post..."),
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
            className="w-full flex-grow resize-none overflow-hidden bg-background pb-4 pr-4 outline-none placeholder:text-zinc-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="cursor-pointer text-zinc-500">This is a button</p>
        <Button
          type="submit"
          className="rounded-full font-semibold disabled:cursor-not-allowed disabled:text-zinc-500"
          disabled={createPost.isLoading || inputValue.trim() === ""}
        >
          {createPost.isLoading ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
};

type CreatePostTriggerProps = {
  session?: Session;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreatePostTrigger = ({
  session,
  open,
  setOpen,
}: CreatePostTriggerProps) => {
  return (
    <div className="flex items-center gap-4 py-5">
      <Avatar className="pointer-events-none">
        <AvatarImage
          className="rounded-full"
          src={session?.user.image as string | undefined}
        />
        <AvatarFallback>{session?.user.name?.split(" ").at(0)}</AvatarFallback>
      </Avatar>

      <span
        onClick={() => setOpen(!open)}
        className="w-full cursor-text select-none text-zinc-500"
      >
        Start a quote...
      </span>

      <Button
        disabled
        className="rounded-full font-semibold disabled:cursor-not-allowed disabled:text-zinc-500"
      >
        Post
      </Button>
    </div>
  );
};
