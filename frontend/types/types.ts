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

export interface AuthState {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isChecking: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: null | WebSocket;
  signup: (data: UserSignupData) => Promise<boolean>;
  login: (data: UserLoginData) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: { profilePic: string }) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  sender: User;
  receiver: User;
}

export interface ChatState {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
}

export interface ChatStore {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (data: {
    text?: string;
    image?: string | ArrayBuffer | null;
  }) => Promise<void>;
  setSelectedUser: (selectedUser: User | null) => void;
  subscribeToMessages: () => void;
  unSubscribeFromMessages: () => void;
}
