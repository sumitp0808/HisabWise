import { useState } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, X, CheckCircle } from "lucide-react";

import { updatePassword } from "../../api/authApi";
import AlertBanner from "../AlertBanner";

ChangePassword.propTypes = {
  emailId: PropTypes.string,
  hidePassUpdate: PropTypes.func,
  showHomeAlert: PropTypes.func,
  homeAlertMessage: PropTypes.func,
};

export default function ChangePassword({
  hidePassUpdate,
  emailId,
  showHomeAlert,
  homeAlertMessage,
}) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [showPasswordOld, setShowPasswordOld] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Old Password is required"),

    newPassword: Yup.string()
      .required("New Password is required")
      .min(8, "Password should be 8 characters minimum"),

    confirmPassword: Yup.string().oneOf(
      [Yup.ref("newPassword"), null],
      "Passwords must match"
    ),
  });

  const formik = useFormik({
    initialValues: {
      emailId,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const updateResponse = await updatePassword(
          values,
          setShowAlert,
          setAlertMessage,
          showHomeAlert,
          homeAlertMessage
        );

        if (updateResponse) {
          hidePassUpdate();
        }
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <AlertBanner
        showAlert={showAlert}
        alertMessage={alertMessage}
        severity="error"
      />

      {/* Old Password */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Old Password
        </label>

        <div className="relative">
          <input
            type={showPasswordOld ? "text" : "password"}
            name="oldPassword"
            value={values.oldPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-blue-500"
          />

          <button
            type="button"
            onClick={() =>
              setShowPasswordOld((prev) => !prev)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPasswordOld ? (
              <Eye size={20} />
            ) : (
              <EyeOff size={20} />
            )}
          </button>
        </div>

        {touched.oldPassword && errors.oldPassword && (
          <p className="mt-1 text-sm text-red-500">
            {errors.oldPassword}
          </p>
        )}
      </div>

      {/* New Password */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          New Password
        </label>

        <div className="relative">
          <input
            type={showPasswordNew ? "text" : "password"}
            name="newPassword"
            value={values.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-blue-500"
          />

          <button
            type="button"
            onClick={() =>
              setShowPasswordNew((prev) => !prev)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPasswordNew ? (
              <Eye size={20} />
            ) : (
              <EyeOff size={20} />
            )}
          </button>
        </div>

        {touched.newPassword && errors.newPassword && (
          <p className="mt-1 text-sm text-red-500">
            {errors.newPassword}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Confirm Password
        </label>

        <div className="relative">
          <input
            type={
              showPasswordConfirm ? "text" : "password"
            }
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-blue-500"
          />

          <button
            type="button"
            onClick={() =>
              setShowPasswordConfirm((prev) => !prev)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPasswordConfirm ? (
              <Eye size={20} />
            ) : (
              <EyeOff size={20} />
            )}
          </button>
        </div>

        {touched.confirmPassword &&
          errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword}
            </p>
          )}
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={hidePassUpdate}
          className="flex items-center justify-center gap-2 rounded-lg border border-red-500 px-4 py-3 text-red-500 transition hover:bg-red-50"
        >
          <X size={18} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-lg border border-green-600 px-4 py-3 text-green-600 transition hover:bg-green-50 disabled:opacity-50"
        >
          <CheckCircle size={18} />
          {isSubmitting ? "Updating..." : "Update"}
        </button>
      </div>
    </form>
  );
}