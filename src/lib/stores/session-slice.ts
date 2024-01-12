import type { StateCreator } from "zustand";
import type { User } from "../types";

export type SessionSlice = {
  user: User | null;
  setSession: (newSession: User | null) => void;
};

export const createSessionSlice: StateCreator<SessionSlice> = (set) => ({
  user: {
    id: "",
    slug: null,
    name: "",
    email: "",
    image: "",
  },

  setSession: (newSession) =>
    set(() => ({
      user: newSession,
    })),
});
