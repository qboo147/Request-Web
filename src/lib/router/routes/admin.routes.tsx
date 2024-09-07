/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { CustomRouteObject } from "../Router";

const AdminDashboard = lazy(() => import("@/views/admin/AdminDashboard"));

const AdminDraft = lazy(() => import("@views/admin/claims/AdminDraft"));
const AdminPending = lazy(() => import("@views/admin/claims/AdminPending"));
const AdminApproved = lazy(() => import("@views/admin/claims/AdminApproved"));
const AdminPaid = lazy(() => import("@views/admin/claims/AdminPaid"));
const AdminRejectCancel = lazy(() => import("@views/admin/claims/AdminRejectCancel"));
const AdminClaimInfo = lazy(() => import("@/views/admin/claims/AdminInfo")); 

const StaffConfig = lazy(() => import("@views/admin/staff/StaffConfig"));
const StaffInfo = lazy(() => import("@views/admin/staff/StaffInfo"));
const EditStaff = lazy(() => import("@views/admin/staff/EditStaff"));
const AddStaff = lazy(() => import("@views/admin/staff/AddStaff"));

const ProjectConfig = lazy(() => import("@views/admin/project/ProjectConfig"));
const ProjectInfo = lazy(() => import("@views/admin/project/ProjectInfo"));
const ProjectCreate = lazy(() => import("@views/admin/project/ProjectCreate"));
const ProjectEdit = lazy(() => import("@views/admin/project/ProjectEdit"));

const PendingStaffConfig = lazy(() => import("@views/admin/pending-staff/PendingStaffConfig"));
const PendingStaffInfo = lazy(() => import("@views/admin/pending-staff/PendingStaffInfo"));

export const adminRoutes: CustomRouteObject[] = [
  {
    path: "/admin/dashboard",
    element: (
      <Suspense>
        <AdminDashboard />
      </Suspense>
    ),
    role: "admin",
  },
  {
    path: "/admin/claims/draft",
    element: (
      <Suspense>
        <AdminDraft />
      </Suspense>
    ),
    role: "admin",
  },
  
  {
    path: "/admin/claims/pending",
    element: (
      <Suspense>
        <AdminPending />
      </Suspense>
    ),
    role: "admin",
  },
  {
    path: "/admin/claims/approved",
    element: (
      <Suspense>
        <AdminApproved />
      </Suspense>
    ),
    role: "admin",
  },
  {
    path: "/admin/claims/paid",
    element: (
      <Suspense>
        <AdminPaid />
      </Suspense>
    ),
    role: "admin",
  },
  {
    path: "/admin/claims/rejected-cancelled",
    element: (
      <Suspense>
        <AdminRejectCancel />
      </Suspense>
    ),
    role: "admin",
  },
  {
    path: "/admin/claims/:claim_id",
    element: (
      <Suspense>
        <AdminClaimInfo />
      </Suspense>
    ),
    role: "admin",
  },
  {
    path: "/config/staff",
    element: (
      <Suspense>
        <StaffConfig />
      </Suspense>
    ),
    role: "admin",
  },
  {
    path: "config/staff/:staff_id",
    element: (
      <Suspense>
        <StaffInfo />
      </Suspense>
    ),
    role: "admin",
  },
  {
    path: "/config/add-staff/",
    element: (
      <Suspense>
        <AddStaff />
      </Suspense>
    ),
    role: "admin",
  },
  {
    path: "/config/edit-staff",
    element: (
      <Suspense>
        <EditStaff />
      </Suspense>
    ),
    role: "admin",
  },
  {
    path: "/config/project",
    element: (
      <Suspense>
        <ProjectConfig />
      </Suspense>
    ),
    role: "admin",
  },
  {
    path: "/config/project/create",
    element: (
      <Suspense>
        <ProjectCreate />
      </Suspense>
    ),
    role: "admin",
  },
  {
    path: "/config/project/edit/:id",
    element: (
      <Suspense>
        <ProjectEdit />
      </Suspense>
    ),
    role: "admin",
  },
  {
    path: "/config/project/:project_id",
    element: (
      <Suspense>
        <ProjectInfo />
      </Suspense>
    ),
    role: "admin",
  },
  {
    path: "/config/pending-staff",
    element: (
      <Suspense>
        <PendingStaffConfig />
      </Suspense>
    ),
    role: "admin",
  },
  {
    path: "config/pending-staff/:staff_id",
    element: (
      <Suspense>
        <PendingStaffInfo />
      </Suspense>
    ),
    role: "admin",
  },
];
