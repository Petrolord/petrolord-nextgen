import React, { useMemo, useState } from 'react';
import * as L from './qiLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, num, Tbl, Refusal, Declared, CaseBox, parseCase, XYChart, CH,
} from './qiPanelBits';

// The feasibility explorer (Associate): is the data good enough, and can the
// seismic see the fluid? It runs the Associate engines through the teaching
// lab (qiLab.js) on a well of the Ekene teaching pack or on a case file a
// learner pastes: the data inventory, seismic QC (spectrum, band edges and the
// centroid, signal to noise, footprint), shear against Greenberg-Castagna and
// the local shear trend, the elastic set, fluids and oil-to-brine
// substitution, the wet trend and the distance from it, and modelled AVO at
// the top of the reservoir. Every stated input has a visible control that
// shows its value; an engine refusal prints in the engine's own words.

export const MODES = [
  ['inventory', 'Data inventory'],
  ['qc', 'Seismic QC'],
  ['shear', 'Shear and the local trend'],
  ['elastic', 'The elastic set'],
  ['substitution', 'Fluids and substitution'],
  ['wet', 'Wet trend and distance'],
  ['avo', 'Modelled AVO'],
];

const E = L.EKENE;
const SOURCE_OPTIONS = [...L.PACK_WELLS.map((w) => [w, `Ekene pack: ${w}`]), ['case', 'Paste a case file']];
const FORMS = [['linear', 'linear'], ['quadratic', 'quadratic']];
const YES_NO = [['no', 'off'], ['yes', 'on']];

/** The control values a source starts from: the course's Ekene settings, or what a case states. */
const startState = (c) => {
  const st = (c && c.stated) || {};
  const cond = (c && c.conditions) || L.PACK.conditions.ekene;
  const tr = c ? L.caseTraces(c) : null;
  const t0 = tr && !tr.error ? (c.traces.t0_ms || 0) : E.qcWindowsMs[0][0];
  const t1 = tr && !tr.error ? t0 + (tr.traces[0].length - 1) * tr.dtMs : E.qcWindowsMs[0][1];
  const w = c ? L.caseWell(c) : L.packWell('Ekene-1');
  const oil = w && !w.error ? L.zoneSamples(w, 'oil', { vshCut: st.netSandVshCut ?? E.netSandVshCut }) : [];
  return {
    taper: String(st.taper ?? E.qcTaper),
    t0: String(t0),
    t1: String(t1),
    maxLag: String(st.snrMaxLag ?? E.snrMaxLag),
    minPeriod: String(E.footprintPeriods[0]),
    maxPeriod: String(E.footprintPeriods[1]),
    stripe: 'no',
    vshCut: String(st.netSandVshCut ?? E.netSandVshCut),
    form: st.shearForm ?? E.shearForm,
    level: String(st.shearLevel ?? E.shearLevel),
    vpAt: '3100',
    shaleAboveFt: String(st.shaleAboveFt ?? E.shaleAboveFt),
    blockFt: String(st.trendBlockFt ?? E.trendBlockFt),
    sampleFt: String(st.substitutionSampleFt ?? (oil.length && !oil.error ? oil[Math.floor(oil.length / 2)].md_ft : '')),
    tF: String(cond.tF),
    pPsia: String(cond.pPsia),
    salinity: String(cond.salinity),
    api: String(cond.api),
    gorScfStb: String(cond.gorScfStb),
    gasSg: String(cond.gasSg),
  };
};

