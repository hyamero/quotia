import type { StateCreator } from "zustand";

export type ModalSlice = {
  postFormIsOpen: boolean;
  loginModalIsOpen: boolean;
  deletePostModalIsOpen: boolean;

  modalActions: {
    setPostFormIsOpen: (modalState: boolean) => void;
    togglePostFormIsOpen: () => void;
    toggleLoginModalIsOpen: () => void;
    toggleDeletePostModalIsOpen: () => void;
  };
};

export const createModalSlice: StateCreator<ModalSlice> = (set) => ({
  postFormIsOpen: false,
  loginModalIsOpen: false,
  deletePostModalIsOpen: false,

  modalActions: {
    setPostFormIsOpen: (modalState) =>
      set(() => ({
        postFormIsOpen: modalState,
      })),

    togglePostFormIsOpen: () =>
      set((state) => ({ postFormIsOpen: !state.postFormIsOpen })),

    toggleLoginModalIsOpen: () =>
      set((state) => ({ loginModalIsOpen: !state.loginModalIsOpen })),

    toggleDeletePostModalIsOpen: () =>
      set((state) => ({ deletePostModalIsOpen: !state.deletePostModalIsOpen })),
  },
});
