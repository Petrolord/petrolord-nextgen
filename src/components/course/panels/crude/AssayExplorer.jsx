import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea,
  ReferenceLine, BarChart, Bar,
} from 'recharts';
import {
  LIBRARY, LIBRARY_IDS, BLANKABLE, OBIGBO_STABILITY_PAIRS, OBIGBO_BLEND_SHARES, library, gravity, refutas,
  blendOf, blanksAndRefusals, curvePlot, cutsOf, stability,
} from './crudeLab';
import {
  AXIS, TOOLTIP, GRID, SERIES, f4, usable, Tbl, Basis, Shortcut, Refused, StableBadge, Note, Lead, Empty, safe,
  Slider, Toggle,
} from './panelBits';
import { PanelShell, SelectField, FieldGrid } from '@/components/course/panels/petrophysics/panelKit';

// Assay explorer, the Associate tier throughout.
//
// THE BASIS RULE IS THE PAGE. Every property of a blend is printed beside the
// basis the engine names for it, in the engine's own words, and beside the
// reading the engine does not use (API averaged on volume, sulfur on volume, the
// Refutas index on volume, the SARA fractions on volume), each computed by the
// teaching lab with the engine's own helpers. At Obigbo Light and Egbema Medium,
// 65 and 35, every figure is the one SECTION 12 of the digest prints, and the
// lab test pins that.
//
// A BLANK IS NOT A ZERO. Blanking a property on one crude makes the blend come
// back with that property not blended and the crude named, exactly as the
// engine returns it. Every refusal is the engine's own sentence.
//
// NO VERDICT IS ITS OWN STATE. The stability screen answers true, false or null,
// and null is drawn as No verdict, never as a tick.

export const MODES = [
  ['library', 'The OBIGBO library: API, SG, the per-mass properties, SARA and the TBP curve'],
  ['blend', 'The blend builder: every property beside its basis and the reading the engine does not use'],
  ['curve', 'The TBP curve, the unknown beyond a partial curve, and the cut set as bands'],
  ['stability', 'Will the blend stay stable: the CII, its bands, and the gravity screen'],
];

const NONE = '';
const crudeOptions = (withNone) => [...(withNone ? [[NONE, 'no third crude']] : []), ...LIBRARY_IDS.map((id) => [id, LIBRARY[id].name])];
const propLabel = (p) => (p === null || p === undefined ? 'not given' : String(p));

// ---------------------------------------------------------------------------

