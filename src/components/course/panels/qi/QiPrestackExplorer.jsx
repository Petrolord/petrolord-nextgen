import React, { useMemo, useState } from 'react';
import * as L from './qiLab';
import * as P from './qiLabPro';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, num, Tbl, Refusal, Declared, CaseBox, parseCase, XYChart, CH,
} from './qiPanelBits';

// The prestack explorer (Professional): from the tie to AVO on the seismic.
// It runs the Professional engines through the teaching lab (qiLabPro.js) on
// the Ekene teaching pack (traces at Ekene-1 to Ekene-4, their checkshots, the
// gathers next to Ekene-1 and the published RMS velocity table) or on a case
// file a learner pastes (one NMO-corrected gather, its RMS velocity table and
// four wells' intercepts and gradients): wavelets and phase, the tie and the
// time-depth record, the field wavelet, gather QC, Dix and Walden, angle
// gathers and partial stacks, the Shuey fit and its trend, and AVO at the
// wells. Every stated input has a visible control showing its value; an
// engine refusal prints in the engine's own words.

export const MODES = [
  ['wavelet', 'Wavelets and phase'],
  ['tie', 'The tie and the time-depth record'],
  ['compare', 'Wavelets across wells'],
  ['gathers', 'Gathers and their QC'],
  ['velocity', 'Dix and Walden'],
  ['angles', 'Angle gathers and partial stacks'],
  ['avo', 'Shuey fit and the background trend'],
  ['wells', 'AVO at the wells'],
];

const E = P.EKENE_PRO;
const WELLS = L.PACK_WELLS;
const SOURCE_OPTIONS = [['ekene', 'Ekene teaching pack'], ['case', 'Paste a case file']];
const WELL_OPTIONS = WELLS.map((w) => [w, w]);
const TERMS = [['2', 'two terms'], ['3', 'three terms']];
const ROTATIONS = [['0', 'none'], ['90', 'Ekene-3 rotated by 90 degrees'], ['180', 'Ekene-3 rotated by 180 degrees']];

const list = (s) => String(s).split(',').map((x) => num(x)).filter((x) => Number.isFinite(x));
const listText = (a) => a.join(', ');

const TextField = ({ label, value, onChange }) => (
  <div>
    <Label className="text-pl-muted text-xs mb-1 block">{label}</Label>
    <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="h-8 text-sm" />
  </div>
);

/** A pasted case in the prestack shape: { table, gather, wells, stated } or { error }. */
const caseData = (c) => {
  if (!c || !c.velocity || !Array.isArray(c.velocity.rows)) return { error: 'The case has no velocity block.' };
  const g = c.gather;
  if (!g || !Array.isArray(g.traces) || !Array.isArray(g.offsets_m) || !(g.dt_ms > 0)) return { error: 'The case has no gather block with traces, offsets_m and dt_ms.' };
  return {
    table: { tMs: c.velocity.rows.map((r) => r[0]), vrms: c.velocity.rows.map((r) => r[1]) },
    gather: { traces: g.traces, offsets: g.offsets_m, dtMs: g.dt_ms, t0Ms: g.t0_ms || 0 },
    wells: Array.isArray(c.wells) ? c.wells : [],
    stated: c.stated || {},
  };
};

