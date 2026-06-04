import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getGroupDetailsService, getGroupExpenseService } from '../../../api/groupApi';
import AlertBanner from '../../AlertBanner';
import Loading from '../../Loading';
import { convertToCurrency, currencyFind, categoryIcon } from '../../../utils/helper';
import ExpenseCard from '../../expense/ExpenseCard';
import GroupCategoryGraph from './GroupCategoryGraph';
import GroupMonthlyGraph from './GroupMonthlyGraph';
import { Link } from 'react-router-dom';
import dataConfig from '../../../config.json';
import { GroupSettlements } from '../settlement';
import {Receipt, HandCoins, Wallet, Pencil} from "lucide-react";


const profile = JSON.parse(localStorage.getItem('profile'))
const emailId = profile?.emailId
var showCount = 10

export default function ViewGroup() {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [group, setGroup] = useState({});
    const [groupExpense, setGroupExpense] = useState([]);
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertExpense, setAlertExpense] = useState(false);
    const [alertExpenseMessage, setAlertExpenseMessage] = useState('');
    const [showAllExp, setShowAllExp] = useState(false);
    const [expFocus, setExpFocus] = useState(false);
    const [expenses, setExpenses] = useState()
    const [viewSettlement, setViewSettlement] = useState(0)

    const toggleAllExp = () => {
        setExpenses(groupExpense?.expense?.slice(0, showCount))
        if (showCount >= groupExpense?.expense?.length)
            setShowAllExp(true)
        setExpFocus(true)
        showCount += 5
    }


    const toggleExpView = () => {
        setViewSettlement(0)
    }

    const toggleSettleView = () => {
        setViewSettlement(1)
    }

    const toggleMySettleView = () => {
        setViewSettlement(2)
    }

    const findUserSplit = (split) => {
        if (split) {
            split = split[0]
            return split[emailId]
        }
        return 0
    }

    useEffect(() => {
        const getGroupDetails = async () => {
            setLoading(true)
            const groupIdJson = {
                id: params.groupId
            }
            const response_group = await getGroupDetailsService(groupIdJson, setAlert, setAlertMessage)
            const response_expense = await getGroupExpenseService(groupIdJson, setAlertExpense, setAlertExpenseMessage)

            response_group && setGroup(response_group?.data?.group)
            response_expense && setGroupExpense(response_expense?.data)
            response_expense?.data?.expense && setExpenses(response_expense?.data?.expense?.slice(0, 5))
            if (response_expense?.data?.expense?.length <= 5 || !response_expense)
                setShowAllExp(true)
            setLoading(false)
        }
        getGroupDetails()
    }, [params.groupId]);

    const CategoryIcon = categoryIcon(
        group?.groupCategory
    );

    return (
  <div className="space-y-6">
    {loading ? (
      <Loading />
    ) : (
      <>
        {/* Header */}
        <div className="relative rounded-xl bg-blue-50 p-6">
          <AlertBanner
            showAlert={alert}
            alertMessage={alertMessage}
            severity="error"
          />

          <Link
            to={dataConfig.EDIT_GROUP_URL + group?._id}
            className="absolute right-4 top-4"
          >
            <Pencil size={18} />
          </Link>

          <h1 className="mb-2 text-3xl font-bold">
            {group?.groupName}
          </h1>

          <p className="text-gray-600">
            {group?.groupDescription}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Created by{" "}
            <span className="font-medium text-blue-700">
              {group?.groupOwner}
            </span>
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="rounded-md bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
              Category: {group?.groupCategory}
            </span>

            <Link
              to={dataConfig.ADD_EXPENSE_URL + group?._id}
              className="
                fixed bottom-6 right-6 z-50
                rounded-full bg-blue-600 px-5 py-3
                text-white shadow-lg
                md:static md:rounded-lg
              "
            >
              Add Expense
            </Link>
          </div>

          <div className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <CategoryIcon className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Total Expense */}
          <div className="flex gap-4 rounded-xl bg-blue-50 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white">
              <Receipt className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-semibold text-blue-800">
                Total Expense
              </h3>

              <p className="text-2xl font-bold text-blue-900">
                {currencyFind(
                  group?.groupCurrency
                )}{" "}
                {groupExpense.total
                  ? convertToCurrency(
                      groupExpense.total
                    )
                  : 0}
              </p>
            </div>
          </div>

          {/* Owed */}
          <div className="flex gap-4 rounded-xl bg-green-50 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-700 text-white">
              <HandCoins className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-semibold text-green-800">
                You are owed
              </h3>

              <p className="text-2xl font-bold text-green-900">
                {currencyFind(
                  group?.groupCurrency
                )}{" "}
                {findUserSplit(
                  group?.split
                ) > 0
                  ? convertToCurrency(
                      findUserSplit(
                        group?.split
                      )
                    )
                  : 0}
              </p>
            </div>
          </div>

          {/* Owe */}
          <div className="flex gap-4 rounded-xl bg-red-50 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-700 text-white">
              <Wallet className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-semibold text-red-800">
                You Owe
              </h3>

              <p className="text-2xl font-bold text-red-900">
                {currencyFind(
                  group?.groupCurrency
                )}{" "}
                {findUserSplit(
                  group?.split
                ) < 0
                  ? convertToCurrency(
                      Math.abs(
                        findUserSplit(
                          group?.split
                        )
                      )
                    )
                  : 0}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-hidden rounded-lg border">
          <button
            onClick={toggleExpView}
            className={`flex-1 py-3 text-center ${
              viewSettlement === 0
                ? "bg-blue-50 font-bold text-blue-700"
                : ""
            }`}
          >
            Group Expenses
          </button>

          <button
            onClick={toggleSettleView}
            className={`flex-1 py-3 text-center ${
              viewSettlement === 1
                ? "bg-blue-50 font-bold text-blue-700"
                : ""
            }`}
          >
            Group Balance
          </button>

          <button
            onClick={toggleMySettleView}
            className={`flex-1 py-3 text-center ${
              viewSettlement === 2
                ? "bg-blue-50 font-bold text-blue-700"
                : ""
            }`}
          >
            My Balance
          </button>
        </div>

        {/* Content */}
        <div className="mt-4">
          {viewSettlement === 2 && (
            <p className="text-center">
              My Balance - Under Development
            </p>
          )}

          {viewSettlement === 1 && (
            <GroupSettlements
              currencyType={
                group?.groupCurrency
              }
            />
          )}

          {viewSettlement === 0 && (
            <>
              {alertExpense ? (
                <div className="flex min-h-50 flex-col items-center justify-center text-center">
                  <p className="text-lg">
                    No expense present for this
                    group! Record your first
                    group expense now.
                  </p>

                  <Link
                    className="mt-2 text-blue-600"
                    to={
                      dataConfig.ADD_EXPENSE_URL +
                      group?._id
                    }
                  >
                    Add Expense
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Expenses */}
                  <div
                    className={
                      expFocus
                        ? "md:col-span-2"
                        : ""
                    }
                  >
                    <div className="grid gap-4">
                      {expenses?.map(
                        (myExpense) => (
                          <ExpenseCard
                            key={
                              myExpense?._id
                            }
                            expenseId={
                              myExpense?._id
                            }
                            expenseName={
                              myExpense?.expenseName
                            }
                            expenseAmount={
                              myExpense?.expenseAmount
                            }
                            expensePerMember={
                              myExpense?.expensePerMember
                            }
                            expenseOwner={
                              myExpense?.expenseOwner
                            }
                            expenseDate={
                              myExpense?.expenseDate
                            }
                            currencyType={
                              group?.groupCurrency
                            }
                          />
                        )
                      )}

                      {!showAllExp && (
                        <button
                          onClick={
                            toggleAllExp
                          }
                          className="rounded-lg border px-4 py-2 hover:bg-gray-50"
                        >
                          View More
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Graphs */}
                  <div>
                    <GroupCategoryGraph
                      currencyType={
                        group?.groupCurrency
                      }
                    />
                  </div>

                  <div>
                    <GroupMonthlyGraph />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </>
    )}
  </div>
);
}