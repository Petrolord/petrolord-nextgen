import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Lock, 
  LogOut, 
  Save, 
  Loader2,
  Trash2,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useUserSettings } from '@/hooks/useUserSettings';
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
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';

// Design system (batch 2A): the page renders inside the signed-in scope
// (src/design/rollout/w2a.js) and uses theme roles; the ui pieces theme
// themselves there, so the page adds no colour of its own to them.
const SettingsPage = () => {
  const { user, profile, signOut } = useAuth();
  const { preferences, loading, saving, updatePreferences, updateProfile } = useUserSettings();
  const { toast } = useToast();
  
  // Local state for forms
  const [profileForm, setProfileForm] = useState({
    display_name: profile?.display_name || '',
    email: user?.email || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirmPassword: ''
  });

  // Load profile data into form when available
  React.useEffect(() => {
    if (profile && user) {
        setProfileForm({
            display_name: profile.display_name || '',
            email: user.email || ''
        });
    }
  }, [profile, user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(profileForm);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.confirmPassword) {
        toast({
            title: "Passwords do not match",
            variant: "destructive"
        });
        return;
    }
    if (passwordForm.password.length < 6) {
        toast({
            title: "Password too weak",
            description: "Password must be at least 6 characters.",
            variant: "destructive"
        });
        return;
    }
    await updateProfile({ password: passwordForm.password });
    setPasswordForm({ password: '', confirmPassword: '' });
  };

  const handlePreferenceChange = (key, value) => {
    updatePreferences({ [key]: value });
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 animate-spin text-pl-primary-text" />
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:p-8 space-y-8">
      <Helmet>
        <title>Settings - Petrolord NextGen Suite</title>
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-pl-text tracking-tight">Account Settings</h1>
          <p className="text-pl-muted mt-1">Manage your profile preferences and security settings.</p>
        </div>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="w-full md:w-auto overflow-x-auto justify-start">
          <TabsTrigger value="account" className="gap-2">
            <User className="w-4 h-4" /> Account
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Settings className="w-4 h-4" /> Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="w-4 h-4" /> Privacy
          </TabsTrigger>
        </TabsList>

        {/* --- ACCOUNT TAB --- */}
        <TabsContent value="account" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid gap-6 md:grid-cols-2">
              
              {/* Profile Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-pl-text">Profile Information</CardTitle>
                  <CardDescription>Update your personal details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="display_name">Display Name</Label>
                      <Input 
                        id="display_name" 
                        value={profileForm.display_name}
                        onChange={(e) => setProfileForm({...profileForm, display_name: e.target.value})}
                                              />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                                              />
                      <p className="text-xs text-pl-muted">Changing email will require re-verification.</p>
                    </div>
                    <Button 
                        type="submit" 
                        disabled={saving}
                        className="w-full mt-4 font-semibold"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Security / Password */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-pl-text">Security</CardTitle>
                  <CardDescription>Update your password or account access.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password"
                        value={passwordForm.password}
                        onChange={(e) => setPasswordForm({...passwordForm, password: e.target.value})}
                                              />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                              />
                    </div>
                    <Button 
                        type="submit" 
                        variant="outline"
                        disabled={saving || !passwordForm.password}
                        className="w-full mt-4"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                        Update Password
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-pl-danger/40 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-pl-danger-text flex items-center gap-2">
                     <Trash2 className="w-5 h-5" aria-hidden="true" /> Danger Zone
                  </CardTitle>
                  <CardDescription>Irreversible actions for your account.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h4 className="text-pl-text font-medium">Deactivate Account</h4>
                        <p className="text-sm text-pl-muted">Permanently disable access to your account and data.</p>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Deactivate Account</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently deactivate your account
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-pl-danger text-pl-danger-fg hover:bg-pl-danger/90">Continue Deactivation</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>

        {/* --- PREFERENCES TAB --- */}
        <TabsContent value="preferences" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-pl-text">Interface Settings</CardTitle>
                        <CardDescription>Customize the look and feel of the platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Theme */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <Label className="text-base">Theme Preference</Label>
                                <p className="text-sm text-pl-muted">Choose your preferred visual theme.</p>
                            </div>
                            <div className="flex flex-wrap gap-2 bg-pl-sunken p-1 rounded-lg border border-pl-border">
                                <Button 
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handlePreferenceChange('theme', 'light')}
                                    aria-pressed={preferences?.theme === 'light'}
                                    className={preferences?.theme === 'light' ? 'bg-pl-surface text-pl-text shadow-pl-sm' : 'text-pl-muted'}
                                >
                                    <Sun className="w-4 h-4 mr-2" /> Light
                                </Button>
                                <Button 
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handlePreferenceChange('theme', 'dark')}
                                    aria-pressed={preferences?.theme === 'dark' || !preferences?.theme}
                                    className={preferences?.theme === 'dark' || !preferences?.theme ? 'bg-pl-surface text-pl-text shadow-pl-sm' : 'text-pl-muted'}
                                >
                                    <Moon className="w-4 h-4 mr-2" /> Dark
                                </Button>
                                <Button 
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handlePreferenceChange('theme', 'system')}
                                    aria-pressed={preferences?.theme === 'system'}
                                    className={preferences?.theme === 'system' ? 'bg-pl-surface text-pl-text shadow-pl-sm' : 'text-pl-muted'}
                                >
                                    <Monitor className="w-4 h-4 mr-2" /> System
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        {/* Language */}
                        <div className="grid gap-4 sm:grid-cols-2">
                             <div className="space-y-2">
                                <Label>Language</Label>
                                <Select 
                                    value={preferences?.language || 'en'} 
                                    onValueChange={(val) => handlePreferenceChange('language', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English (US)</SelectItem>
                                        <SelectItem value="es">Spanish</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                        <SelectItem value="de">German</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Timezone</Label>
                                <Select 
                                    value={preferences?.timezone || 'UTC'} 
                                    onValueChange={(val) => handlePreferenceChange('timezone', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select timezone" />
                                    </SelectTrigger>
                                    <SelectContent className="h-60">
                                        <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                                        <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                                        <SelectItem value="America/Chicago">Central Time (US & Canada)</SelectItem>
                                        <SelectItem value="America/Denver">Mountain Time (US & Canada)</SelectItem>
                                        <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                                        <SelectItem value="Europe/London">London</SelectItem>
                                        <SelectItem value="Europe/Paris">Paris</SelectItem>
                                        <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </TabsContent>

        {/* --- NOTIFICATIONS TAB --- */}
        <TabsContent value="notifications" className="space-y-6">
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-pl-text">Notification Preferences</CardTitle>
                        <CardDescription>Control how and when you receive alerts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base text-pl-text">Email Notifications</Label>
                                <p className="text-sm text-pl-muted">Receive important updates via email.</p>
                            </div>
                            <Switch 
                                checked={preferences?.email_notifications ?? true}
                                onCheckedChange={(val) => handlePreferenceChange('email_notifications', val)}
                            />
                        </div>
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base text-pl-text">In-App Notifications</Label>
                                <p className="text-sm text-pl-muted">Show alerts within the dashboard interface.</p>
                            </div>
                            <Switch 
                                checked={preferences?.in_app_notifications ?? true}
                                onCheckedChange={(val) => handlePreferenceChange('in_app_notifications', val)}
                            />
                        </div>
                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base text-pl-text">System Alerts</Label>
                                <p className="text-sm text-pl-muted">Critical system health and maintenance notices.</p>
                            </div>
                            <Switch 
                                checked={preferences?.system_alerts ?? true}
                                onCheckedChange={(val) => handlePreferenceChange('system_alerts', val)}
                            />
                        </div>
                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base text-pl-text">Weekly Digest</Label>
                                <p className="text-sm text-pl-muted">A summary of your activity sent every Monday.</p>
                            </div>
                            <Switch 
                                checked={preferences?.weekly_digest ?? false}
                                onCheckedChange={(val) => handlePreferenceChange('weekly_digest', val)}
                            />
                        </div>

                    </CardContent>
                </Card>
            </motion.div>
        </TabsContent>

        {/* --- PRIVACY TAB --- */}
        <TabsContent value="privacy" className="space-y-6">
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-pl-text">Privacy Controls</CardTitle>
                        <CardDescription>Manage your data visibility and sharing options.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         
                         <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Profile Visibility</Label>
                                <Select 
                                    value={preferences?.profile_visibility || 'private'} 
                                    onValueChange={(val) => handlePreferenceChange('profile_visibility', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select visibility" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">Public (Visible to everyone)</SelectItem>
                                        <SelectItem value="organization">Organization Only</SelectItem>
                                        <SelectItem value="private">Private (Only me)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                         </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base text-pl-text">Activity Logging</Label>
                                <p className="text-sm text-pl-muted">Allow us to log detailed usage analytics to improve features.</p>
                            </div>
                            <Switch 
                                checked={preferences?.activity_logging ?? true}
                                onCheckedChange={(val) => handlePreferenceChange('activity_logging', val)}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base text-pl-text">Data Sharing</Label>
                                <p className="text-sm text-pl-muted">Share anonymized data with partners for research.</p>
                            </div>
                            <Switch 
                                checked={preferences?.data_sharing ?? false}
                                onCheckedChange={(val) => handlePreferenceChange('data_sharing', val)}
                            />
                        </div>

                    </CardContent>
                </Card>
            </motion.div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default SettingsPage;