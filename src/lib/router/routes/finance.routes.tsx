import { lazy, Suspense } from "react";
import { CustomRouteObject } from "../Router";

const FinanceApproved = lazy(() => import("@views/finance/FinanceApproved"));
const FinancePaid = lazy(() => import("@views/finance/FinancePaid"));
const FinanceInfoPaid = lazy(() => import("@views/finance/FinanceInfoPaid"));
const FinanceInfoDownload = lazy(() => import("@views/finance/FinanceInfoDownload"));

export const financeRoutes: CustomRouteObject[] = [
  {
    path: "/finance/approved",
    element: <Suspense><FinanceApproved /></Suspense>,
    role: "finance"
  },
  {
    path: "/finance/paid",
    element: <Suspense><FinancePaid /></Suspense>,
    role: "finance"
  },
  {
    path: "/finance/claims/:claimid",
    element: <Suspense><FinanceInfoPaid /></Suspense>,
    role: "claimer"
  },
  {
    path: "/finance/claims/download/:claimid",
    element: <Suspense><FinanceInfoDownload /></Suspense>,
    role: "claimer"
  }
];