/** The control values a source starts from: the course's Ekene settings, or what a case states. */
const startState = (c) => {
  const cd = c ? caseData(c) : null;
  const st = cd && !cd.error ? cd.stated : {};
  const top1 = P.checkshotTwt('Ekene-1', L.packWell('Ekene-1').topFt);
  const tEk = Number.isFinite(top1) ? Math.round(top1) : 1200;
  const event = st.targetMs ?? tEk;
  const tab = cd && !cd.error ? cd.table : P.packVelocity();
  return {
    well: 'Ekene-1',
    wt0: String(E.waveletWindowMs[0]),
    wt1: String(E.waveletWindowMs[1]),
    wlen: String(E.waveletLengthMs),
    wsmooth: String(E.waveletSmoothHz),
    csShift: '0',
    maxLag: String(E.bulkMaxLagMs),
    cmpLag: String(E.compareMaxLag),
    rotate: '0',
    gather: '5',
    binWidth: String(E.binWidthM),
    eventMs: String(event),
    pickHalf: String(E.pickHalfWindowMs),
    maxStretch: String(E.maxStretch),
    rmoWindow: String(E.rmoWindowMs),
    rmoMaxLag: String(E.rmoMaxLagMs),
    rmoNear: String(E.rmoNearCount),
    timeMs: String(st.timeMs ?? event),
    offsetM: String(st.offsetM ?? 1500),
    dixTo: String(st.dixLayer ? st.dixLayer.toMs : tab.tMs[tab.tMs.length - 1]),
    edges: listText(st.angleEdges ?? E.angleEdges),
    minFold: String(E.minFold),
    sampleMs: String(st.targetMs ?? event),
    farFrom: String(st.farBins ? st.farBins[0] : 2),
    farTo: String(st.farBins ? st.farBins[1] : 3),
    stackAngles: listText(st.stackAngles ?? E.stackAngles),
    terms: String(st.shueyTerms ?? 2),
    vsVp: '0.5',
    scale: '1',
    chiDeg: String(E.chiDeg),
  };
};

const QiPrestackExplorer = ({ initialMode = 'wavelet', initialText = null }) => {
  const [mode, setMode] = useState(initialMode);
  const [source, setSource] = useState(initialText ? 'case' : 'ekene');
  const [caseText, setCaseText] = useState(initialText || '');
  const parsed = source === 'case' ? parseCase(caseText) : null;
  const [s, setS] = useState(() => startState(initialText ? parseCase(initialText).value || null : null));
  const set = (k) => (v) => setS((o) => ({ ...o, [k]: v }));

  const onSource = (v) => { setSource(v); if (v !== 'case') setS(startState(null)); };
  const onCase = (t) => { setCaseText(t); const p = parseCase(t); if (p.value) setS(startState(p.value)); };

  const data = useMemo(() => {
    if (source === 'case') {
      if (!parsed || !parsed.value) return { error: parsed ? parsed.error : 'No case.' };
      const cd = caseData(parsed.value);
      return cd.error ? cd : { kind: 'case', ...cd };
    }
    return { kind: 'pack', table: P.packVelocity() };
  }, [source, parsed]);

  const gather = data.error ? null : (data.kind === 'case' ? data.gather : P.packGather(num(s.gather)));

  return (
    <PanelShell
      title="Prestack explorer"
      subtitle="From the tie to AVO on the seismic. The Professional engines on the Ekene teaching pack, or on a case file you paste."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        <SelectField label="Data" value={source} onChange={onSource} options={SOURCE_OPTIONS} />
        {source === 'case' && <CaseBox value={caseText} onChange={onCase} />}
      </FieldGrid>
      {data.error && <Note>{data.error}</Note>}
      {!data.error && (
        <div className="mt-1">
          {['wavelet', 'tie', 'compare'].includes(mode) && data.kind === 'case' && (
            <Note>This view reads the Ekene pack&apos;s traces and checkshots at the wells; a prestack case carries none. Choose the Ekene teaching pack as the data.</Note>
          )}
          {mode === 'wavelet' && data.kind === 'pack' && <WaveletView s={s} set={set} />}
          {mode === 'tie' && data.kind === 'pack' && <TieView s={s} set={set} />}
          {mode === 'compare' && data.kind === 'pack' && <CompareView s={s} set={set} />}
          {mode === 'gathers' && <GathersView data={data} gather={gather} s={s} set={set} />}
          {mode === 'velocity' && <VelocityView data={data} s={s} set={set} />}
          {mode === 'angles' && <AnglesView data={data} gather={gather} s={s} set={set} />}
          {mode === 'avo' && <AvoView data={data} gather={gather} s={s} set={set} />}
          {mode === 'wells' && <WellsView data={data} s={s} set={set} />}
        </div>
      )}
      <Note>
        This is the course&apos;s own explorer, and the Suite&apos;s QI Studio and Seismolord run the same engines: every
        number here is a return value of a vendored engine, printed to six decimals. Depths are in feet, offsets in metres,
        times in two-way milliseconds.
      </Note>
    </PanelShell>
  );
};

