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
import type { Session } from "next-auth";
import { Button } from "../ui/button";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "~/app/_components/ui/avatar";
import { useBoundStore } from "~/lib/use-bound-store";

type PostFormProps = {
  user: Session["user"];
  formType: "post" | "comment";
  postId?: string;
};

export const PostForm = ({ user, formType, postId }: PostFormProps) => {
  const [inputValue, setInputValue] = useState("");

  const togglePostFormIsOpen = useBoundStore(
    (state) => state.modalActions.togglePostFormIsOpen,
  );
  const setTempPosts = useBoundStore(
    (state) => state.tempPostActions.setTempPosts,
  );
  const setTempComments = useBoundStore(
    (state) => state.tempCommentsActions.setTempComments,
  );

  const [textAreaCount, setTextAreaCount] = useState(0);

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

  /**
   * Create Post Mutation
   */

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

  const createComment = api.post.createComment.useMutation({
    onSuccess: (data) => {
      setTempComments(data);
      toast.success("Comment created!");
      setInputValue("");
    },
    onMutate: () => toast.loading("Creating comment..."),
    onError: () => {
      toast.error("Something went wrong. Try again later.");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (inputValue.trim() === "") return;

    if (formType === "post") {
      createPost.mutate({ content: inputValue });
      togglePostFormIsOpen();
    } else {
      createComment.mutate({ content: inputValue, postId: postId! });
    }
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
            src={user.image as string | undefined}
            alt={user.name ? `${user.name}'s avatar` : "user avatar"}
          />
          <AvatarFallback>{user.name}</AvatarFallback>
        </Avatar>
        <div className="w-full">
          <p className="text-base font-semibold">{user.name}</p>
          <textarea
            ref={inputRef}
            value={inputValue}
            style={{ height: 0 }}
            // maxLength={500}
            placeholder="Start a quote..."
            onChange={(e) => {
              setInputValue(e.target.value);
              setTextAreaCount(e.target.value.length);
            }}
            className="max-h-[350px] w-full flex-grow resize-none overflow-auto bg-background pb-4 pr-4 outline-none placeholder:text-zinc-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="cursor-pointer text-zinc-500">Your followers can reply</p>
        <div className="space-x-3">
          <span
            className={textAreaCount > 500 ? "text-red-500" : "text-zinc-500"}
          >
            {textAreaCount >= 450 ? 500 - textAreaCount : null}
          </span>
          <Button
            title="Post"
            type="submit"
            className="rounded-full font-semibold disabled:cursor-not-allowed disabled:text-zinc-500"
            disabled={
              createPost.isLoading ||
              inputValue.trim() === "" ||
              textAreaCount > 500
            }
          >
            {createPost.isLoading ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </form>
  );
};
