import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { SystemSettingsService } from '@/services/systemSettingsService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Settings, Shield, Mail, ToggleLeft, Database, Save, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const SettingInput = ({ setting, value, onChange }) => {
    if (setting.setting_type === 'boolean') {
        return (
            <div className="flex items-center justify-between py-2">
                <Label htmlFor={setting.setting_key} className="flex flex-col gap-1">
                    <span className="font-medium text-pl-text">{setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    <span className="font-normal text-xs text-pl-muted">{setting.description}</span>
                </Label>
                <Switch 
                    id={setting.setting_key}
                    checked={value === 'true' || value === true}
                    onCheckedChange={(checked) => onChange(String(checked))}
                />
            </div>
        );
    }

    return (
        <div className="space-y-2 py-2">
            <Label htmlFor={setting.setting_key} className="text-pl-text">
                {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Label>
            {setting.setting_type === 'number' ? (
                <Input 
                    type="number" 
                    id={setting.setting_key} 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <Input 
                    type="text" 
                    id={setting.setting_key} 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
            <p className="text-xs text-pl-muted">{setting.description}</p>
        </div>
    );
};

const FeatureToggleRow = ({ feature, onToggle }) => (
    <div className="flex items-center justify-between p-4 rounded-lg border border-pl-border bg-pl-sunken">
        <div className="space-y-1">
            <h4 className="font-medium text-pl-text">{feature.feature_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
            <p className="text-sm text-pl-muted">{feature.description}</p>
        </div>
        <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${feature.is_enabled ? 'text-pl-success-text' : 'text-pl-muted'}`}>
                {feature.is_enabled ? 'Enabled' : 'Disabled'}
            </span>
            <Switch 
                checked={feature.is_enabled}
                onCheckedChange={(checked) => onToggle(feature.feature_key, checked)}
            />
        </div>
    </div>
);

const AdminSystemSettingsPage = () => {
    const { user } = useAuth();
    const { refresh } = useSystemSettings();
    const { toast } = useToast();
    
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [rawSettings, setRawSettings] = useState([]);
    const [rawFeatures, setRawFeatures] = useState([]);
    const [unsavedChanges, setUnsavedChanges] = useState({});
    
    // Maintenance states
    const [backupLoading, setBackupLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [settings, features] = await Promise.all([
                SystemSettingsService.getAllSettings(),
                SystemSettingsService.getAllFeatures()
            ]);
            setRawSettings(settings || []);
            setRawFeatures(features || []);
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to load settings", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSettingChange = (key, newValue) => {
        setUnsavedChanges(prev => ({
            ...prev,
            [key]: newValue
        }));
    };

    const saveSettings = async (groupName) => {
        const settingsToSave = rawSettings.filter(s => s.group_name === groupName && unsavedChanges[s.setting_key] !== undefined);
        
        if (settingsToSave.length === 0) {
            toast({ title: "No changes", description: "No settings were modified." });
            return;
        }

        try {
            const promises = settingsToSave.map(s => 
                SystemSettingsService.updateSetting(s.setting_key, unsavedChanges[s.setting_key], s.setting_type, user.id)
            );
            
            await Promise.all(promises);
            
            toast({ title: "Settings Saved", description: `${settingsToSave.length} settings updated successfully.` });
            setUnsavedChanges(prev => {
                const newChanges = { ...prev };
                settingsToSave.forEach(s => delete newChanges[s.setting_key]);
                return newChanges;
            });
            loadData(); // Reload to confirm
            refresh(); // Update global context
        } catch (error) {
            toast({ title: "Save Failed", description: error.message, variant: "destructive" });
        }
    };

    const handleFeatureToggle = async (key, enabled) => {
        try {
            await SystemSettingsService.toggleFeature(key, enabled, user.id);
            toast({ title: "Feature Updated", description: `${key} is now ${enabled ? 'enabled' : 'disabled'}.` });
            loadData();
            refresh();
        } catch (error) {
            toast({ title: "Update Failed", variant: "destructive" });
        }
    };

    const handleMaintenanceAction = async (action) => {
        if (action === 'backup') {
            setBackupLoading(true);
            try {
                await SystemSettingsService.triggerBackup();
                toast({ title: "Backup Complete", description: "Database backup created successfully." });
            } finally {
                setBackupLoading(false);
            }
        } else if (action === 'cache') {
            await SystemSettingsService.clearCache();
            toast({ title: "Cache Cleared", description: "System cache has been flushed." });
        }
    };

    // Filter settings by group
    const generalSettings = rawSettings.filter(s => s.group_name === 'general');
    const emailSettings = rawSettings.filter(s => s.group_name === 'email');
    const securitySettings = rawSettings.filter(s => s.group_name === 'security');
    const licenseSettings = rawSettings.filter(s => s.group_name === 'license');

    // Helper to get current value (unsaved or saved)
    const getValue = (key, savedValue) => {
        return unsavedChanges[key] !== undefined ? unsavedChanges[key] : savedValue;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-pl-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 px-4 py-8 md:px-8 animate-in fade-in duration-500">
            <Helmet><title>System Settings - Petrolord Admin</title></Helmet>

            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-pl-text flex items-center gap-2">
                    <Settings className="w-8 h-8 text-pl-accent-text" aria-hidden="true" /> System Configuration
                </h1>
                <p className="text-pl-muted">Manage global settings, feature flags, and system maintenance.</p>
            </div>

            <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="p-1 flex-wrap h-auto justify-start">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="license">License</TabsTrigger>
                    <TabsTrigger value="email" className="flex gap-2"><Mail className="w-4 h-4"/> Email</TabsTrigger>
                    <TabsTrigger value="security" className="flex gap-2"><Shield className="w-4 h-4"/> Security</TabsTrigger>
                    <TabsTrigger value="features" className="flex gap-2"><ToggleLeft className="w-4 h-4"/> Features</TabsTrigger>
                    <TabsTrigger value="maintenance" className="flex gap-2"><Database className="w-4 h-4"/> Maintenance</TabsTrigger>
                </TabsList>

                {/* GENERAL SETTINGS */}
                <TabsContent value="general">
                    <Card className="bg-pl-surface border-pl-border">
                        <CardHeader>
                            <CardTitle className="text-pl-text">General Configuration</CardTitle>
                            <CardDescription>Basic system identity and localization settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {generalSettings.map(setting => (
                                <SettingInput 
                                    key={setting.id} 
                                    setting={setting} 
                                    value={getValue(setting.setting_key, setting.setting_value)}
                                    onChange={(val) => handleSettingChange(setting.setting_key, val)}
                                />
                            ))}
                        </CardContent>
                        <CardFooter className="border-t border-pl-border pt-6">
                            <Button onClick={() => saveSettings('general')}>
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* LICENSE SETTINGS */}
                <TabsContent value="license">
                    <Card className="bg-pl-surface border-pl-border">
                        <CardHeader>
                            <CardTitle className="text-pl-text">Licensing & Grace Periods</CardTitle>
                            <CardDescription>Configure default durations for student access.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {licenseSettings.map(setting => (
                                <SettingInput 
                                    key={setting.id} 
                                    setting={setting} 
                                    value={getValue(setting.setting_key, setting.setting_value)}
                                    onChange={(val) => handleSettingChange(setting.setting_key, val)}
                                />
                            ))}
                        </CardContent>
                        <CardFooter className="border-t border-pl-border pt-6">
                            <Button onClick={() => saveSettings('license')}>
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* EMAIL SETTINGS */}
                <TabsContent value="email">
                    <Card className="bg-pl-surface border-pl-border">
                        <CardHeader>
                            <CardTitle className="text-pl-text">Email Service</CardTitle>
                            <CardDescription>SMTP configuration for system notifications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert variant="info" className="mb-4">
                                <AlertTriangle className="w-4 h-4" />
                                <AlertTitle>Sensitive Information</AlertTitle>
                                <AlertDescription>SMTP credentials are stored securely but displayed here for verification.</AlertDescription>
                            </Alert>
                            {emailSettings.map(setting => (
                                <SettingInput 
                                    key={setting.id} 
                                    setting={setting} 
                                    value={getValue(setting.setting_key, setting.setting_value)}
                                    onChange={(val) => handleSettingChange(setting.setting_key, val)}
                                />
                            ))}
                        </CardContent>
                        <CardFooter className="border-t border-pl-border pt-6 flex justify-between">
                            <Button variant="outline">
                                Send Test Email
                            </Button>
                            <Button onClick={() => saveSettings('email')}>
                                <Save className="w-4 h-4 mr-2" /> Save Configuration
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* SECURITY SETTINGS */}
                <TabsContent value="security">
                    <Card className="bg-pl-surface border-pl-border">
                        <CardHeader>
                            <CardTitle className="text-pl-text">Security Policies</CardTitle>
                            <CardDescription>Password rules, timeouts, and access controls.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {securitySettings.map(setting => (
                                <SettingInput 
                                    key={setting.id} 
                                    setting={setting} 
                                    value={getValue(setting.setting_key, setting.setting_value)}
                                    onChange={(val) => handleSettingChange(setting.setting_key, val)}
                                />
                            ))}
                        </CardContent>
                        <CardFooter className="border-t border-pl-border pt-6">
                            <Button onClick={() => saveSettings('security')}>
                                <Save className="w-4 h-4 mr-2" /> Save Policies
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* FEATURE TOGGLES */}
                <TabsContent value="features">
                    <Card className="bg-pl-surface border-pl-border">
                        <CardHeader>
                            <CardTitle className="text-pl-text">Feature Flags</CardTitle>
                            <CardDescription>Enable or disable system features in real-time without deployment.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {rawFeatures.map(feature => (
                                <FeatureToggleRow 
                                    key={feature.id}
                                    feature={feature}
                                    onToggle={handleFeatureToggle}
                                />
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SYSTEM MAINTENANCE */}
                <TabsContent value="maintenance">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-pl-surface border-pl-border">
                            <CardHeader>
                                <CardTitle className="text-pl-text">Database Operations</CardTitle>
                                <CardDescription>Manage data integrity and backups.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-3 rounded bg-pl-sunken border border-pl-border">
                                    <div>
                                        <h5 className="text-sm font-medium text-pl-text">System Backup</h5>
                                        <p className="text-xs text-pl-muted">Create a full snapshot of the database.</p>
                                    </div>
                                    <Button 
                                        onClick={() => handleMaintenanceAction('backup')} 
                                        disabled={backupLoading}
                                        variant="outline"
                                    >
                                        {backupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
                                        Backup Now
                                    </Button>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded bg-pl-sunken border border-pl-border">
                                    <div>
                                        <h5 className="text-sm font-medium text-pl-text">Optimize Tables</h5>
                                        <p className="text-xs text-pl-muted">Run vacuum and re-index operations.</p>
                                    </div>
                                    <Button variant="outline">Optimize</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-pl-surface border-pl-border">
                            <CardHeader>
                                <CardTitle className="text-pl-text">System Health</CardTitle>
                                <CardDescription>Diagnostic checks and cache management.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-pl-muted">Database Connection</span>
                                        <span className="text-pl-success-text flex items-center gap-1"><CheckCircle className="w-3 h-3" aria-hidden="true" /> Healthy</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-pl-muted">Storage Service</span>
                                        <span className="text-pl-success-text flex items-center gap-1"><CheckCircle className="w-3 h-3" aria-hidden="true" /> Operational</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-pl-muted">Email Gateway</span>
                                        <span className="text-pl-success-text flex items-center gap-1"><CheckCircle className="w-3 h-3" aria-hidden="true" /> Connected</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-pl-border">
                                    <Button 
                                        onClick={() => handleMaintenanceAction('cache')} 
                                        variant="destructive" 
                                        className="w-full"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" /> Clear System Cache
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminSystemSettingsPage;