import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

import AIAssistant from "../../components/ai/AIAssistant";

export default function DashboardLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("profile"));

    if (!user?.accessToken) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar
        isOpenSidebar={openSidebar}
        onCloseSidebar={() => setOpenSidebar(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <DashboardNavbar
          onOpenSidebar={() => setOpenSidebar(true)}
        />

        {/* Page Content */}
        <main
          className="
            flex-1
            overflow-y-auto
            px-4
            py-6
            lg:px-6
            lg:py-8
          "
        >
          <Outlet />
        </main>

        {/* AI Assistant Floating Button */}
        <AIAssistant />

      </div>
    </div>
  );
}