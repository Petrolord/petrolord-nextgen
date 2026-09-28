import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { ShieldCheck, Plus, Mail, UserX, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const SuperAdminToolPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(null);
  const [superAdmins, setSuperAdmins] = useState([]);
  const [selectedAdminForDeactivation, setSelectedAdminForDeactivation] = useState(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Strictly use production URL or VITE_APP_URL to ensure no localhost in emails
  const appUrl = import.meta.env.VITE_APP_URL || 'https://nextgen.petrolord.com';

  const fetchSuperAdmins = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, email, status')
      .eq('role', 'super_admin')
      .neq('status', 'inactive');
    
    if (error) {
      toast({ variant: 'destructive', title: 'Error fetching admins', description: error.message });
    } else {
      setSuperAdmins(data || []);
    }
  }, [toast]);

  useEffect(() => {
    fetchSuperAdmins();
  }, [fetchSuperAdmins]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) throw new Error("Authentication check failed. Please log in again.");

      // Redirect URL for the user to set their password
      const redirectUrl = `${appUrl}/reset-password`;

      const { data, error } = await supabase.functions.invoke('create-super-admin', {
        body: { email, redirectUrl },
        headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
      });

      if (error) {
        throw new Error(error.message || 'Failed to send invitation');
      }
      
      toast({
        title: 'Invitation Sent',
        description: `Invitation sent to ${email}.`,
        variant: "default",
      });
      setEmail('');
      fetchSuperAdmins();

    } catch (error) {
      console.error("Create super admin error:", error);
      toast({
        variant: "destructive",
        title: "Invitation Failed",
        description: error.message || "An unknown error occurred. Check logs for details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!selectedAdminForDeactivation) return;
    const targetId = selectedAdminForDeactivation.id;
    
    setDeactivateLoading(targetId);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      const { error } = await supabase.functions.invoke('deactivate-user', {
        body: { 
          userId: targetId,
          reason: 'Deactivated by Super Admin via Dashboard'
        },
        headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
      });

      if (error) throw new Error(error.message || 'Failed to deactivate user');

      toast({
        title: 'User Deactivated',
        description: `${selectedAdminForDeactivation.email} has been deactivated and can no longer log in.`,
      });
      
      setSuperAdmins(prev => prev.filter(admin => admin.id !== targetId));
      fetchSuperAdmins();

    } catch (error) {
      console.error("Deactivation error:", error);
      toast({
        variant: "destructive",
        title: "Deactivation Failed",
        description: error.message
      });
    } finally {
      setDeactivateLoading(null);
      setSelectedAdminForDeactivation(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Super Admin Tool - Petrolord NextGen Suite</title>
        <meta name="description" content="Manage Super Admin accounts." />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="px-4 py-8 md:px-8"
      >
        <h1 className="text-4xl font-bold text-pl-text mb-2">Super Admin Management</h1>
        <p className="text-xl text-pl-muted mb-8">Create and manage Super Admin accounts.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invitation Card */}
          <div className="lg:col-span-1">
            <div className="bg-pl-surface rounded-lg p-6 md:p-8 border border-pl-border shadow-pl-sm">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-pl-accent/15 rounded-lg">
                   <ShieldCheck className="w-6 h-6 text-pl-accent-text" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-pl-text">Create New Admin</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-pl-text mb-2">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pl-muted" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-pl-border-strong bg-pl-surface text-pl-text placeholder:text-pl-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus transition-colors"
                      placeholder="new.admin@petrolord.com"
                      required
                    />
                  </div>
                  <p className="text-xs text-pl-muted mt-2">
                    Invitation link redirects to: <br/>
                    <span className="text-pl-primary-text font-mono break-all">{appUrl}/reset-password</span>
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full font-semibold py-3 text-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {loading ? 'Sending Invitation...' : 'Invite Super Admin'}
                </Button>
              </form>
            </div>
          </div>
          
          {/* List Card */}
          <div className="lg:col-span-2">
            <div className="bg-pl-surface rounded-lg border border-pl-border shadow-pl-sm overflow-hidden">
              <div className="p-6 border-b border-pl-border flex justify-between items-center">
                <h2 className="text-2xl font-bold text-pl-text">Active Super Admins</h2>
                <span className="px-3 py-1 bg-pl-sunken rounded-full text-xs text-pl-muted border border-pl-border">
                  {superAdmins.length} Active
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-pl-sunken">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-pl-text">Display Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-pl-text">Email</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-pl-text">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pl-border">
                    {superAdmins.length > 0 ? (
                      superAdmins.map((admin) => (
                        <tr key={admin.id} className="hover:bg-pl-sunken/60 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-pl-sunken flex items-center justify-center mr-3 text-xs font-bold text-pl-text">
                                    {admin.display_name ? admin.display_name.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <span className="text-pl-text font-medium">{admin.display_name || 'n/a'}</span>
                                {admin.id === user?.id && (
                                    <span className="ml-2 text-[10px] bg-pl-accent/20 text-pl-accent-text px-2 py-0.5 rounded border border-pl-accent/40">YOU</span>
                                )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-pl-muted font-mono text-sm">{admin.email}</td>
                          <td className="px-6 py-4 text-right">
                             {admin.id !== user?.id ? (
                               <AlertDialog>
                                 <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="destructive" 
                                      size="sm" 
                                      disabled={deactivateLoading === admin.id}
                                      onClick={() => setSelectedAdminForDeactivation(admin)}
                                    >
                                      {deactivateLoading === admin.id ? (
                                        <span className="animate-pulse">Deactivating...</span>
                                      ) : (
                                        <>
                                            <UserX className="w-4 h-4 mr-2" />
                                            Deactivate
                                        </>
                                      )}
                                    </Button>
                                 </AlertDialogTrigger>
                                 <AlertDialogContent>
                                   <AlertDialogHeader>
                                     <AlertDialogTitle className="flex items-center text-pl-danger-text">
                                       <AlertTriangle className="w-5 h-5 mr-2" />
                                       Confirm Deactivation
                                     </AlertDialogTitle>
                                     <AlertDialogDescription className="text-pl-muted">
                                       Are you sure you want to deactivate <strong>{admin.email}</strong>? 
                                       <br/><br/>
                                       This action will immediately prevent the user from logging in and revoke all access tokens. You can reactivate them later via direct database access if needed.
                                     </AlertDialogDescription>
                                   </AlertDialogHeader>
                                   <AlertDialogFooter>
                                     <AlertDialogCancel>Cancel</AlertDialogCancel>
                                     <AlertDialogAction 
                                       onClick={handleDeactivate}
                                       className="bg-pl-danger text-pl-danger-fg hover:bg-pl-danger/90"
                                     >
                                       Yes, Deactivate User
                                     </AlertDialogAction>
                                   </AlertDialogFooter>
                                 </AlertDialogContent>
                               </AlertDialog>
                             ) : (
                                <span className="text-xs text-pl-muted italic">Current User</span>
                             )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-6 py-12 text-center text-pl-muted">
                          <div className="flex flex-col items-center justify-center">
                            <ShieldCheck className="w-12 h-12 text-pl-muted mb-4" />
                            <p>No other super admins found.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SuperAdminToolPage;