import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  PSI, G, PARAMS, RP90_MAWOP_FACTORS, MAASP_ELEMENTS, MAWOP_CANDIDATES,
  maaspRows, publishedMaasp, publishedMawop, factorSweep, densitySweep,
} from './integrityLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Annulus explorer, the Professional tier. What a limiting element allows at
// surface, which candidate governs the annulus, what the RP 90 role factors
// cost, and why a rating is a DIFFERENTIAL rather than a pressure.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');
const mpa = (pa) => fmt(pa / 1e6, 4);
const psi = (pa) => fmt(pa / PSI, 1);

const MODES = [
  ['maasp', 'MAASP, the rating and the head'],
  ['mawop', 'MAWOP and the governing candidate'],
  ['factors', 'The RP 90 role factors'],
  ['differential', 'The differential across the wall'],
];

const Maasp = () => {
  const [rho, setRho] = useState('');
  const annulusFluidDensityKgM3 = rho === '' ? PARAMS.annulusFluidDensityKgM3 : Number(rho);
  const out = useMemo(() => {
    try { return publishedMaasp({ annulusFluidDensityKgM3 }); } catch { return null; }
  }, [annulusFluidDensityKgM3]);
  // The rating term is the SAME engine call with the element brought to
  // surface, where the head is zero by construction. Nothing here recomputes
  // the physics; the two terms are two engine answers and their difference.
  const atSurface = useMemo(() => {
    try {
      return publishedMaasp({
        annulusFluidDensityKgM3,
        elements: MAASP_ELEMENTS.map((el) => ({ ...el, tvdM: 0 })),
      });
    } catch { return null; }
  }, [annulusFluidDensityKgM3]);
  const published = useMemo(() => {
    try { return publishedMaasp(); } catch { return null; }
  }, []);

  if (!out || !atSurface || !published || !out.rows.length) {
    return <Note>That annulus fluid density does not give the engine a row to build. The density has to be positive, and the limiting element needs a positive pressure limit at a depth of zero or more.</Note>;
  }

  const row = out.rows[0];
  const ratingPa = atSurface.rows[0].allowSurfacePa;
  const headPa = ratingPa - row.allowSurfacePa;
  const bars = [
    { name: 'rating term', v: ratingPa / 1e6 },
    { name: 'hydrostatic term', v: -headPa / 1e6 },
    { name: 'allowed at surface', v: row.allowSurfacePa / 1e6 },
  ];
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <NumField label={`Annulus fluid density (kg/m3, published ${PARAMS.annulusFluidDensityKgM3})`}
          value={rho} onChange={setRho} placeholder={String(PARAMS.annulusFluidDensityKgM3)} />
      </div>
      <TileGrid>
        <Tile label="Element limit at its depth" value={mpa(row.limitPa)} unit="MPa" />
        <Tile label="Design factor on it" value={fmt(row.factor, 3)} />
        <Tile label="Rating term, factor times limit" value={mpa(ratingPa)} unit="MPa" />
        <Tile label="True vertical depth" value={fmt(row.tvdM, 3)} unit="m" />
        <Tile label="Annulus fluid" value={fmt(annulusFluidDensityKgM3, 1)} unit="kg/m3" />
        <Tile label="Backup fluid on the far side" value={fmt(row.backupDensityKgM3, 1)} unit="kg/m3" />
        <Tile label="Hydrostatic term taken off" value={mpa(headPa)} unit="MPa" />
        <Tile label="Allowed at surface" value={mpa(row.allowSurfacePa)} unit="MPa" />
        <Tile label="Same, in psi" value={psi(row.allowSurfacePa)} unit="psi" />
        <Tile label="Reported MAASP after the clamp" value={mpa(out.maaspPa)} unit="MPa" />
        <Tile label="Negative row flagged" value={out.negative ? 'YES, this is a finding' : 'no'} />
        <Tile label="Published MAASP" value={mpa(published.maaspPa)} unit="MPa" />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'MPa', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(x) => fmt(x, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#64748b" />
            <Bar dataKey="v" name="contribution to the allowable" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">term</th>
              <th className="text-right pr-3">MPa</th>
              <th className="text-right pr-3">psi</th>
              <th className="text-left">where it comes from</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pr-3">rating term</td>
              <td className="text-right pr-3 text-emerald-400">{mpa(ratingPa)}</td>
              <td className="text-right pr-3">{psi(ratingPa)}</td>
              <td className="text-slate-400">the same element brought to surface, where the head is zero</td>
            </tr>
            <tr>
              <td className="pr-3">hydrostatic term</td>
              <td className="text-right pr-3 text-rose-400">{mpa(-headPa)}</td>
              <td className="text-right pr-3">{psi(-headPa)}</td>
              <td className="text-slate-400">the column the annulus already carries down to the element</td>
            </tr>
            <tr>
              <td className="pr-3">allowed at surface</td>
              <td className="text-right pr-3">{mpa(row.allowSurfacePa)}</td>
              <td className="text-right pr-3">{psi(row.allowSurfacePa)}</td>
              <td className="text-slate-400">what a gauge at the wellhead may read</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        The element is rated {mpa(row.limitPa)} MPa and the design factor of {fmt(row.factor, 2)}
        {' '}keeps {mpa(ratingPa)} MPa of that. The annulus fluid has already spent
        {' '}{mpa(headPa)} MPa of it getting down to {fmt(row.tvdM, 1)} m, so the gauge at surface
        may only read {mpa(row.allowSurfacePa)} MPa, which is {psi(row.allowSurfacePa)} psi. Raise
        the density in the box and watch the rating term stay exactly where it is while the
        allowable falls: nothing about the steel changed, only what the fluid did to it.
      </div>
      <Note>
        The depth here is TRUE VERTICAL and not measured, and it has to be. A pressure head is a
        vertical quantity, and turning a measured depth into a vertical one is the survey engine's
        job rather than this one's. The element sits at {fmt(PARAMS.maaspFixture.mdM, 0)} m along
        hole and only {fmt(row.tvdM, 1)} m below the rotary table, a difference of
        {' '}{fmt(PARAMS.maaspFixture.mdM - row.tvdM, 1)} m. Feed a slant well its measured depth
        here and every allowable comes back too low, which is the safe direction and still wrong.
      </Note>
    </>
  );
};

