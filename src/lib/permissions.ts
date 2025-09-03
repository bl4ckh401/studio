// This file contains utility functions for checking various permissions in the application

// This utility function determines if a user can perform financial actions like adding expenses, income, fines, etc.
// Only treasurers, chama admins, and the group creator can perform these actions
export function canPerformFinancialActions(userRole?: string | null, userId?: string | null, groupCreatorId?: string | null): boolean {
  // If we don't have role information, the user cannot perform financial actions
  if (!userRole && !userId) {
    return false;
  }
  
  // Allow the group creator to perform financial actions
  if (userId && groupCreatorId && userId === groupCreatorId) {
    return true;
  }

  // Convert to lowercase for case-insensitive comparison
  const role = typeof userRole === 'string' ? userRole.toLowerCase() : '';
  
  // Check if the user is a treasurer or chama admin
  return (
    role.includes('treasurer') || 
    role.includes('chamaadmin')
  );
}

// This utility function determines if a user can perform administrative actions
// like adding/removing members, changing group settings, etc.
export function canPerformAdministrativeActions(userRole?: string | null, userId?: string | null, groupCreatorId?: string | null): boolean {
  // If we don't have role information, the user cannot perform administrative actions
  if (!userRole && !userId) {
    return false;
  }
  
  // Allow the group creator to perform administrative actions
  if (userId && groupCreatorId && userId === groupCreatorId) {
    return true;
  }

  // Convert to lowercase for case-insensitive comparison
  const role = typeof userRole === 'string' ? userRole.toLowerCase() : '';
  
  // Check if the user is an admin, treasurer, chairperson, or secretary
  return (
    role.includes('chamaadmin') || 
    role.includes('treasurer') ||
    role.includes('chairperson') ||
    role.includes('secretary')
  );
}

// This utility function determines if a user is an officer bearer
// (treasurer, chairperson, secretary or chama admin)
export function isOfficeBearer(userRole?: string | null): boolean {
  if (!userRole) {
    return false;
  }
  
  // Convert to lowercase for case-insensitive comparison
  const role = typeof userRole === 'string' ? userRole.toLowerCase() : '';
  
  return (
    role.includes('treasurer') || 
    role.includes('chairperson') ||
    role.includes('secretary') ||
    role.includes('chamaadmin')
  );
}

// This utility function determines if a user can approve transactions
// Only office bearers can approve transactions
export function canApproveTransactions(userRole?: string | null): boolean {
  return isOfficeBearer(userRole);
}

// This utility function determines if a user can access group reports
// Only office bearers and group creators can access reports
export function canAccessReports(userRole?: string | null, userId?: string | null, groupCreatorId?: string | null): boolean {
  // Allow the group creator to access reports
  if (userId && groupCreatorId && userId === groupCreatorId) {
    return true;
  }
  
  return isOfficeBearer(userRole);
}

// This utility function determines if a user can manage goals
// Only office bearers and group creators can manage goals
export function canManageGoals(userRole?: string | null, userId?: string | null, groupCreatorId?: string | null): boolean {
  // Allow the group creator to manage goals
  if (userId && groupCreatorId && userId === groupCreatorId) {
    return true;
  }
  
  return isOfficeBearer(userRole);
}

// This utility function determines if a user can communicate with all members
// Only office bearers and group creators can communicate with all members
export function canCommunicateWithAllMembers(userRole?: string | null, userId?: string | null, groupCreatorId?: string | null): boolean {
  // Allow the group creator to communicate with all members
  if (userId && groupCreatorId && userId === groupCreatorId) {
    return true;
  }
  
  return isOfficeBearer(userRole);
}

// This utility function determines if a user can apply for a loan
// All members can apply for loans
export function canApplyForLoan(): boolean {
  // All members can apply for loans
  return true;
}

// This utility function determines if a user can approve a loan as a guarantor
// Only a user who is a guarantor for a specific loan can approve it
export function canApproveAsGuarantor(userId?: string | null, guarantorsList?: any[]): boolean {
  if (!userId || !guarantorsList || !Array.isArray(guarantorsList) || guarantorsList.length === 0) {
    return false;
  }
  
  // Check if the user is a guarantor for this loan
  return guarantorsList.some(guarantor => {
    const guarantorId = guarantor.userId || guarantor.user?.id;
    return guarantorId === userId;
  });
}

// This utility function determines if a user can update financial records
// Only office bearers can update financial records
export function canUpdateFinancialRecords(userRole?: string | null, userId?: string | null, groupCreatorId?: string | null): boolean {
  // Allow the group creator to update financial records
  if (userId && groupCreatorId && userId === groupCreatorId) {
    return true;
  }
  
  return isOfficeBearer(userRole);
}

// This utility function determines if a user can view records/transactions
// All members can view records/transactions
export function canViewRecords(): boolean {
  // All members can view records/transactions
  return true;
}

// This utility function determines if a user can view the settings tab
// Only office bearers and group creators can access settings
export function canViewSettings(userRole?: string | null, userId?: string | null, groupCreatorId?: string | null): boolean {
  // Allow the group creator to view settings
  if (userId && groupCreatorId && userId === groupCreatorId) {
    return true;
  }
  
  return isOfficeBearer(userRole);
}

// This utility function determines if a user can edit settings
// Only office bearers and group creators can edit settings
export function canEditSettings(userRole?: string | null, userId?: string | null, groupCreatorId?: string | null): boolean {
  // Allow the group creator to edit settings
  if (userId && groupCreatorId && userId === groupCreatorId) {
    return true;
  }
  
  return isOfficeBearer(userRole);
}

// This utility function determines if a user can approve settings changes
// Only office bearers can approve settings changes but not the one who made the change
export function canApproveSettings(
  userRole?: string | null, 
  userId?: string | null, 
  createdById?: string | null
): boolean {
  // Check if user is an office bearer
  if (!isOfficeBearer(userRole)) {
    return false;
  }
  
  // Cannot approve own changes
  if (userId && createdById && userId === createdById) {
    return false;
  }
  
  return true;
}

// This utility function determines if a user can update member roles
// Only office bearers and group creators can update member roles
export function canUpdateMemberRoles(userRole?: string | null, userId?: string | null, groupCreatorId?: string | null): boolean {
  // Allow the group creator to update member roles
  if (userId && groupCreatorId && userId === groupCreatorId) {
    return true;
  }
  
  // Check if the user is a chairperson or secretary (treasurers cannot update roles)
  const role = typeof userRole === 'string' ? userRole.toLowerCase() : '';
  
  return (
    role.includes('chairperson') || 
    role.includes('secretary') ||
    role.includes('chamaadmin')
  );
}