import React, { useMemo, useState } from 'react';
import * as X from './qiLabExp';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, num, Tbl, Refusal, Declared, CaseBox, parseCase, XYChart, CH,
} from './qiPanelBits';

// The inversion explorer (Expert): from the seismic to impedance. It runs the
// Expert engines through the teaching lab (qiLabExp.js) on the Ekene teaching
// pack (the full, near, mid and far traces at Ekene-1 to Ekene-4 and their
// logs in time on the checkshots) or on a case file a learner pastes in the
// Expert case shape (wells with low-passed impedance logs in time, a second
// position, a target trace with its stacks, wavelets and supplied
// low-frequency models): the forward model and its adjoint, the low-frequency
// model, the wavelet scale, model-based, blocky and sparse-spike inversion,
// coloured inversion, blind wells, realisations with Q10, Q50 and Q90, and
// simultaneous inversion by stacks. Every stated input has a visible control
// showing its value; an engine refusal prints in the engine's own words.

export const MODES = [
  ['forward', 'The forward model and its adjoint'],
  ['lfm', 'The low-frequency model'],
  ['scale', 'The wavelet scale'],
  ['modelBased', 'Model-based, blocky and sparse-spike'],
  ['coloured', 'Coloured inversion'],
  ['blind', 'Blind wells'],
  ['spread', 'Realisations: Q10, Q50 and Q90'],
  ['simultaneous', 'Simultaneous inversion by stacks'],
];

const E = X.EXPERT;
const SOURCE_OPTIONS = [['ekene', 'Ekene teaching pack'], ['case', 'Paste a case file']];
const WELL_OPTIONS = X.EXPERT_WELLS.map((w) => [w, w]);
const METHODS = [['model_based', 'model-based'], ['blocky', 'model-based, blocky'], ['sparse_spike', 'sparse-spike']];
const YESNO = [['yes', 'left out of its own LFM (blind)'], ['no', 'kept in its own LFM']];
const STACKSETS = [['near,mid,far', 'near, mid and far'], ['near,mid', 'near and mid'], ['near', 'near only']];
const list = (t) => String(t).split(',').map((v) => num(v)).filter(Number.isFinite);
const listText = (a) => a.join(', ');
const fin = Number.isFinite;

const TextField = ({ label, value, onChange }) => (
  <div>
    <Label className="text-pl-muted text-xs mb-1 block">{label}</Label>
    <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="h-8 text-sm" />
  </div>
);

const startState = (c) => {
  const st = c && c.stated ? c.stated : null;
  return {
    well: 'Ekene-1',
    t0: String(E.windowMs[0]), t1: String(E.windowMs[1]),
    waveletHz: String(E.waveletHz), waveletHalf: String(E.waveletHalfMs),
    lfmHz: String(E.lfmHz), truthHz: String(E.truthHz),
    power: String(st ? st.lfm.power : E.idwPower),
    eps: String(st ? st.modelBased.eps : E.eps),
    iters: String(st ? st.modelBased.iters : E.iters),
    method: 'model_based', lambda: String(E.lambda), epsTV: String(E.epsTV), outer: String(E.outer),
    blind: 'yes',
    bandLo: String(E.band[0]), bandHi: String(E.band[1]),
    snr: String(E.noiseSnr), seedFirst: String(E.seeds[0]), seedCount: String(E.seeds.length),
    stacks: 'near,mid,far',
    simEps: listText(st ? st.simultaneous.eps : E.simEps),
    simIters: String(st ? st.simultaneous.iters : E.iters),
    sampleB: String(st ? st.lfm.sampleB : 0),
    sampleA: String(st ? st.modelBased.sampleA : 0),
    simSampleA: String(st ? st.simultaneous.sampleA : 0),
    adjSeed: '42',
  };
};

