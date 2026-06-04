import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import gravatarUrl from "gravatar-url";

import Logo from "../../components/Logo";
import NavSection from "../../components/NavSection";

import navConfig from "./NavConfig";
import dataConfig from "../../config.json";

const DRAWER_WIDTH = 280;

export default function DashboardSidebar({
  isOpenSidebar,
  onCloseSidebar,
}) {
  const user = JSON.parse(localStorage.getItem("profile"));

  const { pathname } = useLocation();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-6 py-5">
        <Logo />
      </div>

      {/* User Card */}
      <div className="mx-4 mt-4 mb-6">
        <Link to={dataConfig.USER_PROFILE_URL}>
          <div className="flex items-center rounded-xl bg-blue-50 p-4 transition hover:bg-blue-100">
            {user && (
              <img
                src={gravatarUrl(user.emailId, {
                  size: 200,
                  default: dataConfig.USER_DEFAULT_LOGO_URL,
                })}
                alt="profile"
                className="h-12 w-12 rounded-full object-cover"
              />
            )}

            <div className="ml-3 overflow-hidden">
              <p className="font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>

              <p className="truncate text-xs text-gray-500">
                {user?.emailId}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="px-2">
        <NavSection navConfig={navConfig} />
      </div>

      {/* Push Footer Down */}
      <div className="flex-1" />

      {/* Footer */}
      <div className="p-4">
        <div className="mt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} HisabWise
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpenSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onCloseSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-70
          bg-white border-r
          flex flex-col
          transition-transform duration-300
          lg:hidden
          ${
            isOpenSidebar
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className="
          hidden lg:flex
          h-screen w-70
          flex-col
          border-r border-dashed
          bg-white
          sticky top-0
        "
      >
        {sidebarContent}
      </aside>
    </>
  );
}

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};