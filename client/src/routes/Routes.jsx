import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Home from "@/components/home/Home";
import LoginPage from "@/components/auth/LoginPage";
import Sidebar from "@/components/sidebar/Sidebar";
import PageNotFound from "@/components/errors/PageNotFound";
import RegisterPage from "@/components/auth/RegisterPage";
import PlansPage from "@/components/plans/PlansPage";
import LogoutLayout from "@/components/sidebar/LogoutLayout";
import PaymentHistory from "@/components/payment-history/PaymentHistory";
import InviteLinks from "@/components/invite-links/InviteLinks";
import TeamPage from "@/components/team/TeamPage";
import useInitializeApp from "@/hooks/useInitializeApp";
import IncomePage from "@/components/income/IncomePage";
import MyProfile from "@/components/my-profile/MyProfile";
import MealsPage from "@/components/meals/MealsPage";

const Routes = () => {
  // Initialize application data (authenticated and non-authenticated)
  const { isAuthenticated, isLoading } = useInitializeApp();

  // Show loading indicator while fetching initial data
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
          element: <ProtectedRoute type="registered" isAuthenticated={isAuthenticated} authenticateType="authenticated" />, // Wrap the component in ProtectedRoute
          children: [
            {
              path: "/",
              element: <Home />,
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
            },
            {
              path: "income",
              element: <IncomePage />,
            },
            {
              path: "my-profile",
              element: <MyProfile />,
            },
            {
              path: "meals",
              element: <MealsPage />,
            }
          ]
        }
      ],
    },
    {
      path: '/',
      element: <ProtectedRoute type="not-registered" isAuthenticated={isAuthenticated} authenticateType="authenticated" />,
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
      element: <ProtectedRoute type="not-registered" isAuthenticated={isAuthenticated} authenticateType="not-authenticated" />,
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
    ...(!isAuthenticated ? routesForNotAuthenticatedOnly : []),
    ...(routesForAuthenticatedOnly),
  ]
  
  const router = createBrowserRouter(routes);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