export const LibraryMode = ({ lib, gravity: g, refutas: r }) => {
  if (!Array.isArray(lib)) return <Empty>The library reader has returned nothing, so there is no crude to show.</Empty>;
  return (
    <>
      <Lead>
        Four invented field streams at an invented Rivers State export terminal, and one partial assay. Specific gravity
        is computed from API by the engine&apos;s sgFromApi; every other figure is the assay as typed.
      </Lead>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lib.map((c) => (
          <div key={c.id} className="rounded-md border border-gray-700 bg-[#0F172A] p-3 text-xs text-slate-300">
            <p className="text-white text-sm font-medium mb-1">{c.name}{c.partial ? ' (partial assay)' : ''}</p>
            <p className="mb-0">API {c.api}, SG {f4(c.sg)} <Shortcut>(sgFromApi)</Shortcut></p>
            <p className="mb-0">sulfur {propLabel(c.properties.sulfurWtPct)} wt%, TAN {propLabel(c.properties.tanMgKohG)} mg KOH/g, nitrogen {propLabel(c.properties.nitrogenWtPct)} wt%</p>
            <p className="mb-0">nickel {propLabel(c.properties.nickelPpm)} ppm, vanadium {propLabel(c.properties.vanadiumPpm)} ppm</p>
            <p className="mb-0">viscosity {propLabel(c.properties.viscosityCSt)} cSt{c.refutasIndex === null ? '' : `, Refutas index ${f4(c.refutasIndex)}`}</p>
            {c.sara ? (
              <p className="mb-0">
                SARA {c.sara.saturates}, {c.sara.aromatics}, {c.sara.resins}, {c.sara.asphaltenes} wt%; CII alone {f4(c.cii)}
              </p>
            ) : <p className="mb-0 text-slate-500">no SARA analysis</p>}
            <p className="mb-0 text-slate-400">TBP: {c.curve.map((q) => `${q.volumePercent} at ${q.temperatureF} F`).join('; ')}</p>
          </div>
        ))}
      </div>
      {usable(g) && Array.isArray(g.steps) && (
        <>
          <Lead>
            API is a hyperbola in specific gravity, API = A / SG - B, with A {f4(g.A)} and B {f4(g.B)} read back from the
            engine. Equal steps of SG are unequal steps of API:
          </Lead>
          <Tbl head={['SG', 'API (apiFromSg)', 'step from the row above']} rows={g.steps.map((s) => [String(s.sg), f4(s.api), s.step === null ? 'first row' : f4(s.step)])} />
          <Note>Water, SG 1, is {f4(g.water)} API by the definition.</Note>
        </>
      )}
      {usable(r) && Array.isArray(r.domain) && (
        <>
          <Lead>
            Viscosity blends through the Refutas index. The index has a domain: below it the engine returns no index
            rather than a number.
          </Lead>
          <Tbl head={['viscosity cSt', 'viscosityBlendIndex']} rows={r.domain.map((d) => [String(d.viscosityCSt), d.index === null ? 'no index (outside the domain)' : f4(d.index)])} />
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

export const BlendMode = ({
  blend, refusals, picks, shares, blank, onPick, onShare, onBlank,
}) => {
  const p = Array.isArray(picks) ? picks : [];
  const s = Array.isArray(shares) ? shares : [];
  const bl = blank && typeof blank === 'object' && !blank.error ? blank : { id: NONE, key: 'sulfurWtPct' };
  const controls = (
    <>
      <FieldGrid>
        {[0, 1, 2].map((i) => (
          <SelectField key={`pick${i}`} label={`Crude ${i + 1}`} value={p[i] ?? NONE} onChange={(v) => onPick && onPick(i, v)} options={crudeOptions(i === 2)} />
        ))}
        <SelectField label="Leave blank on" value={bl.id} onChange={(v) => onBlank && onBlank({ ...bl, id: v })} options={[[NONE, 'nothing blank'], ...p.filter(Boolean).map((id) => [id, LIBRARY[id] ? LIBRARY[id].name : id])]} />
        <SelectField label="The property left blank" value={bl.key} onChange={(v) => onBlank && onBlank({ ...bl, key: v })} options={BLANKABLE} />
      </FieldGrid>
      <div className="grid gap-3 sm:grid-cols-3 mt-2">
        {[0, 1, 2].map((i) => (p[i] ? (
          <Slider key={`share${i}`} label={`${LIBRARY[p[i]] ? LIBRARY[p[i]].name : p[i]}, share by volume`} value={s[i] ?? 0} min={0} max={100} onChange={(v) => onShare && onShare(i, v)} />
        ) : null))}
      </div>
    </>
  );
  if (!usable(blend)) {
    return (
      <>
        {controls}
        {blend && blend.error ? <Refused label="blendCrudes refused this blend" reason={blend.error} /> : <Empty>The blend reader has returned nothing, so there is no blend to show.</Empty>}
      </>
    );
  }
  const st = blend.stability || {};
  const rows = [
    ['specific gravity', f4(blend.sg.value), <Basis key="b">{blend.sg.basis}</Basis>, <Shortcut key="s">none: SG is the quantity that blends on volume</Shortcut>, ''],
    ['API', f4(blend.api.value), <Basis key="b">{blend.api.basis}</Basis>, <Shortcut key="s">{f4(blend.api.onVolume)} (the API numbers averaged on volume)</Shortcut>, f4(blend.api.minusOnVolume)],
    ['API, read against the mass-weighted mean', f4(blend.api.value), <Basis key="b">{blend.api.basis}</Basis>, <Shortcut key="s">{f4(blend.api.onMass)} (the API numbers averaged on mass)</Shortcut>, f4(blend.api.minusOnMass)],
    ...blend.massProperties.map((m) => [
      m.label,
      m.value === null ? 'not blended' : f4(m.value),
      <Basis key="b">{m.basis}</Basis>,
      <Shortcut key="s">{m.onVolume === null ? 'not formed' : `${f4(m.onVolume)} (on volume)`}</Shortcut>,
      m.value === null ? '' : f4(m.massMinusVolume),
    ]),
    [
      'viscosity cSt',
      blend.viscosity.value === null ? 'not blended' : f4(blend.viscosity.value),
      <Basis key="b">{blend.viscosity.basis}</Basis>,
      <Shortcut key="s">{blend.viscosity.indexOnVolume === null ? 'not formed' : `${f4(blend.viscosity.indexOnVolume)} (the index on volume); ${f4(blend.viscosity.linearOnMass)} (cSt averaged on mass, no index)`}</Shortcut>,
      blend.viscosity.value === null ? '' : f4(blend.viscosity.massMinusVolume),
    ],
    [
      'CII',
      st.cii === null || st.cii === undefined ? 'not formed' : f4(st.cii),
      <Basis key="b">{st.basis === 'cii' ? 'SARA fractions on mass' : `screen basis ${st.basis}`}</Basis>,
      <Shortcut key="s">{st.ciiOnVolume === null || st.ciiOnVolume === undefined ? 'not formed' : `${f4(st.ciiOnVolume)} (SARA on volume)`}</Shortcut>,
      st.volumeMinusEngine === null || st.volumeMinusEngine === undefined ? '' : `volume reading minus the engine ${f4(st.volumeMinusEngine)}`,
    ],
  ];
  const missing = Object.entries(blend.missing || {});
  return (
    <>
      {controls}
      <Lead>
        The blend as blendCrudes returns it. The third column is the basis in the engine&apos;s own words; the fourth is a
        reading the engine does not use, computed with the engine&apos;s own helpers so it can be read beside the right
        answer; the last is the engine&apos;s figure minus that reading.
      </Lead>
      <Tbl head={['property', 'the engine', 'basis the engine names', 'the reading the engine does not use', 'engine minus that reading']} rows={rows} />
      {missing.length > 0 && (
        <Note>
          Not blended, and named by the engine: {missing.map(([k, who]) => `${k} (no value for ${who.join(', ')})`).join('; ')}. A blank is
          absent; a typed 0 is a real zero and blends like any other figure.
        </Note>
      )}
      {Array.isArray(blend.fractions) && (
        <>
          <Lead>Volume shares become mass shares once, through each crude&apos;s specific gravity:</Lead>
          <Tbl
            head={['crude', 'volume fraction', 'SG', 'mass fraction', 'mass minus volume']}
            rows={blend.fractions.map((f) => [f.name, f4(f.volumeFraction), f4(f.sg), f4(f.massFraction), f4(f.massMinusVolume)])}
          />
        </>
      )}
      {Array.isArray(refusals) && (
        <>
          <Lead>What blendCrudes refuses, each in its own words:</Lead>
          {refusals.map((r) => <Refused key={r.label} label={r.label} reason={r.reason} />)}
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

const BAND_FILL = ['#1e3a8a', '#134e4a'];

export const CurveMode = ({
  plot, cuts, pick, onPick,
}) => {
  const picker = (
    <FieldGrid>
      <SelectField label="Crude" value={pick || 'obl'} onChange={(v) => onPick && onPick(v)} options={crudeOptions(false)} />
    </FieldGrid>
  );
  if (!usable(plot) || !Array.isArray(plot.sampled)) {
    return <>{picker}<Empty>The curve reader has returned nothing, so there is no curve to draw.</Empty></>;
  }
  const measured = plot.measured.map((q) => ({ temperatureF: q.temperatureF, measured: q.volumePercent }));
  const okCuts = usable(cuts) && Array.isArray(cuts.cuts);
  return (
    <>
      {picker}
      <Lead>
        volumePercentAt, read by the engine every 20 F. The dots are the measured points. Where the engine answers
        unknown, beyond a partial curve, the line stops and the region is shaded as unknown: the curve says nothing
        there, and nothing is drawn as though it did.
      </Lead>
      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={plot.sampled} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="temperatureF" type="number" domain={[0, 1600]} tick={AXIS} label={{ value: 'temperature F', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -4 }} />
            <YAxis domain={[0, 100]} tick={AXIS} label={{ value: 'volume percent distilled', angle: -90, fill: '#94a3b8', fontSize: 11, position: 'insideLeft' }} />
            <Tooltip contentStyle={TOOLTIP} />
            {okCuts && cuts.cuts.map((c, i) => (
              <ReferenceArea key={c.id} x1={c.fromF === null ? 0 : c.fromF} x2={c.toF === null ? 1600 : c.toF} fill={BAND_FILL[i % 2]} fillOpacity={0.25} label={{ value: c.name.split(' /')[0], fill: '#cbd5e1', fontSize: 9, position: 'insideTop' }} />
            ))}
            {plot.unknownBelowF !== null && <ReferenceArea x1={0} x2={plot.unknownBelowF} fill="#7f1d1d" fillOpacity={0.35} label={{ value: 'unknown', fill: '#fca5a5', fontSize: 10 }} />}
            {plot.unknownAboveF !== null && <ReferenceArea x1={plot.unknownAboveF} x2={1600} fill="#7f1d1d" fillOpacity={0.35} label={{ value: 'unknown', fill: '#fca5a5', fontSize: 10 }} />}
            <Line type="linear" dataKey="volumePercent" stroke={SERIES[0]} dot={false} connectNulls={false} name="volumePercentAt" isAnimationActive={false} />
            <Scatter data={measured} dataKey="measured" fill={SERIES[2]} name="measured point" isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {okCuts ? (
        <>
          <Lead>cutYields on the studio&apos;s default cut set, each cut the curve at its upper bound minus the curve at its lower bound:</Lead>
          <Tbl
            head={['cut', 'from F', 'to F', 'yield volume percent']}
            rows={cuts.cuts.map((c) => [c.name, c.fromF === null ? 'from 0 percent' : String(c.fromF), c.toF === null ? 'to 100 percent' : String(c.toF), f4(c.yieldVolPercent, 'unknown')])}
          />
          <Note>
            Total {f4(cuts.totalVolPercent)} percent, reported as it computes. Closes: {String(cuts.closes)}. Cuts with no
            yield: {cuts.unknownCuts.length ? cuts.unknownCuts.join(', ') : 'nothing'}.
          </Note>
        </>
      ) : <Empty>The cut reader has returned nothing.</Empty>}
    </>
  );
};

// ---------------------------------------------------------------------------

export const PAIRS = [
  ...OBIGBO_STABILITY_PAIRS.map((q) => ({ label: `${q.label}, ${q.shares.join(' and ')}`, ids: q.ids, shares: q.shares })),
  { label: 'the Obigbo export blend, 65 and 35', ids: Object.keys(OBIGBO_BLEND_SHARES), shares: Object.values(OBIGBO_BLEND_SHARES) },
];

export const StabilityMode = ({
  st, screen, pair, onPair, dropSara, onDropSara,
}) => {
  const controls = (
    <div className="grid gap-3 sm:grid-cols-2 items-end">
      <SelectField label="Blend" value={String(pair ?? 0)} onChange={(v) => onPair && onPair(Number(v))} options={PAIRS.map((q, i) => [String(i), q.label])} />
      <Toggle label="Take the SARA away, so the screen falls back to gravity" on={dropSara} onChange={onDropSara} />
    </div>
  );
  if (!usable(st)) return <>{controls}<Empty>The stability reader has returned nothing, so there is no screen to show.</Empty></>;
  const bands = usable(screen) && screen.bands ? screen.bands : null;
  return (
    <>
      {controls}
      <div className="mt-3 flex items-center gap-3">
        <StableBadge stable={st.stable} />
        <span className="text-xs text-slate-400">basis {st.basis}{st.band ? `, band ${st.band}` : ''}</span>
      </div>
      <p className="text-xs text-slate-300 font-mono mt-2 mb-0">{st.message}</p>
      {st.basis === 'cii' && st.blendedSara && (
        <>
          <Lead>Each SARA fraction blended on mass, and CII = (saturates + asphaltenes) / (aromatics + resins):</Lead>
          <Tbl
            head={['saturates', 'aromatics', 'resins', 'asphaltenes', 'CII (the engine)', 'CII from SARA on volume']}
            rows={[[f4(st.blendedSara.saturates), f4(st.blendedSara.aromatics), f4(st.blendedSara.resins), f4(st.blendedSara.asphaltenes), f4(st.cii), f4(st.ciiOnVolume)]]}
          />
          {bands && (
            <div className="h-24 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={[{ name: 'CII', cii: st.cii }]} margin={{ top: 4, right: 20, bottom: 4, left: 10 }}>
                  <XAxis type="number" domain={[0, 2]} tick={AXIS} />
                  <YAxis type="category" dataKey="name" tick={AXIS} width={40} />
                  <ReferenceArea x1={0} x2={bands.STABLE} fill="#065f46" fillOpacity={0.3} />
                  <ReferenceArea x1={bands.STABLE} x2={bands.UNSTABLE} fill="#92400e" fillOpacity={0.3} />
                  <ReferenceArea x1={bands.UNSTABLE} x2={2} fill="#7f1d1d" fillOpacity={0.3} />
                  <ReferenceLine x={bands.STABLE} stroke="#fbbf24" label={{ value: String(bands.STABLE), fill: '#fbbf24', fontSize: 10, position: 'top' }} />
                  <ReferenceLine x={bands.UNSTABLE} stroke="#f87171" label={{ value: String(bands.UNSTABLE), fill: '#f87171', fontSize: 10, position: 'top' }} />
                  <Bar dataKey="cii" fill={SERIES[0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <Note>
            The bands are the two the engine exports, below {bands ? String(bands.STABLE) : 'the first'} stable and at or
            above {bands ? String(bands.UNSTABLE) : 'the second'} unstable. Between them the engine returns no verdict and
            says spot test. The bands are screening bands.
          </Note>
        </>
      )}
      {st.basis === 'api-contrast' && (
        <Note>
          The gravity screen: API contrast {f4(st.contrast)}. It can raise a flag and it can never clear one, so when it
          does not flag, the answer is No verdict.
        </Note>
      )}
      {usable(screen) && Array.isArray(screen.probes) && (
        <>
          <Lead>The gravity screen&apos;s two thresholds are not exported, so the engine was asked:</Lead>
          <Tbl
            head={['probe', 'lighter crude API', 'heavier crude API', 'API contrast', 'stable']}
            rows={screen.probes.map((q) => [q.what, String(q.lighter), String(q.heavier), f4(q.contrast), q.verdict])}
          />
          <Note>
            Found by bisection on the engine: API contrast {f4(screen.thresholds.contrast)}, lighter crude API
            {' '}{f4(screen.thresholds.lighter)}. A flag needs both at once.
          </Note>
          <Tbl head={['crude alone', 'CII']} rows={screen.alone.map((c) => [c.name, f4(c.cii)])} />
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

const AssayExplorer = ({ initialMode = 'blend' }) => {
  const [mode, setMode] = useState(initialMode);
  const [picks, setPicks] = useState(['obl', 'egm', NONE]);
  const [shares, setShares] = useState([65, 35, 20]);
  const [blank, setBlank] = useState({ id: NONE, key: 'sulfurWtPct' });
  const [curvePick, setCurvePick] = useState('ebp');
  const [pair, setPair] = useState(3);
  const [dropSara, setDropSara] = useState(false);

  const lib = useMemo(() => (mode === 'library' ? safe(library) : null), [mode]);
  const grav = useMemo(() => (mode === 'library' ? safe(gravity) : null), [mode]);
  const ref = useMemo(() => (mode === 'library' ? safe(refutas) : null), [mode]);
  const blend = useMemo(() => {
    if (mode !== 'blend') return null;
    const ids = picks.filter(Boolean);
    const sh = picks.map((id, i) => (id ? shares[i] : null)).filter((v) => v !== null);
    return safe(() => blendOf(ids, sh, { blank: blank.id ? blank : null }));
  }, [mode, picks, shares, blank]);
  const refusals = useMemo(() => (mode === 'blend' ? safe(() => blanksAndRefusals().refusals) : null), [mode]);
  const plot = useMemo(() => (mode === 'curve' ? safe(() => curvePlot(curvePick)) : null), [mode, curvePick]);
  const cuts = useMemo(() => (mode === 'curve' ? safe(() => cutsOf(curvePick)) : null), [mode, curvePick]);
  const st = useMemo(() => {
    if (mode !== 'stability') return null;
    const q = PAIRS[pair] || PAIRS[0];
    return safe(() => blendOf(q.ids, q.shares, { dropSara }).stability);
  }, [mode, pair, dropSara]);
  const screen = useMemo(() => (mode === 'stability' ? safe(stability) : null), [mode]);

  const onPick = (i, v) => setPicks((p) => p.map((x, k) => (k === i ? v : x)));
  const onShare = (i, v) => setShares((s) => s.map((x, k) => (k === i ? v : x)));

  return (
    <PanelShell
      title="Assay explorer"
      subtitle="The OBIGBO crude library and its export blend, blended by the engine. Every property is printed beside the basis the engine names, and at 65 and 35 of Obigbo Light and Egbema Medium every figure is the one the lessons quote."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'library' && <LibraryMode lib={lib} gravity={grav} refutas={ref} />}
        {mode === 'blend' && (
          <BlendMode blend={blend} refusals={refusals} picks={picks} shares={shares} blank={blank} onPick={onPick} onShare={onShare} onBlank={setBlank} />
        )}
        {mode === 'curve' && <CurveMode plot={plot} cuts={cuts} pick={curvePick} onPick={setCurvePick} />}
        {mode === 'stability' && <StabilityMode st={st} screen={screen} pair={pair} onPair={setPair} dropSara={dropSara} onDropSara={setDropSara} />}
      </div>
      <Note>
        Every figure, basis and refusal on this page is a return value of the vendored crudeAssay module through the
        teaching lab, printed to four decimals. Every crude is invented and illustrative.
      </Note>
    </PanelShell>
  );
};

export default AssayExplorer;