/* ------------------------------------------------------------ views */

const WaveletControls = ({ s, set }) => (
  <FieldGrid>
    <SelectField label="Well" value={s.well} onChange={set('well')} options={WELL_OPTIONS} />
    <NumField label="Trace window start, ms (stated)" value={s.wt0} onChange={set('wt0')} />
    <NumField label="Trace window end, ms (stated)" value={s.wt1} onChange={set('wt1')} />
    <NumField label="Wavelet length, ms (stated)" value={s.wlen} onChange={set('wlen')} />
    <NumField label="Spectral smoothing, Hz (stated)" value={s.wsmooth} onChange={set('wsmooth')} />
  </FieldGrid>
);

const waveletOf = (well, s) => P.wellStatWavelet(well, { window: [num(s.wt0), num(s.wt1)], lengthMs: num(s.wlen), smoothHz: num(s.wsmooth) });

const WaveletView = ({ s, set }) => {
  const w = waveletOf(s.well, s);
  const dt = L.PACK.wellTraces.dt_ms;
  const sp = w.error ? null : P.waveletSpectrum(w, dt);
  const syn = w.error ? null : P.synthetic(s.well, w, { shiftMs: num(s.csShift) });
  const tr = P.wellTrace(s.well, 'full');
  const ph = syn && !syn.error ? P.phaseMatch(syn.synthetic, tr.values) : null;
  const half = w.error ? 0 : (w.length - 1) / 2;
  return (
    <>
      <WaveletControls s={s} set={set} />
      <p className="text-xs text-pl-muted mt-2 mb-0">The statistical wavelet reads the full-stack trace at the well over the stated window; its phase is assumed zero. Sample interval {six(dt)} ms.</p>
      {w.error ? <Refusal text={w.error} /> : (
        <>
          <XYChart label="The statistical wavelet against time from its centre" xTitle="time, ms" yTitle="amplitude"
            lines={[{ pts: w.map((v, k) => [(k - half) * dt, v]), color: CH.blue }]} />
          <TileGrid>
            <Tile label="Samples" value={String(w.length)} />
            {sp && !sp.error && <Tile label="Peak" value={six(sp.peakHz)} unit="Hz" />}
            {sp && !sp.error && <Tile label="Centroid" value={six(sp.centroidHz)} unit="Hz" />}
            {sp && !sp.error && <Tile label="-6 dB low edge" value={six(sp.low6Hz)} unit="Hz" />}
            {sp && !sp.error && <Tile label="-6 dB high edge" value={six(sp.high6Hz)} unit="Hz" />}
          </TileGrid>
          <p className="text-pl-text text-sm font-medium mt-4 mb-1">Phase of the synthetic against the trace</p>
          {syn && syn.error && <Refusal text={syn.error} />}
          {ph && (ph.error ? <Refusal text={ph.error} /> : (
            <TileGrid>
              <Tile label="Best constant phase" value={six(ph.phiDeg)} unit="degrees" />
              <Tile label="Correlation before rotation" value={six(ph.corr0)} />
              <Tile label="Correlation after rotation" value={six(ph.corr)} />
            </TileGrid>
          ))}
        </>
      )}
    </>
  );
};

