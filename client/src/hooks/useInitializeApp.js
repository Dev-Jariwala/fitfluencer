import { useEffect } from 'react';
import { useAuthStore, usePlansStore, useRolesStore, useUsersStore } from '@/store/commonStore';
import { useQuery } from '@tanstack/react-query';
import { authenticateUser, getRoles, getMyFamilyTree } from '@/services/userService';
import toast from 'react-hot-toast';
import { getChildrensByUserId, getParentByUserId } from '@/services/commonService';
import { getPlans } from '@/services/plansService';

/**
 * Hook to initialize application data
 * Handles both authenticated and non-authenticated data loading
 */
export const useInitializeApp = () => {
    const { token, data: userData, setToken, setData } = useAuthStore();

    const setPlans = usePlansStore(state => state.setPlans);

    const { roles, fetchRoles } = useRolesStore();

    const { setUsers } = useUsersStore();

    // Authentication status check
    const { data: authData, isLoading: authLoading, error: authError } = useQuery({
        queryKey: ['authenticateUser'],
        queryFn: async () => {
            const data = await authenticateUser();
            if (data?.isAuthenticated) {
                setToken(data?.token);
                setData(data?.data);
            }
            return data;
        },
    });

    // Load roles regardless of authentication
    const { isLoading: rolesLoading, error: rolesError } = useQuery({
        queryKey: ['getRoles'],
        queryFn: fetchRoles
    });

    const { isLoading: plansLoading, error: plansError } = useQuery({
        queryKey: ['getPlans'],
        queryFn: async () => {
            const plans = await getPlans();
            setPlans(plans?.data || []);
            return plans?.data || [];
        },
        enabled: !!token,
    });

    // Load family tree data only if authenticated
    const { isLoading: usersLoading, error: usersError } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const users = [];
            // this will be usefull when we have to get only immediate parent-child relationship
            /* const childrenData = await getChildrensByUserId('me');
            const parentData = await getParentByUserId('me');
            console.log(childrenData, parentData);
            if (childrenData?.data && childrenData?.data?.length > 0) {
                users.push(...childrenData?.data);
            }
            if (parentData?.data && parentData?.success) {
                users.push(parentData?.data);
            } */
            const familyTree = await getMyFamilyTree();
            console.log(familyTree);
            setUsers(familyTree?.data);
            return familyTree?.data;
        },
        enabled: false, // Only run if user is authenticated
    });

    // Handle errors
    useEffect(() => {
        if (authError && authError.message !== 'Unauthorized') {
            toast.error(authError.message || 'Authentication failed');
        }

        if (rolesError) {
            toast.error(rolesError.message || 'Failed to load roles');
        }

        if (usersError && token) {
            toast.error(usersError.message || 'Failed to load family data');
        }

        if (plansError) {
            toast.error(plansError.message || 'Failed to load plans');
        }
    }, [authError, rolesError, usersError, token, plansError]);

    return {
        isAuthenticated: !!authData?.isAuthenticated,
        isLoading: authLoading || rolesLoading || (token && usersLoading || plansLoading),
        userData,
        roles
    };
};

export default useInitializeApp; 