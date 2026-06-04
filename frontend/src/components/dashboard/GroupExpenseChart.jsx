import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chart.js/auto";

import { getUserGroupsService } from "../../api/groupApi";

import AlertBanner from "../AlertBanner";
import Loading from "../Loading";

export default function GroupExpenseChart() {
  const profile = JSON.parse(localStorage.getItem("profile"));

  const [loading, setLoading] = useState(true);

  const [groupExp, setGroupExp] = useState([]);

  const [alert, setAlert] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const getGroupExpense = async () => {
      setLoading(true);

      const response = await getUserGroupsService(profile, setAlert, setAlertMessage);

      setGroupExp(response?.data?.groups || []);

      setLoading(false);
    };

    getGroupExpense();
  }, []);

  const data = {
    labels: groupExp.map((group) => group.groupName),

    datasets: [
      {
        label: "Group Expenses",

        data: groupExp.map((group) => group.groupTotal),

        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#06B6D4",
          "#EC4899",
          "#14B8A6",
          "#F97316",
          "#84CC16",
        ],

        borderColor: "#ffffff",

        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      datalabels: {
        display: false,
      },

      legend: {
        position: "bottom",

        labels: {
          padding: 16,
          usePointStyle: true,
        },
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
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Groupwise Expense Chart
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Expense distribution across your groups
        </p>
      </div>

      {/* Chart */}
      <div className="h-125">
        <Pie
          data={data}
          options={options}
          plugins={[ChartDataLabels]}
        />
      </div>
    </div>
  );
}