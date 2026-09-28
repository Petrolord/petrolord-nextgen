import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDashboardAnalytics } from '@/lib/reportAnalyticsUtils';
import { BarChart, Download, Loader2, FileText, CheckCircle, Hash } from 'lucide-react';
import ActionsTrendChart from '@/components/charts/ActionsTrendChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ChartPanel } from '@/components/ui/chart-panel';
import ChartFrame from '@/components/charts/ChartFrame';
import { PINNED_TOOLTIP_PROPS, LEGEND_PROPS } from '@/utils/chartTheme';
import { seriesColor } from '@/utils/chartSvg';

const DATE_RANGES = {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days',
    'all': 'All Time',
};

const AdminReportAnalyticsPage = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [dateRangeKey, setDateRangeKey] = useState('30d');
    const [analyticsData, setAnalyticsData] = useState(null);

    const getDateRange = useCallback(() => {
        if (dateRangeKey === 'all') return null;
        const to = new Date();
        const from = new Date();
        switch (dateRangeKey) {
            case '7d': from.setDate(to.getDate() - 7); break;
            case '90d': from.setDate(to.getDate() - 90); break;
            case '30d': default: from.setDate(to.getDate() - 30); break;
        }
        return { from, to };
    }, [dateRangeKey]);
    
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const range = getDateRange();
            const data = await getDashboardAnalytics(range);
            setAnalyticsData(data);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
            setAnalyticsData(null);
        } finally {
            setLoading(false);
        }
    }, [getDateRange, toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleNotImplemented = () => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });

    const renderRecentReports = () => {
        if (!analyticsData?.recentReports || analyticsData.recentReports.length === 0) {
            return <p className="text-pl-muted text-center py-4">No recent reports found for this period.</p>;
        }
        return (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-pl-text">
                    <thead className="text-xs text-pl-muted uppercase bg-pl-sunken">
                        <tr>
                            <th scope="col" className="px-6 py-3">Report Name</th>
                            <th scope="col" className="px-6 py-3">Created By</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Rules Applied</th>
                        </tr>
                    </thead>
                    <tbody>
                        {analyticsData.recentReports.map((report, index) => (
                            <tr key={index} className="border-b border-pl-border hover:bg-pl-sunken/60">
                                <td className="px-6 py-4 font-medium text-pl-text">{report.name.replace(/_/g, ' ')}</td>
                                <td className="px-6 py-4">{report.created_by || 'n/a'}</td>
                                <td className="px-6 py-4">{new Date(report.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{report.rule_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };
    
    return (
        <>
            <Helmet><title>Report Analytics - Petrolord</title></Helmet>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-8 md:px-8">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <h1 className="text-3xl font-bold text-pl-text flex items-center"><BarChart className="mr-3" /> Report Analytics</h1>
                     <div className="flex flex-wrap items-center gap-4">
                        <Select value={dateRangeKey} onValueChange={setDateRangeKey}><SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(DATE_RANGES).map(([key, value]) => (<SelectItem key={key} value={key}>{value}</SelectItem>))}</SelectContent></Select>
                        <Button variant="outline" onClick={handleNotImplemented}><Download className="mr-2 h-4 w-4" /> Export</Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <Loader2 className="w-12 h-12 animate-spin text-pl-primary" />
                    </div>
                ) : analyticsData ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-pl-text">Total Reports Generated</CardTitle><FileText className="h-4 w-4 text-pl-muted" aria-hidden="true" /></CardHeader><CardContent><div className="text-2xl font-bold text-pl-text tabular-nums">{analyticsData.stats.totalReports}</div></CardContent></Card>
                            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-pl-text">Total Anonymization Rules</CardTitle><CheckCircle className="h-4 w-4 text-pl-muted" aria-hidden="true" /></CardHeader><CardContent><div className="text-2xl font-bold text-pl-text tabular-nums">{analyticsData.stats.totalRules}</div></CardContent></Card>
                            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-pl-text">Avg Rules Per Report</CardTitle><Hash className="h-4 w-4 text-pl-muted" aria-hidden="true" /></CardHeader><CardContent><div className="text-2xl font-bold text-pl-text tabular-nums">{analyticsData.stats.avgRulesPerReport}</div></CardContent></Card>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                             <div className="lg:col-span-3">
                                <ActionsTrendChart data={analyticsData.charts.reportsOverTime} loading={false} />
                            </div>
                            <div className="lg:col-span-2">
                                <ChartPanel title="Anonymization Rule Distribution" className="h-full">
                                    <ChartFrame height={240}>
                                        <PieChart>
                                            <Pie data={analyticsData.charts.ruleDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill={seriesColor(0)} label>
                                                {analyticsData.charts.ruleDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={seriesColor(index)} />)}
                                            </Pie>
                                            <Tooltip {...PINNED_TOOLTIP_PROPS} />
                                            <Legend {...LEGEND_PROPS} />
                                        </PieChart>
                                    </ChartFrame>
                                </ChartPanel>
                            </div>
                        </div>

                         <Card>
                            <CardHeader><CardTitle className="text-pl-text">Recent Reports</CardTitle></CardHeader>
                            <CardContent>
                                {renderRecentReports()}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="text-center py-16 text-pl-muted">
                        <p>No analytics data available.</p>
                        <p className="text-sm">Try selecting a different date range or generate some reports.</p>
                    </div>
                )}
            </motion.div>
        </>
    );
};

export default AdminReportAnalyticsPage;