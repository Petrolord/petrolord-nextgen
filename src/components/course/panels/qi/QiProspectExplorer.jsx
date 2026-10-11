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

// The prospect explorer (Expert): from impedance to properties, a prospect
// and an assessment. It runs the Expert engines through the teaching lab
// (qiLabExp.js) on the Ekene teaching pack (the four wells' logs at log
// scale and the Ekene Sand top grid) or on a case file a learner pastes in the
// Expert case shape (porosity and AI pairs, labelled facies samples, a depth
// grid in feet): the linear transform and its interval, the left-out-well
// band, Bayesian facies and the confusion matrix, closure on a grid, and
// conformance and the assessment on designed anomalies. Every stated input
// has a visible control showing its value; an engine refusal prints in the
// engine's own words.

export const MODES = [
  ['transform', 'A linear transform and its interval'],
  ['leftout', 'Left-out wells and the widened band'],
  ['facies', 'Bayesian facies and the confusion matrix'],
  ['closure', 'Crest, spill and closure'],
  ['conformance', 'Anomaly conformance, evidence and the assessment'],
];

const E = X.EXPERT;
const SOURCE_OPTIONS = [['ekene', 'Ekene teaching pack'], ['case', 'Paste a case file']];
const ATTRS = [['ai', 'AI'], ['ai,vpvs', 'AI and Vp/Vs']];
const PRIORS = [['samples', 'the samples\' proportions'], ['equal', 'equal']];
const KINDS = [['gaussian', 'Gaussian'], ['kde', 'Gaussian kernel density']];
const YES = [['yes', 'yes'], ['no', 'no']];
const FEAS = [['feasible', 'feasible'], ['conditional', 'conditional'], ['not-feasible', 'not feasible'], ['', 'not stated']];
const list = (t) => String(t).split(',').map((v) => num(v)).filter(Number.isFinite);
const listText = (a) => a.join(', ');

const TextField = ({ label, value, onChange }) => (
  <div>
    <Label className="text-pl-muted text-xs mb-1 block">{label}</Label>
    <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="h-8 text-sm" />
  </div>
);

const startState = (c) => {
  const st = c && c.stated ? c.stated : null;
  return {
    vshCut: '0.35',
    level: String(st ? st.porosity.level : E.levelInterval),
    aiList: st ? String(st.porosity.atAi) : listText([6500000, 7000000, 7500000]),
    attrs: 'ai',
    priors: 'samples',
    kind: st ? st.facies.kind : 'gaussian',
    faciesAi: st ? String(st.facies.atAi) : listText([6000000, 6600000, 7200000]),
    faciesVpVs: '1.75',
    contact: '',
    levels: '8',
    anomalyAbove: '0',
    cut: 'no',
    present: 'yes', conf: '0.83', inside: '0.9', independent: '2', feasibility: 'feasible',
  };
};

const QiProspectExplorer = ({ initialMode = 'transform', initialText = null }) => {
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
      if (c.error) return c;
      return { kind: 'case', porosity: c.porositySamples, facies: c.faciesSamples, grid: c.grid, faciesClass: p.value.stated?.facies?.class };
    }
    return { kind: 'pack', grid: X.gridFt() };
  }, [source, caseText]);

  return (
    <PanelShell
      title="Prospect explorer"
      subtitle="From impedance to properties and a prospect. The Expert engines on the Ekene teaching pack, or on a case file you paste."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        <SelectField label="Data" value={source} onChange={onSource} options={SOURCE_OPTIONS} />
        {source === 'case' && <CaseBox value={caseText} onChange={onCase} />}
      </FieldGrid>
      {data.error && <Refusal text={data.error} />}
      {!data.error && (
        <div className="mt-1">
          {mode === 'transform' && <TransformView data={data} s={s} set={set} />}
          {mode === 'leftout' && <LeftOutView />}
          {mode === 'facies' && <FaciesView data={data} s={s} set={set} />}
          {mode === 'closure' && <ClosureView data={data} s={s} set={set} />}
          {mode === 'conformance' && <ConformanceView data={data} s={s} set={set} />}
        </div>
      )}
      <Note>
        This is the course&apos;s own explorer, and the Suite&apos;s QI Studio runs the same engines: every number here is a
        return value of a vendored engine, printed to six decimals. AI is acoustic impedance in kg/(m2 s); depths and
        elevations are in feet.
      </Note>
    </PanelShell>
  );
};

/* ------------------------------------------------------------ helpers */

