"use client";

import { type FormEvent, useState } from "react";
import { useStore } from "~/lib/useStore";
import { api } from "~/trpc/react";
import { toast } from "sonner";

export function CreatePost() {
  const [content, setContent] = useState("");
  const { setTempPosts } = useStore();

  const { mutate: createPost, isLoading } = api.post.create.useMutation({
    onSuccess: (data) => {
      setTempPosts(data);
      toast.success("Post created!");
      setContent("");
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
