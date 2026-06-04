import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UsersRound } from "lucide-react";

import { getUserGroupsService } from "../../api/groupApi";

import Loading from "../Loading";
import GroupCards from "./GroupCards";

import dataConfig from "../../config.json";

const profile = JSON.parse(localStorage.getItem("profile"));

const emailId = profile?.emailId;

export default function Group() {
  const [loading, setLoading] = useState(false);

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const getUserGroups = async () => {
      setLoading(true);

      const response = await getUserGroupsService(profile);

      setGroups(response?.data?.groups || []);

      setLoading(false);
    };

    getUserGroups();
  }, []);

  const checkActive = (split) => {
    for (const key in split) {
      if (
        Object.prototype.hasOwnProperty.call(
          split,
          key
        )
      ) {
        if (
          Math.round(split[key]) !== 0
        ) {
          return true;
        }
      }
    }

    return false;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Floating Create Group Button */}
      <Link
        to={dataConfig.CREATE_GROUP_URL}
        className="
          fixed bottom-5 right-5 z-50
          flex h-14 w-14 items-center justify-center
          rounded-full
          bg-blue-600
          text-white
          shadow-lg
          transition
          hover:bg-blue-700
        "
      >
        <UsersRound size={24} />
      </Link>

      {/* Heading */}
      <h1 className="text-3xl font-bold">
        Your Groups
      </h1>

      {/* Groups Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {groups?.map((group) => (
          <Link
            key={group?._id}
            to={dataConfig.VIEW_GROUP_URL + group?._id}
            className="block"
          >
            <GroupCards
              title={group?.groupName}
              description={group?.groupDescription}
              groupMembers={group?.groupMembers}
              share={group?.split?.[0]?.[emailId]}
              currencyType={group?.groupCurrency}
              groupCategory={group?.groupCategory}
              isGroupActive={checkActive(group?.split?.[0])}
            />
          </Link>
        ))}

        {/* Create Group Card */}
        <Link
          to={dataConfig.CREATE_GROUP_URL}
          className="
            flex min-h-77.5
            flex-col items-center justify-center
            rounded-xl
            bg-linear-to-br
            from-blue-400/60
            to-blue-900/60
            text-white
            shadow-xl
            transition
            hover:scale-[1.02]
          "
        >
          <UsersRound
            size={56}
            className="mb-4"
          />

          <h2 className="text-2xl font-bold">
            Create New Group!
          </h2>
        </Link>
      </div>
    </div>
  );
}