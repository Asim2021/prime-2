import { create } from "zustand";
import { INITIAL_USER } from "./constant";
import { devtools } from "zustand/middleware";

interface UserStore {
  user: UserI;
  avatarName: string;
  isAnonymous: boolean;
  setUser: (user: UserI) => void;
}

const getAvatarName = (name : string | undefined) =>{
  return name
    ? name
        .split(" ")
        .map((ele) => ele[0])
        .splice(0, 3)
        .join("")
    : "";
}

const useUserStore = create<UserStore>()(
  devtools((set) => ({
    user: INITIAL_USER,
    avatarName : '',
    isAnonymous: false,
    setUser: (user) => {
      set((state) => ({
        ...state,
        avatarName : getAvatarName(user?.username),
        user,
        isAnonymous: false,
      }));
    },
  }))
);

export default useUserStore;
