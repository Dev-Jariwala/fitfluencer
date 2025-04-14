import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuthStore } from "@/store/commonStore";
import Home from "@/components/home/Home";
import LoginPage from "@/components/auth/LoginPage";
import Sidebar from "@/components/sidebar/Sidebar";
import PageNotFound from "@/components/errors/PageNotFound";
import RegisterPage from "@/components/auth/RegisterPage";
import PlansPage from "@/components/plans/PlansPage";
import { useQuery } from "@tanstack/react-query";
import { authenticateUser } from "@/services/userService";
import { useEffect } from "react";
import toast from "react-hot-toast";
import InviteLinkPage from "@/components/invite-link/InviteLinkPage";
import Navbar from "@/components/sidebar/Navbar";
import LogoutNavbar from "@/components/sidebar/LogoutNavbar";
import LogoutLayout from "@/components/sidebar/LogoutLayout";
import PaymentHistory from "@/components/payment-history/PaymentHistory";
import InviteLinks from "@/components/invite-links/InviteLinks";
import TeamPage from "@/components/team/TeamPage";
const Routes = () => {
  const { setToken, setData } = useAuthStore();

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
      // toast.error(error.message);
    }
  }, [error]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="basic-loader"></div>
    </div>
  }

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "*",
      element: <PageNotFound />,
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <Sidebar />,
      children: [
        {
          path: "/",
          element: <ProtectedRoute type="registered" isAuthenticated={userAuthenticated?.isAuthenticated} authenticateType="authenticated" />, // Wrap the component in ProtectedRoute
          children: [
            {
              path: "/",
              element: <Home />,
            },
            {
              path: "invite-link",
              element: <InviteLinkPage />,
            },
            {
              path: "payment-history",
              element: <PaymentHistory />,
            },
            {
              path: "invite-links",
              element: <InviteLinks />,
            },
            {
              path: "team",
              element: <TeamPage />,
            }
          ]
        }
      ],
    },
    {
      path: '/',
      element: <ProtectedRoute type="not-registered" isAuthenticated={userAuthenticated?.isAuthenticated} authenticateType="authenticated" />,
      children: [
        {
          path: '/',
          element: <Navigate to="/plans" />
        },
        {
          path: "plans",
          element: <LogoutLayout>
            <PlansPage />
          </LogoutLayout>
        }
      ]
    }
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: '/',
      element: <ProtectedRoute type="not-registered" isAuthenticated={userAuthenticated?.isAuthenticated} authenticateType="not-authenticated" />,
      children: [
        {
          path: '/',
          element: <Navigate to="/login" />
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
        {
          path: 'register',
          element: <RegisterPage />,
        },
      ]
    }
  ];

  // Combine and conditionally include routes based on authentication status
  const routes = [
    ...routesForPublic,
    ...(!userAuthenticated?.isAuthenticated ? routesForNotAuthenticatedOnly : []),
    ...(routesForAuthenticatedOnly),
  ]
  console.log('routes', routes)
  const router = createBrowserRouter(routes);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