const TieView = ({ s, set }) => {
  const w = waveletOf(s.well, s);
  const tr = P.wellTrace(s.well, 'full');
  const syn = w.error ? w : P.synthetic(s.well, w, { shiftMs: num(s.csShift) });
  const bs = syn.error ? null : P.bulkShift(syn.synthetic, tr.values, tr.dtMs, { maxLagMs: num(s.maxLag) });
  const pts = syn.error ? [] : Array.from(syn.synthetic).map((v, i) => [P.sampleTime(tr, i), v]).filter((p) => Number.isFinite(p[1]));
  const t0 = pts.length ? pts[0][0] : 0;
  const t1 = pts.length ? pts[pts.length - 1][0] : 0;
  const peak = (arr) => Math.max(1e-12, ...arr.map((p) => Math.abs(p[1])));
  const seis = Array.from(tr.values).map((v, i) => [P.sampleTime(tr, i), v]).filter((p) => p[0] >= t0 && p[0] <= t1);
  const cs = L.PACK.checkshots[s.well].rows;
  return (
    <>
      <WaveletControls s={s} set={set} />
      <FieldGrid>
        <NumField label="Checkshot times moved by, ms (stated)" value={s.csShift} onChange={set('csShift')} />
        <NumField label="Bulk shift search, ms (stated)" value={s.maxLag} onChange={set('maxLag')} />
      </FieldGrid>
      {num(s.csShift) !== 0 && (
        <Declared title="A DESIGNED TEACHING CASE">The checkshot times are moved by the stated amount before the synthetic is built, to show the bulk shift finding the move back. The Ekene checkshots are as the kit records them.</Declared>
      )}
      {syn.error ? <Refusal text={syn.error} /> : (
        <>
          <XYChart label="The synthetic and the full-stack trace at the well, each scaled to its own peak" xTitle="two-way time, ms" yTitle="scaled amplitude"
            lines={[{ pts: pts.map((p) => [p[0], p[1] / peak(pts)]), color: CH.red }, { pts: seis.map((p) => [p[0], p[1] / peak(seis)]), color: CH.blue }]} />
          <Note>Red: the synthetic. Blue: the full-stack trace at the well.</Note>
          <TileGrid>
            <Tile label="Live synthetic samples" value={String(syn.live)} />
            {bs && !bs.error && <Tile label="Bulk shift" value={six(bs.lagMs)} unit="ms" />}
            {bs && !bs.error && <Tile label="Correlation at that shift" value={six(bs.corr)} />}
          </TileGrid>
          {bs && bs.error && <Refusal text={bs.error} />}
        </>
      )}
      <p className="text-pl-text text-sm font-medium mt-4 mb-1">The time-depth record</p>
      <Tbl head={['well', 'top of the reservoir, ft', 'two-way time at the top, ms']}
        rows={WELLS.map((wl) => { const pw = L.packWell(wl); const t = P.checkshotTwt(wl, pw.topFt); return [wl, six(pw.topFt), t && t.error ? t.error : six(t)]; })} />
      <Tbl max head={['depth, ft', 'one-way time, ms', 'two-way time, ms']} rows={cs.map((r) => [six(L.mToFt(r[0])), six(r[1]), six(2 * r[1])])} />
      <Note>Two-way time is twice the checkshot&apos;s one-way time, linear between checkshot levels.</Note>
    </>
  );
};

const CompareView = ({ s, set }) => {
  const rot = num(s.rotate);
  const ws = WELLS.map((wl) => ({ name: wl, samples: waveletOf(wl, s) }));
  const bad = ws.find((w) => w.samples.error);
  const used = bad ? null : ws.map((w) => (rot && w.name === 'Ekene-3' ? { name: w.name, samples: P.rotate(w.samples, rot) } : w));
  const cmp = used ? P.compare(used, { maxLag: num(s.cmpLag) }) : null;
  const dt = L.PACK.wellTraces.dt_ms;
  const avSp = cmp && !cmp.error ? P.waveletSpectrum(Array.from(cmp.average), dt) : null;
  return (
    <>
      <WaveletControls s={s} set={set} />
      <FieldGrid>
        <NumField label="Alignment search, samples (stated)" value={s.cmpLag} onChange={set('cmpLag')} />
        <SelectField label="Designed rotation" value={s.rotate} onChange={set('rotate')} options={ROTATIONS} />
      </FieldGrid>
      {rot !== 0 && <Declared title="A DESIGNED TEACHING CASE">Ekene-3&apos;s wavelet is rotated by the stated phase before the comparison, to show a well that disagrees. The Ekene wavelets are not rotated.</Declared>}
      {bad && <Refusal text={bad.samples.error} />}
      {cmp && (cmp.error ? <Refusal text={cmp.error} /> : (
        <>
          <Tbl head={['well', 'lag to the reference, samples', 'correlation with the average', ...WELLS]}
            rows={cmp.aligned.map((a, i) => [a.name, String(a.lag), six(cmp.misfit[i].corrToAverage), ...cmp.similarity[i].map(six)])} />
          <TileGrid>
            <Tile label="Field wavelet samples" value={String(cmp.average.length)} />
            {avSp && !avSp.error && <Tile label="Field wavelet peak" value={six(avSp.peakHz)} unit="Hz" />}
            {avSp && !avSp.error && <Tile label="Field wavelet centroid" value={six(avSp.centroidHz)} unit="Hz" />}
          </TileGrid>
          <Note>QI Studio calls a well whose wavelet correlates with the average below 0.8 unlike the others.</Note>
        </>
      ))}
    </>
  );
};

