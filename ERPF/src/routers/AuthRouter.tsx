import { createBrowserRouter, Navigate } from "react-router-dom";

import ForgetPassword from "@pages/Auth/ForgetPassword";
import Register from "@pages/Auth/Register";
import ResetPassword from "@pages/Auth/ResetPassword";
import Verify from "@pages/Auth/Verify";
import { ENDPOINT } from "@constants/endpoints";
import Login from "@pages/Auth/Login";

const AuthRouter = createBrowserRouter([
  { path: ENDPOINT.BASE, element: <Login /> },
  { path: ENDPOINT.AUTH.LOGIN, element: <Login /> },
  {
    path: ENDPOINT.AUTH.LOGOUT,
    element: <Navigate to={ENDPOINT.AUTH.LOGIN} replace />,
  },
  { path: ENDPOINT.AUTH.REGISTER, element: <Register /> },
  { path: ENDPOINT.AUTH.FORGET_PASSWORD, element: <ForgetPassword /> },
  { path: ENDPOINT.AUTH.VERIFY, element: <Verify /> },
  {
    path: ENDPOINT.AUTH.RESET_PASSWORD,
    element: <ResetPassword />,
  },
  { path: ENDPOINT.ALL, element: <Navigate to={ENDPOINT.BASE} replace /> },
]);

export default AuthRouter;
