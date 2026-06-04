import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import { getEmailList } from "../../api/authApi";
import {editGroupService, getGroupDetailsService} from "../../api/groupApi";

import Loading from "../Loading";
import AlertBanner from "../AlertBanner";

import configData from "../../config.json";

export function EditGroup() {
  const navigate = useNavigate();
  const params = useParams();

  const profile = JSON.parse(localStorage.getItem("profile"));

  const currentUser = profile?.emailId;

  const [loading, setLoading] = useState(false);
  const [emailList, setEmailList] = useState([]);

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const groupSchema = Yup.object().shape({
    groupName: Yup.string().required(
      "Group name is required"
    ),
    groupDescription: Yup.string(),
    groupCurrency: Yup.string().required(
      "Currency Type is required"
    ),
    groupCategory: Yup.string().required(
      "Category is required"
    ),
  });

  const formik = useFormik({
    initialValues: {
      groupName: "",
      groupDescription: "",
      groupCurrency: "",
      groupCategory: "",
      groupOwner: "",
      groupMembers: [currentUser],
      id: params.groupId,
    },

    validationSchema: groupSchema,

    onSubmit: async (values) => {
      const response = await editGroupService(values, setAlert, setAlertMessage);

      if (response) {
        window.location = configData.VIEW_GROUP_URL + params.groupId;
      }
    },
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
  } = formik;

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      const response =
        await getEmailList();

      const list = response.data.user.filter((email) => email !== currentUser);

      setEmailList(list);

      const groupResponse =
        await getGroupDetailsService(
          { id: params.groupId },
          setAlert,
          setAlertMessage
        );

      const group = groupResponse?.data?.group;

      if (group) {
        formik.setValues({
          groupName: group.groupName || "",
          groupDescription:
            group.groupDescription || "",
          groupCurrency:
            group.groupCurrency || "",
          groupCategory:
            group.groupCategory || "",
          groupOwner:
            group.groupOwner || "",
          groupMembers:
            group.groupMembers || [],
          id: params.groupId,
        });
      }

      setLoading(false);
    };

    getData();
  }, []);

  const toggleMember = (email) => {
    const exists = values.groupMembers.includes(email);

    if (exists) {
      setFieldValue("groupMembers", values.groupMembers.filter((member) => member !== email));
    } else {
      setFieldValue("groupMembers", [...values.groupMembers, email]);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold">
        Edit Group
      </h1>

      <AlertBanner
        showAlert={alert}
        alertMessage={alertMessage}
        severity="error"
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Group Name */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Group Name
          </label>

          <input
            type="text"
            name="groupName"
            value={values.groupName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border px-4 py-3"
          />

          {touched.groupName &&
            errors.groupName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.groupName}
              </p>
            )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Group Description
          </label>

          <textarea
            rows={4}
            name="groupDescription"
            value={values.groupDescription}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border px-4 py-3"
          />

          {touched.groupDescription &&
            errors.groupDescription && (
              <p className="mt-1 text-sm text-red-500">
                {errors.groupDescription}
              </p>
            )}
        </div>

        {/* Members */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Group Members
          </label>

          <div className="max-h-60 overflow-y-auto rounded-lg border p-3">
            {emailList.map((email) => (
              <label
                key={email}
                className="flex items-center gap-2 py-2"
              >
                <input
                  type="checkbox"
                  checked={values.groupMembers.includes(
                    email
                  )}
                  onChange={() =>
                    toggleMember(email)
                  }
                />

                <span>{email}</span>
              </label>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {values.groupMembers.map(
              (member) => (
                <span
                  key={member}
                  className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                >
                  {member}
                </span>
              )
            )}
          </div>
        </div>

        {/* Currency + Category */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Currency
            </label>

            <select
              name="groupCurrency"
              value={values.groupCurrency}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value="">
                Select Currency
              </option>

              <option value="INR">
                ₹ INR
              </option>

              <option value="USD">
                $ USD
              </option>

              <option value="EUR">
                € EUR
              </option>
            </select>

            {touched.groupCurrency &&
              errors.groupCurrency && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.groupCurrency}
                </p>
              )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Category
            </label>

            <select
              name="groupCategory"
              value={values.groupCategory}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value="">
                Select Category
              </option>
            
              <option value="Home">
                Hostel
              </option>

              <option value="Home">
                Home
              </option>

              <option value="Trip">
                Trip
              </option>

              <option value="Office">
                Office
              </option>

              <option value="Sports">
                Sports
              </option>

              <option value="Others">
                Others
              </option>
            </select>

            {touched.groupCategory &&
              errors.groupCategory && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.groupCategory}
                </p>
              )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid gap-3 md:grid-cols-2 md:justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border px-4 py-3 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : "Edit Group"}
          </button>
        </div>
      </form>
    </div>
  );
}