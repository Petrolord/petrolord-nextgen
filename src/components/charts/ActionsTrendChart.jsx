import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';
import { ChartPanel } from '@/components/ui/chart-panel';
import ChartFrame from '@/components/charts/ChartFrame';
import { GRID_STYLE, PINNED_TOOLTIP_PROPS, LEGEND_PROPS } from '@/utils/chartTheme';
import { seriesColor, AXIS_TICK } from '@/utils/chartSvg';

// Batch 2C: the system analytics trend on the white family chart standard.
// Its only user is AdminReportAnalyticsPage, so it is on the roles only.
const ActionsTrendChart = ({ data, loading }) => {
    if (loading) {
        return <div className="h-80 flex justify-center items-center bg-pl-surface border border-pl-border rounded-lg"><Loader2 className="w-8 h-8 animate-spin text-pl-primary" /></div>;
    }
    if (!data || data.length === 0) {
        return <div className="h-80 flex justify-center items-center bg-pl-surface border border-pl-border rounded-lg text-pl-muted">No data available for this period.</div>;
    }

    return (
        <ChartPanel title="Actions Over Time" className="h-full">
            <ChartFrame height={240}>
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid {...GRID_STYLE} />
                    <XAxis dataKey="date" tick={AXIS_TICK} tickLine={false} axisLine={false} />
                    <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} />
                    <Tooltip {...PINNED_TOOLTIP_PROPS} />
                    <Legend {...LEGEND_PROPS} />
                    <Line type="monotone" dataKey="count" name="Actions" stroke={seriesColor(0)} strokeWidth={2} dot={{ r: 4, fill: seriesColor(0) }} activeDot={{ r: 8 }} />
                </LineChart>
            </ChartFrame>
        </ChartPanel>
    );
};

export default ActionsTrendChart;
