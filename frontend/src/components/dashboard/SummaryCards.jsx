import { ReceiptIndianRupee } from "lucide-react";
import { convertToCurrency } from "../../utils/helper";

export default function SummaryCards({userTotalExp}) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
          <ReceiptIndianRupee
            size={30}
            className="text-white"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-blue-700">
            Total Expenses
          </p>

          <h2 className="mt-1 text-3xl font-bold text-blue-900">
            ₹{" "}
            {userTotalExp
              ? convertToCurrency(userTotalExp)
              : "0"}
          </h2>
        </div>
      </div>
    </div>
  );
}