const QiFeasibilityExplorer = ({ initialMode = 'inventory', initialText = null, initialSource = null }) => {
  const [mode, setMode] = useState(initialMode);
  const [source, setSource] = useState(initialSource || (initialText ? 'case' : 'Ekene-1'));
  const [caseText, setCaseText] = useState(initialText || '');
  const parsed = source === 'case' ? parseCase(caseText) : null;
  const theCase = parsed && parsed.value ? parsed.value : null;
  const [s, setS] = useState(() => startState(initialText ? parseCase(initialText).value || null : null));
  const set = (k) => (v) => setS((o) => ({ ...o, [k]: v }));

  const onSource = (v) => {
    setSource(v);
    if (v !== 'case') setS(startState(null));
  };
  const onCase = (t) => {
    setCaseText(t);
    const p = parseCase(t);
    if (p.value) setS(startState(p.value));
  };

  const data = useMemo(() => {
    if (source === 'case') {
      if (!theCase) return { error: parsed ? parsed.error : 'No case.' };
      const well = L.caseWell(theCase);
      const tr = L.caseTraces(theCase);
      return {
        kind: 'case', well, traces: tr.error ? tr : tr.traces, neighbours: tr.error ? tr : tr.traces,
        dtMs: tr.error ? NaN : tr.dtMs, startMs: theCase.traces?.t0_ms || 0,
      };
    }
    return {
      kind: 'pack', well: L.packWell(source), traces: L.qcTraces('spread'), neighbours: L.qcTraces('neighbours'),
      dtMs: L.QC_CLOCK.dtMs, startMs: L.QC_CLOCK.t0Ms,
    };
  }, [source, theCase, parsed]);

  const cond = {
    tF: num(s.tF), pPsia: num(s.pPsia), salinity: num(s.salinity), api: num(s.api), gorScfStb: num(s.gorScfStb), gasSg: num(s.gasSg),
  };

  return (
    <PanelShell
      title="Feasibility explorer"
      subtitle="Is the data good enough, and can the seismic see the fluid? The Associate engines on a well of the Ekene teaching pack, or on a case file you paste."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        <SelectField label="Data" value={source} onChange={onSource} options={SOURCE_OPTIONS} />
        {source === 'case' && <CaseBox value={caseText} onChange={onCase} />}
      </FieldGrid>
      {data.error && <Note>{data.error}</Note>}
      {!data.error && data.well && data.well.error && <Refusal text={data.well.error} />}
      {!data.error && data.well && !data.well.error && (
        <div className="mt-1">
          {mode === 'inventory' && <InventoryView data={data} />}
          {mode === 'qc' && <QcView data={data} s={s} set={set} />}
          {mode === 'shear' && <ShearView data={data} s={s} set={set} />}
          {mode === 'elastic' && <ElasticView data={data} s={s} set={set} />}
          {mode === 'substitution' && <SubstitutionView data={data} s={s} set={set} cond={cond} />}
          {mode === 'wet' && <WetView data={data} s={s} set={set} cond={cond} />}
          {mode === 'avo' && <AvoView data={data} s={s} set={set} cond={cond} />}
        </div>
      )}
      <Note>
        This is the course&apos;s own explorer, and the Suite&apos;s QI Studio and Rock Physics Studio run the same
        engines: every number here is a return value of a vendored engine, printed to six decimals. Depths are in feet.
      </Note>
    </PanelShell>
  );
};

/* ------------------------------------------------------------ views */

const ZoneControls = ({ s, set, shale = false }) => (
  <>
    <NumField label="Net sand Vsh cut-off (stated)" value={s.vshCut} onChange={set('vshCut')} />
    {shale && <NumField label="Cap rock thickness above the top, ft (stated)" value={s.shaleAboveFt} onChange={set('shaleAboveFt')} />}
  </>
);

const ConditionControls = ({ s, set }) => (
  <FieldGrid>
    <NumField label="Temperature, degF (stated)" value={s.tF} onChange={set('tF')} />
    <NumField label="Pressure, psia (stated)" value={s.pPsia} onChange={set('pPsia')} />
    <NumField label="Brine salinity, weight fraction (stated)" value={s.salinity} onChange={set('salinity')} />
    <NumField label="Oil gravity, API (stated)" value={s.api} onChange={set('api')} />
    <NumField label="Gas-oil ratio, scf/stb (stated)" value={s.gorScfStb} onChange={set('gorScfStb')} />
    <NumField label="Gas gravity (stated)" value={s.gasSg} onChange={set('gasSg')} />
  </FieldGrid>
);

