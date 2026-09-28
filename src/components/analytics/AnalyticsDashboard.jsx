import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend
} from 'recharts';
import { ChartPanel } from '@/components/ui/chart-panel';
import ChartFrame from '@/components/charts/ChartFrame';
import { GRID_STYLE, PINNED_TOOLTIP_PROPS, LEGEND_PROPS } from '@/utils/chartTheme';
import { seriesColor, AXIS_TICK } from '@/utils/chartSvg';
import { Users, GraduationCap, CheckCircle, Award, Activity } from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import { KPICard } from '@/components/charts/DashboardWidgets';
import { Loader2 } from 'lucide-react';

const CHART_MARGIN = { top: 10, right: 10, left: -10, bottom: 0 };

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [charts, setCharts] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [metricData, chartData] = await Promise.all([
          analyticsService.getDashboardMetrics(),
          analyticsService.getChartsData()
        ]);
        setMetrics(metricData);
        setCharts(chartData);
      } catch (error) {
        console.error("Dashboard load failed", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-pl-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Users"
          value={metrics?.totalUsers}
          icon={Users}
          tone="info"
        />
        <KPICard
          title="Enrollments"
          value={metrics?.totalEnrollments}
          icon={GraduationCap}
        />
        <KPICard
          title="Active Enrollments"
          value={metrics?.activeEnrollments}
          icon={CheckCircle}
          tone="success"
        />
        <KPICard
          title="Live Certificates"
          value={metrics?.certificatesIssued}
          icon={Award}
          tone="accent"
        />
        <KPICard
          title="Active Users (30d)"
          value={metrics?.activeUsers}
          icon={Activity}
          tone="info"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth */}
        <ChartPanel title="User Growth Trend" className="lg:col-span-2">
          <ChartFrame height={280}>
            <LineChart data={charts?.userGrowth} margin={CHART_MARGIN}>
              <CartesianGrid {...GRID_STYLE} vertical={false} />
              <XAxis dataKey="name" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} />
              <Tooltip {...PINNED_TOOLTIP_PROPS} />
              <Line type="monotone" dataKey="value" stroke={seriesColor(0)} strokeWidth={3} dot={{ r: 4, fill: seriesColor(0) }} />
            </LineChart>
          </ChartFrame>
        </ChartPanel>

        {/* Enrollment Status */}
        <ChartPanel title="Enrollment Status">
          <ChartFrame height={280}>
            <PieChart>
              <Pie
                data={charts?.enrollmentStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {charts?.enrollmentStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={seriesColor(index)} />
                ))}
              </Pie>
              <Tooltip {...PINNED_TOOLTIP_PROPS} />
              <Legend {...LEGEND_PROPS} />
            </PieChart>
          </ChartFrame>
        </ChartPanel>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Users Area */}
        <ChartPanel title="Daily Activity (Session Events, 14 Days)">
          <ChartFrame height={280}>
            <AreaChart data={charts?.activeUsersTrend} margin={CHART_MARGIN}>
              <defs>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={seriesColor(1)} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={seriesColor(1)} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID_STYLE} vertical={false} />
              <XAxis dataKey="name" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} />
              <Tooltip {...PINNED_TOOLTIP_PROPS} />
              <Area type="monotone" dataKey="value" stroke={seriesColor(1)} fillOpacity={1} fill="url(#colorActive)" />
            </AreaChart>
          </ChartFrame>
        </ChartPanel>

        {/* Enrollments by Door */}
        <ChartPanel title="Enrollments by Door">
          <ChartFrame height={280}>
            <BarChart data={charts?.enrollmentsByDoor} margin={CHART_MARGIN}>
              <CartesianGrid {...GRID_STYLE} vertical={false} />
              <XAxis dataKey="name" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} />
              <Tooltip {...PINNED_TOOLTIP_PROPS} cursor={{ fill: 'rgba(15,23,42,0.04)' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {charts?.enrollmentsByDoor.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={seriesColor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ChartFrame>
        </ChartPanel>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;