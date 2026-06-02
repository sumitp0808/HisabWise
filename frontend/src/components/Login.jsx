import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";

import { login } from "../api/authApi";
import configData from "../config.json";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("profile"));

  if (user?.accessToken) {
    return <Navigate to={configData.DASHBOARD_URL} replace />;
  }

  const LoginSchema = Yup.object().shape({
    emailId: Yup.string().email("Email must be a valid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      emailId: "",
      password: "",
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await login(values, setShowAlert, setAlertMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = formik;

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden md:flex md:w-1/2 bg-slate-50 items-center justify-center p-10">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">
            Hi, Welcome Back
          </h1>

          <img
            src="/static/illustrations/illustration_login.png"
            alt="login"
            className="w-full"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Register Link */}
          <div className="flex justify-end mb-8">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to={configData.REGISTER_URL}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Get Started
              </Link>
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-2">
            Sign in to HisabWise!
          </h2>

          <p className="text-gray-500 mb-8">
            Enter your details below.
          </p>

          {/* Error Alert */}
          {showAlert && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-red-700">
              {alertMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email Address
              </label>

              <input
                type="email"
                name="emailId"
                value={values.emailId}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              {touched.emailId && errors.emailId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.emailId}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <Eye size={20} />
                  ) : (
                    <EyeOff size={20} />
                  )}
                </button>
              </div>

              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Mobile Register Link */}
          <div className="mt-6 text-center md:hidden">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to={configData.REGISTER_URL}
                className="font-semibold text-blue-600"
              >
                Get Started
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-10 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} HisabWise
          </div>
        </div>
      </div>
    </div>
  );
}