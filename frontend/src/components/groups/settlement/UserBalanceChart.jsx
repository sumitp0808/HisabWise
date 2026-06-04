import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Bar } from "react-chartjs-2";
import "chart.js/auto";

import { getGroupDetailsService } from "../../../api/groupApi";

import AlertBanner from "../../AlertBanner";
import Loading from "../../Loading";

const UserBalanceChart = () => {
  const params = useParams();

  const [loading, setLoading] = useState(false);

  const [graphData, setGraphData] = useState([]);
  const [graphLabel, setGraphLabel] = useState([]);

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] =
    useState("");

  const data = {
    labels: graphLabel,

    datasets: [
      {
        label: "User Balance",
        data: graphData,
        backgroundColor:"rgba(255, 99, 132, 0.5)",
        borderColor:"rgba(255, 99, 132, 1)",
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
  };

  useEffect(() => {
    const getGroupDetails = async () => {
      setLoading(true);

      const groupIdJson = {
        id: params.groupId,
      };

      const response = await getGroupDetailsService(groupIdJson, setAlert, setAlertMessage);

      const split = Object.entries(response?.data?.group?.split?.[0] || {});

      const labels = [];
      const values = [];

      split.forEach((item) => {
        if (item[1] < 0) {
          labels.push(item[0]);
          values.push(Math.abs(item[1]));
        }
      });

      setGraphLabel(labels);
      setGraphData(values);

      setLoading(false);
    };

    getGroupDetails();
  }, [params.groupId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="my-6">
      <AlertBanner
        showAlert={alert}
        alertMessage={alertMessage}
        severity="error"
      />

      <div className="h-87.5 w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default UserBalanceChart;