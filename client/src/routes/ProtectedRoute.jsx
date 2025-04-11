import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore, useRolesStore } from "@/store/commonStore";
import { getRoles } from "@/services/rolesService";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
export const ProtectedRoute = ({ type, isAuthenticated, authenticateType }) => {
  const { data } = useAuthStore();
  const setRoles = useRolesStore(state => state.setRoles);

  const { data: roles, isLoading: isLoadingRoles, error: errorRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const data = await getRoles();
      setRoles(data?.roles);
      return data?.roles;
    }
  });

  useEffect(() => {
    if (errorRoles) {
      toast.error(`Error fetching roles: ${JSON.stringify(errorRoles)}`);
    }
  }, [errorRoles]);

  if (authenticateType === 'authenticated' && !isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (authenticateType === 'not-authenticated' && isAuthenticated) {
    return <Navigate to="/" />
  }

  if (type === 'not-registered' && data?.is_registered) {
    return <Navigate to="/" />
  }

  if (type === 'registered' && !data?.is_registered) {
    return <Navigate to="/plans" />
  }

  return (
    <Outlet />
  )
};
