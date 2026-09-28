import React, { useId } from 'react';
import { Download } from 'lucide-react';
import ChartLogo from '@/components/charts/ChartLogo';
import { exportChartAsImage } from '@/utils/chartExport';
import { SVG_CHART } from '@/utils/chartSvg';

/**
 * ChartFrame for a hand-made SVG plot (NextGen batch 1B). The same white
 * surface, footer band for the ChartLogo watermark, optional header and PNG
 * export as ChartFrame, with an <svg> in place of Recharts' container:
 *
 *   <SvgChartFrame width={W} height={H} label="Porosity and temperature with depth" minWidth={460}>
 *     <line {...GRID_LINE_PROPS} x1={...} ... />
 *     <polyline points={pts} fill="none" stroke={seriesColor(0)} strokeWidth="1.8" />
 *   </SvgChartFrame>
 *
 * `width` and `height` are the viewBox; the svg scales to the frame's width.
 * `label` is the accessible name (role="img"). `minWidth` keeps a wide plot
 * legible on a phone: the plot scrolls sideways inside the frame. `maxWidth`
 * stops a small plot from stretching (and its text from growing) on a wide
 * screen; the plot is centred. The white plate is drawn for you. `svgProps` go on the <svg> element.
 */
const DEFAULT_LOGO_HEIGHT = 40;

const SvgChartFrame = ({
  width, height, label, minWidth = null, maxWidth = null, className = '', exportFilename = null,
  logoHeight = DEFAULT_LOGO_HEIGHT, header = null, svgProps = {}, children,
}) => {
  const frameId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const elementId = `chart-frame-${frameId}`;
  const svg = (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label={label}
      style={minWidth || maxWidth ? { minWidth: minWidth || undefined, maxWidth: maxWidth || undefined, margin: maxWidth ? '0 auto' : undefined, display: maxWidth ? 'block' : undefined } : undefined}
      {...svgProps}>
      <rect x="0" y="0" width={width} height={height} fill={SVG_CHART.plate} />
      {children}
    </svg>
  );
  return (
    <div
      data-canvas="chart"
      className={`relative bg-white rounded-b-lg ${className}`}
      style={{ paddingBottom: logoHeight + 20 }}
      id={exportFilename ? elementId : undefined}
    >
      {header && (
        <p className="chart-frame-header px-3 pt-2 pr-10 text-[11px] leading-snug text-slate-600">{header}</p>
      )}
      {minWidth ? <div className="overflow-x-auto">{svg}</div> : svg}
      <ChartLogo style={{ height: `${logoHeight}px`, bottom: '10px', opacity: 0.55 }} />
      {exportFilename && (
        <button
          type="button"
          onClick={() => exportChartAsImage(elementId, exportFilename)}
          title="Download chart as PNG"
          aria-label="Download chart as PNG"
          className="absolute top-2 right-2 p-1.5 rounded border border-slate-200 bg-white/90 text-slate-500 hover:text-slate-800 hover:bg-white shadow-sm"
        >
          <Download className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default SvgChartFrame;
