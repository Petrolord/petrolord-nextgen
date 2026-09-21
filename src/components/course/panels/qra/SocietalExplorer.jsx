import React, { useMemo, useState } from 'react';
import {
  pll, farOf, fnCompare, parseNumber, parseRows, rowsText, crew, offsite, criteria, fractionTable, PRESETS, STREAMS,
} from './qraLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, twelve, word, Tbl, TextRows, Refusal, Declared, safe,
} from './panelBits';

// The societal risk explorer (Professional): potential loss of life and the
// fatal accident rate of a crew, and the F-N curve of a population against a
// criterion line or point. Every figure is a return value of the vendored
// engine through qraLab, on the teaching streams or on what the learner types.
// Each scenario's expected number of deaths is a stated input.

export const MODES = [
  ['pll', 'Potential loss of life and the fatal accident rate'],
  ['fn', 'The F-N curve against a criterion'],
  ['fractions', 'Deaths indoors and outdoors, for societal risk'],
];

const SCEN_KEYS = ['frequencyPerYr', 'fatalities'];

export const PllMode = ({ t }) => {
  const [text, setText] = useState(rowsText(STREAMS.JISIKE_CREW, SCEN_KEYS));
  const [persons, setPersons] = useState(String(STREAMS.JISIKE_CREW_PERSONS));
  const [hours, setHours] = useState(String(STREAMS.JISIKE_HOURS_PER_PERSON));
  const p = useMemo(() => pll({ scenarios: parseRows(text, SCEN_KEYS).rows }), [text]);
  const exposed = parseNumber(persons) * parseNumber(hours);
  const f = useMemo(() => (p.error ? null : farOf({ pllPerYr: p.pllPerYr, exposedHoursPerYr: exposed })), [p, exposed]);
  return (
    <>
      <FieldGrid>
        <TextRows label="Scenarios, one per line: name, frequency per year, expected deaths N (need not be whole)" value={text} onChange={setText} rows={5} />
        <NumField label="People exposed" value={persons} onChange={setPersons} />
        <NumField label="Hours a year each person is exposed" value={hours} onChange={setHours} />
      </FieldGrid>
      {p.error ? <Refusal r={p} /> : (
        <>
          <TileGrid>
            <Tile label="PLL" value={twelve(p.pllPerYr)} unit="fatalities per year" />
            <Tile label="Exposed hours a year" value={Number.isFinite(exposed) ? String(exposed) : 'none'} unit="hours" />
            {f && !f.error && <Tile label="FAR" value={six(f.far)} unit="per 100,000,000 exposed hours" />}
          </TileGrid>
          {f && f.error && <Refusal r={f} />}
          <Tbl head={['scenario', 'f x N per year']} rows={p.contributions.map((c) => [c.name, twelve(c.pllPerYr)])} />
          <Declared title="PLL, IN THE ENGINE'S WORDS">{p.basis.model}</Declared>
        </>
      )}
      {t && (
        <>
          <Note>The JISIKE crew, the teaching stream, and the same PLL and FAR built wrongly.</Note>
          <Tbl
            head={['how it was built', 'value']}
            rows={[
              ['PLL, sum of f x N', twelve(t.c.pllPerYr)],
              ['sum of f over N', twelve(t.c.wrong.fOverN)],
              ['sum of f with N ignored', twelve(t.c.wrong.nIgnored)],
              ['FAR over the crew\'s hours', six(t.c.far)],
              ['FAR over one person\'s hours', six(t.c.wrong.farOnePerson)],
              ['FAR on a base of 1,000,000 hours', six(t.c.wrong.farBaseMillion)],
            ]}
          />
        </>
      )}
    </>
  );
};

const CRITERIA = [
  ...PRESETS.criteria.map((k) => [k, `the preset ${k}`]),
  ['line', 'a line of my own, F = C over N to the alpha'],
];

