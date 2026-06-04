import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

import Loading from "../Loading";
import AlertBanner from "../AlertBanner";

import {
  getUserDailyExpService,
  getUserMonthlyExpService,
} from "../../api/expenseApi";

import { monthNamesMMM } from "../../utils/helper";

export default function CalenderExpenseGraph() {
  const [monthlyView, setMonthlyView] = useState(true);

  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");

  const [userMonthlyExp, setUserMonthlyExp] = useState([]);

  const [userDailyExp, setUserDailyExp] = useState([]);

  const profile = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    const getUserDetails = async () => {
      setLoading(true);

      const payload = {
        user: profile.emailId,
      };

      const monthlyResponse = await getUserMonthlyExpService(payload, setAlert, setAlertMessage);

      const dailyResponse = await getUserDailyExpService(payload, setAlert, setAlertMessage);

      setUserMonthlyExp(monthlyResponse?.data?.data || []);

      setUserDailyExp(dailyResponse?.data?.data || []);

      setLoading(false);
    };

    getUserDetails();
  }, []);

  const chartData = {
    labels: monthlyView
      ? userMonthlyExp.map((month) => monthNamesMMM[month._id.month - 1])
      : userDailyExp.map((day) => `${monthNamesMMM[day._id.month - 1]}-${day._id.date}`),

    datasets: [
      {
        label: monthlyView
          ? "Monthly Expense"
          : "Daily Expense",

        data: monthlyView
          ? userMonthlyExp.map((month) => month.amount)
          : userDailyExp.map((day) => day.amount),

        borderColor:"rgb(59,130,246)",

        backgroundColor:"rgba(59,130,246,0.15)",

        fill: true,

        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <AlertBanner
        showAlert={alert}
        alertMessage={alertMessage}
        severity="error"
      />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Expense Analytics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track your spending trends
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <span className="text-sm font-medium text-slate-600">
            Monthly View
          </span>

          <button
            type="button"
            onClick={() =>
              setMonthlyView(
                !monthlyView
              )
            }
            className={`relative h-6 w-11 rounded-full transition ${
              monthlyView
                ? "bg-blue-600"
                : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                monthlyView
                  ? "left-5"
                  : "left-0.5"
              }`}
            />
          </button>
        </label>
      </div>

      {/* Chart */}
      <div className="h-95">
        <Line
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
}