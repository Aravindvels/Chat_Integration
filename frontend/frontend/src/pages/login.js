import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import ROUTE_CONSTANT from "../constant/route";
import {
  useLazyUserMeQuery,
  useUserLoginMutation,
} from "../service/loginservice";
import { getLocalStorage, setLocalStorageObject } from "../utils/helper";
import { LOCAL_CONSTANTS } from "../constant/local";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const [login,{isLoading}] = useUserLoginMutation();
  const [userMe] = useLazyUserMeQuery();
  const navigate = useNavigate();
  const accessToken = getLocalStorage(LOCAL_CONSTANTS.ACCESS);
  const user = useSelector((state) => state?.application?.user);
  const bas = process.env.REACT_APP_BASE_URL;
console.log(bas)
  useEffect(() => {
    if (accessToken && !user) {
      userMe()
        .unwrap()
        .then(() => {
          navigate(ROUTE_CONSTANT.HOME);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user, accessToken, navigate, userMe]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      login(values)
        .unwrap()
        .then((res) => {
          const { token } = res;
          setLocalStorageObject({
            [LOCAL_CONSTANTS.ACCESS]: token,
          });
          toast.success("Logged in successfully!");
          navigate(ROUTE_CONSTANT.HOME);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Login failed. Please check your credentials.");
        });
    },
  });

  return (
    <div className="whole-container">
      <ToastContainer />
      <div className="login-container">
        <div className="login">
          <form className="form" onSubmit={formik.handleSubmit}>
            <span className="input-span">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="error">{formik.errors.email}</div>
              ) : null}
            </span>

            <span className="input-span">
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="error">{formik.errors.password}</div>
              ) : null}
            </span>

            <span className="span">
              <Link to={ROUTE_CONSTANT.FORGOT_PASSWORD}>Forgot password?</Link>
            </span>

            <input className="submit" type="submit" value="Log in" disabled={isLoading}/>

            <span className="span">
              Don't have an account?{" "}
              <Link to={ROUTE_CONSTANT.REGISTER}>Sign up</Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
