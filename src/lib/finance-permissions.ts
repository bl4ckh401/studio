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
