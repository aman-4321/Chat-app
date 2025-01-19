import { Theme } from "daisyui";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "coffee" as Theme, // default theme
      setTheme: (theme: Theme) => set({ theme }),
      isLoading: true,
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: "chat-theme",
      onRehydrateStorage: () => (state) => {
        state?.setIsLoading(false);
      },
    }
  )
);