const packSamples = (s) => X.logScaleSamples(X.EXPERT_WELLS, { vshCut: num(s.vshCut) });

/* ------------------------------------------------------------ views */

const TransformView = ({ data, s, set }) => {
  const samples = data.kind === 'case' ? data.porosity : packSamples(s).filter((x) => x.facies !== 'shale');
  const at = list(s.aiList);
  const pt = X.porosityTransform(samples, at, num(s.level));
  const ais = samples.map((x) => x.ai);
  return (
    <>
      <FieldGrid>
        {data.kind === 'pack' && <NumField label="Net sand Vsh cut-off (stated)" value={s.vshCut} onChange={set('vshCut')} />}
        <NumField label="Interval level (stated)" value={s.level} onChange={set('level')} />
        <TextField label="AI to predict at, kg/(m2 s) (stated)" value={s.aiList} onChange={set('aiList')} />
      </FieldGrid>
      <p className="text-xs text-pl-muted mt-2 mb-0">
        {data.kind === 'pack' ? 'The net sand of the Ekene Sand in the four pack wells, both legs, at log scale (the kit\'s PHIT).' : 'The case\'s porosity and AI calibration pairs.'}
        {' '}The 80 percent interval gives Q10 (its low end) and Q90 (its high end).
      </p>
      {pt.error ? <Refusal text={pt.error} /> : (
        <>
          <XYChart label="Porosity against AI, and the fitted line" xTitle="AI, kg/(m2 s)" yTitle="porosity"
            points={[{ pts: samples.map((x) => [x.ai, x.phit]), color: CH.amber, r: 1.6 }]}
            lines={[{ pts: [Math.min(...ais), Math.max(...ais)].map((x) => [x, pt.fit.a + pt.fit.b * x]), color: CH.blue }]} />
          <TileGrid>
            <Tile label="Intercept a" value={six(pt.fit.a)} />
            <Tile label="Slope b per 10^6 kg/(m2 s)" value={six(pt.fit.b * 1e6)} />
            <Tile label="Residual standard error s" value={six(pt.fit.s)} />
            <Tile label="R squared" value={six(pt.fit.r2)} />
            <Tile label="Calibration samples" value={String(pt.fit.n)} />
          </TileGrid>
          <Tbl head={['AI, kg/(m2 s)', 'predicted porosity', 'low end of the interval', 'high end of the interval']}
            rows={pt.predictions.map((p) => [six(p.ai), six(p.y), six(p.lo), six(p.hi)])} />
        </>
      )}
    </>
  );
};

const LeftOutView = () => (
  <>
    <Declared title="THE LEFT-OUT-WELL BAND ARRIVES IN QI STUDIO">QI Studio leaves each well out in turn, predicts its porosity from the blind inverted AI at that well, and widens the band by the pooled left-out error. That check is QI Studio&apos;s own app code; this explorer does not compute it. The course&apos;s lessons quote its figures on the Ekene wells, and the transform view here gives the log-against-log band it widens.</Declared>
  </>
);