const Mawop = () => {
  const [rho, setRho] = useState('');
  const annulusFluidDensityKgM3 = rho === '' ? PARAMS.annulusFluidDensityKgM3 : Number(rho);
  const out = useMemo(() => {
    try { return publishedMawop({ annulusFluidDensityKgM3 }); } catch { return null; }
  }, [annulusFluidDensityKgM3]);
  if (!out || !out.rows || !out.rows.length) {
    return <Note>That annulus fluid density leaves no MAWOP row to reduce over. The density has to be positive before any candidate can be given an allowable.</Note>;
  }
  const rows = out.rows;
  const first = rows[0];
  const minRow = rows.reduce((a, b) => (b.allowSurfacePa < a.allowSurfacePa ? b : a));
  const maxRow = rows.reduce((a, b) => (b.allowSurfacePa > a.allowSurfacePa ? b : a));
  const data = rows.map((r, i) => ({ ...r, order: i + 1, mpa: r.allowSurfacePa / 1e6 }));
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <NumField label={`Annulus fluid density (kg/m3, published ${PARAMS.annulusFluidDensityKgM3})`}
          value={rho} onChange={setRho} placeholder={String(PARAMS.annulusFluidDensityKgM3)} />
      </div>
      <div className="rounded-md border border-[#BFFF00]/40 bg-[#BFFF00]/5 p-4 my-3">
        <p className="text-xs text-gray-400 mb-1">The reduction over the rows, which is LOGIC and not arithmetic</p>
        <div className="grid gap-3 sm:grid-cols-3 items-end">
          <div>
            <p className="text-gray-500 text-xs mb-0">The FIRST row is</p>
            <p className="text-white text-2xl font-bold mb-0">{mpa(first.allowSurfacePa)}<span className="text-sm text-gray-400 ml-1">MPa</span></p>
            <p className="text-gray-500 text-xs mb-0">{first.name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-0">The MINIMUM row is</p>
            <p className="text-[#BFFF00] text-2xl font-bold mb-0">{mpa(minRow.allowSurfacePa)}<span className="text-sm text-gray-400 ml-1">MPa</span></p>
            <p className="text-gray-500 text-xs mb-0">{minRow.name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-0">The engine reports</p>
            <p className="text-white text-2xl font-bold mb-0">{mpa(out.mawopPa)}<span className="text-sm text-gray-400 ml-1">MPa</span></p>
            <p className="text-gray-500 text-xs mb-0">governing: {out.governing}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 mb-0">
          The governing candidate is row {data.findIndex((r) => r.name === out.governing) + 1} of
          {' '}{rows.length} and not row 1, and taking the first row instead would report
          {' '}{mpa(first.allowSurfacePa - minRow.allowSurfacePa)} MPa more pressure than the
          annulus can actually take.
        </p>
      </div>
      <TileGrid>
        <Tile label="Candidates offered" value={fmt(rows.length, 0)} />
        <Tile label="Governing candidate" value={out.governing} />
        <Tile label="Is that the first row" value={out.governing === first.name ? 'yes' : 'NO'} />
        <Tile label="MAWOP" value={mpa(out.mawopPa)} unit="MPa" />
        <Tile label="Same, in psi" value={psi(out.mawopPa)} unit="psi" />
        <Tile label="Most permissive candidate" value={maxRow.name} />
        <Tile label="Its allowable" value={mpa(maxRow.allowSurfacePa)} unit="MPa" />
        <Tile label="Spread across the candidates" value={mpa(maxRow.allowSurfacePa - minRow.allowSurfacePa)} unit="MPa" />
        <Tile label="Negative row flagged" value={out.negative ? 'YES, this is a finding' : 'no'} />
        <Tile label="Engine" value={out.engine} />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} interval={0} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'allowed at surface (MPa)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(x) => fmt(x, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={out.mawopPa / 1e6} stroke="#BFFF00"
              label={{ value: 'MAWOP, the minimum', fill: '#BFFF00', fontSize: 10, position: 'insideTopRight' }} />
            <Bar dataKey="mpa" name="allowed at surface" fill="#38bdf8" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">order</th>
              <th className="text-left pr-3">candidate</th>
              <th className="text-left pr-3">role</th>
              <th className="text-right pr-3">factor</th>
              <th className="text-right pr-3">limit (MPa)</th>
              <th className="text-right pr-3">TVD (m)</th>
              <th className="text-right pr-3">backup (kg/m3)</th>
              <th className="text-right pr-3">allowed (MPa)</th>
              <th className="text-left">governs</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.name} className={r.name === out.governing ? 'text-[#BFFF00]' : ''}>
                <td className="pr-3">{r.order}</td>
                <td className="pr-3">{r.name}</td>
                <td className="pr-3">{r.kind || '-'}</td>
                <td className="text-right pr-3">{fmt(r.factor, 3)}</td>
                <td className="text-right pr-3">{mpa(r.limitPa)}</td>
                <td className="text-right pr-3">{fmt(r.tvdM, 3)}</td>
                <td className="text-right pr-3">{fmt(r.backupDensityKgM3, 1)}</td>
                <td className="text-right pr-3">{mpa(r.allowSurfacePa)}</td>
                <td>{r.name === out.governing ? 'this one' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Read the allowed column down the table. It does not fall in order, it goes
        {' '}{mpa(rows[0].allowSurfacePa)}, then UP, then down, and the smallest number is the last
        row rather than the first. The annulus can only be worked to the weakest thing on it, so
        the answer is a MINIMUM over the rows. A reduction that returned rows[0] would agree with
        the minimum on any case where the rows happen to be sorted, and would be wrong here by
        {' '}{mpa(first.allowSurfacePa - minRow.allowSurfacePa)} MPa.
      </div>
      <Note>
        Verifying the rows does not verify the reduction. Each of these {rows.length} rows is a
        differential hydrostatic calculation that a test can pin one at a time, and the selection
        over them is a separate claim with a separate way of being wrong. A sibling course shipped
        a worst-row reduction that silently returned the first row on every case that passed, which
        is why the test behind this panel asserts both that the governing row IS the minimum and
        that it is NOT the first.
      </Note>
    </>
  );
};