const QiInversionExplorer = ({ initialMode = 'forward', initialText = null }) => {
  const [mode, setMode] = useState(initialMode);
  const [source, setSource] = useState(initialText ? 'case' : 'ekene');
  const [caseText, setCaseText] = useState(initialText || '');
  const [s, setS] = useState(() => startState(initialText ? parseCase(initialText).value || null : null));
  const set = (k) => (v) => setS((o) => ({ ...o, [k]: v }));
  const onSource = (v) => { setSource(v); if (v !== 'case') setS(startState(null)); };
  const onCase = (t) => { setCaseText(t); const p = parseCase(t); if (p.value) setS(startState(p.value)); };

  const data = useMemo(() => {
    if (source === 'case') {
      const p = parseCase(caseText);
      if (p.error) return p;
      const c = X.caseExpert(p.value);
      return c.error ? c : { kind: 'case', ...c };
    }
    const win = X.windowIndex([num(s.t0), num(s.t1)]);
    const S = X.ekeneSetup(win, { waveletHz: num(s.waveletHz), waveletHalfMs: num(s.waveletHalf), lfmHz: num(s.lfmHz) });
    return S.error ? S : { kind: 'pack', S };
  }, [source, caseText, s.t0, s.t1, s.waveletHz, s.waveletHalf, s.lfmHz]);

  const packOnly = ['scale', 'coloured', 'blind', 'spread'].includes(mode);
  return (
    <PanelShell
      title="Inversion explorer"
      subtitle="From the seismic to impedance. The Expert engines on the Ekene teaching pack, or on a case file you paste."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        <SelectField label="Data" value={source} onChange={onSource} options={SOURCE_OPTIONS} />
        {source === 'case' && <CaseBox value={caseText} onChange={onCase} />}
      </FieldGrid>
      {source === 'ekene' && (
        <FieldGrid>
          <NumField label="Window start, ms (stated)" value={s.t0} onChange={set('t0')} />
          <NumField label="Window end, ms (stated)" value={s.t1} onChange={set('t1')} />
          <NumField label="Ricker wavelet, Hz (stated)" value={s.waveletHz} onChange={set('waveletHz')} />
          <NumField label="Wavelet half length, ms (stated)" value={s.waveletHalf} onChange={set('waveletHalf')} />
          <NumField label="LFM cut, Hz (stated)" value={s.lfmHz} onChange={set('lfmHz')} />
        </FieldGrid>
      )}
      {data.error && <Refusal text={data.error} />}
      {!data.error && packOnly && data.kind === 'case' && (
        <Note>This view reads the Ekene pack&apos;s traces and logs at the four wells; an Expert case carries one target trace. Choose the Ekene teaching pack as the data.</Note>
      )}
      {!data.error && (
        <div className="mt-1">
          {mode === 'forward' && <ForwardView data={data} s={s} set={set} />}
          {mode === 'lfm' && <LfmView data={data} s={s} set={set} />}
          {mode === 'scale' && data.kind === 'pack' && <ScaleView S={data.S} />}
          {mode === 'modelBased' && <ModelBasedView data={data} s={s} set={set} />}
          {mode === 'coloured' && data.kind === 'pack' && <ColouredView S={data.S} s={s} set={set} />}
          {mode === 'blind' && data.kind === 'pack' && <BlindView S={data.S} s={s} set={set} />}
          {mode === 'spread' && data.kind === 'pack' && <SpreadView S={data.S} s={s} set={set} />}
          {mode === 'simultaneous' && <SimView data={data} s={s} set={set} />}
        </div>
      )}
      <Note>
        This is the course&apos;s own explorer, and the Suite&apos;s QI Studio runs the same engines: every number here is a
        return value of a vendored engine, printed to six decimals. Times are two-way milliseconds; AI is acoustic
        impedance in kg/(m2 s).
      </Note>
    </PanelShell>
  );
};

/* ------------------------------------------------------------ helpers */

const msOf = (win, i) => win.t0Ms + i * win.dtMs;
const opts = (s) => ({ eps: num(s.eps), iters: num(s.iters), lambda: num(s.lambda), epsTV: num(s.epsTV), outer: num(s.outer), power: num(s.power) });
const scoreTiles = (sc, label) => (sc && fin(sc.corr) ? (
  <TileGrid>
    <Tile label={`${label}: correlation with the log`} value={six(sc.corr)} />
    <Tile label={`${label}: AI error`} value={six(sc.rmsPct)} unit="percent" />
    <Tile label="Samples scored" value={String(sc.n)} />
  </TileGrid>
) : null);

const WellPick = ({ s, set, blind = true }) => (
  <>
    <SelectField label="Well" value={s.well} onChange={set('well')} options={WELL_OPTIONS} />
    {blind && <SelectField label="The well's own log (stated)" value={s.blind} onChange={set('blind')} options={YESNO} />}
  </>
);

