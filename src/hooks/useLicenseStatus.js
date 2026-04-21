import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

/**
 * Hook to check and monitor the license status for a specific user.
 * 
 * Usage:
 * const { status, isValid, isLoading, refresh } = useLicenseStatus(userId);
 * 
 * @param {string} userId - The UUID of the user to check
 * @returns {Object} status object containing current license details
 */
export const useLicenseStatus = (userId) => {
  const { isSuperAdmin } = useAuth();
  const [status, setStatus] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkStatus = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    // Task 2: Super Admins bypass all license checks immediately
    if (isSuperAdmin) {
      setStatus({
        status: 'Active (Super Admin)',
        message: 'Super Admin Access',
        daysRemaining: null,
        isPerpetual: true,
        expiryDate: null,
        inGracePeriod: false,
        isActive: true
      });
      setIsValid(true);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('university_members')
        .select(`
          status,
          license_end,
          grace_period_end_date,
          enrollment_status,
          license_type
        `)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setStatus({
          status: 'none',
          message: 'No academic license found',
          daysRemaining: 0
        });
        setIsValid(false);
        return;
      }

      const now = new Date();
      const licenseEnd = data.license_end ? new Date(data.license_end) : null;
      const graceEnd = data.grace_period_end_date ? new Date(data.grace_period_end_date) : null;
      
      let currentStatus = data.status || 'inactive';
      let message = 'License is active';
      let valid = false;
      let daysRemaining = 0;

      if (currentStatus === 'active') {
        if (licenseEnd && now > licenseEnd) {
          // Check grace period
          if (graceEnd && now <= graceEnd) {
            currentStatus = 'grace_period';
            message = 'License expired, currently in grace period';
            valid = true;
            daysRemaining = Math.ceil((graceEnd - now) / (1000 * 60 * 60 * 24));
          } else {
            currentStatus = 'expired';
            message = 'License has expired';
            valid = false;
            daysRemaining = 0;
          }
        } else {
          valid = true;
          if (licenseEnd) {
             daysRemaining = Math.ceil((licenseEnd - now) / (1000 * 60 * 60 * 24));
          }
        }
      } else {
        message = `License is ${currentStatus}`;
        valid = false;
      }

      setStatus({
        status: currentStatus,
        licenseEnd: data.license_end,
        gracePeriodEnd: data.grace_period_end_date,
        type: data.license_type,
        message,
        daysRemaining
      });
      setIsValid(valid);

    } catch (err) {
      console.error('Error checking license status:', err);
      setError(err);
      setIsValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [userId, isSuperAdmin]);

  return { 
    status, 
    isValid, 
    isLoading, 
    error,
    refresh: checkStatus 
  };
};

export default useLicenseStatus;