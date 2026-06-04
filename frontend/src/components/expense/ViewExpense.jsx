import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getExpDetailsService } from "../../api/expenseApi";

import { convertToCurrency, currencyFind } from "../../utils/helper";

import Loading from "../Loading";
import AlertBanner from "../AlertBanner";

import dataConfig from "../../config.json";

export const ViewExpense = () => {
  const navigate = useNavigate();
  const params = useParams();

  const expenseId = params.expenseId;

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [expenseDetails, setExpenseDetails] = useState(null);

  const [expenseDate, setExpenseDate] = useState("");

  useEffect(() => {
    const getExpenseDetails = async () => {
      setLoading(true);

      const response = await getExpDetailsService({ id: expenseId }, setAlert, setAlertMessage);

      const expense = response?.data?.expense;

      setExpenseDetails(expense);

      if (expense?.expenseDate) {
        setExpenseDate(new Date(expense.expenseDate).toDateString());
      }

      setLoading(false);
    };

    getExpenseDetails();
  }, [expenseId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-xl bg-white shadow-lg">
      <AlertBanner
        severity="error"
        alertMessage={alertMessage}
        showAlert={alert}
      />

      {/* Header */}
      <div className="bg-blue-50 p-8">
        <h1 className="text-3xl font-bold text-blue-900">
          {expenseDetails?.expenseName}
        </h1>

        <p className="mt-2 text-gray-600">
          {expenseDetails?.expenseDescription}
        </p>
      </div>

      {/* Content */}
      <div className="grid gap-6 p-8 md:grid-cols-2">
        <div>
          <h3 className="font-semibold text-gray-700">
            Category
          </h3>

          <p>
            {
              expenseDetails?.expenseCategory
            }
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">
            Date
          </h3>

          <p>{expenseDate}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">
            Amount
          </h3>

          <p>
            {currencyFind(
              expenseDetails?.expenseCurrency
            )}{" "}
            {convertToCurrency(
              expenseDetails?.expenseAmount
            )}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">
            Payment Method
          </h3>

          <p>
            {expenseDetails?.expenseType}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">
            Expense Owner
          </h3>

          <p>
            {expenseDetails?.expenseOwner}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-red-600">
            Amount Per Person
          </h3>

          <p className="font-semibold text-red-600">
            {currencyFind(
              expenseDetails?.expenseCurrency
            )}{" "}
            {convertToCurrency(
              expenseDetails?.expensePerMember
            )}
          </p>
        </div>

        {/* Members */}
        <div className="md:col-span-2">
          <h3 className="mb-3 font-semibold text-gray-700">
            Members
          </h3>

          <div className="flex flex-wrap gap-2">
            {expenseDetails?.expenseMembers?.map(
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

        {/* Actions */}
        <div className="mt-4 grid gap-3 md:col-span-2 md:grid-cols-2">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border px-4 py-3 hover:bg-gray-50"
          >
            Back
          </button>

          <Link
            to={
              dataConfig.EDIT_EXPENSE_URL +
              expenseId
            }
            className="rounded-lg bg-blue-600 px-4 py-3 text-center text-white hover:bg-blue-700"
          >
            Edit Expense
          </Link>
        </div>
      </div>
    </div>
  );
}