const Factors = () => {
  const [name, setName] = useState(MAWOP_CANDIDATES.length ? MAWOP_CANDIDATES[0].name : '');
  const candidate = useMemo(
    () => MAWOP_CANDIDATES.find((c) => c.name === name) || MAWOP_CANDIDATES[0],
    [name],
  );
  const sweep = useMemo(() => {
    try { return factorSweep(candidate); } catch { return null; }
  }, [candidate]);
  if (!candidate || !sweep || !sweep.length) {
    return <Note>There is no candidate to derate. A MAWOP row needs a named element with a pressure limit, a true vertical depth and a role the RP 90 table recognises.</Note>;
  }
  const bareRating = sweep.find((r) => r.role === 'rating');
  const data = sweep.map((r) => ({
    role: r.role,
    factor: r.factor,
    mpa: r.result.mawopPa / 1e6,
    ratio: bareRating && bareRating.result.mawopPa > 0 ? r.result.mawopPa / bareRating.result.mawopPa : null,
    lostPa: bareRating ? bareRating.result.mawopPa - r.result.mawopPa : null,
  }));
  return (
    <>
      <SelectField label="The same steel, at each RP 90 role" value={candidate.name} onChange={setName}
        options={MAWOP_CANDIDATES.map((c) => [c.name, c.name])} />
      <div className="mt-3">
        <TileGrid>
          <Tile label="Element" value={candidate.name} />
          <Tile label="Its published role" value={candidate.role} />
          <Tile label="Its rating" value={mpa(candidate.limitPa)} unit="MPa" />
          <Tile label="Roles in the RP 90 table" value={fmt(Object.keys(RP90_MAWOP_FACTORS).length, 0)} />
          <Tile label="Outer casing burst" value={fmt(RP90_MAWOP_FACTORS['outer-casing-burst'], 2)} />
          <Tile label="Inner casing burst" value={fmt(RP90_MAWOP_FACTORS['inner-casing-burst'], 2)} />
          <Tile label="Inner tubing collapse" value={fmt(RP90_MAWOP_FACTORS['inner-tubing-collapse'], 2)} />
          <Tile label="The bare rating, not derated" value={fmt(RP90_MAWOP_FACTORS.rating, 2)} />
        </TileGrid>
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="role" tick={{ fill: '#94a3b8', fontSize: 9 }} interval={0} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'MAWOP (MPa)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(x) => fmt(x, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="mpa" name="MAWOP at this role" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">role</th>
              <th className="text-right pr-3">factor</th>
              <th className="text-right pr-3">MAWOP (MPa)</th>
              <th className="text-right pr-3">psi</th>
              <th className="text-right pr-3">against the bare rating</th>
              <th className="text-right">pressure the role costs (MPa)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.role} className={r.role === candidate.role ? 'text-[#BFFF00]' : ''}>
                <td className="pr-3">{r.role}</td>
                <td className="text-right pr-3">{fmt(r.factor, 3)}</td>
                <td className="text-right pr-3">{fmt(r.mpa, 4)}</td>
                <td className="text-right pr-3">{psi(r.mpa * 1e6)}</td>
                <td className="text-right pr-3 text-amber-400">{r.ratio == null ? '-' : fmt(r.ratio, 5)}</td>
                <td className="text-right text-rose-400">{r.lostPa == null ? '-' : mpa(r.lostPa)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        One piece of steel, one depth, one annulus fluid, and {data.length} different answers. The
        role is not a description of the element, it is a decision about how much of its rating you
        are willing to spend, and the outer casing at {fmt(RP90_MAWOP_FACTORS['outer-casing-burst'], 2)}
        {' '}keeps far less of it than the inner casing at {fmt(RP90_MAWOP_FACTORS['inner-casing-burst'], 2)}.
        The last column is what the role costs in pressure rather than in fractions, and that is
        the number an operations engineer feels.
      </div>
      <Note>
        The derating is not proportional to the factor, and the last column but one shows it. The
        hydrostatic term is subtracted AFTER the factor is applied, so halving the factor takes
        more than half the allowable away. The factors themselves are the RP 90 defaults and they
        are overridable, which is the right design: they are a convention from a standard document
        rather than a property of the pipe, and the standard governs.
      </Note>
    </>
  );
};

