import { create } from "zustand";
import {
  type TempPostSlice,
  createTempPostSlice,
} from "./stores/temp-post-slice";

import {
  type TempCommentSlice,
  createTempCommentSlice,
} from "./stores/temp-comment-slice";

import { type ModalSlice, createModalSlice } from "./stores/modal-slice";

import {
  type SessionUserSlice,
  createSessionUserSlice,
} from "./stores/session-user-slice";

export const useBoundStore = create<
  TempPostSlice & ModalSlice & TempCommentSlice & SessionUserSlice
>((...a) => ({
  ...createSessionUserSlice(...a),
  ...createTempPostSlice(...a),
  ...createModalSlice(...a),
  ...createTempCommentSlice(...a),
}));
