import React from "react";
import { Navigate } from "react-router-dom";
import { getItemWithExpiry } from "./storage.utils";
import { decryptData } from "./auth.utils";

function withAuthorization<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: string[]
) {
  return function WithAuthorizationComponent(props: P) {
    const encryptedData = getItemWithExpiry<string>("userData");

    if (!encryptedData) {
      console.log("No user data available or data has expired.");
      return <Navigate to="/login" replace />;
    }

    const decryptedData = decryptData(encryptedData);
    const userData = JSON.parse(decryptedData);

    if (!allowedRoles.includes(userData.role)) {
      if (userData.role === "approver")
        return <Navigate to="/approver/vetting" replace />;
      if (userData.role === "finance")
        return <Navigate to="/finance/approved" replace />;
      if (userData.role === "claimer")
        return <Navigate to="/claims" replace />;
      if (userData.role === "admin")
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuthorization;
