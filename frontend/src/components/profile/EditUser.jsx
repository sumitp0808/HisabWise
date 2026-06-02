import { useState } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X, CheckCircle } from "lucide-react";

import { editUser } from "../../api/authApi";
import AlertBanner from "../AlertBanner";

EditForm.propTypes = {
  hideEditUser: PropTypes.func,
  emailId: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  showHomeAlert: PropTypes.func,
  homeAlertMessage: PropTypes.func,
};

export default function EditForm({
  hideEditUser,
  emailId,
  firstName,
  lastName,
  showHomeAlert,
  homeAlertMessage,
}) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const EditSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      emailId,
      firstName,
      lastName,
    },

    validationSchema: EditSchema,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const updateResponse = await editUser(
          values,
          setShowAlert,
          setAlertMessage,
          showHomeAlert,
          homeAlertMessage
        );

        if (updateResponse) {
          hideEditUser();
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* First Name */}
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

        {/* Last Name */}
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

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={hideEditUser}
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