const FaciesView = ({ data, s, set }) => {
  const attrs = s.attrs.split(',');
  const samples = data.kind === 'case' ? data.facies : packSamples(s);
  const names = [...new Set(samples.map((x) => x.facies))];
  const priors = s.priors === 'equal' ? Object.fromEntries(names.map((n) => [n, 1])) : null;
  const aiPts = list(s.faciesAi);
  const vv = num(s.faciesVpVs);
  const at = aiPts.map((a) => (attrs.length === 2 ? [a, vv] : [a]));
  const canTwo = data.kind === 'pack';
  const noTwo = attrs.length === 2 && !canTwo;
  const fm = noTwo ? null : X.faciesModel(samples, { attrs, kind: s.kind, priors, at });
  const conf = !fm || fm.error || s.kind === 'kde' ? null : fm.confusion;
  return (
    <>
      <FieldGrid>
        {data.kind === 'pack' && <NumField label="Net sand Vsh cut-off (stated)" value={s.vshCut} onChange={set('vshCut')} />}
        <SelectField label="Attributes (stated)" value={s.attrs} onChange={set('attrs')} options={ATTRS} />
        <SelectField label="Priors (stated)" value={s.priors} onChange={set('priors')} options={PRIORS} />
        <SelectField label="Density per facies (stated)" value={s.kind} onChange={set('kind')} options={KINDS} />
        <TextField label="AI to classify at, kg/(m2 s) (stated)" value={s.faciesAi} onChange={set('faciesAi')} />
        {attrs.length === 2 && <NumField label="Vp/Vs to classify at (stated)" value={s.faciesVpVs} onChange={set('faciesVpVs')} />}
      </FieldGrid>
      <Declared title="A FLUID HYPOTHESIS">A facies named for a fluid (oil sand, brine sand) is a hypothesis about the pore fluid. The Facies course teaches Bayesian classification as a subject; here it is applied to impedance.</Declared>
      {noTwo && <Note>The case&apos;s facies samples carry AI alone: choose AI as the attribute.</Note>}
      {fm && (fm.error ? <Refusal text={fm.error} /> : (
        <>
          <Tbl head={['facies', 'samples', 'prior', 'mean AI', 'standard deviation of AI']}
            rows={fm.model.classes.map((c) => [c.name, String(c.n), six(c.prior), six(c.mean[0]), six(Math.sqrt(c.cov[0][0]))])} />
          <Tbl head={[...(attrs.length === 2 ? ['AI', 'Vp/Vs'] : ['AI']), ...fm.model.classes.map((c) => `P(${c.name})`), 'most likely']}
            rows={fm.posteriors.map((p) => [...p.x.map(six), ...p.probs.map(six), p.best >= 0 ? fm.model.classes[p.best].name : 'none'])} />
          {conf && (
            <>
              <p className="text-pl-text text-sm font-medium mt-4 mb-1">The confusion matrix on its own samples (rows true, columns predicted)</p>
              <Tbl head={['true facies', ...conf.names]} rows={conf.names.map((n, i) => [n, ...conf.counts[i].map(String)])} />
              <TileGrid><Tile label="Share classified correctly" value={six(conf.accuracy)} /></TileGrid>
            </>
          )}
          {s.kind === 'kde' && <Note>The confusion matrix is shown for the Gaussian density only; scoring every sample under a kernel density over every sample is too slow for the browser.</Note>}
        </>
      ))}
    </>
  );
};

const ClosureView = ({ data, s, set }) => {
  if (!data.grid) return <Note>The case carries no grid.</Note>;
  const contact = String(s.contact).trim() === '' ? null : num(s.contact);
  const c = X.closureOf(data.grid, { contact, levels: num(s.levels) });
  const live = Array.from(data.grid.z).filter((v) => Math.abs(v) < 1e29).length;
  return (
    <>
      <FieldGrid>
        <NumField label="Contact elevation, ft, blank for the spill (stated)" value={s.contact} onChange={set('contact')} />
        <NumField label="Levels on the area-depth curve (stated)" value={s.levels} onChange={set('levels')} />
      </FieldGrid>
      <p className="text-xs text-pl-muted mt-2 mb-0">
        {data.kind === 'pack' ? 'The Ekene Sand top as the kit grids it from the six development wells\' tops, z minus the depth below the kelly bushing.' : 'The case\'s depth grid.'}
        {' '}{data.grid.spec.nx} by {data.grid.spec.ny} nodes every {six(data.grid.spec.dx)} ft, {live} mapped. Elevation in feet, negative down; the crest is the highest mapped node.
      </p>
      {c.error ? <Refusal text={c.error} /> : (
        <>
          <TileGrid>
            <Tile label="Crest" value={six(c.crestZ)} unit="ft" />
            <Tile label="Spill" value={six(c.spillZ)} unit="ft" />
            <Tile label="Column from crest to spill" value={six(c.columnFt)} unit="ft" />
            <Tile label="Spill limited by the map edge" value={c.limitedByEdge ? 'yes' : 'no'} />
            <Tile label="Area at the spill" value={six(c.atSpill.areaM2)} unit="ft2" />
            <Tile label="Gross rock volume at the spill" value={six(c.atSpill.grvM3)} unit="ft3" />
          </TileGrid>
          {c.atContact && (
            <TileGrid>
              <Tile label="Nodes at the stated contact" value={String(c.atContact.nodes)} />
              <Tile label="Gross rock volume at the stated contact" value={six(c.atContact.grvM3)} unit="ft3" />
              <Tile label="Closed at that contact" value={c.atContact.closed ? 'yes' : 'no'} />
            </TileGrid>
          )}
          {c.curve.length > 0 && (
            <>
              <XYChart label="Area against contact, from the crest to the spill" xTitle="contact, ft" yTitle="area, ft2"
                lines={[{ pts: c.curve.map((r) => [r.contact, r.areaM2]), color: CH.blue }]} />
              <Tbl head={['contact, ft', 'nodes', 'area, ft2', 'gross rock volume, ft3']} rows={c.curve.map((r) => [six(r.contact), String(r.nodes), six(r.areaM2), six(r.grvM3)])} />
            </>
          )}
        </>
      )}
    </>
  );
};

