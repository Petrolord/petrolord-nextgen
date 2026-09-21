import React, { useMemo, useState } from 'react';
import {
  subsystem, sifOf, scenario, parseNumber,
  annexB, simplified, iduSif, publishedSif, betaSweep, twoOfTwo, STREAMS,
} from './lopaLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, twelve, silText, ex, Tbl, Refusal, Declared, Warnings, SubsystemFields, fromParams, toParams, safe,
} from './panelBits';

// The SIF PFDavg builder (Professional): one subsystem in any architecture by
// the IEC 61508-6 Annex B low demand equations, a SIF as the series sum of
// three subsystems, and the published worked SIF reproduced from the vendored
// golden. Every figure is a return value of the vendored engine through
// lopaLab. Failure rates are typed by the learner or taken from the teaching
// streams, and they are illustrative, never data.

export const MODES = [
  ['subsystem', 'One subsystem in any architecture'],
  ['sif', 'A SIF as the sum of three subsystems, and back to the TMEL'],
  ['published', 'The published worked SIF, reproduced'],
];

export const SubsystemMode = ({ t }) => {
  const [s, set] = useState(fromParams({ architecture: '1oo2', ...STREAMS.EKULAMA_FULL }));
  const r = useMemo(() => subsystem(toParams(s)), [s]);
  return (
    <>
      <SubsystemFields s={s} set={set} />
      {r.error ? <Refusal r={r} /> : (
        <>
          <TileGrid>
            <Tile label="PFDavg" value={twelve(r.pfdAvg)} />
            <Tile label="RRF" value={six(r.rrf)} />
            <Tile label="SIL, low demand" value={silText(r.sil)} />
            <Tile label="Dominant term" value={r.dominant} />
            <Tile label="tCE" value={six(r.tCE)} unit="hours" />
            <Tile label="tGE" value={r.tGE === null ? 'none' : six(r.tGE)} unit={r.tGE === null ? '' : 'hours'} />
            <Tile label="Independent term" value={twelve(r.terms.independent)} />
            <Tile label="Common cause, DU and DD" value={`${twelve(r.terms.ccfDU)} and ${twelve(r.terms.ccfDD)}`} />
          </TileGrid>
          <Warnings list={r.warnings} />
          <Declared title="THE FORMULA THE ENGINE REPORTS">{r.basis.formula}</Declared>
        </>
      )}
      {t && (
        <>
          <Note>The EKULAMA teaching channel in every architecture, the full Annex B form.</Note>
          <Tbl
            head={['architecture', 'tCE hours', 'tGE hours', 'independent', 'common cause DU', 'PFDavg', 'RRF', 'SIL', 'dominant']}
            rows={t.a.map((x) => [x.architecture, six(x.tCE), x.tGE === null ? 'none' : six(x.tGE), twelve(x.independent), twelve(x.ccfDU), twelve(x.pfdAvg), six(x.rrf), silText(x.sil), x.dominant])}
          />
          <Note>The same channel with no detected failures and no MRT: the simplified forms.</Note>
          <Tbl head={['architecture', 'PFDavg', 'RRF', 'SIL']} rows={t.s.map((x) => [x.architecture, twelve(x.pfdAvg), six(x.rrf), silText(x.sil)])} />
          <Note>The beta factor swept, betaD half of it.</Note>
          <Tbl
            head={['architecture', 'beta factor', 'independent', 'common cause', 'PFDavg', 'dominant']}
            rows={t.b.map((x) => [x.architecture, String(x.beta), twelve(x.independent), twelve(x.commonCause), twelve(x.pfdAvg), x.dominant])}
          />
          <Declared title="TWO OUT OF TWO CARRIES NO BETA FACTOR TERM">
            With a beta factor typed the 2oo2 PFDavg is {twelve(t.two.typed)}, and without one {twelve(t.two.without)}.
            The engine says: {t.two.warnings.join('; ')}
          </Declared>
        </>
      )}
    </>
  );
};