const InvControls = ({ s, set }) => (
  <FieldGrid>
    <SelectField label="Method (stated)" value={s.method} onChange={set('method')} options={METHODS} />
    <NumField label="Regularisation weight eps (stated)" value={s.eps} onChange={set('eps')} />
    <NumField label="Iterations (stated)" value={s.iters} onChange={set('iters')} />
    {s.method === 'sparse_spike' && <NumField label="Sparse-spike lambda (stated)" value={s.lambda} onChange={set('lambda')} />}
    {s.method === 'blocky' && <NumField label="Blocky epsTV (stated)" value={s.epsTV} onChange={set('epsTV')} />}
    {s.method === 'blocky' && <NumField label="Blocky outer loops (stated)" value={s.outer} onChange={set('outer')} />}
    <NumField label="Inverse distance power (stated)" value={s.power} onChange={set('power')} />
    <NumField label="High cut of the log scored against, Hz (stated)" value={s.truthHz} onChange={set('truthHz')} />
  </FieldGrid>
);

/* ------------------------------------------------------------ views */

const ForwardView = ({ data, s, set }) => {
  const wavelet = data.kind === 'pack' ? data.S.wavelet : data.A.fullWavelet;
  const n = data.kind === 'pack' ? data.S.win.ns : data.win.ns;
  const seed = num(s.adjSeed);
  let a = (Number.isInteger(seed) ? seed : 0) >>> 0;
  const rnd = () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296 - 0.5; };
  const xv = Array.from({ length: n }, rnd); const yv = Array.from({ length: n }, rnd);
  const dot = (u, v) => u.reduce((t, w, i) => t + w * v[i], 0);
  const rows = [
    ['centred difference D', dot(X.diffCentred(xv), yv), dot(xv, X.diffCentredAdjoint(yv))],
    ['centred convolution C', dot(X.convolveCentred(xv, wavelet), yv), dot(xv, X.convolveCentredAdjoint(yv, wavelet))],
  ].map(([k, l, r]) => [k, six(l), six(r), six(l - r)]);
  let chart = null;
  if (data.kind === 'pack') {
    const S = data.S;
    const log = S.logs.find((l) => l.name === s.well);
    const c = log.lnAi.map((v, i) => (fin(v) ? i : -1)).filter((i) => i >= 0);
    const held = log.lnAi.map((v, i) => (fin(v) ? v : (i < c[0] ? log.lnAi[c[0]] : log.lnAi[c[c.length - 1]])));
    const syn = X.forwardPoststack(held, S.wavelet);
    const tr = X.wellTrace(s.well, 'full', S.win);
    const cc = X.corrOf(syn.slice(c[0], c[c.length - 1] + 1), tr.slice(c[0], c[c.length - 1] + 1));
    chart = (
      <>
        <XYChart label="The synthetic of the log in time and the full-stack trace at the well" xTitle="two-way time, ms" yTitle="amplitude"
          lines={[{ pts: Array.from(syn, (v, i) => [msOf(S.win, i), v]), color: CH.red }, { pts: Array.from(tr, (v, i) => [msOf(S.win, i), v]), color: CH.blue }]} />
        <Note>Red: the synthetic, with the log held at its first and last values outside the logged samples. Blue: the full-stack trace.</Note>
        <TileGrid>
          <Tile label="Correlation over the logged samples" value={six(cc.corr)} />
          <Tile label="Logged samples" value={String(cc.n)} />
          <Tile label="Wavelet scale" value={six(S.scale)} />
        </TileGrid>
      </>
    );
  }
  return (
    <>
      <FieldGrid>
        {data.kind === 'pack' && <WellPick s={s} set={set} blind={false} />}
        <NumField label="Seed of the two test vectors (stated)" value={s.adjSeed} onChange={set('adjSeed')} />
      </FieldGrid>
      <p className="text-xs text-pl-muted mt-2 mb-0">The dot-product test: for any x and y, (A x) . y equals x . (A transposed y). Two vectors of {n} samples from the stated seed.</p>
      <Tbl head={['operator', '(A x) . y', 'x . (A^T y)', 'difference']} rows={rows} />
      {chart}
    </>
  );
};

