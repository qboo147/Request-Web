import IdentityVerification from "@/views/pages/auth/IdentityVerification";
import PasswordNew from "@/views/pages/auth/PasswordNew";
import PasswordReset from "@/views/pages/auth/PasswordReset";
import Register from "@/views/pages/auth/Register";
import Home from "@/views/pages/Home";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

const Login = lazy(() => import("@/views/pages/auth/Login"));

export const publicRoutes: RouteObject[] = [
  {
    path: "/login",
    element: (
      <Suspense>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense>
        <Register />
      </Suspense>
    ),
  },
  {
    path: "/passwordreset",
    element: (
      <Suspense>
        <PasswordReset />
      </Suspense>
    ),
  },
  {
    path: "/identityverification",
    element: (
      <Suspense>
        <IdentityVerification />
      </Suspense>
    ),
  },
  {
    path: "/passwordnew",
    element: (
      <Suspense>
        <PasswordNew />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: (
      <Suspense>
        <Home />
      </Suspense>
    ),
  },
];