const GathersView = ({ data, gather, s, set }) => {
  if (gather && gather.error) return <Refusal text={gather.error} />;
  const bins = P.offsetBins(gather.offsets, num(s.binWidth));
  const pick = P.pickEvent(gather, gather.traces[0], num(s.eventMs), { halfWindowMs: num(s.pickHalf) });
  const v = pick.error ? null : P.velocityAt(data.table, pick.tMs);
  const r = pick.error ? null : P.rmo(gather, pick.tMs, { windowMs: num(s.rmoWindow), maxLagMs: num(s.rmoMaxLag), nearCount: num(s.rmoNear) });
  return (
    <>
      <FieldGrid>
        {data.kind === 'pack' && <SelectField label="Gather" value={s.gather} onChange={set('gather')} options={L.PACK.gathers.cdps.map((c, k) => [String(k), `gather ${k}: inline ${c.inline}, crossline ${c.crossline}`])} />}
        <NumField label="Offset bin width, m (stated)" value={s.binWidth} onChange={set('binWidth')} />
        <NumField label="Event near, ms (stated)" value={s.eventMs} onChange={set('eventMs')} />
        <NumField label="Pick half window, ms (stated)" value={s.pickHalf} onChange={set('pickHalf')} />
        <NumField label="Stretch limit, fraction (stated)" value={s.maxStretch} onChange={set('maxStretch')} />
        <NumField label="Moveout half window, ms (stated)" value={s.rmoWindow} onChange={set('rmoWindow')} />
        <NumField label="Moveout largest shift, ms (stated)" value={s.rmoMaxLag} onChange={set('rmoMaxLag')} />
        <NumField label="Pilot traces, nearest (stated)" value={s.rmoNear} onChange={set('rmoNear')} />
      </FieldGrid>
      <p className="text-xs text-pl-muted mt-2 mb-0">{gather.offsets.length} offsets from {gather.offsets[0]} to {gather.offsets[gather.offsets.length - 1]} m, every {six(gather.dtMs)} ms from {gather.t0Ms} ms. The event is the largest amplitude on the nearest offset within the half window.</p>
      {bins.error ? <Refusal text={bins.error} /> : (() => {
        const fs = P.foldOf(bins.fold, bins.centres, 1);
        return (
          <TileGrid>
            <Tile label="Offset bins" value={String(bins.fold.length)} />
            <Tile label="Traces" value={String(fs.total)} />
            <Tile label="Live bins" value={String(fs.liveBins)} />
            <Tile label="Far offset (bin centre)" value={six(fs.farOffset)} unit="m" />
          </TileGrid>
        );
      })()}
      {pick.error ? <Refusal text={pick.error} /> : (
        <>
          <TileGrid>
            <Tile label="Event picked" value={six(pick.tMs)} unit="ms" />
            {v && !v.error && <Tile label="RMS velocity there" value={six(v.vrms)} unit="m/s" />}
            {v && !v.error && <Tile label="Stretch mute offset" value={six(P.muteOffset(pick.tMs, v.vrms, num(s.maxStretch)))} unit="m" />}
          </TileGrid>
          {v && !v.error && (
            <Tbl max head={['offset, m', 'NMO stretch', 'Walden angle, degrees']}
              rows={gather.offsets.map((x) => [String(x), six(P.stretch(x, pick.tMs, v.vrms)), six(P.walden(x, pick.tMs, v.vrms, v.vint))])} />
          )}
          {r && (r.error ? <Refusal text={r.error} /> : (
            <>
              <TileGrid>
                <Tile label="Residual moveout method" value={r.method || 'none'} />
                <Tile label="Offsets used" value={String(r.used)} />
                <Tile label="Offsets fitted" value={String(r.fitted)} />
                <Tile label="Residual at the far offset" value={six(r.rmoFarMs)} unit="ms" />
              </TileGrid>
              <Tbl max head={['offset, m', 'lag, ms', 'correlation']} rows={(r.lagsMs || []).map((l, k) => [String([...gather.offsets].sort((a, b) => a - b)[k]), six(l), six(r.corr[k])])} />
            </>
          ))}
        </>
      )}
    </>
  );
};

