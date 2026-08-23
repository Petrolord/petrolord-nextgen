import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, Legend,
} from 'recharts';
import {
  TW, DEPTH, ZONES, porosityCurves, zoneMean, sampleIndexAt, fmt, num,
} from './typewellLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, FieldGrid, Note } from './panelKit';

// Multi-method porosity lab: density, Wyllie sonic, RHG and the
// neutron-density combination, all computed live from the constants the
// learner sets. The zone means are produced, not displayed from a key.
const PorosityLab = () => {
  const [p, setP] = useState({
    rhoMa: String(TW.rho_ma), rhoFl: String(TW.rho_fl),
    dtMa: String(TW.dt_ma), dtFl: String(TW.dt_fl),
    ndMethod: 'avg', sampleDepth: '2020',
  });
  const set = (k) => (v) => setP((s) => ({ ...s, [k]: v }));

  const parsed = {
    rhoMa: num(p.rhoMa), rhoFl: num(p.rhoFl), dtMa: num(p.dtMa), dtFl: num(p.dtFl),
  };
  const valid = Object.values(parsed).every(Number.isFinite);

  const curves = useMemo(
    () => (valid ? porosityCurves({ ...parsed, ndMethod: p.ndMethod }) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [p.rhoMa, p.rhoFl, p.dtMa, p.dtFl, p.ndMethod, valid],
  );

  const rows = useMemo(() => {
    if (!curves) return [];
    const out = [];
    for (let i = 0; i < DEPTH.length; i += 2) {
      out.push({
        depth: DEPTH[i],
        phiD: Number.isFinite(curves.phiD[i]) ? +curves.phiD[i].toFixed(4) : null,
        phiW: Number.isFinite(curves.phiW[i]) ? +curves.phiW[i].toFixed(4) : null,
        phiRhg: Number.isFinite(curves.phiRhg[i]) ? +curves.phiRhg[i].toFixed(4) : null,
        phiNd: Number.isFinite(curves.phiNdArr[i]) ? +curves.phiNdArr[i].toFixed(4) : null,
      });
    }
    return out;
  }, [curves]);

  const iSample = sampleIndexAt(num(p.sampleDepth) || 2020);

  return (
    <PanelShell title="Porosity lab"
      subtitle="Set the matrix and fluid constants, then read the four porosity families they produce. SAND_A means come from your constants, nowhere else.">
      <FieldGrid>
        <NumField label="rho matrix (g/cc)" value={p.rhoMa} onChange={set('rhoMa')} />
        <NumField label="rho fluid (g/cc)" value={p.rhoFl} onChange={set('rhoFl')} />
        <NumField label="dt matrix (us/m)" value={p.dtMa} onChange={set('dtMa')} />
        <NumField label="dt fluid (us/m)" value={p.dtFl} onChange={set('dtFl')} />
        <SelectField label="N-D combine" value={p.ndMethod} onChange={set('ndMethod')}
          options={[['avg', 'Average'], ['rms', 'Root mean square']]} />
      </FieldGrid>

      {curves && (
        <>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="depth" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={[0, 0.45]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <ReferenceArea x1={ZONES.SAND_A[0]} x2={ZONES.SAND_A[1]} fill="#BFFF00" fillOpacity={0.06} />
                <ReferenceArea x1={ZONES.SAND_B[0]} x2={ZONES.SAND_B[1]} fill="#38bdf8" fillOpacity={0.06} />
                <Line type="monotone" dataKey="phiD" name="Density" stroke="#BFFF00" dot={false} strokeWidth={1.5} />
                <Line type="monotone" dataKey="phiW" name="Wyllie" stroke="#38bdf8" dot={false} strokeWidth={1.5} />
                <Line type="monotone" dataKey="phiRhg" name="RHG" stroke="#f59e0b" dot={false} strokeWidth={1.2} />
                <Line type="monotone" dataKey="phiNd" name="N-D" stroke="#f472b6" dot={false} strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <TileGrid>
            <Tile label="SAND_A mean, density" value={fmt(zoneMean(curves.phiD, ZONES.SAND_A))} unit="v/v" />
            <Tile label="SAND_A mean, Wyllie sonic" value={fmt(zoneMean(curves.phiW, ZONES.SAND_A))} unit="v/v" />
            <Tile label="SAND_A mean, RHG" value={fmt(zoneMean(curves.phiRhg, ZONES.SAND_A))} unit="v/v" />
            <Tile label="SAND_A mean, N-D" value={fmt(zoneMean(curves.phiNdArr, ZONES.SAND_A))} unit="v/v" />
            <Tile label="SAND_B mean, Wyllie sonic" value={fmt(zoneMean(curves.phiW, ZONES.SAND_B))} unit="v/v" />
            <Tile label="SAND_B mean, N-D" value={fmt(zoneMean(curves.phiNdArr, ZONES.SAND_B))} unit="v/v" />
            <Tile label={`Sample at ${DEPTH[iSample]} m, N-D`} value={fmt(curves.phiNdArr[iSample])} unit="v/v" />
            <div>
              <NumField label="Sample depth (m)" value={p.sampleDepth} onChange={set('sampleDepth')} />
            </div>
          </TileGrid>
        </>
      )}
      {!curves && <Note>Enter finite matrix and fluid constants to compute.</Note>}
      <Note>Shaded bands: SAND_A (lime) and SAND_B (blue). Wrong constants make every family wrong together; the crossplot and the water leg are how you catch it.</Note>
    </PanelShell>
  );
};

export default PorosityLab;
