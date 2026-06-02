import { Menu } from "lucide-react";

import AccountPopover from "./AccountPopover";
import Searchbar from "./Searchbar";

export default function DashboardNavbar({ onOpenSidebar }) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center px-4 lg:h-20 lg:px-6">
        
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={onOpenSidebar}
          className="mr-2 rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={24} />
        </button>

        {/* Search */}
        <Searchbar />

        {/* Push Right */}
        <div className="flex-1" />

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Future Notifications */}
          {/* <NotificationsPopover /> */}

          <AccountPopover />
        </div>
      </div>
    </header>
  );
}