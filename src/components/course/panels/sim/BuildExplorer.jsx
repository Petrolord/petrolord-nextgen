import React, { useMemo, useState } from 'react';
import {
  deviatedPath, validationCases, gridSummary, datumDepthFt, DESIGN,
} from './simLab';
import { PanelShell, Tile, TileGrid, Note, SelectField } from '@/components/course/panels/petrophysics/panelKit';
import { useThemeClass } from '@/design/themeClass';
import SvgChartFrame from '@/components/charts/SvgChartFrame';
import { seriesColor, SVG_CHART } from '@/utils/chartSvg';

// Build explorer: the two things the Expert tier actually does. Trajectory
// mode intersects a well path against the grid and shows the connection list
// that comes back, which is a RESULT rather than a hand-written COMPDAT.
// Validation mode shows what the validator refuses, one rule at a time.

const CELL = 13;
const fmt = (v, d = 4) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d }) : '-');

const BuildExplorer = () => {
  const tc = useThemeClass();
  const [mode, setMode] = useState('trajectory');
  const [toX, setToX] = useState(DESIGN.deviated.to.x);
  const [toY, setToY] = useState(DESIGN.deviated.to.y);

  const out = useMemo(() => {
    try {
      return {
        grid: gridSummary(),
        path: deviatedPath({ to: { x: toX, y: toY } }),
        cases: validationCases(),
        datum: datumDepthFt(),
      };
    } catch (e) {
      return { error: e.message };
    }
  }, [toX, toY]);

  if (out.error) {
    return <PanelShell title="Build explorer"><Note>{out.error}</Note></PanelShell>;
  }

  const { grid, path, cases, datum } = out;
  const touched = new Set(path.connections.map((c) => `${c.i},${c.j}`));
  const iMin = 12;
  const jMin = 14;
  const span = 14;

  return (
    <PanelShell
      title="Build explorer"
      subtitle="A trajectory becomes a connection list, and a broken spec becomes a refusal with a reason."
    >
      <div className="grid gap-4 sm:grid-cols-3 items-end">
        <SelectField
          label="Mode"
          value={mode}
          onChange={setMode}
          options={[['trajectory', 'Trajectory to connections'], ['validation', 'What the validator refuses']]}
        />
        {mode === 'trajectory' && (
          <>
            <div>
              <p className={tc('text-gray-400 text-xs mb-1', 'text-pl-muted text-xs mb-1')}>Toe easting: <span className={tc('text-white', 'text-pl-text')}>{toX} m</span></p>
              <input
                type="range" min={1200} max={2600} step={100} value={toX}
                onChange={(e) => setToX(Number(e.target.value))}
                className={tc('w-full accent-[#BFFF00]', 'w-full accent-pl-primary')}
              />
            </div>
            <div>
              <p className={tc('text-gray-400 text-xs mb-1', 'text-pl-muted text-xs mb-1')}>Toe northing: <span className={tc('text-white', 'text-pl-text')}>{toY} m</span></p>
              <input
                type="range" min={1200} max={2700} step={100} value={toY}
                onChange={(e) => setToY(Number(e.target.value))}
                className={tc('w-full accent-[#BFFF00]', 'w-full accent-pl-primary')}
              />
            </div>
          </>
        )}
      </div>

      {mode === 'trajectory' ? (
        <>
          <TileGrid>
            <Tile label="Connections" value={fmt(path.connections.length, 0)} />
            <Tile label="Distinct columns" value={fmt(path.distinctColumns, 0)} />
            <Tile label="Heel cell" value={path.fromCell ? `(${path.fromCell.i}, ${path.fromCell.j})` : '-'} />
            <Tile label="Toe cell" value={path.toCell ? `(${path.toCell.i}, ${path.toCell.j})` : '-'} />
          </TileGrid>

          <SvgChartFrame width={span * CELL + 2} height={span * CELL + 2} label="Cells the trajectory crosses" maxWidth={360}>
              {Array.from({ length: span * span }, (_, idx) => {
                const i = iMin + (idx % span);
                const j = jMin + Math.floor(idx / span);
                const hit = touched.has(`${i},${j}`);
                return (
                  <rect
                    key={idx}
                    x={(i - iMin) * CELL + 1}
                    y={(jMin + span - 1 - j) * CELL + 1}
                    width={CELL}
                    height={CELL}
                    fill={hit ? seriesColor(0) : SVG_CHART.plate}
                    stroke={SVG_CHART.grid}
                    strokeWidth={0.6}
                  />
                );
              })}
          </SvgChartFrame>

          <div className="overflow-x-auto">
            <table className={tc('w-full text-xs text-gray-300', 'w-full text-xs text-pl-text')}>
              <thead className={tc('text-gray-500', 'text-pl-muted')}>
                <tr><th className="text-left py-1">i</th><th className="text-left">j</th><th className="text-left">k</th><th className="text-right">Length (ft)</th><th className="text-left pl-3">Dir</th></tr>
              </thead>
              <tbody>
                {path.connections.map((c) => (
                  <tr key={`${c.i}-${c.j}-${c.k}`}>
                    <td className="py-0.5">{c.i}</td><td>{c.j}</td><td>{c.k}</td>
                    <td className="text-right">{fmt(c.lengthFt, 2)}</td>
                    <td className="pl-3">{c.dir}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Note>
            Move the toe and the connection list moves with it. COMPDAT item 13 carries the direction the
            path crossed each cell, which is why a horizontal leg reads X or Y where a vertical one reads Z.
          </Note>
        </>
      ) : (
        <>
          <TileGrid>
            <Tile label="Rules exercised" value={fmt(cases.length, 0)} />
            <Tile label="Grid cells" value={fmt(grid.cellCount, 0)} />
            <Tile label="Datum depth" value={fmt(datum, 2)} unit="ft" />
            <Tile label="Layers" value={fmt(grid.nz, 0)} />
          </TileGrid>
          <div className="space-y-2">
            {cases.map((c) => (
              <div key={c.case} className={tc('rounded border border-gray-700 bg-black/30 p-2', 'rounded border border-pl-border bg-pl-sunken p-2')}>
                <p className={tc('text-xs text-[#BFFF00] mb-1', 'text-xs text-pl-primary-text mb-1')}>{c.case}</p>
                {c.errors.map((e) => (
                  <p key={e} className={tc('text-xs text-gray-400 mb-0', 'text-xs text-pl-muted mb-0')}>{e}</p>
                ))}
              </div>
            ))}
          </div>
          <Note>
            Each broken spec isolates ONE rule, so the count is a fact about the validator rather than
            about how badly a spec can be mangled. None of these is a warning: every one stops the deck.
          </Note>
        </>
      )}
    </PanelShell>
  );
};

export default BuildExplorer;