export const SifMode = ({ t }) => {
  const I = STREAMS.IDU;
  const [a, setA] = useState(fromParams(I.transmitters));
  const [b, setB] = useState(fromParams(I.logicSolver));
  const [c, setC] = useState(fromParams(I.valves));
  const [tmel, setTmel] = useState(String(STREAMS.LOOP_TMEL));
  const r = useMemo(() => sifOf([
    { name: 'sensors', ...toParams(a) },
    { name: 'logic solver', ...toParams(b) },
    { name: 'final elements', ...toParams(c) },
  ]), [a, b, c]);
  const l = useMemo(() => (r.error ? null : scenario({ ...STREAMS.ORONI, tmelPerYr: parseNumber(tmel), sifPfdAvg: r.pfdAvg })), [r, tmel]);
  return (
    <>
      <Note>Sensors</Note>
      <SubsystemFields s={a} set={setA} />
      <Note>Logic solver</Note>
      <SubsystemFields s={b} set={setB} />
      <Note>Final elements</Note>
      <SubsystemFields s={c} set={setC} />
      <FieldGrid>
        <NumField label="TMEL for the ORONI row, per year" value={tmel} onChange={setTmel} />
      </FieldGrid>
      {r.error ? <Refusal r={r} /> : (
        <>
          <Tbl head={['part', 'architecture', 'PFDavg']} rows={r.parts.map((p) => [p.name, p.architecture, twelve(p.pfdAvg)])} />
          <TileGrid>
            <Tile label="SIF PFDavg, the series sum" value={twelve(r.pfdAvg)} />
            <Tile label="Achieved RRF" value={six(r.rrf)} />
            <Tile label="Achieved SIL" value={silText(r.sil)} />
            {l && !l.error && <Tile label="Required PFDavg of the ORONI row" value={twelve(l.requiredSifPfdAvg)} />}
            {l && !l.error && <Tile label="Meets the TMEL" value={String(l.meetsTmel)} />}
          </TileGrid>
          {l && l.error && <Refusal r={l} />}
          <Declared title="THE ENGINE'S METHOD">{r.basis.method}</Declared>
        </>
      )}
      {t && (
        <Note>
          The IDU teaching SIF: {t.parts.map((p) => `${p.name} ${twelve(p.pfdAvg)}`).join(', ')}; total {twelve(t.pfdAvg)},
          RRF {six(t.rrf)}, SIL {silText(t.sil)}, and it meets the ORONI TMEL: {String(t.meetsTmel)}.
        </Note>
      )}
    </>
  );
};

export const PublishedMode = ({ t }) => (t ? (
  <>
    <Note>{t.source}. The failure rates are the slide&apos;s own example values, read from the vendored golden.</Note>
    <Tbl
      head={['case', 'architecture', 'lambdaDU', 'lambdaDD', 'MTTR', 'MRT', 'beta factor', 'betaD', 'engine PFDavg', 'three figures', 'printed']}
      rows={t.rows.map((x) => [x.id, x.params.architecture, ex(x.params.lambdaDuPerHour), ex(x.params.lambdaDdPerHour), String(x.params.mttrHours), String(x.params.mrtHours), String(x.params.beta), String(x.params.betaD), twelve(x.pfdAvg), x.threeFigures, x.printed])}
    />
    <TileGrid>
      <Tile label="SIF PFDavg" value={twelve(t.pfdAvg)} unit={`printed ${t.printed.pfdAvg}`} />
      <Tile label="RRF" value={six(t.rrf)} unit={`printed ${t.printed.rrf}`} />
      <Tile label="SIL" value={silText(t.sil)} />
    </TileGrid>
    <Declared title="WHAT THE REPRODUCTION NEEDED">
      The published table reproduces only with the MRT equal to the MTTR on every row. The table does not print it.
    </Declared>
  </>
) : <Note>The published table could not be read.</Note>);

const SifExplorer = ({ initialMode = 'subsystem' }) => {
  const [mode, setMode] = useState(initialMode);
  const t1 = useMemo(() => (mode === 'subsystem' ? safe(() => ({
    a: annexB(), s: simplified(), b: betaSweep(), two: twoOfTwo(),
  })) : null), [mode]);
  const t2 = useMemo(() => (mode === 'sif' ? safe(iduSif) : null), [mode]);
  const t3 = useMemo(() => (mode === 'published' ? safe(publishedSif) : null), [mode]);
  return (
    <PanelShell
      title="SIF PFDavg builder"
      subtitle="The IEC 61508-6 Annex B low demand equations, with detected failures, MTTR, MRT, the beta factor and proof test coverage. A SIF is the sum of its subsystems."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'subsystem' && <SubsystemMode t={t1} />}
        {mode === 'sif' && <SifMode t={t2} />}
        {mode === 'published' && <PublishedMode t={t3} />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored LOPA engine. It has no hardware fault tolerance
        check and no high demand mode: every band here is low demand.
      </Note>
    </PanelShell>
  );
};

export default SifExplorer;
