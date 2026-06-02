import { useRoutes } from "react-router-dom";

//configfile import 
import configData from "./config.json"

import DashboardLayout from "./layouts/dashboard";
import Dashboard from './components/Dashboard';

//Pages
import Login from './components/Login';
import Register from './components/Register'
import Page404 from './components/Page404';
import Profile from './components/profile';
import PageUserDeleted from './components/profile/PageUserDeleted';
import Group from './components/groups';
import CreateGroup from './components/groups/CreateGroup';
import ViewGroup from './components/groups/ViewGroup';
import AddExpense from './components/expense/AddExpense';
import { ViewExpense } from './components/expense/ViewExpense';
import EditExpense from './components/expense/EditExpense';
import { EditGroup } from './components/groups/EditGroup';
import About from './components/About';

export default function Router() {
    return useRoutes([
        {
            path: configData.DASHBOARD_HOME_URL,
            element: <DashboardLayout />,
            children: [
                {
                    path: configData.DASHBOARD_URL,
                    element: <Dashboard />
                },
                {
                    path: configData.CREATE_GROUP_URL,
                    element: <CreateGroup />
                },
                {
                    path: configData.ADD_EXPENSE_ROUTER_URL,
                    element: <AddExpense />
                },
                {
                    path: configData.EDIT_EXPENSE_ROUTER_URL,
                    element: <EditExpense />
                },
                {
                    path: configData.VIEW_EXPENSE_ROUTER_URL,
                    element: <ViewExpense />
                },
                {
                    path: configData.USER_GROUPS_URL,
                    element: <Group />
                },
                {
                    path: configData.VIEW_GROUP_ROUTER_URL,
                    element: <ViewGroup />
                },
                {
                    path: configData.EDIT_GROUP_ROUTER_URL,
                    element: <EditGroup />
                },
                // {path:configData.ABOUT_URL,
                //   element: <About/>},
                {
                    path: configData.USER_PROFILE_URL,
                    element: <Profile />
                }
            ]
        },
        {
            path: configData.LOGIN_URL,
            element: <Login />
        },
        {
            path: configData.REGISTER_URL,
            element: <Register />
        },
        {
            path: configData.USER_DELETED_URL,
            element: <PageUserDeleted />
        },
        {
            path: configData.ABOUT_URL,
            element: <About />
        },
        { path: '*', element: <Page404 /> }
    ])
}