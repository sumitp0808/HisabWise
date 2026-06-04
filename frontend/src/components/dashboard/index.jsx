import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {getUserExpenseService} from "../../api/expenseApi";

import {getUserGroupsService} from "../../api/groupApi";

import Loading from "../Loading";
import AlertBanner from "../AlertBanner";

import WelcomeMessage from "./WelcomeMessage";
import SummaryCards from "./SummaryCards";
import CalenderExpenseGraph from "./CalenderExpenseGraph";
import CategoryExpenseChart from "./CategoryExpenseGraph";
import GroupExpenseChart from "./GroupExpenseChart";
import RecentTransactions from "./RecentTransactions";
import EndMessage from "./EndMessage";

import configData from "../../config.json";

export default function Dashboard() {
  const profile = JSON.parse(localStorage.getItem("profile"));

  const [loading, setLoading] = useState(true);

  const [newUser, setNewUser] = useState(false);

  const [userExp, setUserExp] = useState(null);

  const [alert, setAlert] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const getUserDetails = async () => {
      setLoading(true);

      const payload = {
        user: profile.emailId,
      };

      const expenseResponse = await getUserExpenseService(payload, setAlert, setAlertMessage);

      setUserExp(expenseResponse?.data);

      const groupResponse = await getUserGroupsService(profile);

      if (groupResponse?.data?.groups?.length === 0) {
        setNewUser(true);
      }

      setLoading(false);
    };

    getUserDetails();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
  <>
    <div className="mx-auto max-w-7xl space-y-6">
      <AlertBanner
        showAlert={alert}
        alertMessage={alertMessage}
        severity="error"
      />

      <WelcomeMessage />

      {newUser ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <h2 className="mb-3 text-2xl font-semibold">
            Welcome to HisabWise 🎉
          </h2>

          <p className="mb-6 text-gray-600">
            Looks like you're new here.
            Create your first group and
            start tracking shared expenses.
          </p>

          <Link
            to={configData.CREATE_GROUP_URL}
            className="
              inline-flex
              rounded-lg
              bg-blue-600
              px-6
              py-3
              text-white
              hover:bg-blue-700
            "
          >
            Create Group
          </Link>
        </div>
      ) : (
        <>
          <SummaryCards userTotalExp={userExp?.total} />

          <div className="grid gap-6 xl:grid-cols-2">
            <CalenderExpenseGraph />
            <CategoryExpenseChart />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <GroupExpenseChart />
            <RecentTransactions />
          </div>

          <EndMessage />
        </>
      )}
    </div>
  </>
);
}