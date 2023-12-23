"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import { api } from "~/trpc/react";
import { useStore } from "../utils/useStore";

export function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState("");

  // const { tempPosts, setTempPosts } = useStore();

  const {
    mutate: createPost,
    isLoading,
    // data,
  } = api.post.create.useMutation({
    onSuccess: (data) => {
      router.refresh();
      setContent("");
      console.log(data);
      toast.success("Post created!");
    },
    onMutate: () => toast.info("Creating post..."),
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (content.trim() === "") return;
    createPost({ content });

    // setTempPosts(data);
    // console.log(tempPosts);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Title"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
