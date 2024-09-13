import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { useRequestPasswordMutation } from "../service/loginservice";
import { ToastContainer, toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const [postForgotPassword,{isLoading}] = useRequestPasswordMutation();


  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: (values) => {
      postForgotPassword(values)
        .unwrap()
        .then((res) => {
          toast.success("Password reset email sent.");
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

            <button
              className="submit"
              type="submit"
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