const ConformanceView = ({ data, s, set }) => {
  if (!data.grid) return <Note>The case carries no grid.</Note>;
  const g = data.grid;
  const c = X.closureOf(g);
  const above = num(s.anomalyAbove);
  let conf = null;
  if (!c.error) {
    const xMid = g.spec.x0 + Math.floor(g.spec.nx / 2) * g.spec.dx;
    const mask = s.cut === 'yes' ? X.maskCut(g, c.spillZ + above, xMid) : X.maskAbove(g, c.spillZ + above);
    conf = X.conformanceOf(g, mask, c.spill);
  }
  const ev = X.evidenceIndependence([
    { name: 'full-stack RMS amplitude', source: 'full_stack' },
    { name: 'impedance from the full stack', source: 'full_stack' },
    { name: 'far-stack brightening', source: 'far_stack' },
  ]);
  const present = s.present === 'yes';
  const asmt = X.assessProspect({
    anomalyPresent: present,
    conformance: present ? num(s.conf) : null,
    insideClosure: present ? num(s.inside) : null,
    independent: num(s.independent),
    feasibility: s.feasibility,
    competing: [],
  });
  return (
    <>
      <FieldGrid>
        <NumField label="Anomaly: nodes shallower than the spill plus, ft (stated)" value={s.anomalyAbove} onChange={set('anomalyAbove')} />
        <SelectField label="Cut the anomaly at the middle column (stated)" value={s.cut} onChange={set('cut')} options={YES} />
      </FieldGrid>
      <Declared title="A DESIGNED TEACHING ANOMALY">The anomaly is drawn by the course on the grid: every mapped node shallower than the stated elevation, and, when cut, only west of the grid&apos;s middle column. The conformance engine (prospectAssessment.js) waits on its independent oracle; the course teaches it now and grades nothing through it until that lands.</Declared>
      {c.error && <Refusal text={c.error} />}
      {conf && (conf.error ? <Refusal text={conf.error} /> : (
        <TileGrid>
          <Tile label="Anomaly nodes" value={String(conf.anomalyNodes)} />
          <Tile label="Downdip edge nodes" value={String(conf.edgeNodes)} />
          <Tile label="Conformance" value={six(conf.conformance)} />
          <Tile label="Share inside the closure" value={six(conf.insideClosure)} />
          <Tile label="Implied contact" value={six(conf.impliedContactZ)} unit="ft" />
          <Tile label="Edge scatter" value={six(conf.edgeSdM)} unit="ft" />
        </TileGrid>
      ))}
      <p className="text-pl-text text-sm font-medium mt-4 mb-1">Evidence: one seismic response is one piece of evidence</p>
      <Tbl head={['source', 'items']} rows={ev.groups.map((gr) => [gr.label, gr.items.join(', ')])} />
      <TileGrid>
        <Tile label="Supporting items" value={String(ev.supporting)} />
        <Tile label="Independent sources" value={String(ev.independent)} />
      </TileGrid>
      <p className="text-pl-text text-sm font-medium mt-4 mb-1">The assessment</p>
      <FieldGrid>
        <SelectField label="Anomaly present (stated)" value={s.present} onChange={set('present')} options={YES} />
        {present && <NumField label="Conformance (stated)" value={s.conf} onChange={set('conf')} />}
        {present && <NumField label="Share inside the closure (stated)" value={s.inside} onChange={set('inside')} />}
        <NumField label="Independent supporting sources (stated)" value={s.independent} onChange={set('independent')} />
        <SelectField label="Feasibility verdict (stated)" value={s.feasibility} onChange={set('feasibility')} options={FEAS} />
      </FieldGrid>
      <TileGrid>
        <Tile label="Recommendation" value={asmt.recommendation} />
        <Tile label="Seismic support" value={asmt.seismicSupport} />
      </TileGrid>
      <p className="text-xs text-pl-text mt-2 mb-0">{asmt.label}</p>
      <ul className="list-disc pl-5 text-xs text-pl-text">{asmt.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
      <Note>QI never sets the geological chance of success: the assessment reports what the seismic says for the risk team to weigh.</Note>
    </>
  );
};

export default QiProspectExplorer;