const LfmView = ({ data, s, set }) => {
  const power = num(s.power);
  if (data.kind === 'case') {
    const r = X.lfmAt(data.lfm, data.B, data.win, { power });
    const k = num(s.sampleB);
    return (
      <>
        <FieldGrid>
          <NumField label="Inverse distance power (stated)" value={s.power} onChange={set('power')} />
          <NumField label="Sample of the second position, index from the first (stated)" value={s.sampleB} onChange={set('sampleB')} />
        </FieldGrid>
        <Declared title="AWAITING ITS INDEPENDENT ORACLE">The low-frequency model engine (lfm.js) waits on its oracle in the engines repository. The course teaches it now and grades nothing through it until that lands.</Declared>
        {r.error ? <Refusal text={r.error} /> : (
          <>
            <XYChart label="The LFM ln(AI) at the second position" xTitle="two-way time, ms" yTitle="ln(AI)" lines={[{ pts: Array.from(r, (v, i) => [msOf(data.win, i), v]), color: CH.blue }]} />
            <TileGrid>
              <Tile label="Time of the stated sample" value={six(msOf(data.win, k))} unit="ms" />
              <Tile label="LFM ln(AI) at the stated sample" value={six(r[k])} />
            </TileGrid>
          </>
        )}
      </>
    );
  }
  const S = data.S;
  const log = S.logs.find((l) => l.name === s.well);
  const at = { x: log.x, y: log.y, horizons: log.horizonsMs };
  const r = X.lfmAt(S.lfm, at, S.win, { power, exclude: s.blind === 'yes' ? s.well : undefined });
  const truth = X.truthOf(log, num(s.truthHz));
  return (
    <>
      <FieldGrid>
        <WellPick s={s} set={set} />
        <NumField label="Inverse distance power (stated)" value={s.power} onChange={set('power')} />
        <NumField label="High cut of the log scored against, Hz (stated)" value={s.truthHz} onChange={set('truthHz')} />
      </FieldGrid>
      <Declared title="AWAITING ITS INDEPENDENT ORACLE">The low-frequency model engine (lfm.js) waits on its oracle in the engines repository. The course teaches it now and grades nothing through it until that lands.</Declared>
      {r.error ? <Refusal text={r.error} /> : (
        <>
          <XYChart label="The LFM and the well's log after the high cut, ln(AI)" xTitle="two-way time, ms" yTitle="ln(AI)"
            lines={[{ pts: Array.from(r, (v, i) => [msOf(S.win, i), v]), color: CH.blue }, { pts: Array.from(truth, (v, i) => [msOf(S.win, i), v]), color: CH.red }]} />
          <Note>Blue: the LFM. Red: the log after the high cut.</Note>
          <Tbl head={['well', 'distance, m', 'share of the weight']} rows={(() => {
            const used = S.lfm.filter((w) => (s.blind === 'yes' ? w.name !== s.well : true));
            const ws = used.map((w) => { const d = Math.hypot(w.x - log.x, w.y - log.y); return [w.name, d, d < 1e-6 ? Infinity : 1 / d ** power]; });
            const exact = ws.find((w) => w[2] === Infinity);
            const tot = ws.reduce((t, w) => t + (fin(w[2]) ? w[2] : 0), 0);
            return ws.map((w) => [w[0], six(w[1]), six(exact ? (w === exact ? 1 : 0) : w[2] / tot)]);
          })()} />
          <p className="text-pl-text text-sm font-medium mt-4 mb-1">Horizon times at the well, ms</p>
          <TileGrid>
            <Tile label="Top of the Ekene Sand" value={six(log.horizonsMs[0])} unit="ms" />
            <Tile label="Base of the Ekene Sand" value={six(log.horizonsMs[1])} unit="ms" />
          </TileGrid>
        </>
      )}
    </>
  );
};

const ScaleView = ({ S }) => (
  <>
    <Declared title="APP ARITHMETIC">The scale is QI Studio&apos;s own least-squares rule (its inversion service), repeated in the course&apos;s lab: the one number that makes the scaled forward model of the logs match the full stack best, pooled over the well samples whose wavelet span the log covers. It is app code, outside the gated engines.</Declared>
    <TileGrid>
      <Tile label="Scale" value={six(S.scale)} />
      <Tile label="Samples pooled" value={String(S.scaleSamples)} />
      <Tile label="Peak of the stated wavelet" value={six(Math.max(...S.raw))} />
      <Tile label="Peak of the scaled wavelet" value={six(Math.max(...S.wavelet))} />
    </TileGrid>
  </>
);

