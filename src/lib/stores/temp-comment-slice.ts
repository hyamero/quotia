import type { StateCreator } from "zustand";
import type { PostItem, TempPostItem } from "../types";

export type TempCommentSlice = {
  tempComments: PostItem[];
  deletedComments: string[];
  deleteCommentId: string;

  tempCommentsActions: {
    setTempComments: (newComment: TempPostItem | undefined) => void;
    setDeletedComments: (commentId: string) => void;
    setDeleteCommentId: (commentId: string) => void;
  };
};

/**
 * Temporary Comments (for optimistic UI when creating a new comment)
 */

export const createTempCommentSlice: StateCreator<TempCommentSlice> = (
  set,
) => ({
  tempComments: [],
  deletedComments: [],
  deleteCommentId: "",

  tempCommentsActions: {
    setTempComments: (newComment) =>
      newComment &&
      set((state) => ({
        tempComments: [
          { ...newComment, likes: 0, likedByUser: false, updatedAt: null },
          ...state.tempComments,
        ],
      })),

    setDeletedComments: (commentId) =>
      set((state) => ({
        deletedComments: [...state.deletedComments, commentId],
      })),

    setDeleteCommentId: (commentId) =>
      set(() => ({
        deleteCommentId: commentId,
      })),
  },
});
