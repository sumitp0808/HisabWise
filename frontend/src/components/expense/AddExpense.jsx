import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FormikProvider, Form, useFormik } from "formik";
import * as Yup from "yup";

import { currencyFind } from "../../utils/helper";
import { addExpenseService } from "../../api/expenseApi";
import { getGroupDetailsService } from "../../api/groupApi";

import AlertBanner from "../AlertBanner";
import Loading from "../Loading";

import configData from "../../config.json";

export default function AddExpense() {
  const params = useParams();

  const profile = JSON.parse(
    localStorage.getItem("profile")
  );

  const currentUser = profile?.emailId;
  const groupId = params.groupId;

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [groupMembers, setGroupMembers] = useState([]);

  const [groupCurrency, setGroupCurrency] = useState("INR");

  const addExpenseSchema = Yup.object().shape({
    expenseName: Yup.string().required(
      "Expense name is required"
    ),

    expenseDescription: Yup.string(),

    expenseAmount: Yup.string().required(
      "Amount is required"
    ),

    expenseCategory: Yup.string().required(
      "Category is required"
    ),

    expenseType: Yup.string().required(
      "Payment Method is required"
    ),

    expenseMembers: Yup.array().min(
      1,
      "At least one expense member is required"
    ),
  });

  const formik = useFormik({
    initialValues: {
      expenseName: "",
      expenseDescription: "",
      expenseAmount: "",
      expenseCategory: "",
      expenseDate: new Date().toISOString().split("T")[0],
      expenseMembers: [],
      expenseOwner: currentUser,
      groupId,
      expenseType: "Cash",
    },

    validationSchema: addExpenseSchema,

    onSubmit: async (values) => {
      setLoading(true);

      const payload = {
        ...values,
        expenseDate: new Date(values.expenseDate).toISOString(),
    };

      if (
        await addExpenseService(
          payload,
          setAlert,
          setAlertMessage
        )
      ) {
        window.location =
          configData.VIEW_GROUP_URL +
          groupId;
      }

      setLoading(false);
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
    const getGroupDetails = async () => {
      setLoading(true);

      const response =
        await getGroupDetailsService(
          { id: groupId },
          setAlert,
          setAlertMessage
        );

      const group =
        response?.data?.group;

      setGroupCurrency(
        group?.groupCurrency || "INR"
      );

      setGroupMembers(
        group?.groupMembers || []
      );

      setFieldValue(
        "expenseMembers",
        group?.groupMembers || []
      );

      setLoading(false);
    };

    getGroupDetails();
  }, []);

  const toggleMember = (member) => {
    if (
      values.expenseMembers.includes(member)
    ) {
      setFieldValue(
        "expenseMembers",
        values.expenseMembers.filter(
          (m) => m !== member
        )
      );
    } else {
      setFieldValue(
        "expenseMembers",
        [...values.expenseMembers, member]
      );
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-lg">
      <AlertBanner
        showAlert={alert}
        alertMessage={alertMessage}
        severity="error"
      />

      <h1 className="mb-6 text-2xl font-bold">
        Add Expense
      </h1>

      <FormikProvider value={formik}>
        <Form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Expense Name */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Expense Name
            </label>

            <input
              type="text"
              name="expenseName"
              value={values.expenseName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-lg border px-4 py-3"
            />

            {touched.expenseName &&
              errors.expenseName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.expenseName}
                </p>
              )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Expense Description
            </label>

            <textarea
              rows={3}
              name="expenseDescription"
              value={values.expenseDescription}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-lg border px-4 py-3"
            />

            {touched.expenseDescription &&
              errors.expenseDescription && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.expenseDescription}
                </p>
              )}
          </div>

          {/* Owner */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Expense Owner
            </label>

            <select
              name="expenseOwner"
              value={values.expenseOwner}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            >
              {groupMembers.map(
                (member) => (
                  <option
                    key={member}
                    value={member}
                  >
                    {member}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Members */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Expense Members
            </label>

            <div className="max-h-56 overflow-y-auto rounded-lg border p-3">
              {groupMembers.map((member) => (
                <label
                  key={member}
                  className="flex items-center gap-2 py-2"
                >
                  <input
                    type="checkbox"
                    checked={values.expenseMembers.includes(
                      member
                    )}
                    onChange={() =>
                      toggleMember(member)
                    }
                  />

                  {member}
                </label>
              ))}
            </div>

            {touched.expenseMembers &&
              errors.expenseMembers && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.expenseMembers}
                </p>
              )}
          </div>

          {/* Amount + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Expense Amount
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  {currencyFind(
                    groupCurrency
                  )}
                </span>

                <input
                  type="number"
                  name="expenseAmount"
                  value={values.expenseAmount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded-lg border py-3 pl-8 pr-4"
                />
              </div>

              {touched.expenseAmount &&
                errors.expenseAmount && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.expenseAmount}
                  </p>
                )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Category
              </label>

              <select
                name="expenseCategory"
                value={values.expenseCategory}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="">
                  Select Category
                </option>
                <option value="Food & drink">
                  Food & drink
                </option>
                <option value="Shopping">
                  Rent
                </option>
                <option value="Shopping">
                  Shopping
                </option>
                <option value="Entertainment">
                  Entertainment
                </option>
                <option value="Home">
                  Home
                </option>
                <option value="Transportation">
                  Transportation
                </option>
                <option value="Others">
                  Others
                </option>
              </select>
            </div>
          </div>

          {/* Payment Type */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Payment Method
            </label>

            <select
              name="expenseType"
              value={values.expenseType}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value="Cash">
                Cash
              </option>
              <option value="UPI Payment">
                UPI Payment
              </option>
              <option value="Card">
                Card
              </option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Expense Date
            </label>

            <input
              type="date"
              value={values.expenseDate}
              onChange={(e) =>
                setFieldValue(
                  "expenseDate",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              to={
                configData.VIEW_GROUP_URL +
                groupId
              }
              className="
                rounded-lg border
                px-4 py-3 text-center
                hover:bg-gray-50
              "
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                rounded-lg bg-blue-600
                px-4 py-3 text-white
                hover:bg-blue-700
                disabled:opacity-50
              "
            >
              {isSubmitting
                ? "Adding..."
                : "Add Expense"}
            </button>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
}