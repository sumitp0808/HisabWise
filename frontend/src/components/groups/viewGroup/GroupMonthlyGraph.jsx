import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Line } from "react-chartjs-2";
import "chart.js/auto";

import {getGroupDailyExpService, getGroupMonthlyExpService} from "../../../api/expenseApi";

import { monthNamesMMM } from "../../../utils/helper";

import AlertBanner from "../../AlertBanner";
import Loading from "../../Loading";

const GroupMonthlyGraph = () => {
  const params = useParams();

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [loading, setLoading] = useState(true);

  const [monthlyExp, setMonthlyExp] = useState([]);

  const [dailyExp, setDailyExp] = useState([]);

  const [monthlyView, setMonthlyView] = useState(false);

  const toggleMonthlyView = () => {
    setMonthlyView((prev) => !prev);
  };

  const data = {
    labels: monthlyView
      ? monthlyExp.map((monthly) => monthNamesMMM[monthly._id.month - 1])
      : dailyExp.map((daily) => `${monthNamesMMM[daily._id.month - 1]}-${daily._id.date}`),

    datasets: [
      {
        label: "Monthly Expenses",

        data: monthlyView
          ? monthlyExp.map((monthly) => monthly.amount)
          : dailyExp.map((daily) => daily.amount),

        backgroundColor: "rgba(255, 99, 132, 0.5)",

        borderColor: "rgba(255, 99, 132, 1)",

        fill: true,

        tension: 0.2,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
    },
  };

  useEffect(() => {
    const getGroupMonthlyExpense =
      async () => {
        setLoading(true);

        const groupIdJson = {
          id: params.groupId,
        };

        const monthlyResponse = await getGroupMonthlyExpService(groupIdJson, setAlert, setAlertMessage);

        const dailyResponse = await getGroupDailyExpService(groupIdJson, setAlert, setAlertMessage);

        setMonthlyExp(monthlyResponse?.data?.data || []);

        setDailyExp(dailyResponse?.data?.data || []);

        setLoading(false);
      };

    getGroupMonthlyExpense();
  }, [params.groupId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <AlertBanner
        showAlert={alert}
        alertMessage={alertMessage}
        severity="error"
      />

      <div className="h-87.5">
        <Line
          data={data}
          options={options}
        />
      </div>

      {/* Toggle */}
      <div className="mt-4 flex items-center gap-3">
        <label className="inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={monthlyView}
            onChange={
              toggleMonthlyView
            }
            className="h-4 w-4"
          />

          <span className="ml-2 text-sm">
            Monthly View
          </span>
        </label>
      </div>

      <p className="mt-6 text-center font-medium text-gray-600">
        {monthlyView
          ? "Monthly Expense Graph"
          : "Daily Expense Graph"}
      </p>
    </div>
  );
};

export default GroupMonthlyGraph;