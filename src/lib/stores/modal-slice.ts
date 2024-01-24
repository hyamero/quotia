import type { StateCreator } from "zustand";
import type { Post } from "../types";

export type ModalSlice = {
  postFormIsOpen: boolean;
  loginModalIsOpen: boolean;
  deletePostModalIsOpen: boolean;
  likesModalIsOpen: boolean;
  commentFormIsOpen: {
    isOpen: boolean;
    post: Post;
  };

  modalActions: {
    setPostFormIsOpen: (modalState: boolean) => void;
    setCommentFormIsOpen: (modalState: boolean) => void;
    setLikesModalIsOpen: (modalState: boolean) => void;
    togglePostFormIsOpen: () => void;
    toggleCommentFormIsOpen: (post: Post) => void;
    toggleLoginModalIsOpen: () => void;
    toggleDeletePostModalIsOpen: () => void;
  };
};

export const createModalSlice: StateCreator<ModalSlice> = (set) => ({
  postFormIsOpen: false,
  loginModalIsOpen: false,
  deletePostModalIsOpen: false,
  likesModalIsOpen: false,
  commentFormIsOpen: {
    isOpen: false,
    post: {
      ...({} as Post),
    },
  },

  modalActions: {
    setPostFormIsOpen: (modalState) =>
      set(() => ({
        postFormIsOpen: modalState,
      })),

    setLikesModalIsOpen: (modalState) =>
      set(() => ({
        likesModalIsOpen: modalState,
      })),

    setCommentFormIsOpen: (modalState) =>
      set((state) => ({
        commentFormIsOpen: {
          isOpen: modalState,
          post: state.commentFormIsOpen.post,
        },
      })),

    togglePostFormIsOpen: () =>
      set((state) => ({ postFormIsOpen: !state.postFormIsOpen })),

    toggleCommentFormIsOpen: (post) =>
      set((state) => ({
        commentFormIsOpen: {
          isOpen: !state.commentFormIsOpen.isOpen,
          post: { ...post },
        },
      })),

    toggleLoginModalIsOpen: () =>
      set((state) => ({ loginModalIsOpen: !state.loginModalIsOpen })),

    toggleDeletePostModalIsOpen: () =>
      set((state) => ({ deletePostModalIsOpen: !state.deletePostModalIsOpen })),
  },
});
