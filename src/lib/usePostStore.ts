import { create } from "zustand";

type PostItem = {
  id: string;
  authorId: string;
  content: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

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
  tempPosts: Post[];
  createPostIsOpen: boolean;

  actions: {
    setTempPosts: (newPost: Post | undefined) => void;
    setCreatePostIsOpen: (modalState: boolean) => void;
  };
};

const usePostStore = create<PostState>()((set) => ({
  tempPosts: [],
  createPostIsOpen: false,

  actions: {
    setTempPosts: (newPost) =>
      newPost &&
      set((state) => ({
        tempPosts: [newPost, ...state.tempPosts],
      })),
    setCreatePostIsOpen: (modalState) =>
      set(() => ({
        createPostIsOpen: modalState,
      })),
  },
}));

export const useTempPosts = () => usePostStore((state) => state.tempPosts);

export const usePostModal = () =>
  usePostStore((state) => state.createPostIsOpen);

export const usePostActions = () => usePostStore((state) => state.actions);