const ModelBasedView = ({ data, s, set }) => {
  if (data.kind === 'case') {
    const A = data.A;
    const r = X.modelBasedOn({ d: A.full, wavelet: A.fullWavelet, m0: A.lowFrequencyModels.lnAi, eps: num(s.eps), iters: num(s.iters) });
    const k = num(s.sampleA);
    return (
      <>
        <FieldGrid>
          <NumField label="Regularisation weight eps (stated)" value={s.eps} onChange={set('eps')} />
          <NumField label="Iterations (stated)" value={s.iters} onChange={set('iters')} />
          <NumField label="Sample of the target trace, index from the first (stated)" value={s.sampleA} onChange={set('sampleA')} />
        </FieldGrid>
        <p className="text-xs text-pl-muted mt-2 mb-0">Model-based inversion of the target trace with the case&apos;s full-stack wavelet and its supplied low-frequency model of ln(AI).</p>
        {r.error ? <Refusal text={r.error} /> : (
          <>
            <XYChart label="Inverted AI and the supplied LFM at the target trace" xTitle="two-way time, ms" yTitle="AI"
              lines={[{ pts: Array.from(r.ai, (v, i) => [msOf(data.win, i), v]), color: CH.blue }, { pts: A.lowFrequencyModels.lnAi.map((v, i) => [msOf(data.win, i), Math.exp(v)]), color: CH.red, dash: '4 3' }]} />
            <TileGrid>
              <Tile label="Iterations run" value={String(r.iterations)} />
              <Tile label="Residual RMS" value={six(r.residualRms)} />
              <Tile label="Time of the stated sample" value={six(msOf(data.win, k))} unit="ms" />
              <Tile label="Inverted AI at the stated sample" value={six(r.ai[k])} unit="kg/(m2 s)" />
            </TileGrid>
          </>
        )}
      </>
    );
  }
  const S = data.S;
  const log = S.logs.find((l) => l.name === s.well);
  const r = X.invertAt(S, s.well, { ...opts(s), method: s.method, exclude: s.blind === 'yes' });
  const truth = X.truthOf(log, num(s.truthHz));
  const nz = s.method === 'sparse_spike' && !r.error ? Array.from(r.r).filter((v) => v !== 0).length : null;
  return (
    <>
      <FieldGrid><WellPick s={s} set={set} /></FieldGrid>
      <InvControls s={s} set={set} />
      {r.error ? <Refusal text={r.error} /> : (
        <>
          <XYChart label="Inverted AI, the LFM and the log after the high cut" xTitle="two-way time, ms" yTitle="AI"
            lines={[
              { pts: Array.from(r.ai, (v, i) => [msOf(S.win, i), v]), color: CH.blue },
              { pts: Array.from(r.m0, (v, i) => [msOf(S.win, i), Math.exp(v)]), color: CH.amber, dash: '4 3' },
              { pts: Array.from(truth, (v, i) => [msOf(S.win, i), Math.exp(v)]), color: CH.red },
            ]} />
          <Note>Blue: the inverted AI. Amber dashes: the LFM. Red: the log after the high cut.</Note>
          <TileGrid>
            {r.iterations != null && <Tile label="Iterations run" value={String(r.iterations)} />}
            {r.residualRms != null && <Tile label="Residual RMS" value={six(r.residualRms)} />}
            {nz != null && <Tile label="Non-zero reflectivity samples" value={String(nz)} />}
          </TileGrid>
          {(() => { const sc = blindScore(r.m, truth); return scoreTiles(sc, s.blind === 'yes' ? 'Blind' : 'Kept in'); })()}
          <Tbl max head={['time, ms', 'log AI after the high cut', 'LFM AI', 'inverted AI']}
            rows={Array.from(r.ai, (v, i) => [six(msOf(S.win, i)), fin(truth[i]) ? six(Math.exp(truth[i])) : 'none', six(Math.exp(r.m0[i])), six(v)]).filter((row) => row[1] !== 'none')} />
        </>
      )}
    </>
  );
};

const blindScore = (m, truth) => X.scoreOf(m, truth);

