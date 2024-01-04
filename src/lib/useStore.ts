import { create } from "zustand";
import type { Session } from "next-auth";

type PostItem = {
  id: string;
  authorId: string;
  content: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  likes: number;
  likedByUser: boolean;
};

export type TempPostItem = Omit<
  PostItem,
  "likes" | "likedByUser" | "updatedAt"
>;

export type User = {
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

type TempPostStore = {
  tempPosts: PostItem[];
  setTempPosts: (newPost: TempPostItem | undefined) => void;
};

export const useTempPostStore = create<TempPostStore>()((set) => ({
  tempPosts: [],

  setTempPosts: (newPost) =>
    newPost &&
    set((state) => ({
      tempPosts: [
        { ...newPost, likes: 0, likedByUser: false, updatedAt: null },
        ...state.tempPosts,
      ],
    })),
}));

export const useTempPosts = () => useTempPostStore((state) => state.tempPosts);

export const useSetTempPosts = () =>
  useTempPostStore((state) => state.setTempPosts);

/**
 * Store session data for client-side use
 */

type SessionStore = {
  user: Session["user"] | null;
  setSession: (newSession: Session["user"] | null) => void;
};

const useSessionStore = create<SessionStore>()((set) => ({
  user: {
    id: "",
    name: "",
    email: "",
    image: "",
  },

  setSession: (newSession) =>
    set(() => ({
      user: newSession,
    })),
}));

export const useUser = () => useSessionStore((state) => state.user);

export const useSetSession = () => useSessionStore((state) => state.setSession);

/**
 * CreatePostModal (for opening and closing the create post modal)
 */

type CreatePostModalStore = {
  createPostIsOpen: boolean;

  actions: {
    setCreatePostIsOpen: (modalState: boolean) => void;
    toggleCreatePostIsOpen: () => void;
  };
};

const useCreatePostModalStore = create<CreatePostModalStore>()((set) => ({
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
  useCreatePostModalStore((state) => state.createPostIsOpen);

export const usePostModalActions = () =>
  useCreatePostModalStore((state) => state.actions);
