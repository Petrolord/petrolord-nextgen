import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { ChartPanel } from '@/components/ui/chart-panel';
import ChartFrame from '@/components/charts/ChartFrame';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GRID_STYLE, PINNED_TOOLTIP_PROPS, LEGEND_PROPS } from '@/utils/chartTheme';
import { seriesColor, AXIS_TICK } from '@/utils/chartSvg';

// Admin dashboard widgets (batch 2C). Every screen that uses them is in 2C
// (admin roles, /dashboard/analytics, /dashboard/compliance), so they are on
// the theme roles only. Charts follow the white family standard: a ChartPanel
// card with a ChartFrame (white plate, Petrolord mark), the chart theme's grid,
// ticks and tooltip, and series colours from seriesColor(n).

const AXIS_PROPS = { tick: AXIS_TICK, tickLine: false, axisLine: false };
const CHART_MARGIN = { top: 10, right: 10, left: -10, bottom: 0 };

// Icon chip tints. Colour here marks a status only where the card's title or
// subtext says it in words (a danger chip on "Active Alerts", for example).
const KPI_TONES = {
  primary: 'bg-pl-primary/10 text-pl-primary-text',
  accent: 'bg-pl-accent/15 text-pl-accent-text',
  info: 'bg-pl-info-bg text-pl-info-text',
  success: 'bg-pl-success-bg text-pl-success-text',
  warning: 'bg-pl-warning-bg text-pl-warning-text',
  danger: 'bg-pl-danger-bg text-pl-danger-text',
  neutral: 'bg-pl-sunken text-pl-muted',
};

// --- KPI Card ---
export const KPICard = ({ title, value, subtext, trend, icon: Icon, tone = 'primary' }) => {
  let TrendIcon = Minus;
  let trendColor = 'text-pl-muted';
  let trendWord = 'no change';

  if (trend > 0) {
    TrendIcon = ArrowUp;
    trendColor = 'text-pl-success-text';
    trendWord = 'up';
  } else if (trend < 0) {
    TrendIcon = ArrowDown;
    trendColor = 'text-pl-danger-text';
    trendWord = 'down';
  }

  return (
    <Card className="transition-all hover:border-pl-border-strong">
      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-pl-muted">{title}</p>
            <h3 className="text-2xl font-bold text-pl-text mt-2 tabular-nums">{value ?? 'n/a'}</h3>
          </div>
          <div className={cn('p-2 rounded-lg shrink-0', KPI_TONES[tone] || KPI_TONES.primary)}>
            {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
          </div>
        </div>
        {(subtext || trend !== undefined) && (
          <div className="flex items-center mt-4 text-xs">
            {trend !== undefined && (
              <span className={cn('flex items-center font-medium mr-2', trendColor)}>
                <TrendIcon className="w-3 h-3 mr-1" aria-hidden="true" />
                <span className="sr-only">{trendWord} </span>
                {Math.abs(trend)}%
              </span>
            )}
            <span className="text-pl-muted">{subtext}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- Bar Chart Widget ---
export const BarChartWidget = ({ title, data, dataKey, xKey = 'name', color = seriesColor(0), height = 300 }) => (
  <ChartPanel title={title} className="h-full">
    <ChartFrame height={height}>
      <BarChart data={data} margin={CHART_MARGIN}>
        <CartesianGrid {...GRID_STYLE} vertical={false} />
        <XAxis dataKey={xKey} {...AXIS_PROPS} />
        <YAxis {...AXIS_PROPS} />
        <Tooltip {...PINNED_TOOLTIP_PROPS} cursor={{ fill: 'rgba(15,23,42,0.04)' }} />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartFrame>
  </ChartPanel>
);

// --- Line Chart Widget ---
export const LineChartWidget = ({ title, data, lines = [], xKey = 'name', height = 300 }) => (
  <ChartPanel title={title} className="h-full">
    <ChartFrame height={height}>
      <LineChart data={data} margin={CHART_MARGIN}>
        <CartesianGrid {...GRID_STYLE} vertical={false} />
        <XAxis dataKey={xKey} {...AXIS_PROPS} />
        <YAxis {...AXIS_PROPS} />
        <Tooltip {...PINNED_TOOLTIP_PROPS} />
        <Legend {...LEGEND_PROPS} />
        {lines.map((line, index) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.name}
            stroke={line.color || seriesColor(index)}
            strokeWidth={2}
            dot={{ r: 3, fill: line.color || seriesColor(index) }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ChartFrame>
  </ChartPanel>
);

// --- Area Chart Widget ---
export const AreaChartWidget = ({ title, data, dataKey, xKey = 'name', color = seriesColor(0), height = 300 }) => (
  <ChartPanel title={title} className="h-full">
    <ChartFrame height={height}>
      <AreaChart data={data} margin={CHART_MARGIN}>
        <defs>
          <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey={xKey} {...AXIS_PROPS} />
        <YAxis {...AXIS_PROPS} />
        <CartesianGrid {...GRID_STYLE} vertical={false} />
        <Tooltip {...PINNED_TOOLTIP_PROPS} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          fillOpacity={1}
          fill={`url(#color${dataKey})`}
        />
      </AreaChart>
    </ChartFrame>
  </ChartPanel>
);

// --- Pie Chart Widget ---
export const PieChartWidget = ({ title, data, dataKey = 'value', nameKey = 'name', height = 300 }) => (
  <ChartPanel title={title} className="h-full">
    <ChartFrame height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={seriesColor(index)} />
          ))}
        </Pie>
        <Tooltip {...PINNED_TOOLTIP_PROPS} />
        <Legend {...LEGEND_PROPS} />
      </PieChart>
    </ChartFrame>
  </ChartPanel>
);
