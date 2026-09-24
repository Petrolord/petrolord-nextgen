import React, { useMemo, useState } from 'react';
import {
  completenessOf, coverageOf, rangeOf, indexOf, ratesOf, cumulativeOf, waterCutOf, phaseSumOf, frozenOf, namesOf,
  parseSeries, parseNames, parseNumber, logChecks, productionChecks, wellNames, DATASET, DEFINITIONAL_LIMITS,
} from './dataqcLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, list, Tbl, SeriesField, Refusal, Declared, Flags, Series, safe,
} from './panelBits';

// The checks explorer (Associate): is the data fit to use. Completeness and
// coverage, definitional and caller ranges with rate rules, the depth or time
// index, the consistency checks and well names. Every figure is a return value
// of the vendored engine through dataqcLab, on the Ekene teaching dataset or on
// the series the learner types. Type null or a dash for a missing value.

export const MODES = [
  ['there', 'Is it there: completeness and coverage'],
  ['valid', 'Is it valid: range limits and rate rules'],
  ['index', 'The depth or time index'],
  ['agree', 'Does it agree with itself: cumulative, water cut, phase sum, frozen runs'],
  ['names', 'Well names: normalisation and near duplicates'],
];

const LOG = DATASET.EKENE_LOG;
const PROD = DATASET.EKENE_PROD;
const CHANNEL_OPTIONS = [['', 'caller limits (min and max below)'], ...Object.keys(DEFINITIONAL_LIMITS).map((k) => [k, k])];

export const ThereMode = ({ t }) => {
  const [vals, setVals] = useState(Series(LOG.channels.RHOB.values.slice(70, 100)));
  const [idx, setIdx] = useState(Series(LOG.depth.slice(70, 100)));
  const [start, setStart] = useState(String(LOG.depth[70]));
  const [end, setEnd] = useState(String(LOG.depth[99]));
  const [maxStep, setMaxStep] = useState('0.5');
  const v = parseSeries(vals);
  const ix = parseSeries(idx);
  const c = v.error ? null : completenessOf({ values: v.values });
  const cv = v.error || ix.error ? null : coverageOf({
    index: ix.values, values: v.values, start: parseNumber(start), end: parseNumber(end), maxStep: parseNumber(maxStep),
  });
  return (
    <>
      <FieldGrid>
        <SeriesField label="Values (null or a dash is missing)" value={vals} onChange={setVals} />
        <SeriesField label="Index, one entry per value" value={idx} onChange={setIdx} />
        <NumField label="Interval start" value={start} onChange={setStart} />
        <NumField label="Interval end" value={end} onChange={setEnd} />
        <NumField label="maxStep" value={maxStep} onChange={setMaxStep} />
      </FieldGrid>
      {v.error && <Note>{v.error}</Note>}
      {ix.error && <Note>{ix.error}</Note>}
      {c && c.error && <Refusal r={c} />}
      {c && !c.error && (
        <>
          <TileGrid>
            <Tile label="Completeness, present over n" value={six(c.completeness)} />
            <Tile label="Missing" value={String(c.missing)} />
            <Tile label="Gap runs" value={String(c.gapRuns.length)} />
            <Tile label="Longest gap" value={String(c.longestGap)} />
          </TileGrid>
          <Flags flags={c.flags} />
        </>
      )}
      {cv && cv.error && <Refusal r={cv} />}
      {cv && !cv.error && (
        <>
          <TileGrid>
            <Tile label="Coverage of the interval" value={six(cv.coverage)} />
            <Tile label="Covered length" value={six(cv.coveredLength)} />
          </TileGrid>
          <Tbl head={['hole from', 'to']} rows={cv.uncovered.map((h) => [six(h.from), six(h.to)])} />
        </>
      )}
      <Note>A step between two present samples covers the index between them when it is at most maxStep; a longer step is a hole.</Note>
      {t && (
        <Tbl head={['EKENE-7 channel', 'missing', 'completeness', 'gap runs']} rows={t.channels.map((x) => [x.name, String(x.missing), six(x.completeness), String(x.gapRuns)])} />
      )}
    </>
  );
};