const Differential = () => {
  const [backup, setBackup] = useState('');
  const backupDensityKgM3 = backup === '' ? 0 : Number(backup);
  const baseline = useMemo(() => {
    try { return densitySweep(); } catch { return null; }
  }, []);
  const chosen = useMemo(() => {
    if (!baseline) return null;
    try {
      return baseline.map((r) => ({
        annulusFluidDensityKgM3: r.annulusFluidDensityKgM3,
        rows: maaspRows({
          annulusFluidDensityKgM3: r.annulusFluidDensityKgM3,
          elements: MAASP_ELEMENTS.map((el) => ({ ...el, backupDensityKgM3 })),
        }),
      }));
    } catch { return null; }
  }, [baseline, backupDensityKgM3]);

  if (!baseline || !baseline.length || !chosen) {
    return <Note>That backup density does not describe a wall with two sides. The column on the far side has to be zero or heavier, and the annulus fluid has to be positive.</Note>;
  }

  const el = MAASP_ELEMENTS[0];
  const data = baseline.map((r, i) => ({
    rho: r.annulusFluidDensityKgM3,
    published: r.rows.rows[0].allowSurfacePa / 1e6,
    chosen: chosen[i].rows.rows[0].allowSurfacePa / 1e6,
    reported: chosen[i].rows.maaspPa / 1e6,
    negative: chosen[i].rows.negative,
  }));
  const negatives = data.filter((r) => r.negative);
  const dRho = baseline[baseline.length - 1].annulusFluidDensityKgM3 - baseline[0].annulusFluidDensityKgM3;
  const drop = baseline[0].rows.rows[0].allowSurfacePa - baseline[baseline.length - 1].rows.rows[0].allowSurfacePa;

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <NumField label={`Backup density on the far side (kg/m3, the published element carries ${el.backupDensityKgM3})`}
          value={backup} onChange={setBackup} placeholder="0" />
      </div>
      <TileGrid>
        <Tile label="Densities swept" value={fmt(baseline.length, 0)} />
        <Tile label="Element depth" value={fmt(el.tvdM, 3)} unit="m" />
        <Tile label="Published backup" value={fmt(el.backupDensityKgM3, 1)} unit="kg/m3" />
        <Tile label="Backup in use here" value={fmt(backupDensityKgM3, 1)} unit="kg/m3" />
        <Tile label="Density range swept" value={fmt(dRho, 0)} unit="kg/m3" />
        <Tile label="Allowable lost across it" value={mpa(drop)} unit="MPa" />
        <Tile label="Head that density change carries" value={mpa(dRho * G * el.tvdM)} unit="MPa" />
        <Tile label="Rows going negative here" value={fmt(negatives.length, 0)} />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="rho" type="number" domain={['dataMin', 'dataMax']}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'annulus fluid density (kg/m3)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'allowed at surface (MPa)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(x) => fmt(x, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#f472b6"
              label={{ value: 'zero, below which it is a finding', fill: '#f472b6', fontSize: 10, position: 'insideBottomRight' }} />
            <Line type="monotone" dataKey="published" name={`backup ${el.backupDensityKgM3} kg/m3, the published element`} stroke="#BFFF00" dot isAnimationActive={false} />
            <Line type="monotone" dataKey="chosen" name={`backup ${fmt(backupDensityKgM3, 0)} kg/m3, the row itself`} stroke="#38bdf8" dot isAnimationActive={false} />
            <Line type="monotone" dataKey="reported" name="what the engine REPORTS after the clamp" stroke="#f472b6" strokeDasharray="4 3" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">annulus fluid (kg/m3)</th>
              <th className="text-right pr-3">allowed with the published backup (MPa)</th>
              <th className="text-right pr-3">allowed with backup {fmt(backupDensityKgM3, 0)} (MPa)</th>
              <th className="text-right pr-3">reported MAASP after the clamp (MPa)</th>
              <th className="text-left">negative flag</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.rho}>
                <td className="pr-3">{fmt(r.rho, 0)}</td>
                <td className="text-right pr-3">{fmt(r.published, 4)}</td>
                <td className={`text-right pr-3 ${r.chosen < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{fmt(r.chosen, 4)}</td>
                <td className="text-right pr-3">{fmt(r.reported, 4)}</td>
                <td className={r.negative ? 'text-rose-400' : 'text-slate-500'}>{r.negative ? 'NEGATIVE, a finding' : 'clear'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Two columns, one element, and the only difference between them is what stands on the far
        side of the wall. A rating is a DIFFERENTIAL across that wall, so a heavier column behind
        it pushes back and buys margin, and taking that column away spends the margin. Across the
        density range swept here the allowable falls by {mpa(drop)} MPa, which is exactly the
        change in head, {mpa(dRho * G * el.tvdM)} MPa, and not a coefficient anybody fitted.
      </div>
      <Note>
        Look at the rows flagged NEGATIVE. Hydrostatic alone has already busted the rating there,
        so the row says the annulus is over its limit with nothing at all applied at surface. The
        engine reports the MAASP as zero and raises the flag rather than handing back a negative
        number, because a negative allowable is not a pressure you can apply in the other
        direction, it is a finding. The clamp is the safe half of that behaviour and the flag is
        the honest half, and a reader who sees only the clamped zero learns nothing.
      </Note>
    </>
  );
};

const AnnulusExplorer = () => {
  const [mode, setMode] = useState('maasp');
  return (
    <PanelShell
      title="Annulus pressure explorer"
      subtitle="What the element allows at surface, which candidate governs, what the RP 90 roles cost, and why the far side of the wall is part of the answer"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'maasp' && <Maasp />}
        {mode === 'mawop' && <Mawop />}
        {mode === 'factors' && <Factors />}
        {mode === 'differential' && <Differential />}
      </div>
    </PanelShell>
  );
};

export default AnnulusExplorer;