const ColouredView = ({ S, s, set }) => {
  const co = X.colouredAt(S, { band: [num(s.bandLo), num(s.bandHi)] });
  return (
    <>
      <FieldGrid>
        <NumField label="Band low edge, Hz (stated)" value={s.bandLo} onChange={set('bandLo')} />
        <NumField label="Band high edge, Hz (stated)" value={s.bandHi} onChange={set('bandHi')} />
        <NumField label="High cut of the log scored against, Hz (stated)" value={s.truthHz} onChange={set('truthHz')} />
      </FieldGrid>
      {co.error ? <Refusal text={co.error} /> : (
        <>
          <TileGrid>
            <Tile label="Mean alpha the operator uses" value={six(co.alpha)} />
            <Tile label="Transform length" value={String(co.N)} />
          </TileGrid>
          <Tbl head={['well', 'logged samples', 'alpha from its log', 'correlation with the band-passed log']} rows={co.out.map((o) => {
            const l = S.logs.find((x) => x.name === o.name);
            const hi = X.lowPassFinite(l.lnAi, X.halfWindowFor(num(s.truthHz), S.win.dtMs));
            const lo = X.lowPassFinite(l.lnAi, X.halfWindowFor(num(s.bandLo), S.win.dtMs));
            const c = X.corrOf(o.rel, hi.map((v, i) => v - lo[i]));
            const sl = co.slopes.find((x) => x.name === o.name);
            return [o.name, String(sl.samples), six(sl.alpha), six(c.corr)];
          })} />
          <Note>Coloured inversion gives relative impedance with no level, so it is scored by correlation alone.</Note>
        </>
      )}
    </>
  );
};

const BlindView = ({ S, s, set }) => {
  const bt = X.blindTable(S, s.method, { ...opts(s), truthHz: num(s.truthHz) });
  const bad = bt.find((r) => r.blind.error || r.withWell.error);
  return (
    <>
      <InvControls s={s} set={set} />
      {bad ? <Refusal text={(bad.blind.error || bad.withWell.error)} /> : (
        <Tbl head={['well', 'blind correlation', 'blind AI error, percent', 'kept-in correlation', 'kept-in AI error, percent', 'LFM-only correlation', 'LFM-only AI error, percent']}
          rows={bt.map((r) => [r.name, six(r.blind.corr), six(r.blind.rmsPct), six(r.withWell.corr), six(r.withWell.rmsPct), six(r.lfmOnly.corr), six(r.lfmOnly.rmsPct)])} />
      )}
    </>
  );
};

const SpreadView = ({ S, s, set }) => {
  const first = num(s.seedFirst); const count = num(s.seedCount);
  const seeds = Number.isInteger(first) && Number.isInteger(count) && count > 0 && count <= 100 ? Array.from({ length: count }, (_, i) => first + i) : null;
  const sp = seeds ? X.spreadAt(S, s.well, { ...opts(s), snr: num(s.snr), seeds }) : null;
  const log = S.logs.find((l) => l.name === s.well);
  const idx = log.lnAi.map((v, i) => (fin(v) ? i : -1)).filter((i) => i >= 0);
  return (
    <>
      <FieldGrid>
        <WellPick s={s} set={set} blind={false} />
        <NumField label="Signal to noise of the added noise (stated)" value={s.snr} onChange={set('snr')} />
        <NumField label="First seed (stated)" value={s.seedFirst} onChange={set('seedFirst')} />
        <NumField label="Realisations (stated)" value={s.seedCount} onChange={set('seedCount')} />
        <NumField label="Regularisation weight eps (stated)" value={s.eps} onChange={set('eps')} />
        <NumField label="Iterations (stated)" value={s.iters} onChange={set('iters')} />
        <NumField label="Inverse distance power (stated)" value={s.power} onChange={set('power')} />
      </FieldGrid>
      <Declared title="THE LABELS">Q10 is the 10th percentile, the value 10 percent of realisations fall below: the low figure. Q50 is the median, Q90 the high figure. Each realisation is the trace plus seeded noise, inverted model-based with the well left out of its LFM. An estimate on stated seeds.</Declared>
      {!sp && <Note>Give a whole first seed and between 1 and 100 realisations.</Note>}
      {sp && (sp.error ? <Refusal text={sp.error} /> : (
        <>
          <XYChart label="Q10, Q50 and Q90 of AI across the realisations" xTitle="two-way time, ms" yTitle="AI"
            lines={[{ pts: Array.from(sp.q10, (v, i) => [msOf(S.win, i), v]), color: CH.blue, dash: '4 3' }, { pts: Array.from(sp.q50, (v, i) => [msOf(S.win, i), v]), color: CH.blue }, { pts: Array.from(sp.q90, (v, i) => [msOf(S.win, i), v]), color: CH.red, dash: '4 3' }]} />
          <Tbl max head={['time, ms', 'Q10 AI', 'Q50 AI', 'Q90 AI', 'relative spread']} rows={idx.map((i) => [six(msOf(S.win, i)), six(sp.q10[i]), six(sp.q50[i]), six(sp.q90[i]), six(sp.spread[i])])} />
        </>
      ))}
    </>
  );
};