export const ValidMode = ({ t }) => {
  const [vals, setVals] = useState(Series(LOG.channels.NPHI.values.slice(145, 165)));
  const [channel, setChannel] = useState('fraction');
  const [unit, setUnit] = useState('v/v');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [rates, setRates] = useState(Series(PROD.oil.slice(44, 62)));
  const [hours, setHours] = useState(Series(PROD.hoursOn.slice(44, 62)));
  const v = parseSeries(vals);
  const args = channel ? { values: v.values, channel, unit } : { values: v.values, min: parseNumber(min), max: parseNumber(max) };
  const r = v.error ? null : rangeOf(args);
  const rv = parseSeries(rates);
  const hv = parseSeries(hours);
  const rc = rv.error || hv.error ? null : ratesOf({ rates: rv.values, hoursOn: hv.values });
  return (
    <>
      <FieldGrid>
        <SeriesField label="Values" value={vals} onChange={setVals} />
        <SelectField label="Channel" value={channel} onChange={(c) => { setChannel(c); setUnit(c ? Object.keys(DEFINITIONAL_LIMITS[c])[0] : ''); }} options={CHANNEL_OPTIONS} />
        {channel && <SelectField label="Unit" value={unit} onChange={setUnit} options={[...Object.keys(DEFINITIONAL_LIMITS[channel]).map((u) => [u, u]), ['unlisted', 'a unit the engine does not list (see the refusal)']]} />}
        <NumField label="Caller minimum" value={min} onChange={setMin} />
        <NumField label="Caller maximum" value={max} onChange={setMax} />
      </FieldGrid>
      {v.error && <Note>{v.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Checked" value={String(r.checked)} />
            <Tile label="Failed" value={String(r.failed)} />
          </TileGrid>
          <Declared title="WHERE THE LIMITS CAME FROM">{r.basis.source}</Declared>
          <Flags flags={r.flags} />
        </>
      )}
      <FieldGrid>
        <SeriesField label="Daily rates" value={rates} onChange={setRates} />
        <SeriesField label="Hours on, one per day (0 means shut in)" value={hours} onChange={setHours} />
      </FieldGrid>
      {(rv.error || hv.error) && <Note>{rv.error || hv.error}</Note>}
      {rc && rc.error && <Refusal r={rc} />}
      {rc && !rc.error && <Flags flags={rc.flags} />}
      <Note>The engine ships definitional limits only. A plausibility range for a basin or a tool is yours to supply, and a unit the engine does not list is refused and nothing is converted.</Note>
      {t && (
        <Tbl head={['EKENE-7 channel', 'checked', 'failed', 'entries flagged']} rows={t.ranges.map((x) => [x.name, String(x.checked), String(x.failed), list(x.flagged)])} />
      )}
    </>
  );
};

export const IndexMode = ({ t }) => {
  const [idx, setIdx] = useState(Series(DATASET.EKENE_SPLICE.index));
  const [direction, setDirection] = useState('increasing');
  const [step, setStep] = useState('');
  const [tol, setTol] = useState('');
  const ix = parseSeries(idx);
  const r = ix.error ? null : indexOf({
    index: ix.values, direction, expectedStep: parseNumber(step), stepTolerance: parseNumber(tol),
  });
  return (
    <>
      <FieldGrid>
        <SeriesField label="Index" value={idx} onChange={setIdx} />
        <SelectField label="Direction" value={direction} onChange={setDirection} options={[['increasing', 'increasing'], ['decreasing', 'decreasing']]} />
        <NumField label="Expected step (blank infers it)" value={step} onChange={setStep} />
        <NumField label="Step tolerance (blank is 1e-6 x the step)" value={tol} onChange={setTol} />
      </FieldGrid>
      {ix.error && <Note>{ix.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Expected step" value={six(r.expectedStep)} />
            <Tile label="Duplicates" value={String(r.duplicates)} />
            <Tile label="Reversals" value={String(r.reversals)} />
            <Tile label="Irregular steps" value={String(r.irregularSteps)} />
            <Tile label="Missing entries" value={String(r.missing)} />
          </TileGrid>
          <Declared title="WHERE THE EXPECTED STEP CAME FROM">{r.expectedStepSource}</Declared>
          <Flags flags={r.flags} />
        </>
      )}
      <Note>A duplicate is a value equal to any earlier value, so a step back onto an earlier depth is flagged twice.</Note>
      {t && <Note>The EKENE-7 splice: {t.splice.duplicates} duplicates, {t.splice.reversals} reversal, {t.splice.irregularSteps} irregular steps, {t.splice.missing} missing entry.</Note>}
    </>
  );
};

