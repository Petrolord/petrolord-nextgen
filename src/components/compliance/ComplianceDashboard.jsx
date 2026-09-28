import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auditService } from '@/services/auditService';
import { AlertTriangle, ShieldCheck, Activity, Lock, CheckCircle } from 'lucide-react';
import { KPICard } from '@/components/charts/DashboardWidgets';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const ComplianceDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);
    const [stats, setStats] = useState({
        totalEvents: 0,
        policyViolations: 0,
        failedLogins: 0,
        dataModifications: 0
    });

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const alertsData = await auditService.getComplianceAlerts();
                setAlerts(alertsData);
                
                // Mock stats fetch - in production this would be a real aggregated query
                setStats({
                    totalEvents: 1250,
                    policyViolations: alertsData.length,
                    failedLogins: 45,
                    dataModifications: 320
                });
            } catch (error) {
                console.error("Dashboard load failed", error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    const handleDismissAlert = async (id) => {
        try {
            await auditService.dismissAlert(id);
            setAlerts(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error("Failed to dismiss alert", error);
        }
    };

    if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-pl-primary" /></div>;

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard title="Compliance Score" value="98%" icon={ShieldCheck} tone="success" subtext="System secure" />
                <KPICard title="Active Alerts" value={alerts.length} icon={AlertTriangle} tone={alerts.length > 0 ? "danger" : "neutral"} />
                <KPICard title="Failed Access" value={stats.failedLogins} icon={Lock} tone="warning" />
                <KPICard title="Total Audit Events" value={stats.totalEvents.toLocaleString()} icon={Activity} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Alerts List */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-pl-text flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2 text-pl-danger-text" aria-hidden="true" />
                            Security & Compliance Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {alerts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-pl-muted">
                                <CheckCircle className="w-12 h-12 mb-2 text-pl-success-text" aria-hidden="true" />
                                <p>No active alerts. System is healthy.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {alerts.map(alert => (
                                    <div key={alert.id} className="flex items-start justify-between p-4 rounded-lg bg-pl-danger-bg border border-pl-danger/30">
                                        <div className="flex gap-3">
                                            <AlertTriangle className="w-5 h-5 text-pl-danger-text mt-0.5" aria-hidden="true" />
                                            <div>
                                                <h4 className="font-semibold text-pl-danger-text">{alert.alert_type}</h4>
                                                <p className="text-sm text-pl-text">{alert.message}</p>
                                                <span className="text-xs text-pl-muted mt-1 block">{new Date(alert.created_at).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleDismissAlert(alert.id)}
                                            className="text-pl-muted hover:text-pl-text"
                                        >
                                            Dismiss
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* System Health / Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-pl-text">System Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-pl-muted">Database Integrity</span>
                                <span className="text-pl-success-text">Optimal</span>
                            </div>
                            <div className="h-2 bg-pl-sunken rounded-full overflow-hidden">
                                <div className="h-full bg-pl-success w-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-pl-muted">API Latency</span>
                                <span className="text-pl-success-text">45ms</span>
                            </div>
                            <div className="h-2 bg-pl-sunken rounded-full overflow-hidden">
                                <div className="h-full bg-pl-success w-[95%]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-pl-muted">Audit Log Storage</span>
                                <span className="text-pl-text">12% Used</span>
                            </div>
                            <div className="h-2 bg-pl-sunken rounded-full overflow-hidden">
                                <div className="h-full bg-pl-primary w-[12%]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ComplianceDashboard;