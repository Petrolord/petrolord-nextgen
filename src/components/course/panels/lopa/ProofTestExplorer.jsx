import React, { useMemo, useState } from 'react';
import {
  sensitivity, longest, parseNumber, parseSeries,
  sensitivityTable, longestIntervals, coverageFloor, judgement, STREAMS,
} from './lopaLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, twelve, silText, Tbl, TextRows, Refusal, Declared, SubsystemFields, fromParams, toParams, safe,
} from './panelBits';

// The proof-test explorer (Expert): PFDavg against the proof test interval, the
// longest interval that meets a target and the states that say why there is
// none, and the floor imperfect proof test coverage sets. Every figure is a
// return value of the vendored engine through lopaLab, on the teaching streams
// or on what the learner types.

export const MODES = [
  ['sensitivity', 'PFDavg against the proof test interval'],
  ['longest', 'The longest interval for a target, and its states'],
  ['coverage', 'Imperfect coverage: the floor and the lifetime'],
];

export const SensitivityMode = ({ t }) => {
  const [s, set] = useState(fromParams(STREAMS.IDU.valves));
  const [intervals, setIntervals] = useState(STREAMS.SENS_INTERVALS.join(', '));
  const iv = parseSeries(intervals);
  const r = useMemo(() => (iv.error ? null : sensitivity(toParams(s), iv.values)), [s, intervals]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <SubsystemFields s={s} set={set} />
      <FieldGrid>
        <TextRows label="Proof test intervals, hours" value={intervals} onChange={setIntervals} rows={1} />
      </FieldGrid>
      {iv.error && <Note>{iv.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <Tbl
          head={['T1 hours', 'PFDavg', 'RRF', 'SIL', 'over the row before']}
          rows={r.rows.map((x, i) => [String(x.proofTestIntervalHours), twelve(x.pfdAvg), six(x.rrf), silText(x.sil), i === 0 ? '' : six(x.pfdAvg / r.rows[i - 1].pfdAvg)])}
        />
      )}
      {t && (
        <>
          <Note>Four teaching subsystems at the same six intervals.</Note>
          <Tbl
            head={['T1 hours', ...t.map((x) => x.label)]}
            rows={t[0].rows.map((row, i) => [String(row.proofTestIntervalHours), ...t.map((x) => twelve(x.rows[i].pfdAvg))])}
          />
          <Declared title="LINEAR AND QUADRATIC GROWTH">
            A 1oo1 with no detected failures doubles with each doubling of T1. A redundant subsystem grows toward the
            square of T1 as its independent term takes over, and a common cause term keeps it closer to linear.
          </Declared>
        </>
      )}
    </>
  );
};

export const LongestMode = ({ t }) => {
  const [s, set] = useState(fromParams(STREAMS.IDU.valves));
  const [target, setTarget] = useState(String(STREAMS.VALVE_TARGETS[2]));
  const r = useMemo(() => longest(toParams(s), parseNumber(target)), [s, target]);
  return (
    <>
      <SubsystemFields s={s} set={set} />
      <FieldGrid>
        <NumField label="Target PFDavg" value={target} onChange={setTarget} />
      </FieldGrid>
      {r.error ? <Refusal r={r} /> : (
        <>
          <TileGrid>
            <Tile label="State" value={r.state} />
            <Tile label="Longest T1" value={r.proofTestIntervalHours === null ? 'none' : six(r.proofTestIntervalHours)} unit={r.proofTestIntervalHours === null ? '' : 'hours'} />
            {r.proofTestIntervalYears !== undefined && <Tile label="Longest T1" value={six(r.proofTestIntervalYears)} unit="years" />}
            {r.floorPfdAvg !== undefined && <Tile label="Floor PFDavg" value={twelve(r.floorPfdAvg)} />}
            {r.pfdAvg !== undefined && <Tile label="PFDavg reported" value={twelve(r.pfdAvg)} />}
          </TileGrid>
          <Declared title="THE ENGINE'S METHOD">{r.basis.method}</Declared>
        </>
      )}
      {t && (
        <>
          <Note>The IDU valves against five targets.</Note>
          <Tbl
            head={['target', 'state', 'longest T1 hours', 'years', 'PFDavg at that T1']}
            rows={t.valves.map((x) => [String(x.target), x.state, six(x.proofTestIntervalHours), six(x.proofTestIntervalYears), twelve(x.pfdAvg)])}
          />
          <Tbl
            head={['case', 'state', 'longest T1 hours', 'floor PFDavg', 'PFDavg reported']}
            rows={t.states.map((x) => [x.name, x.state, x.proofTestIntervalHours === null ? 'none' : six(x.proofTestIntervalHours), x.floorPfdAvg === null ? '' : twelve(x.floorPfdAvg), x.pfdAvg === null ? '' : twelve(x.pfdAvg)])}
          />
        </>
      )}
    </>
  );
};

