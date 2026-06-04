import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chart.js/auto";

import {
  getUserCategoryExpService,
} from "../../api/expenseApi";

import AlertBanner from "../AlertBanner";
import Loading from "../Loading";

import { convertToCurrency } from "../../utils/helper";

export default function CategoryExpenseChart() {
  const profile = JSON.parse(localStorage.getItem("profile"));

  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");

  const [categoryExp, setCategoryExp] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const response = await getUserCategoryExpService({user: profile.emailId}, setAlert, setAlertMessage);

      setCategoryExp(response?.data?.data || []);

      setLoading(false);
    };

    fetchData();
  }, []);

  const data = {
    labels: categoryExp.map((category) => category._id),

    datasets: [
      {
        label: "Category Expenses",

        data: categoryExp.map((category) => category.amount),

        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#06B6D4",
          "#EC4899",
        ],

        borderWidth: 2,

        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      datalabels: {
        display: false,

        formatter: (value) =>
          convertToCurrency(value),
      },

      legend: {
        position: "right",

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
          Category Expense Chart
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Spending distribution by category
        </p>
      </div>

      {/* Chart */}
      <div className="h-125">
        <Doughnut
          data={data}
          options={options}
          plugins={[ChartDataLabels]}
        />
      </div>
    </div>
  );
}