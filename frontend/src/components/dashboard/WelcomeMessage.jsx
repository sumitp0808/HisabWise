import { Link } from "react-router-dom";
import { ArrowRight, Wallet } from "lucide-react";
import configData from "../../config.json";

export default function WelcomeMessage() {
  return (
    <div className="overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-lg">
      <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
        {/* Left Content */}
        <div className="max-w-xl">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
            <Wallet size={28} />
          </div>

          <h1 className="mb-3 text-3xl font-bold">
            Welcome Back 👋
          </h1>

          <p className="mb-6 text-blue-100">
            Keep track of shared expenses, monitor balances,
            and settle debts with your friends, roommates,
            hostel mates, or travel groups effortlessly.
          </p>

          <Link
            to={configData.USER_GROUPS_URL}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-medium text-blue-700 transition hover:bg-blue-50"
          >
            View Groups
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Right Illustration */}
        <div className="flex justify-center">
          <img
            src="/static/illustrations/dashboard-card.png"
            alt="Dashboard"
            className="max-h-64 object-contain"
          />
        </div>
      </div>
    </div>
  );
}