export const FnMode = ({ t }) => {
  const [text, setText] = useState(rowsText(STREAMS.JISIKE_OFFSITE, SCEN_KEYS));
  const [crit, setCrit] = useState(PRESETS.criteria[0]);
  const [c, setC] = useState(String(STREAMS.CALLER_LINE.constantC));
  const [alpha, setAlpha] = useState(String(STREAMS.CALLER_LINE.exponentAlpha));
  const [nMin, setNMin] = useState('');
  const [nMax, setNMax] = useState('');
  const r = useMemo(() => {
    const scenarios = parseRows(text, SCEN_KEYS).rows;
    if (crit !== 'line') return fnCompare({ scenarios, criterion: crit });
    const line = { constantC: parseNumber(c), exponentAlpha: parseNumber(alpha) };
    if (nMin !== '') line.minFatalities = parseNumber(nMin);
    if (nMax !== '') line.maxFatalities = parseNumber(nMax);
    return fnCompare({ scenarios, criterion: line });
  }, [text, crit, c, alpha, nMin, nMax]);
  return (
    <>
      <FieldGrid>
        <TextRows label="Scenarios, one per line: name, frequency per year, expected deaths N" value={text} onChange={setText} rows={6} />
        <SelectField label="Criterion" value={crit} onChange={setCrit} options={CRITERIA} />
        {crit === 'line' && <NumField label="C, the line at N = 1, per year" value={c} onChange={setC} />}
        {crit === 'line' && <NumField label="alpha, the slope" value={alpha} onChange={setAlpha} />}
        {crit === 'line' && <NumField label="Smallest N (blank for 1)" value={nMin} onChange={setNMin} />}
        {crit === 'line' && <NumField label="Largest N (blank for none)" value={nMax} onChange={setNMax} />}
      </FieldGrid>
      {r.error ? <Refusal r={r} /> : (
        <>
          <TileGrid>
            <Tile label="State" value={r.state} />
            <Tile label="Worst ratio F over the criterion" value={six(r.maxRatio)} />
            <Tile label="At N" value={word(r.worstAtFatalities)} />
          </TileGrid>
          <Tbl head={['N', 'F(N), N or more, per year']} rows={r.curve.map((p) => [six(p.fatalities), twelve(p.cumulativeFrequencyPerYr)])} />
          <Tbl
            head={['checked at N', 'F(N) per year', 'criterion per year', 'ratio', 'state', 'above from N']}
            rows={r.checks.map((x) => [six(x.fatalities), twelve(x.curveFrequencyPerYr), twelve(x.criterionFrequencyPerYr), six(x.ratio), x.state, x.exceedsOverFatalities ? six(x.exceedsOverFatalities.from) : ''])}
          />
          <Declared title="THE BOUNDARY, IN THE ENGINE'S WORDS">{r.basis.boundary}</Declared>
        </>
      )}
      {t && (
        <>
          <Note>The JISIKE off-site curve read three ways: N or more, which the engine uses; more than N; and only the scenarios with exactly N.</Note>
          <Tbl head={['N', 'N or more', 'more than N', 'exactly N']} rows={t.o.points.map((p) => [six(p.fatalities), twelve(p.cumulativeFrequencyPerYr), twelve(p.moreThanN), twelve(p.exactlyN)])} />
          <Note>No published worked F-N example exists; the curve is checked by self-consistency. The criterion side is published: the Dutch line and the single R2P2 point.</Note>
          <Tbl
            head={['criterion', 'state']}
            rows={[
              ['the Dutch line', t.c.dutch.state],
              ['the R2P2 point', t.c.point.state],
              ['a slope one line of the analyst\'s own', t.c.caller.state],
              ['a curve built to touch the Dutch line', t.c.touching.state],
            ]}
          />
        </>
      )}
    </>
  );
};

export const FractionsMode = ({ t }) => (
  <>
    <Declared title="WHAT THESE REST ON">
      The Purple Book fractions of deaths indoors and outdoors are single transcriptions of one source, which prints no
      worked example for them. They are taught here and never graded. They count deaths across a population for
      societal risk; individual risk takes the analyst's own vulnerability factor.
    </Declared>
    {t && (
      <Tbl
        head={['case', 'PE', 'FE,in', 'FE,out', 'fraction indoors', 'Fd']}
        rows={t.fr.map((x) => [x.effectCase, six(x.probabilityOfDeath), six(x.fractionDyingIndoors), six(x.fractionDyingOutdoors), six(x.fractionIndoors), twelve(x.fractionOfDeaths)])}
      />
    )}
  </>
);

const SocietalExplorer = ({ initialMode = 'pll' }) => {
  const [mode, setMode] = useState(initialMode);
  const tPll = useMemo(() => (mode === 'pll' ? safe(() => ({ c: crew() })) : null), [mode]);
  const tFn = useMemo(() => (mode === 'fn' ? safe(() => ({ o: offsite(), c: criteria() })) : null), [mode]);
  const tFr = useMemo(() => (mode === 'fractions' ? safe(() => ({ fr: fractionTable() })) : null), [mode]);
  return (
    <PanelShell
      title="Societal risk explorer"
      subtitle="How many people at once: the expected deaths a year, the rate per exposed hour, and the frequency of N or more deaths against a published line or point. Type every number: the engine invents none."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'pll' && <PllMode t={tPll} />}
        {mode === 'fn' && <FnMode t={tFn} />}
        {mode === 'fractions' && <FractionsMode t={tFr} />}
      </div>
      <Note>Every number on this panel is a return value of the vendored QRA engine.</Note>
    </PanelShell>
  );
};

export default SocietalExplorer;
