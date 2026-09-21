import React, { useMemo, useState } from 'react';
import {
  heat, disagreement, evidence, errata, MET_SWEEP,
} from './hygieneLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, Quote, Evidence, safe,
} from './hygieneKit';

// Heat stress, and how strong each equation is.
//
// THE NIOSH 2016 RAL AND REL EQUATIONS AND THE WBGT WEIGHTS ARE CHECKED FOR
// TRANSCRIPTION ONLY. No public printed value reproduces them, and NIOSH's own
// worked example disagrees with its own equation. So this panel evaluates them
// because the course teaches them, prints their status beside every figure,
// and the course grades none of them. The one-hour time weighted averages are
// arithmetic by definition and are the only heat quantities a capstone grades.
//
// Every figure here is a return value of the vendored exposure engine through
// hygieneLab, or a value read out of the vendored golden.

export const MODES = [
  ['wbgt', 'WBGT indoors and outdoors, and the one-hour average'],
  ['limits', 'The NIOSH 2016 RAL and REL equations'],
  ['evidence', 'How strong each equation is'],
  ['errata', 'Published errata'],
];

export const WbgtMode = ({ h }) => {
  if (!h) return <Note>The heat reader did not return.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="Indoor readings, WBGT" value={six(h.wbgt.indoor)} unit="C" />
        <Tile label="Outdoor readings, outdoor form" value={six(h.wbgt.outdoor)} unit="C" />
        <Tile label="Outdoor readings through the indoor form" value={six(h.wbgt.outdoorThroughIndoor)} unit="C" />
        <Tile label="One-hour time weighted WBGT" value={six(h.hour.wbgtTwaC)} unit="C" />
      </TileGrid>
      <Evidence>The WBGT weights are {h.wbgt.evidence}. The one-hour average of stated readouts is arithmetic by definition.</Evidence>
      <Tbl
        head={['WBGT C', 'minutes']}
        rows={h.hour.wbgt.map((p) => [six(p.wbgtC), six(p.durationMin)])}
      />
      <Note>
        The plain mean of the two readings is {six(h.hour.plainMeanC)} C, which weights a short rest the same as a long work
        period. The one-hour time weighted metabolic rate of the same hour is {six(h.hour.metabolicTwaW)} W.
      </Note>
    </>
  );
};

export const LimitsMode = ({ h, m }) => {
  if (!h) return <Note>The heat reader did not return.</Note>;
  const row = h.sweep.find((r) => r.metabolicRateW === Number(m)) || h.sweep[0];
  return (
    <>
      <TileGrid>
        <Tile label={`RAL equation at ${row.metabolicRateW} W`} value={six(row.ralC)} unit="C WBGT" />
        <Tile label={`REL equation at ${row.metabolicRateW} W`} value={six(row.relC)} unit="C WBGT" />
        <Tile label="Outside the figure range, warned" value={String(row.warned)} />
      </TileGrid>
      <Evidence>Every limit on this view is {h.evidence}. No figure here is graded.</Evidence>
      <Tbl
        head={['M W', 'RAL equation C', 'REL equation C', 'warned']}
        rows={h.sweep.map((r) => [six(r.metabolicRateW), six(r.ralC), six(r.relC), String(r.warned)])}
      />
      <Tbl
        head={['acclimatized', 'criterion', 'limit by the equation C', 'margin C', 'exceeds']}
        rows={h.assessments.map((r) => [String(r.acclimatized), r.criterion, six(r.limitWbgtC), six(r.marginC), String(r.exceeds)])}
      />
      <Note>The NIOSH limits apply to a one-hour average, and acclimatisation is an input. The engine refuses otherwise:</Note>
      {h.refusals.map((r) => <Quote key={r.message}>{r.message}</Quote>)}
    </>
  );
};

export const EvidenceMode = ({ ev, d }) => {
  if (!ev || !d) return <Note>The evidence reader did not return.</Note>;
  return (
    <>
      <Tbl
        head={['door', 'published cases', 'oracle-only cases', 'errata', 'refusals', 'evidence class']}
        rows={ev.map((r) => [r.fn, String(r.published), String(r.oracle), String(r.errata), String(r.refusals), r.cls])}
      />
      <Tbl
        head={['example', 'M W', 'equation C', 'document prints C', 'difference C']}
        rows={d.examples.map((r) => [r.id, six(r.metabolicRateW), six(r.equationC), six(r.printedC), six(r.differenceC)])}
      />
      <Evidence>
        The document&apos;s worked example was read off its figure and does not agree with its own equation. A learner who reads
        the figure and a learner who evaluates the equation get different answers, which is one reason no heat limit is graded.
      </Evidence>
      <Tbl
        head={['M W', 'REL equation C', 'band value printed C', 'band minus equation C']}
        rows={d.bands.map((r) => [six(r.metabolicRateW), six(r.relC), six(r.bandC), six(r.bandMinusEquationC)])}
      />
    </>
  );
};

export const ErrataMode = ({ e }) => {
  if (!e) return <Note>The errata reader did not return.</Note>;
  return (
    <>
      <Tbl
        head={['golden id', 'argument', 'printed', 'engine', 'engine minus printed', 'tolerances away']}
        rows={e.rows.map((r) => [r.id, six(r.argument), six(r.printed), six(r.engine), six(r.difference), six(r.tolerancesAway)])}
      />
      {e.rows.map((r) => <Quote key={r.id}>{r.why}</Quote>)}
      <Tbl
        head={['noise dose percent', 'TWA dBA by the formula']}
        rows={e.neighbours.map((r) => [six(r.dosePct), six(r.twaDbA)])}
      />
      <Note>A pinned erratum is a case the engine must miss, so an edit that matched the typo would fail the suite.</Note>
    </>
  );
};

const HeatStressExplorer = ({ initialMode = 'wbgt' }) => {
  const [mode, setMode] = useState(initialMode);
  const [m, setM] = useState(String(MET_SWEEP[5]));

  const h = useMemo(() => safe(heat), []);
  const d = useMemo(() => safe(disagreement), []);
  const ev = useMemo(() => safe(evidence), []);
  const e = useMemo(() => safe(errata), []);

  return (
    <PanelShell
      title="Heat stress"
      subtitle="The wet bulb globe temperature indoors and outdoors, the one-hour averages, the NIOSH 2016 RAL and REL equations with their evidence status beside every figure, and the published errata."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        {mode === 'limits' && (
          <SelectField
            label="Metabolic rate, W"
            value={m}
            onChange={setM}
            options={MET_SWEEP.map((v) => [String(v), `${v} W`])}
          />
        )}
      </FieldGrid>
      <div className="mt-3">
        {mode === 'wbgt' && <WbgtMode h={h} />}
        {mode === 'limits' && <LimitsMode h={h} m={m} />}
        {mode === 'evidence' && <EvidenceMode ev={ev} d={d} />}
        {mode === 'errata' && <ErrataMode e={e} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored exposure engine or a value read out of its golden, printed to
        the precision the teaching digest prints. Temperatures are degrees C WBGT and metabolic rates are watts.
      </Note>
    </PanelShell>
  );
};

export default HeatStressExplorer;
