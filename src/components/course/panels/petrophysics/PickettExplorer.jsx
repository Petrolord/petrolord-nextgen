import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import {
  TW, DEPTH, CURVES, WATER_LEG, porosityCurves, fitPickett, isoSwSegment, fmt, num,
} from './typewellLab';
import { Button } from '@/components/ui/button';
import { PanelShell, NumField, Tile, TileGrid, Note } from './panelKit';

// Pickett explorer: the learner chooses the presumed-water depth window
// and fits the water line themselves. A wrong window gives a wrong fit;
// that is the point.
const PickettExplorer = () => {
  const [win, setWin] = useState({ top: String(WATER_LEG[0]), base: String(WATER_LEG[1]) });
  const [nExp, setNExp] = useState('2');
  const [fit, setFit] = useState(null);
  const [fitError, setFitError] = useState(null);

  // Porosity for the plot is the course convention: neutron-density on
  // the given constants.
  const phi = useMemo(
    () => porosityCurves({ rhoMa: TW.rho_ma, rhoFl: TW.rho_fl, dtMa: TW.dt_ma, dtFl: TW.dt_fl }).phiNdArr,
    [],
  );

  const top = num(win.top);
  const base = num(win.base);
  const points = useMemo(() => {
    const inWin = [];
    const outWin = [];
    for (let i = 0; i < DEPTH.length; i++) {
      const p = phi[i];
      const rt = CURVES.RT[i];
      if (!(p > 0) || !(rt > 0)) continue;
      const row = { phi: +p.toFixed(4), rt: +rt.toFixed(4), depth: DEPTH[i] };
      if (Number.isFinite(top) && Number.isFinite(base) && DEPTH[i] >= top && DEPTH[i] <= base) inWin.push(row);
      else outWin.push(row);
    }
    return { inWin, outWin };
  }, [phi, top, base]);

  const runFit = () => {
    setFitError(null);
    try {
      setFit(fitPickett(phi, top, base));
    } catch (e) {
      setFit(null);
      setFitError(e.message);
    }
  };

  const isoLines = useMemo(() => {
    if (!fit) return [];
    const n = num(nExp) || 2;
    return [1, 0.5, 0.2].map((sw) => ({
      sw,
      pts: isoSwSegment(sw, { aRw: fit.aRw, m: fit.m, n }, 0.05, 0.4),
    }));
  }, [fit, nExp]);

  return (
    <PanelShell title="Pickett explorer"
      subtitle="Pick the depth window you believe is fully water saturated, then fit. The slope is -m and the phi = 1 intercept is a x Rw.">
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 items-end">
        <NumField label="Window top (m)" value={win.top} onChange={(v) => setWin((w) => ({ ...w, top: v }))} />
        <NumField label="Window base (m)" value={win.base} onChange={(v) => setWin((w) => ({ ...w, base: v }))} />
        <NumField label="n (iso-Sw lines)" value={nExp} onChange={setNExp} />
        <Button onClick={runFit} className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold h-8">
          Fit water line
        </Button>
      </div>

      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="phi" name="phi" type="number" scale="log" domain={[0.05, 0.4]}
              ticks={[0.05, 0.1, 0.15, 0.2, 0.3, 0.4]} allowDataOverflow
              tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis dataKey="rt" name="Rt" type="number" scale="log" domain={[1, 30]}
              ticks={[1, 2, 5, 10, 20, 30]} allowDataOverflow
              tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', color: '#fff' }}
              formatter={(v) => fmt(Number(v))} labelFormatter={() => ''} />
            <Scatter name="Outside window" data={points.outWin} fill="#64748b" opacity={0.7} />
            <Scatter name="In window" data={points.inWin} fill="#BFFF00" />
            {isoLines.map((l) => (
              <Scatter key={l.sw} data={l.pts} fill="none"
                line={{ stroke: l.sw === 1 ? '#38bdf8' : '#475569', strokeWidth: l.sw === 1 ? 2 : 1 }}
                shape={() => null} legendType="none" />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {fitError && <Note>Fit failed: {fitError}</Note>}
      {fit && (
        <TileGrid>
          <Tile label="Fitted m" value={fmt(fit.m, 3)} />
          <Tile label="Fitted a x Rw" value={fmt(fit.aRw, 4)} unit="ohm.m" />
          <Tile label="Points in fit" value={String(fit.nPoints)} />
          <Tile label="Iso-Sw lines" value="1.0 / 0.5 / 0.2" />
        </TileGrid>
      )}
      <Note>Blue line: your fitted Sw = 1 water line (grey: 0.5 and 0.2). Points above the water line at the same porosity carry hydrocarbon. Try a deliberately wrong window and watch m and a x Rw move.</Note>
    </PanelShell>
  );
};

export default PickettExplorer;
