import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import { getGroupSettleService } from "../../../api/groupApi";

import AlertBanner from "../../AlertBanner";
import Loading from "../../Loading";

import SettlementCard from "./SettlementCard";
import UserBalanceChart from "./UserBalanceChart";

export const GroupSettlements = ({currencyType}) => {
  const params = useParams();

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [loading, setLoading] = useState(true);

  const [groupSettlement, setGroupSettlement] = useState([]);

  const [reload, setReload] = useState(false);

  useEffect(() => {
    const getGroupSettlement = async () => {
      setReload(false);
      setLoading(true);

      const groupIdJson = {
        id: params.groupId,
      };

      const response = await getGroupSettleService(groupIdJson, setAlert, setAlertMessage);

      setGroupSettlement(response?.data?.data || []);

      setLoading(false);
    };

    getGroupSettlement();
  }, [reload, params.groupId]);

  if (loading) {
    return <Loading />;
  }

  const settlements =
    groupSettlement.filter(
      (settlement) => settlement[2] > 0
    );

  const noSettle =
    settlements.length === 0;

  return (
    <div className="pb-6">
      <AlertBanner
        showAlert={alert}
        alertMessage={alertMessage}
        severity="error"
      />

      {!noSettle && (
        <div className="grid gap-4 md:grid-cols-2">
          {settlements.map((mySettle, index) => (
              <SettlementCard
                key={index}
                mySettle={mySettle}
                currencyType={currencyType}
                setReload={setReload}
              />
            )
          )}
        </div>
      )}

      {noSettle ? (
        <div className="flex min-h-62.5 flex-col items-center justify-center text-center">
          <CheckCircle2
            size={100}
            className="text-green-600"
          />

          <p className="mt-3 text-lg font-medium">
            No Settlement Required!
          </p>
        </div>
      ) : (
        <UserBalanceChart />
      )}
    </div>
  );
}