import { create } from "zustand";

type Post =
  | {
      id: number;
      authorId: string;
      content: string | null;
      createdAt: Date;
      updatedAt: Date | null;
    }
  | undefined;

type PostState = {
  tempPosts: Post[];
  setTempPosts: (newPost: Post) => void;
};

export const useStore = create<PostState>()((set) => ({
  tempPosts: [],
  setTempPosts: (newPost) =>
    set((state) => ({
      tempPosts: [newPost, ...state.tempPosts],
    })),
}));
