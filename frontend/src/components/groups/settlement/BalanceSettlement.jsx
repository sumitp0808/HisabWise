import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CheckCircle } from "lucide-react";

import { settlementService } from "../../../api/groupApi";
import { currencyFind } from "../../../utils/helper";
import AlertBanner from "../../AlertBanner";
import Loading from "../../Loading";

const BalanceSettlement = ({currencyType, settleTo, settleFrom, amount, handleClose, setReload}) => {
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [settleSuccess, setSettleSuccess] = useState(false);

  const settlementSchema = Yup.object().shape({
    settleTo: Yup.string().required("Settle to is required"),

    settleFrom: Yup.string().required("Settle from is required"),

    settleAmount: Yup.number().required("Amount is required").min(0, "Min is 0").max(amount, `Max is ${amount}`),
  });

  const formik = useFormik({
    initialValues: {
      settleTo,
      settleFrom,
      settleAmount: amount,
      settleDate: new Date(),
      groupId: params.groupId,
    },

    validationSchema: settlementSchema,

    onSubmit: async (values) => {
      setLoading(true);

      const response = await settlementService(values, setAlert, setAlertMessage);

      if (response?.data?.status === "Success") {
        setSettleSuccess(true);
        setReload(true);
      }

      setLoading(false);
    },
  });

  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
  } = formik;

  if (loading) {
    return <Loading />;
  }

  if (settleSuccess) {
    return (
      <div className="flex min-h-62.5 flex-col items-center justify-center text-center">
        <CheckCircle
          size={100}
          className="text-green-600"
        />

        <h2 className="mt-4 text-2xl font-bold">Settlement Successful!</h2>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold">Settle Balance</h2>

      <AlertBanner
        showAlert={alert}
        alertMessage={alertMessage}
        severity="error"
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {/* Settlement To */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Settlement To
            </label>

            <input
              type="text"
              name="settleTo"
              value={values.settleTo}
              disabled
              className="w-full rounded-lg border bg-gray-100 px-4 py-3"
            />
          </div>

          {/* Settlement From */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Settlement From
            </label>

            <input
              type="text"
              name="settleFrom"
              value={values.settleFrom}
              disabled
              className="w-full rounded-lg border bg-gray-100 px-4 py-3"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Settlement Date
            </label>

            <input
              type="date"
              value={
                values.settleDate
                  ? new Date(
                      values.settleDate
                    )
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setFieldValue(
                  "settleDate",
                  Date.parse(e.target.value)
                )
              }
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Amount */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Settlement Amount
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                {currencyFind(currencyType)}
              </span>

              <input
                type="number"
                name="settleAmount"
                value={values.settleAmount}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded-lg border py-3 pl-10 pr-4"
              />
            </div>

            {touched.settleAmount &&
              errors.settleAmount && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.settleAmount}
                </p>
              )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 md:ml-auto md:w-72">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-gray-300 px-4 py-3 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
          >
            Settle
          </button>
        </div>
      </form>
    </div>
  );
};

export default BalanceSettlement;