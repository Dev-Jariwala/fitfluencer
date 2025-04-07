import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/commonStore";
import { useQuery } from "@tanstack/react-query";
import { authenticateUser } from "@/services/userService";
import { useEffect } from "react";
import toast from "react-hot-toast";
export const NotRegisteredProtectedRoute = () => {
  const setToken = useAuthStore(state => state.setToken);
  const setData = useAuthStore(state => state.setData);

  const { data: userAuthenticated, isLoading, error } = useQuery({
    queryKey: ['authenticateUser'],
    queryFn: async () => {
      const data = await authenticateUser();
      if (data?.isAuthenticated) {
        setToken(data?.token);
        setData(data?.data);
      }
      return data;
    },
    // enabled: false
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="basic-loader"></div>
    </div>
  }
  if (!userAuthenticated?.isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (userAuthenticated?.data?.is_registered) {
    return <Navigate to="/" />
  }
  return (
    <Outlet />
  )
};
