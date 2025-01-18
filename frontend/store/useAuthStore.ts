import { axiosInstance } from "@/lib/axios";
import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export interface User {
  id: string;
  fullName: string;
  email: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSignupData {
  fullName: string;
  email: string;
  password: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  userId?: string;
  email?: string;
  fullName?: string;
}

interface AuthState {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isChecking: boolean;
  isCheckingAuth: boolean;
  signup: (data: UserSignupData) => Promise<boolean>;
  login: (data: UserLoginData) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: { profilePic: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isChecking: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/user/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: UserSignupData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/user/signup", data);
      set({ authUser: res.data });
      // window.location.href = "/";
      toast.success("Account created successfully");
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: UserLoginData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/user/signin", data);
      set({ authUser: res.data });
      // window.location.href = "/";
      toast.success("Logged in successfully");
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/user/logout");
      set({ authUser: null });
      // window.location.href = "/login";
      toast.success("logged out successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/user/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Error in uploading image");
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
