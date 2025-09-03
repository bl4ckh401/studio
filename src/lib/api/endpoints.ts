export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://chamaconnect.co.ke/backend/api/v1"
    : "http://localhost:3080/api/v1");

export const endPoints = {
  auth: {
    login: `${API_BASE_URL}/users/signin`, // Correct - matches backend route
    register: `${API_BASE_URL}/users/signup`, // Correct - matches backend route
    me: `${API_BASE_URL}/users/current-user`, // Updated to match actual backend endpoint
    updateProfile: `${API_BASE_URL}/users/update-profile`, // Updated to match actual backend endpoint
    updatePassword: `${API_BASE_URL}/users/current-user-update-password`, // Updated to match actual backend endpoint
    updateProfilePicture: `${API_BASE_URL}/users/update-profile-picture`, // Endpoint for profile picture upload
    requestPasswordReset: `${API_BASE_URL}/users/request-password-reset`, // Updated to match UserController.ts
    resetPassword: `${API_BASE_URL}/users/password-reset`, // Updated to match UserController.ts
    activateAccount: `${API_BASE_URL}/auth/activate-account`, // Added new endpoint
    sendActivationEmail: `${API_BASE_URL}/auth/send-activation-email`, // Added new endpoint
    verifyEmail: `${API_BASE_URL}/auth/verify-email`,
    resendVerification: `${API_BASE_URL}/auth/resend-verification`,
    twoFA: {
      send: `${API_BASE_URL}/auth/2fa/send`,
      verify: `${API_BASE_URL}/auth/2fa/verify`,
    },
    users: `${API_BASE_URL}/users`, // Correct - base users endpoint
  },
  roles: {
    getAll: `${API_BASE_URL}/roles`,
    create: `${API_BASE_URL}/roles`,
    get: (id: string) => `${API_BASE_URL}/roles/${id}`,
    update: (id: string) => `${API_BASE_URL}/roles/${id}`,
  },
  permissions: {
    getAll: `${API_BASE_URL}/permissions`,
    create: `${API_BASE_URL}/permissions`,
    get: (id: string) => `${API_BASE_URL}/permissions/${id}`,
    update: (id: string) => `${API_BASE_URL}/permissions/${id}`,
  },

  settings: {
    getAll: `${API_BASE_URL}/settings`,
    get: (id: string) => `${API_BASE_URL}/settings/${id}`,
    update: (id: string) => `${API_BASE_URL}/settings/${id}`,
  },
  groups: {
    groupMembers: {},
    groupSettings: {},
    contributions: {},
    getAll: `${API_BASE_URL}/groups`,
    get: (id: string) => `${API_BASE_URL}/groups/${id}`,
    create: `${API_BASE_URL}/groups`,
    types: `${API_BASE_URL}/groups-types`,
    settings: (groupId: string) => `${API_BASE_URL}/groups-settings/${groupId}`,
    update: (id: string) => `${API_BASE_URL}/groups/${id}`,
    addMembers: (id: string) => `${API_BASE_URL}/groups/${id}/members`,
    removeMembers: (id: string) => `${API_BASE_URL}/groups/${id}/members`,
    getSettings: (id: string) => `${API_BASE_URL}/groups/${id}/settings`,
    addSettings: (id: string) => `${API_BASE_URL}/groups/${id}/settings`,
    uploadDocument: (id: string) => `${API_BASE_URL}/groups/${id}/documents`,
    createPolicy: (id: string) => `${API_BASE_URL}/groups/${id}/policies`,
    getMetrics: (id: string) => `${API_BASE_URL}/groups/${id}/metrics`,
    initiateGroupClosure: (id: string) =>
      `${API_BASE_URL}/groups/${id}/closure`,
    getPolicies: (id: string) => `${API_BASE_URL}/groups/${id}/policies`,
    // Updated settings change routes based on backend API
    settingsChanges: (groupId: string) =>
      `${API_BASE_URL}/groups/${groupId}/settings/changes`,
    approveSettingsChangeAsTreasurer: (groupId: string, changeId: string) =>
      `${API_BASE_URL}/groups/${groupId}/settings/changes/${changeId}/approve/treasurer`,
    approveSettingsChangeAsSecretary: (groupId: string, changeId: string) =>
      `${API_BASE_URL}/groups/${groupId}/settings/changes/${changeId}/approve/secretary`,
    approveSettingsChangeAsChairperson: (groupId: string, changeId: string) =>
      `${API_BASE_URL}/groups/${groupId}/settings/changes/${changeId}/approve/chairperson`,
    rejectSettingsChange: (groupId: string, changeId: string) =>
      `${API_BASE_URL}/groups/${groupId}/settings/changes/${changeId}/reject`,
    getMemberSavings: (groupId: string, memberId?: string) =>
      `${API_BASE_URL}/groups/${groupId}/member-savings${
        memberId ? `/${memberId}` : ""
      }`,
    importData: (groupId: string) => `${API_BASE_URL}/groups/${groupId}/import`,
  },
  transactions: {
    methods: `${API_BASE_URL}/transactions/payment-methods`,
    contribute: `${API_BASE_URL}/transactions/group-contribution`,
    getGroupTransactions: (
      groupId: string,
      offset: number,
      limit: number,
      type: string = "CONTRIBUTION"
    ) =>
      `${API_BASE_URL}/transactions/groups/${groupId}?offset=${offset}&limit=${limit}&type=${type}`,

    addLoanAndExpense: `${API_BASE_URL}/transactions/request-loan-add-expense`,
    applyLoan: `${API_BASE_URL}/transactions/apply-loan`,

    // Loan-specific approval endpoints
    guarantorApproval: (transactionId: string) =>
      `${API_BASE_URL}/transactions/loan/${transactionId}/guarantor-approval`,
    treasurerApproval: (transactionId: string) =>
      `${API_BASE_URL}/transactions/loan/${transactionId}/treasurer-approval`,
    secretaryApproval: (transactionId: string) =>
      `${API_BASE_URL}/transactions/loan/${transactionId}/secretary-approval`,
    chairpersonApproval: (transactionId: string) =>
      `${API_BASE_URL}/transactions/loan/${transactionId}/chairperson-approval`,

    // General transaction approval endpoints (for contributions, expenses, income, fines)
    transactionTreasurerApproval: (transactionId: string) =>
      `${API_BASE_URL}/transactions/${transactionId}/treasurer-approval`,
    transactionSecretaryApproval: (transactionId: string) =>
      `${API_BASE_URL}/transactions/${transactionId}/secretary-approval`,
    transactionChairpersonApproval: (transactionId: string) =>
      `${API_BASE_URL}/transactions/${transactionId}/chairperson-approval`,

    // Rejection endpoint (works for all transaction types)
    rejectTransaction: (transactionId: string) =>
      `${API_BASE_URL}/transactions/${transactionId}/reject`,

    // Other loan-specific endpoints
    lockGuarantorFunds: (transactionId: string) =>
      `${API_BASE_URL}/transactions/loan/${transactionId}/lock-guarantor-funds`,
    unlockGuarantorFunds: (transactionId: string) =>
      `${API_BASE_URL}/transactions/loan/${transactionId}/unlock-guarantor-funds`,
    rejectLoan: (transactionId: string) =>
      `${API_BASE_URL}/transactions/loan/${transactionId}/reject`,
    getLoanDetails: (transactionId: string) =>
      `${API_BASE_URL}/transactions/loan/${transactionId}`,

    // Legacy endpoint (you might want to remove this if not used)
    approvals: (transactionId: string) =>
      `${API_BASE_URL}/transactions/${transactionId}/approvals`,
  },
  reports: {
    transactionSummary: (
      groupId: string,
      startDate?: string,
      endDate?: string
    ) =>
      `${API_BASE_URL}/reports/transactions/summary?groupId=${groupId}${
        startDate ? `&startDate=${startDate}` : ""
      }${endDate ? `&endDate=${endDate}` : ""}`,
    transactionsByType: (
      groupId: string,
      startDate?: string,
      endDate?: string
    ) =>
      `${API_BASE_URL}/reports/transactions/by-type?groupId=${groupId}${
        startDate ? `&startDate=${startDate}` : ""
      }${endDate ? `&endDate=${endDate}` : ""}`,
    transactionsByStatus: (
      groupId: string,
      startDate?: string,
      endDate?: string
    ) =>
      `${API_BASE_URL}/reports/transactions/by-status?groupId=${groupId}${
        startDate ? `&startDate=${startDate}` : ""
      }${endDate ? `&endDate=${endDate}` : ""}`,
    monthlyTransactions: (groupId: string, year?: number) =>
      `${API_BASE_URL}/reports/transactions/monthly?groupId=${groupId}${
        year ? `&year=${year}` : ""
      }`,
    trialBalance: (groupId: string, startDate?: string, endDate?: string) =>
      `${API_BASE_URL}/reports/transactions/trial-balance?groupId=${groupId}${
        startDate ? `&startDate=${startDate}` : ""
      }${endDate ? `&endDate=${endDate}` : ""}`,
    balanceSheet: (groupId: string, asOfDate?: string) =>
      `${API_BASE_URL}/reports/transactions/balance-sheet?groupId=${groupId}${
        asOfDate ? `&asOfDate=${asOfDate}` : ""
      }`,
    dashboardSummary: (startDate?: string, endDate?: string) =>
      `${API_BASE_URL}/reports/dashboard/summary${
        startDate ? `?startDate=${startDate}` : ""
      }${endDate ? `${startDate ? "&" : "?"}endDate=${endDate}` : ""}`,
    memberContributions: (
      groupId: string,
      startDate?: string,
      endDate?: string
    ) =>
      `${API_BASE_URL}/reports/transactions/member-contributions?groupId=${groupId}${
        startDate ? `&startDate=${startDate}` : ""
      }${endDate ? `&endDate=${endDate}` : ""}`,
    loanAnalysis: (groupId: string, startDate?: string, endDate?: string) =>
      `${API_BASE_URL}/reports/transactions/loan-analysis?groupId=${groupId}${
        startDate ? `&startDate=${startDate}` : ""
      }${endDate ? `&endDate=${endDate}` : ""}`,
    expenses: (groupId: string, startDate?: string, endDate?: string) =>
      `${API_BASE_URL}/reports/transactions/expenses?groupId=${groupId}${
        startDate ? `&startDate=${startDate}` : ""
      }${endDate ? `&endDate=${endDate}` : ""}`,
    fines: (groupId: string, startDate?: string, endDate?: string) =>
      `${API_BASE_URL}/reports/transactions/fines-report?groupId=${groupId}${
        startDate ? `&startDate=${startDate}` : ""
      }${endDate ? `&endDate=${endDate}` : ""}`,
  },
  notifications: {
    getAllByUser: (userId: string) =>
      `${API_BASE_URL}/notifications/user/${userId}`,
    getAll: `${API_BASE_URL}/notifications`,
    markAllAsRead: `${API_BASE_URL}/notifications/mark-all-read`,
    markAsRead: (id: string) => `${API_BASE_URL}/notifications/${id}/mark-read`,
    create: `${API_BASE_URL}/notifications`,
  },
  communications: {
    getMessages: (groupId: string) =>
      `${API_BASE_URL}/communications/groups/${groupId}`,
    getAdminMessages: `${API_BASE_URL}/communications`,
    sendMessage: `${API_BASE_URL}/communications`,
    markAsRead: (id: string) =>
      `${API_BASE_URL}/communications/${id}/mark-read`,
  },
  fineRules: {
    create: `${API_BASE_URL}/fine-rules`,
    update: (id: string) => `${API_BASE_URL}/fine-rules/${id}`,
    apply: `${API_BASE_URL}/fine-rules/apply`,
    getGroupFineRules: (groupId: string) =>
      `${API_BASE_URL}/fine-rules/group/${groupId}`,
    getMemberFineHistory: (memberId: string) =>
      `${API_BASE_URL}/fine-rules/member/${memberId}/history`,
  },
  goals: {
    getGroupGoals: (groupId: string) =>
      `${API_BASE_URL}/goals/group/${groupId}`,
    createGoal: `${API_BASE_URL}/goals`,
    updateGoal: (id: string) => `${API_BASE_URL}/goals/${id}`,
    deleteGoal: (id: string) => `${API_BASE_URL}/goals/${id}`,
    markGoalComplete: (id: string) => `${API_BASE_URL}/goals/${id}/complete`,
    approveByTreasurer: (id: string) =>
      `${API_BASE_URL}/goals/${id}/approve/treasurer`,
    approveBySecretary: (id: string) =>
      `${API_BASE_URL}/goals/${id}/approve/secretary`,
    approveByChairperson: (id: string) =>
      `${API_BASE_URL}/goals/${id}/approve/chairperson`,
    reject: (id: string) => `${API_BASE_URL}/goals/${id}/reject`,
    importGoals: (groupId: string) =>
      `${API_BASE_URL}/goals/group/${groupId}/import`,
  },
};
