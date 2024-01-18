import type { StateCreator } from "zustand";

export type ModalSlice = {
  postFormIsOpen: boolean;
  loginModalIsOpen: boolean;
  deletePostModalIsOpen: boolean;
  commentFormIsOpen: {
    isOpen: boolean;
    postId: string;
  };

  modalActions: {
    setPostFormIsOpen: (modalState: boolean) => void;
    setCommentFormIsOpen: (modalState: boolean) => void;
    togglePostFormIsOpen: () => void;
    toggleCommentFormIsOpen: (postId: string) => void;
    toggleLoginModalIsOpen: () => void;
    toggleDeletePostModalIsOpen: () => void;
  };
};

export const createModalSlice: StateCreator<ModalSlice> = (set) => ({
  postFormIsOpen: false,
  loginModalIsOpen: false,
  deletePostModalIsOpen: false,
  commentFormIsOpen: {
    isOpen: false,
    postId: "",
  },

  modalActions: {
    setPostFormIsOpen: (modalState) =>
      set(() => ({
        postFormIsOpen: modalState,
      })),

    setCommentFormIsOpen: (modalState) =>
      set(() => ({
        commentFormIsOpen: {
          isOpen: modalState,
          postId: "",
        },
      })),

    togglePostFormIsOpen: () =>
      set((state) => ({ postFormIsOpen: !state.postFormIsOpen })),

    toggleCommentFormIsOpen: (postId) =>
      set((state) => ({
        commentFormIsOpen: {
          isOpen: !state.commentFormIsOpen.isOpen,
          postId: postId,
        },
      })),

    toggleLoginModalIsOpen: () =>
      set((state) => ({ loginModalIsOpen: !state.loginModalIsOpen })),

    toggleDeletePostModalIsOpen: () =>
      set((state) => ({ deletePostModalIsOpen: !state.deletePostModalIsOpen })),
  },
});
