import PropTypes from "prop-types";
import gravatarUrl from "gravatar-url";

import {
  convertToCurrency,
  currencyFind,
  categoryIcon,
} from "../../utils/helper";

import configData from "../../config.json";

GroupCards.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  groupMembers: PropTypes.array,
  share: PropTypes.number,
  currencyType: PropTypes.string,
  groupCategory: PropTypes.string,
  isGroupActive: PropTypes.bool,
};

export default function GroupCards({
  title,
  description,
  groupMembers,
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
        {/* Status Row */}
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
              Math.abs(Math.floor(share))
            )}
          </span>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Category */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Category
            </span>

            <span className="rounded-md bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
              {groupCategory}
            </span>
          </div>

          {/* Members */}
          <div className="flex -space-x-3">
            {groupMembers
              ?.slice(0, 3)
              .map((member) => (
                <img
                  key={member}
                  src={gravatarUrl(member, {
                    size: 350,
                    default:
                      configData.USER_DEFAULT_LOGO_URL,
                  })}
                  alt={member}
                  className="h-10 w-10 rounded-full border-2 border-white object-cover"
                />
              ))}

            {groupMembers?.length > 3 && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-semibold">
                +{groupMembers.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}