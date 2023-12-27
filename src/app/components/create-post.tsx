"use client";

import {
  type FormEvent,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";
import { useStore } from "~/lib/useStore";
import { api } from "~/trpc/react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { type Session } from "next-auth";

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return;
  textArea.style.height = "3rem";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

export function CreatePost({ session }: { session?: Session }) {
  const [inputValue, setInputValue] = useState("");
  const { setTempPosts } = useStore();
  const textAreaRef = useRef<HTMLTextAreaElement>();

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
  };

  return (
    <Dialog>
      <DialogTrigger className="rounded-xl border border-white px-5 py-1">
        Start a Quote...
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex w-full flex-col gap-4"
        >
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage
                className="h-10 rounded-full"
                src={session?.user.image as string | undefined}
              />
              <AvatarFallback>{session?.user.name}</AvatarFallback>
            </Avatar>
            <div className="w-full">
              <p>{session?.user.name}</p>
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
            <DialogTrigger
              type="submit"
              className="rounded-full bg-white/10 px-5 py-2 font-semibold transition hover:bg-white/20 disabled:cursor-not-allowed disabled:text-gray-500 disabled:hover:bg-white/10"
              disabled={createPost.isLoading || inputValue.trim() === ""}
            >
              {createPost.isLoading ? "Posting..." : "Post"}
            </DialogTrigger>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
