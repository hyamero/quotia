import { create } from "zustand";

export type PostItem =
  | {
      id: string;
      authorId: string;
      content: string | null;
      createdAt: Date;
      updatedAt: Date | null;
    }
  | undefined;

type User = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
};

export type Post = PostItem & {
  author: User;
};

type PostState = {
  tempPosts: PostItem[];
  setTempPosts: (newPost: PostItem) => void;
};

export const useStore = create<PostState>()((set) => ({
  tempPosts: [],
  setTempPosts: (newPost) =>
    set((state) => ({
      tempPosts: [newPost, ...state.tempPosts],
    })),
}));
