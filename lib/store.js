import { create } from "zustand";

export const useLoading = create((set) => ({
  msg: false,
  setMsg: (msg) => set(() => ({ msg: msg })),
}));