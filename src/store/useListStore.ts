import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary } from "@/types";

interface ListState {
  selectedProfiles: UserProfileSummary[];
  addProfile: (profile: UserProfileSummary) => void;
  removeProfile: (userId: string) => void;
  clearList: () => void;
  isSelected: (userId: string) => boolean;
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      selectedProfiles: [],
      addProfile: (profile) => {
        if (get().selectedProfiles.some((p) => p.user_id === profile.user_id)) return;
        set((s) => ({ selectedProfiles: [...s.selectedProfiles, profile] }));
      },
      removeProfile: (userId) =>
        set((s) => ({
          selectedProfiles: s.selectedProfiles.filter((p) => p.user_id !== userId),
        })),
      clearList: () => set({ selectedProfiles: [] }),
      isSelected: (userId) => get().selectedProfiles.some((p) => p.user_id === userId),
    }),
    { name: "wobb-selected-profiles" }
  )
);
