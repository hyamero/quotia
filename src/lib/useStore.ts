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
  deletedPosts: string[];

  actions: {
    setTempPosts: (newPost: TempPostItem | undefined) => void;
    setDeletedPosts: (postId: string) => void;
  };
};

export const useTempPostStore = create<TempPostStore>()((set) => ({
  tempPosts: [],
  deletedPosts: [],

  actions: {
    setTempPosts: (newPost) =>
      newPost &&
      set((state) => ({
        tempPosts: [
          { ...newPost, likes: 0, likedByUser: false, updatedAt: null },
          ...state.tempPosts,
        ],
      })),
    setDeletedPosts: (postId) =>
      set((state) => ({
        deletedPosts: [...state.deletedPosts, postId],
      })),
  },
}));

export const useTempPosts = () => useTempPostStore((state) => state.tempPosts);

export const useDeletedPosts = () =>
  useTempPostStore((state) => state.deletedPosts);

export const usePostActions = () => useTempPostStore((state) => state.actions);

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

type ModalStore = {
  postFormIsOpen: boolean;
  loginModalIsOpen: boolean;

  actions: {
    setPostFormIsOpen: (modalState: boolean) => void;
    togglePostFormIsOpen: () => void;
    toggleLoginModalIsOpen: () => void;
  };
};

const useModalStore = create<ModalStore>()((set) => ({
  postFormIsOpen: false,
  loginModalIsOpen: false,

  actions: {
    setPostFormIsOpen: (modalState) =>
      set(() => ({
        postFormIsOpen: modalState,
      })),
    togglePostFormIsOpen: () =>
      set((state) => ({ postFormIsOpen: !state.postFormIsOpen })),

    toggleLoginModalIsOpen: () =>
      set((state) => ({ loginModalIsOpen: !state.loginModalIsOpen })),
  },
}));

export const usePostFormModal = () =>
  useModalStore((state) => state.postFormIsOpen);

export const useLoginModal = () =>
  useModalStore((state) => state.loginModalIsOpen);

export const useModalActions = () => useModalStore((state) => state.actions);
