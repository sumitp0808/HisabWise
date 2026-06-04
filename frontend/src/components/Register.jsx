import { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";

import { register } from "../api/authApi";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    emailId: Yup.string().email("Email must be a valid email address").required("Email is required"),
    password: Yup.string().required("Password is required").min(8, "Password should be 8 characters minimum"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      emailId: "",
      password: "",
      remember: true,
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await register(values, setShowAlert, setAlertMessage);
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
      {/* Left Illustration Section */}
      <div className="hidden md:flex md:w-1/2 bg-slate-50 items-center justify-center p-10">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">
            Manage expenses more effectively with HisabWise!
          </h1>

          <img
            src="/static/illustrations/illustration_register.png"
            alt="register"
            className="w-full"
          />
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Top Login Link */}
          <div className="flex justify-end mb-8">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Login
              </Link>
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-2">
            Get started absolutely free
          </h2>

          <p className="text-gray-500 mb-8">
            Open Source, Group expense splitting app!
          </p>

          {/* Error Alert */}
          {showAlert && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-red-700">
              {alertMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />

                {touched.firstName && errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />

                {touched.lastName && errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

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

            {/* Register Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? "Creating Account..." : "Register"}
            </button>
          </form>

          {/* Mobile Login Link */}
          <div className="mt-6 text-center md:hidden">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/" className="font-semibold text-blue-600">
                Login
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