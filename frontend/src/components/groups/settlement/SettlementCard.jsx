import { useState } from "react";
import gravatarUrl from "gravatar-url";

import BalanceSettlement from "./BalanceSettlement";

import {convertToCurrency, currencyFind} from "../../../utils/helper";

import configData from "../../../config.json";

const SettlementCard = ({mySettle, currencyType, setReload}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div
        className="
          flex items-center justify-between gap-4
          rounded-xl bg-amber-100 p-4
          shadow-md
        "
      >
        {/* User */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={gravatarUrl(mySettle[0], {
              size: 200,
              default: configData.USER_DEFAULT_LOGO_URL,
            })}
            alt="profile"
            className="h-14 w-14 rounded-full object-cover"
          />

          <div className="min-w-0">
            <p className="truncate font-semibold">
              {mySettle[0].split("@")[0]}
            </p>

            <p className="text-sm text-gray-600">
              to{" "}
              <span className="font-semibold">
                {mySettle[1].split("@")[0]}
              </span>
            </p>
          </div>
        </div>

        {/* Amount */}
        <div className="hidden sm:block text-center">
          <p className="text-xs text-red-700">
            Settlement Amount
          </p>

          <p className="font-bold text-red-700">
            {currencyFind(currencyType)}{" "}
            {convertToCurrency(mySettle[2])}
          </p>
        </div>

        {/* Mobile Amount */}
        <div className="sm:hidden text-right">
          <p className="text-[10px] text-red-700">
            Settlement Amount
          </p>

          <p className="text-sm font-bold text-red-700">
            {currencyFind(currencyType)}{" "}
            {convertToCurrency(mySettle[2])}
          </p>
        </div>

        {/* Action */}
        <button
          onClick={handleOpen}
          className="
            rounded-lg
            border border-blue-600
            px-4 py-2
            text-blue-600
            transition
            hover:bg-blue-50
          "
        >
          Settle
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/50
            p-4
          "
          onClick={handleClose}
        >
          <div
            className="
              w-full max-w-3xl
              rounded-xl bg-white
              p-6 shadow-xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <BalanceSettlement
              currencyType={currencyType}
              settleTo={mySettle[1]}
              settleFrom={mySettle[0]}
              amount={mySettle[2]}
              handleClose={handleClose}
              setReload={setReload}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SettlementCard;