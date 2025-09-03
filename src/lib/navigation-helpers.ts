"use client";

import { Group } from "@/app/types/api";
import { 
  canPerformFinancialActions, 
  isOfficeBearer,
  canAccessReports,
  canManageGoals,
  canCommunicateWithAllMembers
} from "@/lib/permissions";

/**
 * Helper function to filter navigation tabs based on user permissions
 * @param group The current group
 * @param userId The current user's ID
 * @param currentUserRole The current user's role in the group
 * @returns Array of tab names that the user has permission to see
 */
export function getPermissionFilteredTabs(
  group: Group,
  userId: string,
  currentUserRole: string
): string[] {
  // All members can see these tabs
  const allMemberTabs = [
    "Overview", 
    "Members", 
    "Contributions", 
    "Loans", 
    "Documents", 
    "Policies"
  ];

  // Only office bearers can see these tabs
  const officeBearerOnly = [
    "Reports",
    "Settings"
  ];

  // Financial roles (treasurer, admin) can see these tabs
  const financialTabs = [
    "Expenses", 
    "Income", 
    "Fines"
  ];

  // Admin-only tabs
  const adminOnly = [
    "Closure"
  ];

  // Goal management can be done by office bearers
  const goalManagement = [
    "Goals"
  ];

  // Communication can be done by office bearers
  const communicationTabs = [
    "Communications", 
    "Notifications"
  ];

  const isCreator = userId === group.createdById;

  // Start with the basic tabs that everyone can see
  let allowedTabs = [...allMemberTabs];

  // Add financial tabs if user has financial permissions
  if (canPerformFinancialActions(currentUserRole, userId, group.createdById)) {
    allowedTabs = [...allowedTabs, ...financialTabs];
  }

  // Add office bearer tabs
  if (isOfficeBearer(currentUserRole) || isCreator) {
    allowedTabs = [...allowedTabs, ...officeBearerOnly, ...goalManagement, ...communicationTabs];
  }

  // Add admin-only tabs for the group creator
  if (isCreator) {
    allowedTabs = [...allowedTabs, ...adminOnly];
  }

  // Return unique tabs
  return [...new Set(allowedTabs)];
}
