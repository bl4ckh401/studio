// Types for settings changes and approvals
export interface SettingsChange {
  id: string;
  groupId: string;
  settingType: 'GROUP_SETTINGS' | 'MEMBER_ROLE_UPDATE' | 'CONTRIBUTION_SETTINGS' | 'LOAN_SETTINGS';
  changedBy: string;
  changedByName?: string;
  changedByRole?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  oldValue: any;
  newValue: any;
  approvals: SettingsApproval[];
  rejections: SettingsRejection[];
  description?: string;
}

export interface SettingsApproval {
  id: string;
  settingsChangeId: string;
  approvedBy: string;
  approvedByName?: string;
  approvedByRole?: string;
  approvedAt: string;
}

export interface SettingsRejection {
  id: string;
  settingsChangeId: string;
  rejectedBy: string;
  rejectedByName?: string;
  rejectedByRole?: string;
  rejectedAt: string;
  reason?: string;
}
