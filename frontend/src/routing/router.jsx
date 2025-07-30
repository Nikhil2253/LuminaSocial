import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoutes from "./ProtectedRoutes";
import MyProfilePage from "../pages/MyProfilePage";
import OpenedPost from "../components/OpenedPost";
import { ProfileProvider } from "../contexts/ProfileContext";
import UserProfilePage from "../pages/UserProfilePage";
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <HomePage />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/i/:id",
    element: (
      <ProtectedRoutes>
        <ProfileProvider>
          <MyProfilePage />
        </ProfileProvider>
      </ProtectedRoutes>
    ),
  },
  {
    path:"/u/:id",
    element:(
      <UserProfilePage />
    )
  },
  {
    path: "/posts/:id",
    element: <OpenedPost />,
  },
  {
    path:"*",
    element:<NotFound/>
  }
]);

export default router;
