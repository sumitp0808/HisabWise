import { useEffect, useState } from "react";

import {getRecentUserExpService} from "../../api/expenseApi";

import AlertBanner from "../AlertBanner";
import ExpenseCard from "../expense/ExpenseCard";
import Loading from "../Loading";

export default function RecentTransactions() {
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");

  const [recentExp, setRecentExp] = useState([]);

  const profile = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    const getRecentExp = async () => {
      setLoading(true);

      const payload = {
        user: profile.emailId,
      };

      const response = await getRecentUserExpService(payload, setAlert, setAlertMessage);

      if (response) {
        setRecentExp(response?.data?.expense || []);
      }

      setLoading(false);
    };

    getRecentExp();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <AlertBanner
        showAlert={alert}
        alertMessage={alertMessage}
        severity="error"
      />

      {/* Header */}
      <div className="border-b border-slate-100 p-5">
        <h2 className="text-xl font-semibold text-slate-800">
          Recent Transactions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Your latest expenses and payments
        </p>
      </div>

      {/* Transactions */}
      <div className="space-y-3 p-4">
        {recentExp.length > 0 ? (
          recentExp.map((expense) => (
            <ExpenseCard
              key={expense?._id}
              expenseId={expense?._id}
              expenseName={expense?.expenseName}
              expenseAmount={expense?.expenseAmount}
              expensePerMember={expense?.expensePerMember}
              expenseOwner={expense?.expenseOwner}
              expenseDate={expense?.expenseDate}
              currencyType={expense?.expenseCurrency}
            />
          ))
        ) : (
          <div className="py-10 text-center text-slate-500">
            No recent transactions found.
          </div>
        )}
      </div>
    </div>
  );
}