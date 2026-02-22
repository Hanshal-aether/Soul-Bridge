import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';

interface AuthState {
  user: FirebaseUser | null;
  userType: 'individual' | 'hospital' | null;
  walletAddress: string | null;
  isLoading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setUserType: (type: 'individual' | 'hospital' | null) => void;
  setWalletAddress: (address: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userType: null,
  walletAddress: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setUserType: (userType) => set({ userType }),
  setWalletAddress: (walletAddress) => set({ walletAddress }),
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, userType: null, walletAddress: null }),
}));
