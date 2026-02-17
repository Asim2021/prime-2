import { createBrowserRouter, Navigate } from "react-router-dom";

import ForgetPassword from "@pages/Auth/ForgetPassword";
import { ENDPOINT } from "@constants/endpoints";
import Login from "@pages/Auth/Login";

const AuthRouter = createBrowserRouter([
  { path: ENDPOINT.BASE, element: <Login /> },
  { path: ENDPOINT.AUTH.LOGIN, element: <Login /> },
  {
    path: ENDPOINT.AUTH.LOGOUT,
    element: <Navigate to={ENDPOINT.AUTH.LOGIN} replace />,
  },
  { path: ENDPOINT.AUTH.FORGET_PASSWORD, element: <ForgetPassword /> },
  { path: ENDPOINT.ALL, element: <Navigate to={ENDPOINT.BASE} replace /> },
]);

export default AuthRouter;
