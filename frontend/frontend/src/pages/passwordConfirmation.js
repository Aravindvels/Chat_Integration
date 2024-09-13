import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdatePasswordMutation } from "../service/loginservice";
import ROUTE_CONSTANT from "../constant/route";
import { ToastContainer, toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const PasswordResetConfirm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postResetPassword,{isLoading}] = useUpdatePasswordMutation();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      postResetPassword({ id, password: values.password })
        .unwrap()
        .then((res) => {
          navigate(ROUTE_CONSTANT.LOGIN);
          toast.success("Password reset successfully.");
        })
        .catch((error) => {
          toast.error(error?.message);
        })
       
    },
  });

  return (
    <div className="whole-container">
      <ToastContainer />
      <div className="login-container">
        <div className="login">
          <form className="form" onSubmit={formik.handleSubmit}>
            <span className="input-span">
              <label htmlFor="password" className="label">
                New Password
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

            <span className="input-span">
              <label htmlFor="confirmPassword" className="label">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="error">{formik.errors.confirmPassword}</div>
              ) : null}
            </span>

            <button
              className="submit"
              type="submit"
              disabled={isLoading} 
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;
