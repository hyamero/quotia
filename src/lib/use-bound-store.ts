import { create } from "zustand";
import {
  type TempPostSlice,
  createTempPostSlice,
} from "./stores/temp-post-slice";

import {
  type TempCommentSlice,
  createTempCommentSlice,
} from "./stores/temp-comment-slice";

import { type SessionSlice, createSessionSlice } from "./stores/session-slice";

import { type ModalSlice, createModalSlice } from "./stores/modal-slice";

export const useBoundStore = create<
  TempPostSlice & SessionSlice & ModalSlice & TempCommentSlice
>((...a) => ({
  ...createTempPostSlice(...a),
  ...createSessionSlice(...a),
  ...createModalSlice(...a),
  ...createTempCommentSlice(...a),
}));
