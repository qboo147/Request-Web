import { lazy, Suspense } from "react";
import { CustomRouteObject } from "../Router";

const ApproverVetting = lazy(() => import("@views/approver/ApproverVetting"));
const ClaimsApprovedPaid = lazy(() => import("@views/approver/ClaimsApprovedPaid"));
const ApprovalDetail = lazy(() => import("@views/approver/ApprovalDetail"));
const ApprovalClaimDetail = lazy(() => import("@/views/approver/ApprovalClaimDetail"));

export const approverRoutes: CustomRouteObject[] = [
  {
    path: "/approver/vetting",
    element: <Suspense><ApproverVetting /></Suspense>,
    role: "approver"
  },
  {
    path: "/approver/approved-paid",
    element: <Suspense><ClaimsApprovedPaid /></Suspense>,
    role: "approver"
  },
  {
    path: "/approver/:claimid",
    element: <Suspense><ApprovalDetail /></Suspense>,
    role: "approver"
  },
  {
    path: "/approver/claim/:id",
    element: (
      <Suspense>
        <ApprovalClaimDetail />
      </Suspense>
    ),
    role: "approver",
  },
];