const VelocityView = ({ data, s, set }) => {
  const tab = data.table;
  const vint = P.dix(tab);
  const v = P.velocityAt(tab, num(s.timeMs));
  const x = num(s.offsetM);
  const li = tab.tMs.indexOf(num(s.dixTo));
  const earth = [{ thicknessM: 600, v: 1800 }, { thicknessM: 600, v: 2200 }, { thicknessM: 500, v: 2600 }, { thicknessM: 400, v: 3000 }];
  const lr = P.layered(earth);
  return (
    <>
      <FieldGrid>
        <SelectField label="Dix layer ending at, ms (stated)" value={s.dixTo} onChange={set('dixTo')} options={tab.tMs.slice(1).map((t) => [String(t), String(t)])} />
        <NumField label="Time, ms (stated)" value={s.timeMs} onChange={set('timeMs')} />
        <NumField label="Offset, m (stated)" value={s.offsetM} onChange={set('offsetM')} />
        <NumField label="Stretch limit, fraction (stated)" value={s.maxStretch} onChange={set('maxStretch')} />
      </FieldGrid>
      {vint.error ? <Refusal text={vint.error} /> : (
        <>
          <Tbl head={['two-way time, ms', 'RMS velocity, m/s', 'Dix interval velocity, m/s']} rows={tab.tMs.map((t, i) => [six(t), six(tab.vrms[i]), six(vint[i])])} />
          {li > 0 && <TileGrid><Tile label={`Dix interval velocity, ${tab.tMs[li - 1]} to ${tab.tMs[li]} ms`} value={six(vint[li])} unit="m/s" /></TileGrid>}
        </>
      )}
      {v.error ? <Refusal text={v.error} /> : (
        <TileGrid>
          <Tile label="RMS velocity at the time" value={six(v.vrms)} unit="m/s" />
          <Tile label="Interval velocity at the time" value={six(v.vint)} unit="m/s" />
          <Tile label="Walden angle at the offset and time" value={six(P.walden(x, num(s.timeMs), v.vrms, v.vint))} unit="degrees" />
          <Tile label="NMO stretch at the offset and time" value={six(P.stretch(x, num(s.timeMs), v.vrms))} />
          <Tile label="Stretch mute offset at the time" value={six(P.muteOffset(num(s.timeMs), v.vrms, num(s.maxStretch)))} unit="m" />
        </TileGrid>
      )}
      <Note>The RMS velocity is linear in time between table rows and flat outside; the interval velocity is the Dix velocity of the segment the time falls in; the NMO velocity is the RMS velocity.</Note>
      <p className="text-pl-text text-sm font-medium mt-4 mb-1">Walden against an exact ray trace</p>
      <Declared title="A DESIGNED TEACHING CASE">A flat four-layer earth (600 m at 1800 m/s, 600 m at 2200 m/s, 500 m at 2600 m/s, 400 m at 3000 m/s), read at the base of the third layer.</Declared>
      <Tbl head={['offset, m', 'Walden, degrees', 'ray trace, degrees']}
        rows={[500, 1000, 1500, 2000, 2500, 3000].map((xx) => { const rt = P.rayTrace(earth, 2, xx); return [String(xx), six(P.walden(xx, lr[2].t0 * 1000, lr[2].vrms, earth[2].v)), rt && rt.error ? rt.error : six(rt)]; })} />
    </>
  );
};

