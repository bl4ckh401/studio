"use client";
import { useTransaction } from "@/hooks/use-transaction";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { endPoints } from "@/lib/api/endpoints";
import { canApproveAsGuarantor, isOfficeBearer } from "@/lib/permissions";

interface Guarantor {
    userId: string;
    email?: string;
    hasApproved?: boolean;
    status?: string;
}

interface Transaction {
    id: string;
    status: string;
    guarantors?: Guarantor[];
    guarantorsApproved?: boolean;
    allGuarantorsApproved?: boolean;
    treasurerApproved?: boolean;
    treasurerApproval?: boolean;
    secretaryApproved?: boolean;
    secretaryApproval?: boolean;
    chairpersonApproved?: boolean;
    chairpersonApproval?: boolean;
    guarantor?: any[];
}

interface TransactionHook {
    approveAsGuarantor: (id: string) => Promise<void>;
    approveAsTreasurer: (id: string) => Promise<void>;
    approveAsSecretary: (id: string) => Promise<void>;
    approveAsChairperson: (id: string) => Promise<void>;
}

export default function LoanApprovalActions({ 
    transaction, 
    getAll, 
    currentMembership 
}: { 
    transaction: Transaction | null; 
    getAll: () => void;
    currentMembership?: any;
}) {
    // Authentication state
    const storeUser = useAuthStore((state) => state.user);
    const storeToken = useAuthStore((state) => state.token);
    const { user: authUser, meAuth } = useAuth();
    const [user, setUser] = useState(storeUser || authUser || null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(false);
    
    const { 
        approveAsGuarantor, 
        approveAsTreasurer, 
        approveAsSecretary, 
        approveAsChairperson 
    } = useTransaction() as TransactionHook;
    const [loading, setLoading] = useState<boolean>(false);
    
    // Fetch user data directly from backend if not available in store
    useEffect(() => {
        const loadUser = async () => {
            // First try to get user from store
            if (storeUser) {
                // // console.log("Using user from store:", storeUser);
                setUser(storeUser);
                return;
            }
            
            // Then try to get user from auth context
            if (authUser) {
                // console.log("Using user from auth context:", authUser);
                setUser(authUser);
                return;
            }
            
            // If no token in store, we can't fetch user data
            if (!storeToken) {
                console.warn("No auth token available, can't fetch user data");
                return;
            }
            
            // Direct API call to backend as a fallback
            setIsLoadingAuth(true);
            try {
                // First try the meAuth hook
                try {
                    const userData = await meAuth();
                    if (userData) {
                        // console.log("User loaded from meAuth:", userData);
                        setUser(userData);
                        return;
                    }
                } catch (error) {
                    // console.log("meAuth failed, trying direct API call:", error);
                }
                
                // Direct backend API call as a last resort
                const response = await fetch(`${endPoints.auth.me}`, {
                    headers: {
                        Authorization: `Bearer ${storeToken}`,
                        "Content-Type": "application/json"
                    },
                });
                
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                
                const data = await response.json();
                const userData = data.data?.user || data.user || data.data;
                // console.log("User loaded from direct API call:", userData);
                  if (userData) {
                    // Create a deep copy to preserve all nested objects like roles
                    const userDataCopy = JSON.parse(JSON.stringify(userData));
                    
                    // Ensure the role is properly preserved
                    if (typeof userDataCopy.role === 'string' && userData.role && typeof userData.role === 'object') {
                      console.log("Fixing role structure:", userData.role);
                      userDataCopy.role = userData.role;
                    }
                    
                    setUser(userDataCopy);
                    // Also update the store with the deep copy
                    useAuthStore.getState().setUser(userDataCopy);
                } else {
                    console.warn("API returned no user data");
                }
            } catch (error) {
                console.error("Error loading user:", error);
            } finally {
                setIsLoadingAuth(false);
            }
        };
        
        loadUser();
    }, [storeUser, authUser, storeToken]);
    
    // Add debugging logs
  
    
    if (!transaction) {
        // console.log('No transaction provided to LoanApprovalActions');
        return null;
    }
    
    if (isLoadingAuth) {
        // console.log('Auth data is still loading...');
        return <Button variant="outline" size="sm" disabled><Loader2 className="h-4 w-4 animate-spin" /> Loading...</Button>;
    }
    
    if (!user) {
        console.warn('No authenticated user found, cannot determine permissions');
        return null;
    }
    
    // console.log('LoanApprovalActions - Transaction:', transaction);
    
    // Process guarantor arrays - normalize the data structures
    let normalizedGuarantors: Guarantor[] = [];
    
    // Process guarantors array if exists
    if (transaction.guarantors && Array.isArray(transaction.guarantors)) {
        normalizedGuarantors = transaction.guarantors.map(g => ({
            userId: g.userId,
            email: g.email,
            hasApproved: g.hasApproved === true || g.status === 'APPROVED',
            status: g.status
        }));
    }
    
    // Process guarantor array if exists (alternative API format)
    if (transaction.guarantor && Array.isArray(transaction.guarantor)) {
        // If guarantors array exists already, add any missing guarantors from guarantor array
        if (normalizedGuarantors.length > 0) {
            const existingUserIds = normalizedGuarantors.map(g => g.userId);
            const missingGuarantors = transaction.guarantor.filter(g => 
                !existingUserIds.includes(g.userId)
            );
            
            normalizedGuarantors = [...normalizedGuarantors, ...missingGuarantors.map(g => ({
                userId: g.userId,
                email: g.user?.email || g.email,
                hasApproved: g.status === 'APPROVED',
                status: g.status
            }))];
        } else {
            // Otherwise just use the guarantor array
            normalizedGuarantors = transaction.guarantor.map(g => ({
                userId: g.userId,
                email: g.user?.email || g.email,
                hasApproved: g.status === 'APPROVED',
                status: g.status
            }));
        }
    }
    
    // console.log('Normalized guarantors:', normalizedGuarantors);
    
    // Check if all guarantors have approved
    const allGuarantorsApproved = normalizedGuarantors.length > 0 && 
        normalizedGuarantors.every(g => g.hasApproved || g.status === 'APPROVED');
        
    // Set guarantors approval status
    const guarantorsApproved = allGuarantorsApproved || 
                              transaction.guarantorsApproved || 
                              transaction.allGuarantorsApproved;
    
    // Use the permission function to check if the user is a guarantor for this loan    // and hasn't already approved it
    const userId = currentMembership?.userId || user?.id;
    const isGuarantor = canApproveAsGuarantor(
        userId,
        normalizedGuarantors.filter(g => !g.hasApproved && g.status !== 'APPROVED')
    );
    // Safely check roles - prefer currentMembership if available
    const membershipRole = currentMembership?.role?.name || currentMembership?.role || '';
    const rawRole = membershipRole || user?.role?.name || user?.role || '';
    const userRole = typeof rawRole === 'string' ? rawRole.toLowerCase() : '';
    
    // Log role information for debugging
    console.log("User role information:", { 
      membershipRole,
      rawRole, 
      roleObject: currentMembership?.role || user?.role, 
      roleType: typeof (currentMembership?.role || user?.role),
      currentMembership
    });
    
    // Check user roles with case insensitive matching
    const isTreasurer = userRole.includes("treasurer");
    const isSecretary = userRole.includes("secretary");
    const isChairperson = userRole.includes("chairperson") || userRole.includes("chamaadmin");
    
    // Check transaction status - support "PENDING", "PENDING_APPROVAL" and other pending-like statuses
    const isPendingStatus = transaction.status === "PENDING" || 
                          transaction.status === "PENDING_APPROVAL" || 
                          transaction.status?.includes("PENDING");
    
    // Check for various approval flag naming conventions
    const treasurerApproved = transaction.treasurerApproved || 
                             transaction.treasurerApproval;
    
    const secretaryApproved = transaction.secretaryApproved ||
                             transaction.secretaryApproval;
    
    const chairpersonApproved = transaction.chairpersonApproved ||
                               transaction.chairpersonApproval;
    
    const needsTreasurerApproval = isPendingStatus && 
      guarantorsApproved && !treasurerApproved;
    
    const needsSecretaryApproval = isPendingStatus && 
      treasurerApproved && !secretaryApproved;
      
    const needsChairpersonApproval = isPendingStatus && 
      secretaryApproved && !chairpersonApproved;
    
    const handleApprove = async () => {
        try {
            setLoading(true);
            
            if (isGuarantor) {
                await approveAsGuarantor(transaction.id);
                toast.success("Approved as guarantor successfully");
            } else if (isTreasurer && needsTreasurerApproval) {
                await approveAsTreasurer(transaction.id);
                toast.success("Approved as treasurer successfully");
            } else if (isSecretary && needsSecretaryApproval) {
                await approveAsSecretary(transaction.id);
                toast.success("Approved as secretary successfully");
            } else if (isChairperson && needsChairpersonApproval) {
                await approveAsChairperson(transaction.id);
                toast.success("Approved as chairperson successfully");
            }
            
            getAll();
        } catch (error) {
            console.error("Error approving loan:", error);
            toast.error("Failed to approve loan");
        } finally {
            setLoading(false);
        }
    };
    
    // Only show approve button for guarantors who haven't approved yet
    if (isGuarantor) {
        return (
            <Button 
                variant="outline" 
                size="sm" 
                className="bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white"
                onClick={handleApprove}
                disabled={loading}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve as Guarantor"}
            </Button>
        );
    }
    
    // Only show approve button for office bearers based on their role
    // and the current approval workflow state
    if (isTreasurer && needsTreasurerApproval) {
        return (
            <Button 
                variant="outline" 
                size="sm" 
                className="bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white"
                onClick={handleApprove}
                disabled={loading}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve as Treasurer"}
            </Button>
        );
    }
    
    if (isSecretary && needsSecretaryApproval) {
        return (
            <Button 
                variant="outline" 
                size="sm" 
                className="bg-purple-500/10 text-purple-500 hover:bg-purple-500 hover:text-white"
                onClick={handleApprove}
                disabled={loading}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve as Secretary"}
            </Button>
        );
    }
    
    if (isChairperson && needsChairpersonApproval) {
        return (
            <Button 
                variant="outline" 
                size="sm" 
                className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                onClick={handleApprove}
                disabled={loading}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve as Chairperson"}
            </Button>
        );
    }
    
    return null;
}