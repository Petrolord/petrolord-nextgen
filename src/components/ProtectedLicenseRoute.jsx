import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useLicenseStatus from '@/hooks/useLicenseStatus';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

/**
 * Route wrapper that ensures a user has a valid license before rendering children.
 * Redirects to '/dashboard' or custom fallback if license is invalid.
 * 
 * Usage:
 * <ProtectedLicenseRoute userId={user.id}>
 *   <CourseContent />
 * </ProtectedLicenseRoute>
 */
const ProtectedLicenseRoute = ({ userId, children, fallbackPath = '/dashboard' }) => {
  const { isSuperAdmin } = useAuth();
  
  // Task 3: Super Admins completely bypass the routing block and hook check
  if (isSuperAdmin) {
    return children;
  }

  return <LicenseChecker userId={userId} fallbackPath={fallbackPath}>{children}</LicenseChecker>;
};

// Extracted inner component to prevent hook execution for super admins
const LicenseChecker = ({ userId, children, fallbackPath }) => {
  const { isValid, isLoading, status } = useLicenseStatus(userId);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900">
        <Loader2 className="w-10 h-10 text-[#BFFF00] animate-spin mb-4" />
        <h3 className="text-lg font-medium text-slate-300">Verifying License Status...</h3>
      </div>
    );
  }

  if (!isValid) {
    // If invalid, we redirect. 
    // We pass state so the destination page can show a specific message if it wants.
    return <Navigate to={fallbackPath} state={{ from: location, licenseError: status?.message }} replace />;
  }

  return children;
};

export default ProtectedLicenseRoute;