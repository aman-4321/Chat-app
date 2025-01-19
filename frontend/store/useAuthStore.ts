import { axiosInstance } from "@/lib/axios";
import { AuthState, UserLoginData, UserSignupData } from "@/types/types";
import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const BASE_URL = "ws://localhost:8080";

interface WebSocketMessage {
  type: string;
  userIds?: string[];
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isChecking: true,
  onlineUsers: [] as string[],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/user/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch {
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

      get().connectSocket();

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

      get().connectSocket();

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
      get().disconnectSocket();
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

  connectSocket: () => {
    const { socket, authUser } = get();
    if (socket || !authUser) return;

    const wsUrl = `${BASE_URL}?userId=${authUser.id}`;
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log("Socket connected");
      set({ socket: newSocket });
    };

    newSocket.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        if (data.type === "getOnlineUsers" && data.userIds) {
          set({ onlineUsers: data.userIds });
        }
      } catch (error) {
        console.error("Error parsing websocket message", error);
      }
    };

    newSocket.onerror = (error) => {
      console.error("Websocket error", error);
    };
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null });
    }
  },
}));