export const AgreeMode = ({ t }) => {
  const [cum, setCum] = useState(Series(PROD.cumOil.slice(64, 74)));
  const [cumTol, setCumTol] = useState('0');
  const [oil, setOil] = useState(Series(PROD.oil.slice(36, 44)));
  const [water, setWater] = useState(Series(PROD.water.slice(36, 44)));
  const [gross, setGross] = useState(Series(PROD.gross.slice(36, 44)));
  const [rel, setRel] = useState('0.005');
  const [frozen, setFrozen] = useState(Series(PROD.gas.slice(70, 84)));
  const [minRun, setMinRun] = useState('5');
  const [fTol, setFTol] = useState('0');
  const cs = parseSeries(cum);
  const cc = cs.error ? null : cumulativeOf({ cumulative: cs.values, tolerance: parseNumber(cumTol) });
  const o = parseSeries(oil); const w = parseSeries(water); const g = parseSeries(gross);
  const bad = o.error || w.error || g.error;
  const wc = bad ? null : waterCutOf({ oil: o.values, water: w.values });
  const ps = bad ? null : phaseSumOf({ parts: { oil: o.values, water: w.values }, total: g.values, relTolerance: parseNumber(rel) });
  const fz = parseSeries(frozen);
  const fr = fz.error ? null : frozenOf({ values: fz.values, minRun: parseNumber(minRun), tolerance: parseNumber(fTol) });
  return (
    <>
      <FieldGrid>
        <SeriesField label="A cumulative (null is missing)" value={cum} onChange={setCum} />
        <NumField label="Meter tolerance" value={cumTol} onChange={setCumTol} />
      </FieldGrid>
      {cs.error && <Note>{cs.error}</Note>}
      {cc && (cc.error ? <Refusal r={cc} /> : <Flags flags={cc.flags} />)}
      <FieldGrid>
        <SeriesField label="Oil" value={oil} onChange={setOil} />
        <SeriesField label="Water" value={water} onChange={setWater} />
        <SeriesField label="Gross liquid total" value={gross} onChange={setGross} />
        <NumField label="Phase sum relTolerance, on the total" value={rel} onChange={setRel} />
      </FieldGrid>
      {bad && <Note>{bad}</Note>}
      {wc && (wc.error ? <Refusal r={wc} /> : (
        <Tbl head={['entry', 'water / (oil + water)']} rows={wc.computed.map((x, i) => [String(i), six(x)])} />
      ))}
      {ps && (ps.error ? <Refusal r={ps} /> : <Flags flags={ps.flags} />)}
      <FieldGrid>
        <SeriesField label="A series that may be stuck" value={frozen} onChange={setFrozen} />
        <NumField label="minRun" value={minRun} onChange={setMinRun} />
        <NumField label="Tolerance, against the run's first value" value={fTol} onChange={setFTol} />
      </FieldGrid>
      {fz.error && <Note>{fz.error}</Note>}
      {fr && (fr.error ? <Refusal r={fr} /> : <Flags flags={fr.flags} />)}
      <Note>A cumulative is compared with the last present value before it. Water cut is on a liquid basis. The phase-sum tolerance is taken on the total.</Note>
      {t && (
        <Tbl
          head={['EKENE-3 check', 'result']}
          rows={[
            ['cumulative falls', t.cumulative.map((x) => `day ${x.day} against day ${x.comparedWithDay}, drop ${six(x.drop)}`).join('; ')],
            ['water cut failures at 1e-6 and at 1e-4', `${t.waterCut.failedAtDefault} and ${t.waterCut.failedAtReporting}`],
            ['phase sum', t.phaseSum.map((x) => `day ${x.day}: ${six(x.sum)} against ${six(x.total)}, allowed ${six(x.allowed)}`).join('; ')],
            ['frozen gas', t.frozenGas.map((x) => `days ${x.firstDay} to ${x.lastDay} at ${six(x.value)}`).join('; ')],
          ]}
        />
      )}
    </>
  );
};

export const NamesMode = ({ t }) => {
  const [names, setNames] = useState(DATASET.EKENE_IDS.ids.join('\n'));
  const [digits, setDigits] = useState('true');
  const [dist, setDist] = useState('1');
  const r = namesOf({ ids: parseNames(names), digitsMustMatch: digits === 'true', maxDistance: parseNumber(dist) });
  return (
    <>
      <FieldGrid>
        <SeriesField label="Well names, one per line" value={names} onChange={setNames} rows={6} />
        <SelectField label="Digits must match" value={digits} onChange={setDigits} options={[['true', 'yes (the default)'], ['false', 'no']]} />
        <NumField label="maxDistance" value={dist} onChange={setDist} />
      </FieldGrid>
      {r.error ? <Refusal r={r} /> : (
        <>
          <TileGrid>
            <Tile label="Exact pairs" value={String(r.exact)} />
            <Tile label="Normalised pairs" value={String(r.normalisedDuplicates)} />
            <Tile label="Near pairs" value={String(r.near)} />
          </TileGrid>
          <Tbl head={['pair', 'kind', 'distance', 'the engine reason']} rows={r.pairs.map((p) => [`${p.i}, ${p.j}`, p.kind, String(p.distance), p.reason])} />
          <Declared title="THE STATED NORMALISATION">{r.basis.normalisation}</Declared>
        </>
      )}
      {t && <Note>The Ekene well names at the defaults: {t.exact} exact, {t.normalisedDuplicates} normalised and {t.near} near pair.</Note>}
    </>
  );
};

const ChecksExplorer = ({ initialMode = 'there' }) => {
  const [mode, setMode] = useState(initialMode);
  const log = useMemo(() => safe(logChecks), []);
  const prod = useMemo(() => safe(productionChecks), []);
  const names = useMemo(() => safe(wellNames), []);
  return (
    <PanelShell
      title="Data checks explorer"
      subtitle="Whether data are there, valid, well indexed, consistent and uniquely named. Every flag carries the rule that fired and its reason."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'there' && <ThereMode t={log} />}
        {mode === 'valid' && <ValidMode t={log} />}
        {mode === 'index' && <IndexMode t={log} />}
        {mode === 'agree' && <AgreeMode t={prod} />}
        {mode === 'names' && <NamesMode t={names} />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored data quality engine. Missing means null, and a
        sentinel such as -999.25 is a present value until you convert it.
      </Note>
    </PanelShell>
  );
};

export default ChecksExplorer;