const InventoryView = ({ data }) => {
  const w = data.well;
  const counts = ['oil', 'water', 'shale'].map((z) => [z, L.zoneSamples(w, z).length]);
  return (
    <>
      <TileGrid>
        <Tile label="Well" value={w.name} />
        <Tile label="Top of the reservoir" value={six(w.topFt)} unit="ft" />
        <Tile label="Base of the reservoir" value={six(w.baseFt)} unit="ft" />
        <Tile label="Oil-water contact" value={six(w.owcFt)} unit="ft" />
        <Tile label="Log samples" value={String(w.rows.length)} />
        {counts.map(([z, n]) => <Tile key={z} label={`${z === 'shale' ? 'Cap rock' : `${z[0].toUpperCase()}${z.slice(1)} leg`} samples at the Ekene settings`} value={String(n)} />)}
      </TileGrid>
      {data.kind === 'pack' && (
        <Tbl
          head={['well', 'kind', 'logs', 'curves', 'sonic DT', 'shear DTS', 'density RHOB', 'checkshot levels', 'top Ekene Sand, ft']}
          rows={L.inventory().map((r) => [r.well, r.kind, r.logs ? 'yes' : 'no', r.logs ? String(r.curves.length) : 'none',
            r.logs ? (r.sonic ? 'yes' : 'no') : 'none', r.logs ? (r.shear ? 'yes' : 'no') : 'none',
            r.logs ? (r.density ? 'yes' : 'no') : 'none', String(r.checkshots), r.ekeneTop_ft == null ? 'none' : six(r.ekeneTop_ft)])}
        />
      )}
      {data.kind === 'case' && <Note>A case file carries one well; the inventory table above reads the Ekene pack headers when an Ekene well is chosen.</Note>}
    </>
  );
};

const QcView = ({ data, s, set }) => {
  const win = L.timeWindow(data.traces, { t0Ms: num(s.t0), t1Ms: num(s.t1), dtMs: data.dtMs, startMs: data.startMs });
  const spec = win.error ? win : L.spectrum(win, data.dtMs, { taper: num(s.taper) });
  const nwin = L.timeWindow(data.neighbours, { t0Ms: num(s.t0), t1Ms: num(s.t1), dtMs: data.dtMs, startMs: data.startMs });
  const sn = nwin.error ? nwin : L.snr(nwin, { maxLag: num(s.maxLag) });
  const slice = s.stripe === 'yes' ? L.withStripe(L.packSlice(), { period: 6, gain: 1.2 }) : L.packSlice();
  const fp = L.stripe(slice, { minPeriod: num(s.minPeriod), maxPeriod: num(s.maxPeriod) });
  const fmax = spec.error ? 0 : Math.min(100, spec.freqHz[spec.freqHz.length - 1]);
  return (
    <>
      <FieldGrid>
        <NumField label="Window start, ms (stated)" value={s.t0} onChange={set('t0')} />
        <NumField label="Window end, ms (stated)" value={s.t1} onChange={set('t1')} />
        <NumField label="Taper fraction (stated)" value={s.taper} onChange={set('taper')} />
        <NumField label="Maximum lag, samples (stated)" value={s.maxLag} onChange={set('maxLag')} />
      </FieldGrid>
      <p className="text-xs text-pl-muted mt-2 mb-0">
        {data.kind === 'pack'
          ? 'Spectra read the full-stack traces spread over the survey; signal to noise reads the neighbouring traces along the inline through Ekene-1.'
          : 'Spectra and signal to noise read every trace of the case, in the order the file gives them.'}
        {' '}Sample interval {six(data.dtMs)} ms.
      </p>
      {spec.error ? <Refusal text={spec.error} /> : (
        <>
          <XYChart
            label="Mean amplitude spectrum against frequency"
            xTitle="frequency, Hz" yTitle="amplitude"
            xRange={[0, fmax]}
            lines={[{ pts: spec.freqHz.map((f, k) => [f, spec.amp[k]]).filter((p) => p[0] <= fmax), color: CH.blue }]}
          />
          <TileGrid>
            <Tile label="Traces" value={String(spec.traces)} />
            <Tile label="Frequency step" value={six(spec.df)} unit="Hz" />
            <Tile label="Peak" value={six(spec.peakHz)} unit="Hz" />
            <Tile label="Centroid" value={six(spec.centroidHz)} unit="Hz" />
            <Tile label="-6 dB low edge" value={six(spec.low6Hz)} unit="Hz" />
            <Tile label="-6 dB high edge" value={six(spec.high6Hz)} unit="Hz" />
            <Tile label="-6 dB bandwidth" value={six(spec.bandwidth6Hz)} unit="Hz" />
            <Tile label="-20 dB low edge" value={six(spec.low20Hz)} unit="Hz" />
            <Tile label="-20 dB high edge" value={six(spec.high20Hz)} unit="Hz" />
          </TileGrid>
        </>
      )}
      {sn.error ? <Refusal text={sn.error} /> : (
        <TileGrid>
          <Tile label="Neighbouring pairs" value={String(sn.pairs)} />
          <Tile label="Median signal to noise (power)" value={six(sn.snr)} />
          <Tile label="Median signal to noise" value={six(sn.snrDb)} unit="dB" />
        </TileGrid>
      )}
      <p className="text-pl-text text-sm font-medium mt-4 mb-1">Footprint on the Ekene RMS amplitude slice</p>
      <FieldGrid>
        <NumField label="Shortest period, lines (stated)" value={s.minPeriod} onChange={set('minPeriod')} />
        <NumField label="Longest period, lines (stated)" value={s.maxPeriod} onChange={set('maxPeriod')} />
        <SelectField label="Designed stripe every sixth crossline, gain 1.2" value={s.stripe} onChange={set('stripe')} options={YES_NO} />
      </FieldGrid>
      {s.stripe === 'yes' && (
        <Declared title="A DESIGNED TEACHING CASE">
          The slice below has every sixth crossline multiplied by 1.2, a stripe the course adds to show what a footprint looks
          like. It is not in the Ekene data.
        </Declared>
      )}
      {fp.error ? <Refusal text={fp.error} /> : (
        <Tbl
          head={['axis', 'period, lines', 'share', 'prominence', 'cycles']}
          rows={[['along the crosslines', fp.alongCrossline, slice[0].length], ['along the inlines', fp.alongInline, slice.length]]
            .map(([a, v, n]) => [a, six(v.period), six(v.share), six(v.prominence), six(n / v.period)])}
        />
      )}
      <Note>QI Studio calls a stripe a footprint when its share is above 0.3, its prominence is 10 or more and it repeats at least five times across the slice.</Note>
    </>
  );
};

