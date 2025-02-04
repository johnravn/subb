import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import Error from "./pages/error";
import Signup from "./pages/signup";
import Home from "./pages/home";
import Profile from "./pages/profile";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Equipment from "./pages/equipment";
import Dashboard from "./pages/dashboard";
import Redirect from "./pages/redirect";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/home",
        element: <Home />,
        errorElement: <Error />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
            errorElement: <Error />,
          },
          {
            path: "profile",
            element: <Profile />,
            errorElement: <Error />,
          },
          {
            path: "equipment",
            element: <Equipment />,
            errorElement: <Error />,
          },
        ],
      },
      {
        path: "/profile",
        element: <Profile />,
        errorElement: <Error />,
      },
      {
        path: "/equipment",
        element: <Equipment />,
        errorElement: <Error />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <Error />,
  },
  {
    path: "/",
    element: <Redirect />,
    errorElement: <Error />,
  },
]);

export default router;
