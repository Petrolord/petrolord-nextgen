import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, ShieldCheck, UserPlus, Users, Search, RefreshCw, BarChart2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/SupabaseAuthContext';

// Import our new/updated widgets
import { KPICard, AreaChartWidget, BarChartWidget, PieChartWidget } from '@/components/charts/DashboardWidgets';
import { analyticsService } from '@/services/analyticsService';

const AdminManagementPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics'); // Default to Analytics for Super Admin

  // Analytics State
  const [systemMetrics, setSystemMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  // Admin Management State
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  
  useEffect(() => {
    if (activeTab === 'analytics') {
        fetchSystemMetrics();
    } else if (activeTab === 'admins') {
        fetchAdmins();
    }
  }, [activeTab]);

  const fetchSystemMetrics = async () => {
    setLoadingMetrics(true);
    try {
        const metrics = await analyticsService.getSystemMetrics();
        setSystemMetrics(metrics);
    } catch (error) {
        console.error("Error fetching system metrics:", error);
    } finally {
        setLoadingMetrics(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      setLoadingAdmins(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        title: "Error",
        description: "Failed to load admin list.",
        variant: "destructive"
      });
    } finally {
      setLoadingAdmins(false);
    }
  };

  const handleInviteAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminName) {
      toast({ title: "Validation Error", description: "Email and Name are required.", variant: "destructive" });
      return;
    }

    setInviteLoading(true);
    try {
      // 1. Create Profile first (assuming user might sign up later, or use edge function for proper invite flow)
      // Note: In a real app, this should use supabase.auth.admin.inviteUserByEmail() which requires service role key
      // accessible only via Edge Function. For this demo, we'll simulate by checking if user exists or calling edge function.
      
      const { data, error } = await supabase.functions.invoke('create-admin', {
        body: { email: newAdminEmail, name: newAdminName }
      });

      if (error) throw error;

      toast({
        title: "Invitation Sent",
        description: `Admin invitation sent to ${newAdminEmail}`,
        variant: "default"
      });
      
      setIsInviteDialogOpen(false);
      setNewAdminEmail('');
      setNewAdminName('');
      fetchAdmins();

    } catch (error) {
      console.error('Error inviting admin:', error);
      toast({
        title: "Invitation Failed",
        description: error.message || "Could not send invitation.",
        variant: "destructive"
      });
    } finally {
      setInviteLoading(false);
    }
  };

  const filteredAdmins = admins.filter(admin => 
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (admin.display_name && admin.display_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <Helmet>
        <title>Admin Management - Petrolord</title>
      </Helmet>
      
      <div className="px-4 py-8 md:px-8 space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-pl-text flex items-center gap-2">
             <ShieldCheck className="w-8 h-8 text-pl-accent-text" aria-hidden="true" /> Super Admin Console
          </h1>
          <p className="text-pl-muted">Manage platform administrators and view system-wide analytics.</p>
        </div>

        <Tabs defaultValue="analytics" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="p-1">
            <TabsTrigger value="analytics">
                <BarChart2 className="w-4 h-4 mr-2" /> System Analytics
            </TabsTrigger>
            <TabsTrigger value="admins">
                <Users className="w-4 h-4 mr-2" /> Admin Users
            </TabsTrigger>
          </TabsList>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-2">
                <h2 className="text-xl font-semibold text-pl-text">System Overview</h2>
                <Button variant="outline" size="sm" onClick={fetchSystemMetrics}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loadingMetrics ? 'animate-spin' : ''}`} /> Refresh
                </Button>
            </div>

            {loadingMetrics && !systemMetrics ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-pl-primary" />
                </div>
            ) : (
                <>
                    {/* Top Level KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <KPICard title="Total Users" value={systemMetrics?.userCount || 0} icon={Users} tone="info" />
                        <KPICard title="Learners" value={systemMetrics?.learnerCount || 0} icon={Users} tone="primary" />
                        <KPICard title="Active Today" value={systemMetrics?.activeUsers || 0} icon={RefreshCw} tone="success" />
                        <KPICard title="Enrollments" value={systemMetrics?.enrollmentCount || 0} icon={BarChart2} tone="accent" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         <div>
                             <PieChartWidget
                                title="User Distribution"
                                height={240}
                                data={[
                                    { name: 'Learners', value: systemMetrics?.learnerCount || 0 },
                                    { name: 'Staff', value: Math.max((systemMetrics?.userCount || 0) - (systemMetrics?.learnerCount || 0), 0) }
                                ]}
                             />
                         </div>
                         <div className="lg:col-span-2">
                            <Card className="h-full">
                                <CardHeader><CardTitle className="text-pl-text">Academy Records</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="bg-pl-sunken p-6 rounded text-center">
                                            <div className="text-3xl font-bold text-pl-text tabular-nums">{systemMetrics?.enrollmentCount || 0}</div>
                                            <div className="text-xs text-pl-muted mt-1">Total Enrollments</div>
                                        </div>
                                        <div className="bg-pl-sunken p-6 rounded text-center">
                                            <div className="text-3xl font-bold text-pl-text tabular-nums">{systemMetrics?.certificateCount || 0}</div>
                                            <div className="text-xs text-pl-muted mt-1">Live Certificates</div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-pl-muted mt-4">Full breakdowns live in System Analytics.</p>
                                </CardContent>
                            </Card>
                         </div>
                    </div>
                </>
            )}
          </TabsContent>

          {/* ADMINS LIST TAB */}
          <TabsContent value="admins">
            <Card>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-pl-text">Petrolord Administrators</CardTitle>
                  <CardDescription>Users with global administrative privileges.</CardDescription>
                </div>
                <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" /> Invite Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite New Administrator</DialogTitle>
                      <DialogDescription>
                        Send an invitation to a new system administrator. They will receive an email to set up their account.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleInviteAdmin} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          placeholder="John Doe" 
                          value={newAdminName}
                          onChange={(e) => setNewAdminName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="admin@petrolord.com" 
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={inviteLoading}>
                          {inviteLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Send Invitation
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pl-muted" />
                    <Input 
                      placeholder="Search admins..." 
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {loadingAdmins ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-pl-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAdmins.length === 0 ? (
                      <div className="text-center py-8 text-pl-muted">
                        No administrators found matching your search.
                      </div>
                    ) : (
                      filteredAdmins.map((admin) => (
                        <div key={admin.id} className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg bg-pl-sunken border border-pl-border">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-pl-primary/10 flex items-center justify-center text-pl-primary-text font-bold">
                              {admin.display_name?.charAt(0) || admin.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-pl-text">{admin.display_name || 'Unnamed Admin'}</div>
                              <div className="text-sm text-pl-muted">{admin.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className="bg-pl-accent/15 text-pl-accent-text border-pl-accent/40">
                              {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                            </Badge>
                            <div className="text-xs text-pl-muted">
                              Added {new Date(admin.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminManagementPage;