"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type FormEvent,
} from "react";

import { toast } from "sonner";
import { api } from "~/trpc/react";
import { type Session } from "next-auth";

import useMediaQuery from "~/hooks/use-media-query";
import { usePostActions, usePostModal } from "~/lib/usePostStore";

import { Dialog, DialogContent } from "~/app/components/ui/dialog";

import { Drawer, DrawerContent } from "./ui/drawer";

import { Button } from "./ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "~/app/components/ui/avatar";

export function CreatePost({ session }: { session?: Session | null }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const createPostIsOpen = usePostModal();
  const { setCreatePostIsOpen } = usePostActions();

  if (!session)
    return (
      <CreatePostTrigger
        setOpen={setCreatePostIsOpen}
        open={createPostIsOpen}
      />
    );

  if (isDesktop) {
    return (
      <Dialog open={createPostIsOpen} onOpenChange={setCreatePostIsOpen}>
        <CreatePostTrigger
          session={session}
          open={createPostIsOpen}
          setOpen={setCreatePostIsOpen}
        />
        <DialogContent>
          {/* Form Component */}
          <CreatePostForm session={session} setOpen={setCreatePostIsOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={createPostIsOpen} onOpenChange={setCreatePostIsOpen}>
      <CreatePostTrigger
        open={createPostIsOpen}
        session={session}
        setOpen={setCreatePostIsOpen}
      />
      <DrawerContent className="px-7 pb-20">
        {/* Form Component */}
        <CreatePostForm session={session} setOpen={setCreatePostIsOpen} />
      </DrawerContent>
    </Drawer>
  );
}

type CreatePostFormProps = {
  session?: Session;
  setOpen: (modalState: boolean) => void;
};

const CreatePostForm = ({ session, setOpen }: CreatePostFormProps) => {
  const [inputValue, setInputValue] = useState("");
  const { setTempPosts } = usePostActions();

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
    onError: () => {
      toast.error("Something went wrong. Try again later.");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (inputValue.trim() === "") return;
    createPost.mutate({ content: inputValue });
    setOpen(!open);
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
            className="max-h-[350px] w-full flex-grow resize-none overflow-auto bg-background pb-4 pr-4 outline-none placeholder:text-zinc-500"
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
  setOpen: (modalState: boolean) => void;
};

const CreatePostTrigger = ({
  session,
  setOpen,
  open,
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

      <button
        onClick={() => {
          setOpen(!open);
        }}
        className="w-full cursor-text select-none text-left text-zinc-500"
        disabled={!session}
      >
        Start a quote...
      </button>

      <Button
        disabled
        className="rounded-full font-semibold disabled:cursor-not-allowed disabled:text-zinc-500"
      >
        Post
      </Button>
    </div>
  );
};
