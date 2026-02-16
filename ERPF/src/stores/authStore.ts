import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { INITIAL_AUTH_STORE } from './constant'

interface State {
  accessToken: string | undefined | null;
  isLoggedIn: boolean;
  loading: boolean; // To counter the change in route at refresh
}

interface Actions {
  setAuth: (accessToken: string | undefined) => void;
  clearAuth: () => void;
}

const useAuthStore = create<State & Actions>()(
  devtools((set) => ({
    ...INITIAL_AUTH_STORE,
    setAuth: (accessToken) =>
      set((state) => ({
        ...state,
        isLoggedIn: true,
        accessToken: accessToken,
        loading: false,
      })),
    clearAuth: () => set({...INITIAL_AUTH_STORE, loading: false}),
  }))
);

export default useAuthStore;
