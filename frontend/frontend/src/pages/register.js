import { useFormik } from "formik";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ROUTE_CONSTANT from "../constant/route";
import { usePostUserDetailsMutation } from "../service/loginservice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
  email: Yup.string().email("Invalid email format"),
});

const Register = () => {
  const [postUser,{isLoading}] = usePostUserDetailsMutation();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      postUser(values)
        .then((res) => {
          toast.success("Registration successful!");
          navigate(ROUTE_CONSTANT.LOGIN);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Registration failed. Please try again.");
        });
    },
  });
  
  return (
    <div className="whole-container">
      <ToastContainer />
      <div className="login-container">
        <form className="form" onSubmit={formik.handleSubmit}>
          <span className="input-span">
            <label htmlFor="username" className="label">
              User Name
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="error">{formik.errors.username}</div>
            ) : null}
          </span>

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

          <button className="submit" type="submit" disabled={isLoading}>
            Register
          </button>

          <span className="span">
            Don't have an account? <Link to={ROUTE_CONSTANT.LOGIN}>Login</Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
