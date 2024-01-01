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
  createPostIsOpen: boolean;

  actions: {
    setTempPosts: (newPost: PostItem) => void;
    setCreatePostIsOpen: (modalState: boolean) => void;
  };
};

const usePostStore = create<PostState>()((set) => ({
  tempPosts: [],
  createPostIsOpen: false,

  actions: {
    setTempPosts: (newPost) =>
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
