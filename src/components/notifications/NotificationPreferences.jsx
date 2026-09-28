import React, { useState, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Mail, ShieldAlert } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Design system (batch 2A): rendered only by NotificationCenter on
// /dashboard/notifications, inside the signed-in scope, on theme roles.
const NotificationPreferences = () => {
    const { preferences, updatePreferences } = useNotifications();
    const { toast } = useToast();
    const [localPrefs, setLocalPrefs] = useState({
        email_notifications: true,
        in_app_notifications: true,
        report_sent_notifications: true,
        report_failed_notifications: true
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (preferences) {
            setLocalPrefs(preferences);
        }
    }, [preferences]);

    const handleToggle = (key) => {
        setLocalPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updatePreferences(localPrefs);
            toast({
                title: "Preferences Saved",
                description: "Your notification settings have been updated.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save preferences.",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-pl-text">
                        <Mail className="h-5 w-5 text-pl-primary-text" aria-hidden="true" /> Delivery Channels
                    </CardTitle>
                    <CardDescription>Choose how you want to receive notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                            <Label className="text-base text-pl-text">Email Notifications</Label>
                            <p className="text-sm text-pl-muted">Receive critical alerts via email.</p>
                        </div>
                        <Switch 
                            checked={localPrefs.email_notifications}
                            onCheckedChange={() => handleToggle('email_notifications')}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                            <Label className="text-base text-pl-text">In-App Notifications</Label>
                            <p className="text-sm text-pl-muted">Show alerts within the dashboard.</p>
                        </div>
                        <Switch 
                            checked={localPrefs.in_app_notifications}
                            onCheckedChange={() => handleToggle('in_app_notifications')}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-pl-text">
                        <ShieldAlert className="h-5 w-5 text-pl-accent-text" aria-hidden="true" /> Alert Types
                    </CardTitle>
                    <CardDescription>Customize which events trigger a notification.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                            <Label className="text-base text-pl-text">Report Completions</Label>
                            <p className="text-sm text-pl-muted">Notify when generated reports are ready.</p>
                        </div>
                        <Switch 
                            checked={localPrefs.report_sent_notifications}
                            onCheckedChange={() => handleToggle('report_sent_notifications')}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                            <Label className="text-base text-pl-text">System Errors</Label>
                            <p className="text-sm text-pl-muted">Notify when an operation fails.</p>
                        </div>
                        <Switch 
                            checked={localPrefs.report_failed_notifications}
                            onCheckedChange={() => handleToggle('report_failed_notifications')}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="min-w-[120px] font-semibold"
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
};

export default NotificationPreferences;