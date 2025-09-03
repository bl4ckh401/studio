"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  canPerformFinancialActions,
  canPerformAdministrativeActions,
  isOfficeBearer,
  canApplyForLoan,
  canUpdateFinancialRecords,
  canViewRecords,
  canAccessReports,
  canViewSettings,
  canEditSettings,
  canApproveSettings,
  canUpdateMemberRoles
} from '@/lib/permissions';

/**
 * Custom hook to check various permissions for the current user in a group context
 */
export function useRolePermissions(group: any) {
  const storeUser = useAuthStore((state) => state.user);
  const [permissions, setPermissions] = useState({
    canManageFinances: false,
    canManageAdministration: false,
    isOfficeBearer: false,
    canApplyForLoan: true, // All members can apply for loans
    canUpdateRecords: false,
    canViewRecords: true, // All members can view records
    canAccessReports: false,
    isGroupCreator: false,
    canViewSettings: false,
    canEditSettings: false,
    canUpdateMemberRoles: false
  });

  useEffect(() => {
    if (!storeUser || !group) return;

    // Find current user's membership
    const currentUserMembership = group.members?.find(
      (member: any) => member.userId === storeUser.id
    );

    // Get the user role
    const userRole = currentUserMembership?.role?.name || '';
    const isCreator = storeUser.id === group.createdById;

    // Update permissions
    setPermissions({
      canManageFinances: canPerformFinancialActions(userRole, storeUser.id, group.createdById),
      canManageAdministration: canPerformAdministrativeActions(userRole, storeUser.id, group.createdById),
      isOfficeBearer: isOfficeBearer(userRole) || isCreator,
      canApplyForLoan: canApplyForLoan(),
      canUpdateRecords: canUpdateFinancialRecords(userRole, storeUser.id, group.createdById),
      canViewRecords: canViewRecords(),
      canAccessReports: canAccessReports(userRole, storeUser.id, group.createdById),
      isGroupCreator: isCreator,
      canViewSettings: canViewSettings(userRole, storeUser.id, group.createdById),
      canEditSettings: canEditSettings(userRole, storeUser.id, group.createdById),
      canUpdateMemberRoles: canUpdateMemberRoles(userRole, storeUser.id, group.createdById)
    });
  }, [storeUser, group]);

  // Function to check if the user can approve a specific settings change
  const canUserApproveSettings = (createdById: string) => {
    if (!storeUser || !group) return false;
    
    // Find current user's membership
    const currentUserMembership = group.members?.find(
      (member: any) => member.userId === storeUser.id
    );
    
    // Get the user role
    const userRole = currentUserMembership?.role?.name || '';
    
    return canApproveSettings(userRole, storeUser.id, createdById);
  };

  return {
    ...permissions,
    canUserApproveSettings
  };
}
