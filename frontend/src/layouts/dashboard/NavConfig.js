import {
  LayoutDashboard,
  Users,
  UserPlus,
  Info,
} from "lucide-react";

import configData from "../../config.json";

const navConfig = [
  {
    title: "Dashboard",
    path: configData.DASHBOARD_URL,
    icon: <LayoutDashboard size={20} />,
  },
  {
    title: "Groups",
    path: configData.USER_GROUPS_URL,
    icon: <Users size={20} />,
  },
  {
    title: "Create Group",
    path: configData.CREATE_GROUP_URL,
    icon: <UserPlus size={20} />,
  },
  {
    title: "About",
    path: configData.ABOUT_URL,
    icon: <Info size={20} />,
  },
];

export default navConfig;