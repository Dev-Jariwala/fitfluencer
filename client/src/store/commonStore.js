import { create } from 'zustand'
import { getRoles } from '@/services/userService'

// Auth store with persistence
export const useAuthStore = create((set) => ({
    token: null,
    data: null,
    setToken: (token) => set({ token }),
    setData: (data) => set({ data }),
    logout: () => set({ token: null, data: null }),
}));

// Roles store with persistence and initialization
export const useRolesStore = create((set, get) => ({
    roles: [],
    setRoles: (roles) => set({ roles }),
    fetchRoles: async () => {
        const response = await getRoles()
        set({ roles: response.roles || [] })
        return response.roles || []
    },
    clearRoles: () => set({ roles: [] }),
}));

export const usePlansStore = create((set) => ({
    plans: [],
    setPlans: (plans) => set({ plans }),
    clearPlans: () => set({ plans: [] }),
}));

// Users store with persistence
export const useUsersStore = create((set) => ({
    users: [],
    setUsers: (users) => set({ users }),
    clearUsers: () => set({ users: [] }),
}));
