import MainLayout from "@/components/MainLayout";
import { adminRoutes } from "./admin.routes";
import { approverRoutes } from "./approver.routes";
import { claimerRoutes } from "./claimer.routes";
import { financeRoutes } from "./finance.routes";

export const getRoutes = () => {
  return {
    path: "/",
    element: <MainLayout />,
    children: [
      ...adminRoutes,
      ...claimerRoutes,
      ...approverRoutes,
      ...financeRoutes,
    ],
  };
};