const AngleControls = ({ s, set }) => (
  <FieldGrid>
    <TextField label="Angle bin edges, degrees (stated)" value={s.edges} onChange={set('edges')} />
    <NumField label="Sample time, ms (stated)" value={s.sampleMs} onChange={set('sampleMs')} />
  </FieldGrid>
);

const angleRun = (data, gather, s) => {
  if (gather && gather.error) return gather;
  const edges = list(s.edges);
  const ag = P.angles(gather, data.table, { edges });
  if (ag.error) return ag;
  const i = Math.round((num(s.sampleMs) - gather.t0Ms) / gather.dtMs);
  if (!(i >= 0 && i < gather.traces[0].length)) return { error: `The sample time ${s.sampleMs} ms is outside the gather.` };
  return { edges, ag, i };
};

const AnglesView = ({ data, gather, s, set }) => {
  const run = angleRun(data, gather, s);
  return (
    <>
      <AngleControls s={s} set={set} />
      <FieldGrid>
        <NumField label="Minimum fold (stated)" value={s.minFold} onChange={set('minFold')} />
        <NumField label="Far stack from bin (stated)" value={s.farFrom} onChange={set('farFrom')} />
        <NumField label="Far stack to bin, excluded (stated)" value={s.farTo} onChange={set('farTo')} />
      </FieldGrid>
      {run.error ? <Refusal text={run.error} /> : (() => {
        const { edges, ag, i } = run;
        const far = P.stackOf(ag, num(s.farFrom), num(s.farTo))[i];
        const us = P.usable(ag, edges, num(s.minFold))[i];
        return (
          <>
            <Tbl head={['bin', 'angles, degrees', 'fold', 'mean amplitude', 'partial stack of this bin alone']}
              rows={ag.gather.map((b, k) => [String(k), `${edges[k]} to ${edges[k + 1]}`, String(ag.fold[k][i]), six(b[i]), six(P.stackOf(ag, k, k + 1)[i])])} />
            <TileGrid>
              <Tile label={`Partial stack, bins ${s.farFrom} up to ${s.farTo}`} value={six(far)} />
              <Tile label="Usable angle" value={Number.isFinite(us) ? six(us) : 'none'} unit="degrees" />
            </TileGrid>
            <Note>Bin numbers count from 0 at the nearest. A partial stack is the fold-weighted mean of its bins; the mute&apos;s exact zeros are live samples.</Note>
          </>
        );
      })()}
    </>
  );
};