const ShearView = ({ data, s, set }) => {
  const wet = L.zoneSamples(data.well, 'water', { vshCut: num(s.vshCut) });
  const gc = wet.error ? wet : L.shearAgainstGc(wet);
  const vpAt = num(s.vpAt);
  const tr = wet.error ? wet : L.shearTrend(wet, { form: s.form, level: num(s.level), at: Number.isFinite(vpAt) ? [vpAt] : [] });
  const p = tr.error ? null : tr.predictions[0];
  return (
    <>
      <FieldGrid>
        <ZoneControls s={s} set={set} />
        <SelectField label="Trend form (stated)" value={s.form} onChange={set('form')} options={FORMS} />
        <NumField label="Prediction interval level (stated)" value={s.level} onChange={set('level')} />
        <NumField label="Predict at Vp, m/s" value={s.vpAt} onChange={set('vpAt')} />
      </FieldGrid>
      <p className="text-xs text-pl-muted mt-2 mb-0">The fit reads the water-leg net sand samples: net sand inside the reservoir, at or below the oil-water contact.</p>
      {tr.error ? <Refusal text={tr.error} /> : (
        <>
          <XYChart
            label="Measured shear against Vp, with the fitted local trend"
            xTitle="Vp, m/s" yTitle="Vs, m/s"
            points={[{ pts: wet.map((r) => [r.vp, r.vs]), color: CH.amber }]}
            lines={[{ pts: Array.from({ length: 21 }, (_, i) => { const v = tr.vpRange[0] + (i / 20) * (tr.vpRange[1] - tr.vpRange[0]); const q = L.shearTrend(wet, { form: s.form, level: num(s.level), at: [v] }); return [v, q.predictions[0].vs]; }), color: CH.blue }]}
          />
          <TileGrid>
            <Tile label="Samples n" value={String(tr.n)} />
            <Tile label="Degrees of freedom" value={String(tr.dof)} />
            <Tile label="c0" value={six(tr.coef[0])} unit="m/s" />
            <Tile label="c1, the slope" value={six(tr.coef[1])} unit="m/s per km/s" />
            {tr.coef.length > 2 && <Tile label="c2" value={six(tr.coef[2])} />}
            <Tile label="Residual standard error s" value={six(tr.s)} unit="m/s" />
            <Tile label="R squared" value={six(tr.r2)} />
            <Tile label="Lowest Vp" value={six(tr.vpRange[0])} unit="m/s" />
            <Tile label="Highest Vp" value={six(tr.vpRange[1])} unit="m/s" />
          </TileGrid>
          {p && (p.error ? <Refusal text={p.error} /> : (
            <TileGrid>
              <Tile label={`Predicted Vs at ${s.vpAt} m/s`} value={six(p.vs)} unit="m/s" />
              <Tile label="Sigma" value={six(p.sigma)} unit="m/s" />
              <Tile label="Interval low" value={six(p.lo)} unit="m/s" />
              <Tile label="Interval high" value={six(p.hi)} unit="m/s" />
              <Tile label="Extrapolated" value={p.extrapolated ? 'yes' : 'no'} />
            </TileGrid>
          ))}
          {!gc.error && (
            <>
              <p className="text-pl-text text-sm font-medium mt-4 mb-1">Measured shear against Greenberg-Castagna</p>
              <TileGrid><Tile label="Mean of measured / Greenberg-Castagna" value={six(gc.meanRatio)} /></TileGrid>
              <Tbl max head={['depth, ft', 'Vp, m/s', 'measured Vs, m/s', 'Vsh', 'Greenberg-Castagna Vs, m/s', 'measured / GC']}
                rows={gc.rows.map((r) => [six(r.md_ft), six(r.vp), six(r.vs), six(r.vsh), six(r.gc), six(r.ratio)])} />
            </>
          )}
        </>
      )}
    </>
  );
};

