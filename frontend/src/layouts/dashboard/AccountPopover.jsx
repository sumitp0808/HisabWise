import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gravatarUrl from "gravatar-url";

import { logout } from "../../api/authApi";
import configData from "../../config.json";

export default function AccountPopover() {
  const user = JSON.parse(localStorage.getItem("profile"));

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const MENU_OPTIONS = [
    {
      label: "Home",
      linkTo: configData.DASHBOARD_URL,
    },
    {
      label: "Profile",
      linkTo: configData.USER_PROFILE_URL,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="overflow-hidden rounded-full border border-gray-300 transition hover:ring-2 hover:ring-blue-500"
      >
        <img
          src={gravatarUrl(user.emailId, {
            size: 200,
            default: configData.USER_DEFAULT_LOGO_URL,
          })}
          alt="profile"
          className="h-10 w-10 object-cover"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg z-50">
          {/* User Info */}
          <div className="px-4 py-3">
            <p className="font-semibold">
              {user.firstName} {user.lastName}
            </p>

            <p className="text-sm text-gray-500 truncate">
              {user.emailId}
            </p>
          </div>

          <hr />

          {/* Menu Links */}
          <div className="py-2">
            {MENU_OPTIONS.map((item) => (
              <Link
                key={item.label}
                to={item.linkTo}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <hr />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}