const SimView = ({ data, s, set }) => {
  const eps = list(s.simEps);
  if (data.kind === 'case') {
    const A = data.A;
    const r = X.simultaneousOn({ traces: A.angleTraces, thetaDeg: A.angles_deg, wavelets: A.angleWavelets, vsVp: A.backgroundVsVp, m0: A.lowFrequencyModels, eps, iters: num(s.simIters) });
    const k = num(s.simSampleA);
    return (
      <>
        <FieldGrid>
          <TextField label="Weights for ln(AI), ln(SI), ln(density) (stated)" value={s.simEps} onChange={set('simEps')} />
          <NumField label="Iterations (stated)" value={s.simIters} onChange={set('simIters')} />
          <NumField label="Sample of the target trace, index from the first (stated)" value={s.simSampleA} onChange={set('simSampleA')} />
        </FieldGrid>
        <p className="text-xs text-pl-muted mt-2 mb-0">Angles {listText(A.angles_deg)} degrees, the case&apos;s wavelet for each, background Vs/Vp {six(A.backgroundVsVp)}, the supplied low-frequency models.</p>
        {r.error ? <Refusal text={r.error} /> : (
          <TileGrid>
            <Tile label="Iterations run" value={String(r.iterations)} />
            <Tile label="Residual RMS" value={six(r.residualRms)} />
            <Tile label="AI at the stated sample" value={six(Math.exp(r.lnAi[k]))} unit="kg/(m2 s)" />
            <Tile label="Vp/Vs at the stated sample" value={six(Math.exp(r.lnAi[k] - r.lnSi[k]))} />
            <Tile label="Density at the stated sample" value={six(Math.exp(r.lnRho[k]))} unit="kg/m3" />
          </TileGrid>
        )}
      </>
    );
  }
  const S = data.S;
  const M = X.ekeneSimSetup(S);
  if (M.error) return <Refusal text={M.error} />;
  const stacks = s.stacks.split(',');
  const r = X.simAt(S, M, s.well, { exclude: s.blind === 'yes', stacks, eps, iters: num(s.simIters), power: num(s.power) });
  const sc = r.error ? null : X.scoreSim(r, S.logs.find((l) => l.name === s.well));
  return (
    <>
      <FieldGrid>
        <WellPick s={s} set={set} />
        <SelectField label="Stacks used (stated)" value={s.stacks} onChange={set('stacks')} options={STACKSETS} />
        <TextField label="Weights for ln(AI), ln(SI), ln(density) (stated)" value={s.simEps} onChange={set('simEps')} />
        <NumField label="Iterations (stated)" value={s.simIters} onChange={set('simIters')} />
        <NumField label="Inverse distance power (stated)" value={s.power} onChange={set('power')} />
      </FieldGrid>
      <Tbl head={['stack', 'angle, degrees', 'wavelet scale', 'samples']} rows={M.stacks.map((k, i) => [k, String(M.angles[i]), six(M.scales[i].scale), String(M.scales[i].samples)])} />
      <p className="text-xs text-pl-muted mt-2 mb-0">Background Vs/Vp {six(M.vsVp)}, the mean of Vs / Vp over the logged samples of the four wells.</p>
      {r.error ? <Refusal text={r.error} /> : (
        <Tbl head={['parameter', 'correlation with the log', 'error, percent', 'samples']}
          rows={[['AI', sc.ai], ['Vp/Vs', sc.vpvs], ['density', sc.rho]].map(([k, v]) => [k, six(v.corr), six(v.rmsPct), String(v.n)])} />
      )}
    </>
  );
};

export default QiInversionExplorer;