const ElasticView = ({ data, s, set }) => {
  const zones = [['cap rock', 'shale'], ['oil leg', 'oil'], ['water leg', 'water']];
  const rows = zones.map(([name, z]) => {
    const m = L.layerMeans(L.zoneSamples(data.well, z, { vshCut: num(s.vshCut), shaleAboveFt: num(s.shaleAboveFt) }));
    if (m.error) return [name, m.error, '', '', '', '', '', '', '', '', ''];
    const e = L.elastic(m.vp, m.vs, m.rho);
    return [name, String(m.n), six(m.vp), six(m.vs), six(m.rho), six(e.ai), six(e.si), six(e.vpvs), six(e.pr), six(e.lambdaRho / 1e12), six(e.muRho / 1e12)];
  });
  return (
    <>
      <FieldGrid><ZoneControls s={s} set={set} shale /></FieldGrid>
      <Tbl head={['layer', 'samples', 'Vp, m/s', 'Vs, m/s', 'density, kg/m3', 'AI, kg/(m2 s)', 'SI, kg/(m2 s)', 'Vp/Vs', "Poisson's ratio", 'lambda-rho, (GPa)(g/cc)', 'mu-rho, (GPa)(g/cc)']} rows={rows} />
      <Note>Each layer is the mean of its samples; the elastic set is elasticPoint on those means.</Note>
    </>
  );
};

