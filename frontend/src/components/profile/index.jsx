import { useEffect, useState } from "react";
import gravatarUrl from "gravatar-url";
import {
  Pencil,
  KeyRound,
  Trash2,
  X,
} from "lucide-react";

import UserDetails from "./UserDetails";
import ChangePassword from "./ChangePassword";
import EditForm from "./EditUser";
import Loading from "../Loading";
import AlertBanner from "../AlertBanner";

import {deleteUser, getUser} from "../../api/authApi";

import configData from "../../config.json";

const profile = JSON.parse(localStorage.getItem("profile"));

export default function Profile() {
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [showAlert, setShowAlert] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");

  const [changePass, setChangePass] = useState(false);

  const [editUser, setEditUser] = useState(false);

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({});

  useEffect(() => {
    const getUserDetails = async () => {
      setLoading(true);

      const response = await getUser(profile, setShowAlert, setAlertMessage);

      setUser(response.data.user);

      setLoading(false);
    };

    getUserDetails();
  }, []);

  const apiDeleteCall = async () => {
    await deleteUser(user, setShowAlert, setAlertMessage);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-8 text-3xl font-bold">
        User Profile
      </h1>

      <div className="grid gap-8 md:grid-cols-10">
        {/* Avatar Section */}
        <div className="md:col-span-4 text-center">
          {user.emailId && (
            <img
              src={gravatarUrl(user.emailId, {
                size: 350,
                default:
                  configData.USER_DEFAULT_LOGO_URL,
              })}
              alt="profile"
              className="mx-auto h-60 w-60 rounded-full object-cover"
            />
          )}
        </div>

        {/* Details Section */}
        <div className="md:col-span-6">
          {changePass && (
            <ChangePassword
              hidePassUpdate={() =>
                setChangePass(false)
              }
              emailId={user.emailId}
              showHomeAlert={setShowAlert}
              homeAlertMessage={
                setAlertMessage
              }
            />
          )}

          {editUser && (
            <EditForm
              hideEditUser={() =>
                setEditUser(false)
              }
              emailId={user.emailId}
              firstName={user.firstName}
              lastName={user.lastName}
              showHomeAlert={setShowAlert}
              homeAlertMessage={
                setAlertMessage
              }
            />
          )}

          {!changePass && !editUser && (
            <>
              <AlertBanner
                showAlert={showAlert}
                alertMessage={alertMessage}
                severity="success"
              />

              <UserDetails
                firstName={user.firstName}
                lastName={user.lastName}
                emailId={user.emailId}
              />

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {/* Delete */}
                <button
                  onClick={() =>
                    setDeleteConfirm(true)
                  }
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-500 px-4 py-3 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={18} />
                  Delete
                </button>

                {/* Change Password */}
                <button
                  onClick={() =>
                    setChangePass(true)
                  }
                  className="flex items-center justify-center gap-2 rounded-lg border border-yellow-500 px-4 py-3 text-yellow-600 hover:bg-yellow-50"
                >
                  <KeyRound size={18} />
                  Change Password
                </button>

                {/* Edit */}
                <button
                  onClick={() =>
                    setEditUser(true)
                  }
                  className="flex items-center justify-center gap-2 rounded-lg border border-blue-500 px-4 py-3 text-blue-600 hover:bg-blue-50"
                >
                  <Pencil size={18} />
                  Edit Details
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold">
              Confirm User Deletion
            </h2>

            <p className="mt-3 text-gray-600">
              Are you sure you want to
              delete this account?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={apiDeleteCall}
                className="flex-1 rounded-lg border border-red-500 px-4 py-3 text-red-500 hover:bg-red-50"
              >
                Delete Account
              </button>

              <button
                onClick={() =>
                  setDeleteConfirm(false)
                }
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 hover:bg-gray-50"
              >
                <div className="flex items-center justify-center gap-2">
                  <X size={16} />
                  Cancel
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}