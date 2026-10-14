import { create } from "zustand";

type Store = {
    currTab: string
    changeCurrTab: (value: string) => void
}

export const useStore = create<Store>((set) => ({
    currTab: '',

    changeCurrTab: (value: string) => {set({ currTab: value })}
}))