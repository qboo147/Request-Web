import { lazy, Suspense } from "react";
import { CustomRouteObject } from "../Router";
import ClaimMainPage from "@/views/claimer/ClaimMainPage";
import ClaimCreate from "@/views/claimer/ClaimCreate";
import ClaimEdit from "@/views/claimer/ClaimEdit";

const ClaimsDraft = lazy(() => import("@views/claimer/ClaimsDraft"));
const ClaimsPending = lazy(() => import("@views/claimer/ClaimsPending"));
const ClaimsApproved = lazy(() => import("@views/claimer/ClaimsApproved"));
const ClaimsPaid = lazy(() => import("@views/claimer/ClaimsPaid"));
const ClaimsRejectCancel = lazy(() => import("@views/claimer/ClaimsRejectCancel"));
const ClaimInfo = lazy(() => import("@views/claimer/ClaimInfo"));

export const claimerRoutes: CustomRouteObject[] = [
  {
    path: "/claims/draft",
    element: <Suspense><ClaimsDraft /></Suspense>,
    role: "claimer"
  },
  {
    path: "/claims/pending",
    element: <Suspense><ClaimsPending /></Suspense>,
    role: "claimer"
  },
  {
    path: "/claims/approved",
    element: <Suspense><ClaimsApproved /></Suspense>,
    role: "claimer"
  },
  {
    path: "/claims/paid",
    element: <Suspense><ClaimsPaid /></Suspense>,
    role: "claimer"
  },
  {
    path: "/claims/rejected-cancelled",
    element: <Suspense><ClaimsRejectCancel /></Suspense>,
    role: "claimer"
  },
  {
    path: "/claims/:claim_id",
    element: <Suspense><ClaimInfo /></Suspense>,
    role: "claimer"
  },
  {
    path: "/claims/create-claim",
    element: <Suspense><ClaimCreate /></Suspense>,
    role: "claimer"
  },
  {
    path: "/claims",
    element: <Suspense><ClaimMainPage /></Suspense>,
    role: "claimer"
  },
  {
    path: "/claims/edit/:claimid",
    element: <Suspense><ClaimEdit /></Suspense>,
    role: "claimer"
  }
];
