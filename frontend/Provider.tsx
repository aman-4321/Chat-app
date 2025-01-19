"use client";

import { useThemeStore } from "@/store/useThemeStore";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { useAuthStore } from "@/store/useAuthStore";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, isLoading, setIsLoading } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoading(false);
  }, [setIsLoading]);

  if (!mounted || isLoading) {
    return <Loading />;
  }

  return <div data-theme={theme}>{children}</div>;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return <Loading />;
  }

  return children;
}

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