const SubstitutionView = ({ data, s, set, cond }) => {
  const fluids = L.fluidsAt(cond);
  const oil = L.zoneSamples(data.well, 'oil', { vshCut: num(s.vshCut) });
  const zone = fluids.error || oil.error ? null : L.substituteZone(oil, fluids);
  const sample = L.sampleAt(data.well, num(s.sampleFt));
  const one = fluids.error || sample.error ? null : L.substituteSample(sample, fluids, { toSw: 1 });
  return (
    <>
      <ConditionControls s={s} set={set} />
      <FieldGrid>
        <ZoneControls s={s} set={set} />
        <NumField label="Sample depth, ft (stated)" value={s.sampleFt} onChange={set('sampleFt')} />
      </FieldGrid>
      {fluids.error ? <Refusal text={fluids.error} /> : (
        <Tbl head={['fluid', 'density, kg/m3', 'Vp, m/s', 'bulk modulus, GPa']}
          rows={[['brine', six(fluids.brine.rho), six(fluids.brine.vp), six(fluids.brine.k / 1e9)], ['live oil', six(fluids.oil.rho), six(fluids.oil.vp), six(fluids.oil.k / 1e9)]]} />
      )}
      <p className="text-pl-text text-sm font-medium mt-4 mb-1">The sample at {s.sampleFt} ft, taken to brine</p>
      {sample.error && <Note>{sample.error}</Note>}
      {one && (one.error ? <Refusal text={one.error} /> : (
        <TileGrid>
          <Tile label="PHIT" value={six(sample.phit)} />
          <Tile label="Vsh" value={six(sample.vsh)} />
          <Tile label="Sw" value={six(sample.sw)} />
          <Tile label="Mineral bulk modulus" value={six(one.kmin / 1e9)} unit="GPa" />
          <Tile label="In situ fluid bulk modulus" value={six(one.kflA / 1e9)} unit="GPa" />
          <Tile label="Vp brine" value={six(one.vp)} unit="m/s" />
          <Tile label="Vs brine" value={six(one.vs)} unit="m/s" />
          <Tile label="Density brine" value={six(one.rho)} unit="kg/m3" />
          <Tile label="AI in situ" value={six(one.aiBefore)} unit="kg/(m2 s)" />
          <Tile label="AI after substitution to brine" value={six(one.aiAfter)} unit="kg/(m2 s)" />
          <Tile label="Vp/Vs in situ" value={six(one.vpvsBefore)} />
          <Tile label="Vp/Vs after substitution to brine" value={six(one.vpvsAfter)} />
        </TileGrid>
      ))}
      {zone && (zone.error ? <Refusal text={zone.error} /> : (
        <>
          <p className="text-pl-text text-sm font-medium mt-4 mb-1">The oil leg, sample by sample ({zone.n} net sand samples)</p>
          <TileGrid>
            <Tile label="Mean AI in situ" value={six(zone.aiBefore)} />
            <Tile label="Mean AI brine" value={six(zone.aiAfter)} />
            <Tile label="Mean Vp/Vs in situ" value={six(zone.vpvsBefore)} />
            <Tile label="Mean Vp/Vs brine" value={six(zone.vpvsAfter)} />
          </TileGrid>
          <Tbl max head={['depth, ft', 'AI in situ', 'AI brine', 'Vp/Vs in situ', 'Vp/Vs brine']}
            rows={zone.rows.map((r) => [six(r.md_ft), six(r.aiBefore), six(r.aiAfter), six(r.vpvsBefore), six(r.vpvsAfter)])} />
        </>
      ))}
      <Note>Quartz and clay by Voigt-Reuss-Hill on Vsh, brine and oil by Wood at the sample&apos;s Sw, then Gassmann through the dry rock with the sample&apos;s PHIT.</Note>
    </>
  );
};

/** The top interface, in situ and with the oil leg taken to brine, from the stated selections. */
const topInterface = (well, s, fluids) => {
  const shale = L.layerMeans(L.zoneSamples(well, 'shale', { shaleAboveFt: num(s.shaleAboveFt) }));
  const oilS = L.zoneSamples(well, 'oil', { vshCut: num(s.vshCut) });
  const oil = L.layerMeans(oilS);
  if (shale.error) return { error: shale.error };
  if (oil.error) return { error: oil.error };
  const z = L.substituteZone(oilS, fluids);
  if (z.error) return { error: z.error };
  return { shale, oil, brine: { vp: z.vpAfter, vs: z.vsAfter, rho: z.rhoAfter } };
};

