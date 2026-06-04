import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import {convertToCurrency, currencyFind, categoryIcon} from "../../utils/helper";

import dataConfig from "../../config.json";

MiniGroupCard.propTypes = {
  groupId: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  groupMembers: PropTypes.array,
  share: PropTypes.number,
  currencyType: PropTypes.string,
  groupCategory: PropTypes.string,
  isGroupActive: PropTypes.bool,
};

export default function MiniGroupCard({
  groupId,
  title,
  description,
  share,
  currencyType,
  groupCategory,
  isGroupActive,
}) {
  const CategoryIcon =
    categoryIcon(groupCategory);

  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
      {/* Header */}
      <div className="bg-blue-50 px-4 pb-6 pt-8">
        <div className="absolute left-5 top-30 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <CategoryIcon className="h-5 w-5 text-blue-700" />
        </div>

        <h3 className="truncate text-2xl font-bold text-blue-900">
          {title}
        </h3>

        <p className="truncate text-sm text-gray-500">
          {description}
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              isGroupActive
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {isGroupActive
              ? "Not Settled"
              : "Settled"}
          </span>

          <span
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              share < 0
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {share < 0
              ? "You owe"
              : "You are owed"}
            :{" "}
            {currencyFind(currencyType)}{" "}
            {convertToCurrency(
              Math.abs(share)
            )}
          </span>
        </div>

        <Link
          to={
            dataConfig.ADD_EXPENSE_URL +
            groupId
          }
          className="
            inline-flex items-center gap-2
            rounded-lg border border-blue-600
            px-4 py-2
            text-blue-600
            transition
            hover:bg-blue-50
          "
        >
          <Plus size={18} />
          Add Expense
        </Link>
      </div>
    </div>
  );
}