const AvoView = ({ data, gather, s, set }) => {
  const run = angleRun(data, gather, s);
  const angles = list(s.stackAngles);
  return (
    <>
      <AngleControls s={s} set={set} />
      <FieldGrid>
        <TextField label="Mean angle of each bin, degrees (stated)" value={s.stackAngles} onChange={set('stackAngles')} />
        <SelectField label="Shuey terms (stated)" value={s.terms} onChange={set('terms')} options={TERMS} />
        <NumField label="Vs/Vp for the fluid factor (stated)" value={s.vsVp} onChange={set('vsVp')} />
        <NumField label="Scale, trace units per reflection coefficient (stated)" value={s.scale} onChange={set('scale')} />
        <NumField label="Chi, degrees (stated)" value={s.chiDeg} onChange={set('chiDeg')} />
      </FieldGrid>
      {run.error ? <Refusal text={run.error} /> : (() => {
        const { ag, i } = run;
        const terms = num(s.terms);
        const fit = P.shueyFit(angles, ag.gather.map((b) => b[i]), { terms });
        const As = []; const Bs = [];
        for (let k = 0; k < ag.gather[0].length; k++) {
          const f = P.shueyFit(angles, ag.gather.map((b) => b[k]), { terms: 2 });
          if (Number.isFinite(f.A) && f.n === angles.length) { As.push(f.A); Bs.push(f.B); }
        }
        const bt = P.trend(As, Bs);
        const sc = num(s.scale);
        const ctr = P.contrasts(fit.A / sc, fit.B / sc, num(s.vsVp));
        return (
          <>
            <TileGrid>
              <Tile label="Intercept A at the sample" value={six(fit.A)} />
              <Tile label="Gradient B at the sample" value={six(fit.B)} />
              <Tile label="Curvature C at the sample" value={six(fit.C)} />
              <Tile label="Angles used" value={String(fit.n)} />
              <Tile label="Class" value={P.classOf(fit.A / sc, fit.B / sc) || 'none'} />
            </TileGrid>
            <XYChart label="Intercept against gradient at every sample, with the background trend" xTitle="A" yTitle="B"
              points={[{ pts: As.map((a, k) => [a, Bs[k]]), color: CH.blue }, { pts: [[fit.A, fit.B]], color: CH.red, r: 4 }]} />
            <TileGrid>
              <Tile label="(A, B) pairs" value={String(bt.n)} />
              <Tile label="Background trend slope m" value={six(bt.m)} />
              <Tile label="Off-trend distance of the sample" value={six(P.off(fit.A, fit.B, bt.m))} />
              <Tile label="dVp/Vp" value={six(ctr.dVpVp)} />
              <Tile label="dVs/Vs" value={six(ctr.dVsVs)} />
              <Tile label="drho/rho" value={six(ctr.dRhoRho)} />
              <Tile label="Fluid factor" value={six(ctr.fluidFactor)} />
              <Tile label="Chi projection" value={six(P.chi(fit.A, fit.B, num(s.chiDeg)))} />
            </TileGrid>
            <Note>The trend is fitted to the two-term A and B at every sample where every bin carries data. The fluid factor, the contrasts and the class read A and B divided by the stated scale, so state the scale that ties the trace units to reflection coefficients (AVO at the wells).</Note>
          </>
        );
      })()}
    </>
  );
};

const WellsView = ({ data, s, set }) => {
  const rows = data.kind === 'case'
    ? data.wells.map((w) => [w.name, six(w.modelled && w.modelled.A), six(w.modelled && w.modelled.B), six(w.observed && w.observed.A), six(w.observed && w.observed.B)])
    : WELLS.map((w) => {
      const o = P.observedAtWell(w, { anglesDeg: list(s.stackAngles), halfWindowMs: num(s.pickHalf) });
      const m = P.modelledAtWell(w);
      if (o.error || m.error) return [w, o.error || m.error, '', '', ''];
      return [w, six(m.A), six(m.B), six(o.A), six(o.B)];
    });
  return (
    <>
      {data.kind === 'pack' && (
        <FieldGrid>
          <TextField label="Mean angle of near, mid and far, degrees (stated)" value={s.stackAngles} onChange={set('stackAngles')} />
          <NumField label="Pick half window, ms (stated)" value={s.pickHalf} onChange={set('pickHalf')} />
        </FieldGrid>
      )}
      <Tbl head={['well', 'modelled A', 'modelled B', 'seismic A', 'seismic B']} rows={rows} />
      {data.kind === 'pack' && <Note>Modelled: the cap rock over the oil leg at each well, or over its net sand where it has no oil leg. Seismic: the top picked on the near stack trace about its checkshot time, the near, mid and far traces read at that sample and fitted with two Shuey terms.</Note>}
      <Declared title="THE ONE SCALE ARRIVES IN QI STUDIO">
        The least-squares scale that ties the seismic amplitudes to the modelled reflection coefficients over every well,
        and each well&apos;s residual and class agreement, are computed by QI Studio&apos;s AVO at the wells. That calculation
        is app code in the Suite today, so this explorer prints the inputs above and no scale.
      </Declared>
    </>
  );
};

export default QiPrestackExplorer;