export const CoverageMode = ({ t }) => {
  const [s, set] = useState(fromParams({ ...STREAMS.OBAGI_VALVE, proofTestCoverage: STREAMS.PTC_LADDER[3] }));
  const [target, setTarget] = useState(String(STREAMS.OBAGI_TARGET_PFDAVG));
  const p = toParams(s);
  const r = useMemo(() => longest(p, parseNumber(target)), [s, target]); // eslint-disable-line react-hooks/exhaustive-deps
  const f = useMemo(() => longest(p, 1e-9), [s]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <SubsystemFields s={s} set={set} />
      <FieldGrid>
        <NumField label="Target PFDavg" value={target} onChange={setTarget} />
      </FieldGrid>
      {r.error ? <Refusal r={r} /> : (
        <TileGrid>
          <Tile label="Floor PFDavg, T1 going to zero" value={f.error || f.floorPfdAvg === undefined ? 'none' : twelve(f.floorPfdAvg)} />
          <Tile label="State at the target" value={r.state} />
          <Tile label="Longest T1" value={r.proofTestIntervalHours === null ? 'none' : six(r.proofTestIntervalHours)} unit={r.proofTestIntervalHours === null ? '' : 'hours'} />
        </TileGrid>
      )}
      {t && (
        <>
          <Note>The OBAGI valve, coverage swept, against its target.</Note>
          <Tbl
            head={['coverage', 'floor PFDavg', 'longest T1 hours', 'years']}
            rows={t.c.map((x) => [String(x.proofTestCoverage), twelve(x.floorPfdAvg), six(x.proofTestIntervalHours), six(x.proofTestIntervalYears)])}
          />
          <Note>The IDU SIF with every proof test interval stretched together, against the ORONI row.</Note>
          <Tbl
            head={['years', 'SIF PFDavg', 'RRF', 'SIL', 'meets the TMEL']}
            rows={t.j.stretched.map((x) => [String(x.years), twelve(x.pfdAvg), six(x.rrf), silText(x.sil), String(x.meetsTmel)])}
          />
          <Declared title="A SIL THAT HOLDS IS NOT A REQUIREMENT THAT HOLDS">
            The SIF stops meeting the TMEL while it is still in its band. The required PFDavg is the target.
          </Declared>
        </>
      )}
    </>
  );
};

const ProofTestExplorer = ({ initialMode = 'sensitivity' }) => {
  const [mode, setMode] = useState(initialMode);
  const t1 = useMemo(() => (mode === 'sensitivity' ? safe(sensitivityTable) : null), [mode]);
  const t2 = useMemo(() => (mode === 'longest' ? safe(longestIntervals) : null), [mode]);
  const t3 = useMemo(() => (mode === 'coverage' ? safe(() => ({ c: coverageFloor(), j: judgement() })) : null), [mode]);
  return (
    <PanelShell
      title="Proof-test explorer"
      subtitle="How PFDavg grows with the proof test interval, the longest interval a target allows, and the floor a partial proof test leaves."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'sensitivity' && <SensitivityMode t={t1} />}
        {mode === 'longest' && <LongestMode t={t2} />}
        {mode === 'coverage' && <CoverageMode t={t3} />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored LOPA engine. The Annex B forms it uses are
        conservative: they never fall below the time dependent average.
      </Note>
    </PanelShell>
  );
};

export default ProofTestExplorer;
