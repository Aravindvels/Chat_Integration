import React from "react";
import { useRoutes } from "react-router-dom";
import Login from "../pages/login";
import Register from "../pages/register";
import ROUTE_CONSTANT from "../constant/route";
import ChatPage from "../pages/home";
import PasswordReset from "../pages/forgotpassword";
import PasswordResetConfirm from "../pages/passwordConfirmation";
const RouterConst = () => {
  const route = [
    {
      path: ROUTE_CONSTANT.LOGIN,
      element: <Login />,
    },
    {
      path: ROUTE_CONSTANT.REGISTER,
      element: <Register />,
    },
    {
      path: ROUTE_CONSTANT.HOME,
      element: <ChatPage />,
    },
    {
      path: ROUTE_CONSTANT.FORGOT_PASSWORD,
      element: <PasswordReset />,
    },
    {
      path: `${ROUTE_CONSTANT.PASSWORD_RESET}/:id`, 
      element: <PasswordResetConfirm />,
    }
  ];

  const content = useRoutes(route);
  return content;
};

export default RouterConst;
