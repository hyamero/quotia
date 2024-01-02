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

/**
 * Temporary Posts (for optimistic UI when creating a new post)
 */

type TempPost = {
  tempPosts: Post[];
  setTempPosts: (newPost: Post | undefined) => void;
};

export const useTempPostStore = create<TempPost>()((set) => ({
  tempPosts: [],

  setTempPosts: (newPost) =>
    newPost &&
    set((state) => ({
      tempPosts: [newPost, ...state.tempPosts],
    })),
}));

export const useTempPosts = () => useTempPostStore((state) => state.tempPosts);

export const useSetTempPosts = () =>
  useTempPostStore((state) => state.setTempPosts);

/**
 * CreatePostModal (for opening and closing the create post modal)
 */

type CreatePostModal = {
  createPostIsOpen: boolean;

  actions: {
    setCreatePostIsOpen: (modalState: boolean) => void;
    toggleCreatePostIsOpen: () => void;
  };
};

const useCreatePostModal = create<CreatePostModal>()((set) => ({
  createPostIsOpen: false,

  actions: {
    setCreatePostIsOpen: (modalState) =>
      set(() => ({
        createPostIsOpen: modalState,
      })),
    toggleCreatePostIsOpen: () =>
      set((state) => ({ createPostIsOpen: !state.createPostIsOpen })),
  },
}));

export const usePostModalState = () =>
  useCreatePostModal((state) => state.createPostIsOpen);

export const usePostModalActions = () =>
  useCreatePostModal((state) => state.actions);
