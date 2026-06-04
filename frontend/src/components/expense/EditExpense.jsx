import { useEffect, useState } from "react";
import { useFormik, FormikProvider, Form } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import {
  editExpenseService,
  getExpDetailsService,
} from "../../api/expenseApi";

import {
  getGroupDetailsService,
} from "../../api/groupApi";

import { currencyFind } from "../../utils/helper";

import Loading from "../Loading";
import AlertBanner from "../AlertBanner";

export default function EditExpense() {
  const navigate = useNavigate();
  const params = useParams();

  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");

  const [groupMembers, setGroupMembers] = useState([]);

  const [expenseCurrency, setExpenseCurrency] = useState("INR");

  const schema = Yup.object().shape({
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
  });

  const formik = useFormik({
    initialValues: {
      expenseName: "",
      expenseDescription: "",
      expenseAmount: "",
      expenseCategory: "",
      expenseDate: "",
      expenseMembers: [],
      expenseOwner: "",
      groupId: "",
      expenseType: "",
      id: "",
    },

    validationSchema: schema,

    onSubmit: async (values) => {
      setLoading(true);

      const payload = {
        ...values,
        expenseDate: new Date(values.expenseDate).toISOString(),
      };

      if (await editExpenseService(payload, setAlert, setAlertMessage)) {
        navigate(-1);
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
    setValues,
  } = formik;

  useEffect(() => {
    const loadExpense = async () => {
      setLoading(true);

      const expenseResponse =
        await getExpDetailsService(
          { id: params.expenseId },
          setAlert,
          setAlertMessage
        );

      const expense =
        expenseResponse?.data?.expense;

      if (!expense) {
        setLoading(false);
        return;
      }

      setExpenseCurrency(
        expense?.expenseCurrency || "INR"
      );

      const groupResponse =
        await getGroupDetailsService(
          { id: expense.groupId },
          setAlert,
          setAlertMessage
        );

      setGroupMembers(
        groupResponse?.data?.group
          ?.groupMembers || []
      );

      setValues({
        expenseName:
          expense?.expenseName || "",
        expenseDescription:
          expense?.expenseDescription || "",
        expenseAmount:
          expense?.expenseAmount || "",
        expenseCategory:
          expense?.expenseCategory || "",
        expenseDate: expense?.expenseDate
          ? new Date(
              expense.expenseDate
            )
              .toISOString()
              .split("T")[0]
          : "",
        expenseMembers:
          expense?.expenseMembers || [],
        expenseOwner:
          expense?.expenseOwner || "",
        groupId:
          expense?.groupId || "",
        expenseType:
          expense?.expenseType || "",
        id: expense?._id || "",
      });

      setLoading(false);
    };

    loadExpense();
  }, [params.expenseId]);

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
        Edit Expense
      </h1>

      <FormikProvider value={formik}>
        <Form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="text"
            name="expenseName"
            placeholder="Expense Name"
            value={values.expenseName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border px-4 py-3"
          />

          <textarea
            rows={3}
            name="expenseDescription"
            placeholder="Expense Description"
            value={values.expenseDescription}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-3"
          />

          <select
            name="expenseOwner"
            value={values.expenseOwner}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-3"
          >
            {groupMembers.map((member) => (
              <option
                key={member}
                value={member}
              >
                {member}
              </option>
            ))}
          </select>

          <div className="rounded-lg border p-3">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                {currencyFind(
                  expenseCurrency
                )}
              </span>

              <input
                type="number"
                name="expenseAmount"
                value={values.expenseAmount}
                onChange={handleChange}
                className="w-full rounded-lg border py-3 pl-8 pr-4"
              />
            </div>

            <select
              name="expenseCategory"
              value={values.expenseCategory}
              onChange={handleChange}
              className="rounded-lg border px-4 py-3"
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

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              className="rounded-lg border px-4 py-3"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-4 py-3 text-white"
            >
              {isSubmitting
                ? "Saving..."
                : "Edit Expense"}
            </button>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
}