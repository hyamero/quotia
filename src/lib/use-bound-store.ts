import { create } from "zustand";
import {
  type TempPostSlice,
  createTempPostSlice,
} from "./stores/temp-post-slice";

import { type SessionSlice, createSessionSlice } from "./stores/session-slice";

import { type ModalSlice, createModalSlice } from "./stores/modal-slice";

export const useBoundStore = create<TempPostSlice & SessionSlice & ModalSlice>(
  (...a) => ({
    ...createTempPostSlice(...a),
    ...createSessionSlice(...a),
    ...createModalSlice(...a),
  }),
);
