import { useState } from "react";
import { Link } from "react-router-dom";

import {
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  convertToCurrency,
  currencyFind,
  getMonthMMM,
} from "../../utils/helper";

import { deleteExpenseService } from "../../api/expenseApi";

import dataConfig from "../../config.json";

export default function ExpenseCard({
  expenseId,
  expenseName,
  expenseAmount,
  expensePerMember,
  expenseOwner,
  expenseDate,
  currencyType,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const apiDeleteCall = async () => {
    await deleteExpenseService({
      id: expenseId,
    });

    window.location.reload();
  };

  const day = new Date(expenseDate).getDate();

  return (
    <>
      <div className="relative flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
        {/* Date */}
        <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
          <div className="text-2xl font-bold">
            {day}
          </div>

          <div className="text-sm font-medium">
            {getMonthMMM(expenseDate)}
          </div>
        </div>

        {/* Details */}
        <div className="ml-4 flex-1">
          <h3 className="truncate text-lg font-semibold text-blue-700">
            {expenseName}
          </h3>

          <p className="text-sm text-blue-600">
            Total:{" "}
            {currencyFind(currencyType)}
            {" "}
            {convertToCurrency(
              expenseAmount
            )}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Paid by
            <br />
            {expenseOwner}
          </p>
        </div>

        {/* Per Person */}
        <div className="mr-4 text-right">
          <p className="text-xs text-red-600">
            Per person
          </p>

          <p className="font-bold text-red-700">
            {currencyFind(currencyType)}
            {" "}
            {convertToCurrency(
              expensePerMember
            )}
          </p>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="rounded p-1 hover:bg-gray-100"
          >
            <MoreVertical size={18} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-20 mt-2 w-40 rounded-lg border bg-white shadow-lg">
              <Link
                to={dataConfig.VIEW_EXPENSE_URL + expenseId}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              >
                <Eye size={16} />
                View
              </Link>

              <Link
                to={dataConfig.EDIT_EXPENSE_URL + expenseId}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              >
                <Pencil size={16} />
                Edit
              </Link>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setDeleteConfirm(
                    true
                  );
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-100 rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">
              Confirm Expense Deletion
            </h2>

            <p className="mt-2 text-gray-600">
              Are you sure you want
              to delete this
              expense?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={apiDeleteCall}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-500 px-4 py-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
                Delete
              </button>

              <button
                onClick={() =>
                  setDeleteConfirm(false)
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}