const WetView = ({ data, s, set, cond }) => {
  const fluids = L.fluidsAt(cond);
  const wt = fluids.error ? fluids : L.wetTrend(data.well, fluids, { blockFt: num(s.blockFt) });
  const top = fluids.error ? fluids : topInterface(data.well, s, fluids);
  const ok = !wt.error && !top.error;
  const abIn = ok ? L.interfaceAB(top.shale, top.oil) : null;
  const abBr = ok ? L.interfaceAB(top.shale, top.brine) : null;
  const ax = ok ? Math.max(...wt.points.map((p) => Math.abs(p.a)), Math.abs(abIn.a), Math.abs(abBr.a)) * 1.1 : 1;
  return (
    <>
      <FieldGrid>
        <NumField label="Block length, ft (stated)" value={s.blockFt} onChange={set('blockFt')} />
        <ZoneControls s={s} set={set} shale />
      </FieldGrid>
      <ConditionControls s={s} set={set} />
      {wt.error && <Refusal text={wt.error} />}
      {!wt.error && top.error && <Refusal text={top.error} />}
      {ok && (
        <>
          <XYChart
            label="Intercept against gradient: the wet trend, the published line and the top interface"
            xTitle="intercept A" yTitle="gradient B"
            points={[{ pts: wt.points.map((p) => [p.a, p.b]), color: CH.blue }, { pts: [[abIn.a, abIn.b]], color: CH.red, r: 4 }, { pts: [[abBr.a, abBr.b]], color: CH.green, r: 4 }]}
            lines={[{ pts: [[-ax, -ax * wt.line.slope], [ax, ax * wt.line.slope]], color: CH.ink }, { pts: [[-ax, -ax * wt.castagnaSlope], [ax, ax * wt.castagnaSlope]], color: CH.violet, dash: '5 3' }]}
            xRange={[-ax, ax]}
          />
          <Note>Blue points: the block boundaries of the window taken to brine. Ink line: the fitted wet trend. Dashed violet line: the published line. Red: the top in situ. Green: the top with brine.</Note>
          <TileGrid>
            <Tile label="Samples" value={String(wt.samples)} />
            <Tile label="Substituted samples" value={String(wt.substituted)} />
            <Tile label="Samples a block" value={String(wt.blockSamples)} />
            <Tile label="Interfaces" value={String(wt.points.length)} />
            <Tile label="Fitted slope B / A" value={six(wt.line.slope)} />
            <Tile label="Fitted angle" value={six(wt.line.angleDeg)} unit="degrees" />
            <Tile label="RMS distance of the points" value={six(wt.line.rmsDistance)} />
            <Tile label="Mean Vs/Vp of the blocks" value={six(wt.vsVp)} />
            <Tile label="Published slope at that Vs/Vp" value={six(wt.castagnaSlope)} />
          </TileGrid>
          <Tbl
            head={['top interface', 'A', 'B', 'distance from the fitted line', 'distance from the published line']}
            rows={[['cap rock over the oil leg, in situ', abIn], ['cap rock over the oil leg taken to brine', abBr]].map(([n, ab]) => (ab.error
              ? [n, ab.error, '', '', '']
              : [n, six(ab.a), six(ab.b), six(L.distance(ab.a, ab.b, wt.line.slope)), six(L.distance(ab.a, ab.b, wt.castagnaSlope))]))}
          />
        </>
      )}
    </>
  );
};

const AvoView = ({ data, s, set, cond }) => {
  const fluids = L.fluidsAt(cond);
  const top = fluids.error ? fluids : topInterface(data.well, s, fluids);
  const inS = top.error ? null : L.modelledAvo(top.shale, top.oil);
  const br = top.error ? null : L.modelledAvo(top.shale, top.brine);
  const bad = top.error || (inS && inS.error) || (br && br.error);
  return (
    <>
      <FieldGrid><ZoneControls s={s} set={set} shale /></FieldGrid>
      <ConditionControls s={s} set={set} />
      <p className="text-xs text-pl-muted mt-2 mb-0">
        Angles (stated): {E.avoAngles.join(', ')} degrees. Stacks (stated): near {E.stacks.near.join(' to ')}, mid {E.stacks.mid.join(' to ')}, far {E.stacks.far.join(' to ')} degrees, every whole degree.
      </p>
      {bad ? <Refusal text={top.error || inS.error || br.error} /> : (
        <>
          <XYChart
            label="Exact reflection coefficient against angle, in situ and with brine"
            xTitle="angle, degrees" yTitle="R"
            lines={[{ pts: inS.exact.map((x) => [x.angle, x.r]), color: CH.red }, { pts: br.exact.map((x) => [x.angle, x.r]), color: CH.blue }]}
          />
          <Note>Red: in situ (oil). Blue: the oil leg taken to brine.</Note>
          <Tbl head={['angle, degrees', 'exact R in situ', 'exact R brine']} rows={inS.exact.map((x, i) => [String(x.angle), six(x.r), six(br.exact[i].r)])} />
          <Tbl head={['quantity', 'in situ (oil)', 'brine']} rows={[
            ['A', six(inS.a), six(br.a)], ['B', six(inS.b), six(br.b)], ['C', six(inS.c), six(br.c)], ['class', inS.avoClass, br.avoClass],
            ['near mean', six(inS.stackMeans.near), six(br.stackMeans.near)], ['mid mean', six(inS.stackMeans.mid), six(br.stackMeans.mid)], ['far mean', six(inS.stackMeans.far), six(br.stackMeans.far)],
          ]} />
        </>
      )}
    </>
  );
};

export default QiFeasibilityExplorer;
