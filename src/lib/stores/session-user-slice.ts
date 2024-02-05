import type { StateCreator } from "zustand";

type SessionUser = {
  user: {
    slug: string | null;
    name: string | null;
  } | null;
};

type SessionUserSliceActions = {
  setSessionUser: (newSession: SessionUserSlice["user"] | null) => void;
};

export type SessionUserSlice = SessionUser & SessionUserSliceActions;

export const createSessionUserSlice: StateCreator<
  SessionUserSlice & SessionUserSliceActions
> = (set) => ({
  user: {
    slug: null,
    name: null,
  },

  setSessionUser: (newSession) =>
    set(() => ({
      user: newSession,
    })),
});
