import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user: user }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

export const useLoading = create((set) => ({
  msg: false,
  setMsg: (msg) => set(() => ({ msg: msg })),
}));

export const useAccountsStore = create(
  persist(
    (set, get) => ({
      accounts: null,
      setAccounts: (accounts) => set({ accounts: accounts }),
    }),
    {
      name: 'accounts-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

export const useCategoriesStore = create(
  persist(
    (set, get) => ({
      categories: null,
      setCategories: (categories) => set({ categories: categories }),
    }),
    {
      name: 'categories-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)