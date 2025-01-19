import { axiosInstance } from "@/lib/axios";
import { ChatStore } from "@/types/types";
import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      console.log("users fetched", res.data);
      set({ users: res.data });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser?.id}`,
        messageData
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    if (socket) {
      socket.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);

        if (newMessage.senderId !== selectedUser.id) return;
        set({ messages: [...get().messages, newMessage] });
      };
    }
  },

  unSubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;

    if (socket) {
      socket.onmessage = null;
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
