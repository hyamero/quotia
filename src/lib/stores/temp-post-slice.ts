import type { StateCreator } from "zustand";
import type { PostItem, TempPostItem } from "../types";

export type TempPostSlice = {
  tempPosts: PostItem[];
  deletedPosts: string[];
  deletePostId: string;

  tempPostActions: {
    setTempPosts: (newPost: TempPostItem | undefined) => void;
    setDeletedPosts: (postId: string) => void;
    setDeletePostId: (postId: string) => void;
  };
};

/**
 * Temporary Posts (for optimistic UI when creating a new post)
 */

export const createTempPostSlice: StateCreator<TempPostSlice> = (set) => ({
  tempPosts: [],
  deletedPosts: [],
  deletePostId: "",

  tempPostActions: {
    setTempPosts: (newPost) =>
      newPost &&
      set((state) => ({
        tempPosts: [
          {
            ...newPost,
            likes: 0,
            likedByUser: false,
            updatedAt: null,
            replies: 0,
          },
          ...state.tempPosts,
        ],
      })),

    setDeletedPosts: (postId) =>
      set((state) => ({
        deletedPosts: [...state.deletedPosts, postId],
      })),

    setDeletePostId: (postId) =>
      set(() => ({
        deletePostId: postId,
      })),
  },
});
