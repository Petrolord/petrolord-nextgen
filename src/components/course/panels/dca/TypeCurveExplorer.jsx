import React, { useMemo, useState } from 'react';
import { WELLS, ECON_LIMIT_BOPD, typeCurvePipeline } from './declineLab';
import { PanelShell, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Type-curve explorer: pool producers, normalize by time and peak rate, fit
// one hyperbolic through the pooled cloud, then apply it fixed-b to a target
// well. The point the Professional tier makes: pooling wells with different
// decline character produces a curve that matches NEITHER, and a fixed-b
// match can report an excellent R2 while mis-booking the tail.

const fmt = (v, d = 4) => (Number.isFinite(v) ? Number(v).toFixed(d) : '-');

const TypeCurveExplorer = () => {
  const [pool, setPool] = useState({ 'Ekene-1': false, 'Ekene-3': true, 'Ekene-5': false, 'Ekene-6': true });
  const [target, setTarget] = useState('Ekene-6');

  const poolNames = WELLS.map((w) => w.name).filter((n) => pool[n]);
  const out = useMemo(() => {
    if (poolNames.length < 1) return { tc: null };
    try {
      return typeCurvePipeline(poolNames, target);
    } catch (e) {
      return { error: e.message };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(poolNames), target]);

  return (
    <PanelShell
      title="Type-curve explorer"
      subtitle="normalizeByTimeAndRate + fitTypeCurve + applyTypeCurve over the primary windows (the real engine)."
    >
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <p className="text-gray-400 text-xs mb-1">Pool (normalized together)</p>
          <div className="flex gap-3">
            {WELLS.map((w) => (
              <label key={w.name} className="flex items-center gap-1.5 text-sm text-gray-300">
                <input type="checkbox" checked={!!pool[w.name]}
                  onChange={(e) => setPool((p) => ({ ...p, [w.name]: e.target.checked }))} />
                {w.name.replace('Ekene-', 'E')}
                <span className="text-gray-500 text-xs">({w.planted.model === 'hyperbolic' ? `b ${w.planted.b}` : w.planted.model})</span>
              </label>
            ))}
          </div>
        </div>
        <div className="w-44">
          <SelectField label="Apply fixed-b to" value={target} onChange={setTarget}
            options={WELLS.map((w) => [w.name, w.name])} />
        </div>
      </div>

      {out.error && <Note>Engine error: {out.error}</Note>}
      {!out.error && !out.tc && <Note>Pick at least one pool well with enough points to fit.</Note>}
      {out.tc && (
        <>
          <TileGrid>
            <Tile label="Type curve qi (normalized)" value={fmt(out.tc.qi, 6)} />
            <Tile label="Type curve Di" value={fmt(out.tc.Di, 7)} unit="1/d" />
            <Tile label="Type curve b (raw)" value={String(out.tc.b)} />
            <Tile label="Type curve R2" value={fmt(out.tc.R2, 6)} />
          </TileGrid>
          {out.applied ? (
            <TileGrid>
              <Tile label={`${target} fixed-b qi`} value={fmt(out.applied.qi, 4)} unit="stb/d" />
              <Tile label={`${target} fixed-b Di`} value={fmt(out.applied.Di, 7)} unit="1/d" />
              <Tile label="Match R2 / quality" value={`${fmt(out.applied.R2, 6)} / ${out.applied.quality}`} />
              <Tile label={`EUR @ ${ECON_LIMIT_BOPD} (fixed-b)`} value={fmt(out.eurFixedB, 1)} unit="stb" />
              <Tile label="True closed-form EUR" value={fmt(out.eurTrue, 1)} unit="stb" />
              <Tile label="Booking difference" value={fmt(out.pctOff, 4)} unit="%" />
            </TileGrid>
          ) : (
            <Note>applyTypeCurve returned no match for {target} (needs 5+ points and a positive regression).</Note>
          )}
          <Note>
            The default pool (E3 + E6) mixes planted b of 0.5 and 0.35 with different Di, and the
            pooled fit collapses to a nearly exponential b. Apply it anyway and the match R2 looks
            excellent while the EUR runs well short of the closed-form truth: goodness of fit over
            the history says nothing about the tail the borrowed b extrapolates.
          </Note>
        </>
      )}
    </PanelShell>
  );
};

export default TypeCurveExplorer;
