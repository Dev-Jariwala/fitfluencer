import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    token: null,
    data: null,
    setToken: (token) => set({ token }),
    setData: (data) => set({ data }),
    logout: () => set({ token: null, data: null }),
}));

export const useRolesStore = create((set) => ({
    roles: [],
    setRoles: (roles) => set({ roles }),
}));