import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chart.js/auto";

import { getGroupCategoryExpService } from "../../../api/expenseApi";

import AlertBanner from "../../AlertBanner";
import Loading from "../../Loading";

import {convertToCurrency, currencyFind} from "../../../utils/helper";

const GroupCategoryGraph = ({currencyType}) => {
  const params = useParams();

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [loading, setLoading] = useState(true);

  const [categoryExp, setCategoryExp] = useState([]);

  const data = {
    labels: categoryExp.map(
      (category) => category._id
    ),

    datasets: [
      {
        label: "Category Expenses",

        data: categoryExp.map(
          (category) => category.amount
        ),

        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],

        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      datalabels: {
        formatter: (value) =>
          `${currencyFind(currencyType)} ${convertToCurrency(value)}`,
      },

      legend: {
        display: true,
        position: "bottom",

        labels: {
          padding: 18,
        },
      },
    },
  };

  useEffect(() => {
    const getGroupCategoryExpense =
      async () => {
        setLoading(true);

        const groupIdJson = {
          id: params.groupId,
        };

        const response = await getGroupCategoryExpService(groupIdJson, setAlert, setAlertMessage);

        setCategoryExp(response?.data?.data || []);

        setLoading(false);
      };

    getGroupCategoryExpense();
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

      <div className="mx-auto max-w-xl">
        <Doughnut
          data={data}
          options={options}
          plugins={[ChartDataLabels]}
        />
      </div>

      <p className="mt-6 text-center font-medium text-gray-600">
        Category Expense Chart
      </p>
    </div>
  );
};

export default GroupCategoryGraph;