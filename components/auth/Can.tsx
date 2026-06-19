"use client";

import { ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";

interface CanProps { 
  permission?: string;
  permissions?: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export default function Can({ permission, permissions, children, fallback = null }: CanProps) {
  const { hasPermission, hasAnyPermission, isLoading, isSuperuser } = usePermissions();
 
  if (isLoading) return null; 
  if (isSuperuser) {
      return <>{children}</>;
  }

  if (permission && hasPermission(permission)) {
    return <>{children}</>;
  }

  if (permissions && hasAnyPermission(permissions)) {
    return <>{children}</>;
  }

  // If no permission array/string is provided, it's unrestricted? 
  // Let's assume if used, it MUST have one of the props.
  return <>{fallback}</>;
}
