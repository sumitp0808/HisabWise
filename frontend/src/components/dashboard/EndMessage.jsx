import { Link } from "react-router-dom";
import configData from "../../config.json";

export default function EndMessage() {
  return (
    <div className="rounded-2xl border border-green-200 bg-green-50 p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <img
          src="/static/illustrations/dashboard-card.png"
          alt="Dashboard"
          className="mb-6 max-w-xs"
        />

        <h2 className="mb-3 text-2xl font-bold text-green-900">
          Manage Expenses Smarter
        </h2>

        <p className="mb-6 max-w-lg text-green-800">
          Keep track of shared expenses, monitor balances,
          and settle debts with your friends, roommates,
          hostel mates, or travel groups—all in one place.
        </p>

        <Link
          to={configData.USER_GROUPS_URL}
          className="
            rounded-lg
            border
            border-green-700
            px-6
            py-3
            font-medium
            text-green-700
            transition
            hover:bg-green-700
            hover:text-white
          "
        >
          View Groups
        </Link>
      </div>
    </div>
  );
}