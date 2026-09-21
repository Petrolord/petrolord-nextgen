import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';
import {
  riskScale, riskMatrix, bandProbes, residualProbes, appetiteProbes, residualInputChoices, targetChoices,
  residualAt, registerCount, registerPopulations, obodoRegister, calendarProbes,
  POPULATION_CHOICES, SCORE_CHOICES, AS_OF_ISO, q, yn, orNull, given,
} from './riskchangeLab';
import {
  Tbl, Chip, Note, Lead, Empty, safe, AXIS, TOOLTIP, GRID, DASH, MARGIN, BAND_FILL,
} from './panelBits';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid,
} from '@/components/course/panels/petrophysics/panelKit';

// Risk explorer, the Associate tier throughout.
//
// ONE RISK, TWO SCORES AND A REGISTER. The five by five grid shows what a score
// and a band are; the residual view shows what a control is worth and what the
// engine does with an axis nobody assessed; the register view shows that a
// count by band answers whatever question its caller asked.
//
// THE BLANK AND THE OFF-SCALE VALUE DO DIFFERENT THINGS, and the residual view
// exists to show it: a blank axis falls back to the inherent level on that axis
// alone, and an axis given a value off the scale leaves the whole residual
// unscored. Both are the engine's answers through the lab.
//
// Every score, band, verdict and count on this page is a return value of the
// vendored riskScoring engine through riskchangeLab, and every date is read on
// the as-of date the lab hands the engine. Nothing here reads a clock.

export const MODES = [
  ['matrix', 'The five by five grid, its bands and the scores no cell holds'],
  ['residual', 'Residual against inherent, one axis at a time, and appetite'],
  ['register', 'The OBODO register counted by band, two switches'],
  ['calendar', 'Whole days and a review due on the as-of date'],
];

// ---------------------------------------------------------------------------

export const MatrixMode = ({ m, scale, probes }) => {
  if (!m || !Array.isArray(m.rows) || !Array.isArray(m.strip) || !scale || !Array.isArray(scale.bands)) {
    return <Empty>The matrix reader has returned nothing, so there is no grid to draw.</Empty>;
  }
  return (
    <>
      <TileGrid>
        <Tile label="Levels on each axis" value={`${scale.scaleMin} to ${scale.scaleMax}`} />
        <Tile label="Distinct scores in the grid" value={m.distinctScores.length} />
        <Tile label="Scores no cell holds" value={m.unreachable.length} />
        <Tile label="The band that means no score" value={q(scale.noBand)} />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300">
          <thead>
            <tr>
              <th className="pr-2 text-left text-slate-500">likelihood \ impact</th>
              {m.impacts.map((i) => <th key={i} className="px-1 text-slate-500">{i}</th>)}
            </tr>
          </thead>
          <tbody>
            {m.rows.map((row) => (
              <tr key={row.likelihood}>
                <td className="pr-2 text-slate-500">{row.likelihood}</td>
                {row.cells.map((c) => (
                  <td key={c.impact} className="p-0.5">
                    <Chip band={c.band}>{c.score} {c.band}</Chip>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Lead>
        Every whole score from the lowest cell to the top one, each coloured by the band the engine gives it. A band
        begins at its LOWER edge, marked with a bar, and runs up to the next edge. The scores struck through are ones
        no two whole levels multiply to, so no cell can reach them.
      </Lead>
      <div className="mt-2 flex flex-wrap gap-0.5">
        {m.strip.map((x) => (
          <span
            key={x.score}
            title={`${x.score} ${x.band}${x.unreachable ? ', held by no cell' : ''}`}
            className={`inline-block rounded border px-1 text-xs ${x.lowerEdge ? 'border-l-4 border-l-lime-400' : ''} ${x.unreachable ? 'line-through opacity-50' : ''}`}
            style={{ background: BAND_FILL[x.band] }}
          >
            {x.score}
          </span>
        ))}
      </div>
      <Tbl
        head={['band', 'lower edge', 'upper edge as written', 'cells in the grid']}
        rows={scale.bands.map((b) => [q(b.band), b.lowerEdge, b.upperAsWritten, m.bandCellCounts[b.band]])}
      />
      <Note>
        The upper edge is a label. The engine finds a band by its lower edge alone, which is why a score above the grid
        still bands and a score between two cells bands too.
      </Note>
      {Array.isArray(probes) && (
        <Tbl head={['score', 'band']} rows={probes.map((p) => [p.score, q(p.band)])} />
      )}
    </>
  );
};

export const ResidualMode = ({
  r, choices, targets, l, i, t, onL, onI, onT, probes, appetite,
}) => {
  if (!r || !Array.isArray(r.axes) || !Array.isArray(choices) || !Array.isArray(targets)) {
    return <Empty>The residual reader has returned nothing, so there is no residual to compare.</Empty>;
  }
  const kindWord = (a) => {
    if (a.kind === 'blank') return `blank: not assessed, so it falls back to the inherent level ${a.inherentLevel}`;
    if (a.kind === 'level') return `level ${a.given}: assessed and on the scale`;
    return `${given(a.given)}: assessed OFF the scale, so the whole residual is unscored`;
  };
  return (
    <>
      <FieldGrid>
        <SelectField label="Residual likelihood" value={l} onChange={onL} options={choices.map((c) => [c.value, c.label])} />
        <SelectField label="Residual impact" value={i} onChange={onI} options={choices.map((c) => [c.value, c.label])} />
        <SelectField label="Target score" value={t} onChange={onT} options={targets.map((c) => [c.value, c.label])} />
      </FieldGrid>
      <TileGrid>
        <Tile label={`Inherent, ${r.inherentLikelihood} by ${r.inherentImpact}`} value={`${r.inherentScore} ${q(r.inherentBand)}`} />
        <Tile label="Residual" value={`${r.residualScore} ${q(r.residualBand)}`} />
        <Tile label="Target" value={orNull(r.target)} />
        <Tile label="Appetite" value={q(r.appetite)} />
      </TileGrid>
      <Tbl
        head={['residual axis', 'what the engine makes of it']}
        rows={r.axes.map((a) => [a.axis, kindWord(a)])}
      />
      {r.unscored && (
        <Note>
          The residual is unscored: the engine reports a score of {r.residualScore} and the band {q(r.residualBand)}
          rather than guessing a level for the axis that was given something off the scale.
        </Note>
      )}
      {r.appetiteNotSet && (
        <Note>
          {q(r.appetite)} is the engine declining to answer. With no target, a target of zero or a residual it cannot
          score, it has no basis for a pass, so it reports none.
        </Note>
      )}
      {Array.isArray(probes) && (
        <Tbl
          head={['residual probe on the same risk', 'likelihood given', 'impact given', 'residual', 'band']}
          rows={probes.map((p) => [p.label, given(p.residualLikelihood), given(p.residualImpact), p.score, q(p.band)])}
        />
      )}
      {Array.isArray(appetite) && (
        <Tbl
          head={['appetite probe', 'residual', 'target', 'appetite']}
          rows={appetite.map((p) => [p.label, p.residual, given(p.target), q(p.appetite)])}
        />
      )}
    </>
  );
};

export const RegisterMode = ({
  c, pops, rows, population, score, onPopulation, onScore,
}) => {
  if (!c || !Array.isArray(c.counts) || !pops || !Array.isArray(pops.rows)) {
    return <Empty>The register reader has returned nothing, so there is nothing to count.</Empty>;
  }
  return (
    <>
      <FieldGrid>
        <SelectField label="Population handed over" value={population} onChange={onPopulation} options={POPULATION_CHOICES} />
        <SelectField label="Score counted" value={score} onChange={onScore} options={SCORE_CHOICES} />
      </FieldGrid>
      <TileGrid>
        <Tile label="Risks handed to countByBand" value={c.handed} />
        <Tile label="Counted as" value={c.label} />
        <Tile label={q('Critical')} value={c.critical} />
        <Tile label="Critical, across the four choices" value={pops.criticalCounts.join(', ')} />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={c.counts} margin={MARGIN}>
            <CartesianGrid stroke={GRID} strokeDasharray={DASH} />
            <XAxis dataKey="band" tick={AXIS} />
            <YAxis tick={AXIS} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP} />
            <Bar dataKey="count" name="risks" isAnimationActive={false}>
              {c.counts.map((x) => <Cell key={x.band} fill={BAND_FILL[x.band]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The engine does not filter by status. It counts whatever list it is handed, so the population and the score are
        both the caller&apos;s choices, and a dashboard tile has to say which question it answers. {pops.live} of the
        {' '}{pops.risks} risks are live.
      </Note>
      <Tbl
        head={['population', ...pops.rows[0].counts.map((x) => q(x.band))]}
        rows={pops.rows.map((p) => [p.label, ...p.counts.map((x) => x.count)])}
      />
      {Array.isArray(rows) && (
        <Tbl
          head={['risk', 'status', 'L', 'I', 'inherent', 'residual L', 'residual I', 'residual', 'target', 'appetite']}
          rows={rows.map((x) => [x.id, q(x.status), x.likelihood, x.impact, `${x.inherentScore} ${q(x.inherentBand)}`,
            given(x.residualLikelihood), given(x.residualImpact), `${x.residualScore} ${q(x.residualBand)}`,
            given(x.target), q(x.appetite)])}
        />
      )}
    </>
  );
};

export const CalendarMode = ({ cal, rows }) => {
  if (!Array.isArray(cal) || !Array.isArray(rows)) {
    return <Empty>The calendar reader has returned nothing, so there are no days to count.</Empty>;
  }
  return (
    <>
      <Lead>
        Every date is read at LOCAL midnight from its leading YYYY-MM-DD, and so is the as-of date, {AS_OF_ISO}. A date
        that does not exist reads as no date at all.
      </Lead>
      <Tbl head={['date given', 'as', 'parsed', 'days until']} rows={cal.map((c) => [c.label, given(c.given), orNull(c.parsed), orNull(c.days)])} />
      <Lead>
        A review is overdue when the risk is live and its date has passed. A review due on the as-of date is not
        overdue, and a risk that is not live carries no review at all.
      </Lead>
      <Tbl
        head={['risk', 'status', 'next review', 'days until', 'review overdue']}
        rows={rows.map((x) => [x.id, q(x.status), orNull(x.nextReview), orNull(x.daysUntil), yn(x.reviewOverdue)])}
      />
    </>
  );
};

// ---------------------------------------------------------------------------

const RiskExplorer = ({ initialMode = 'matrix' }) => {
  const [mode, setMode] = useState(initialMode);
  const [l, setL] = useState('');
  const [i, setI] = useState('');
  const [t, setT] = useState('');
  const [population, setPopulation] = useState(POPULATION_CHOICES[0][0]);
  const [score, setScore] = useState(SCORE_CHOICES[0][0]);

  const scale = useMemo(() => safe(riskScale), []);
  const m = useMemo(() => (mode === 'matrix' ? safe(riskMatrix) : null), [mode]);
  const bands = useMemo(() => (mode === 'matrix' ? safe(bandProbes) : null), [mode]);
  const choices = useMemo(() => (mode === 'residual' ? safe(residualInputChoices) : null), [mode]);
  const targets = useMemo(() => (mode === 'residual' ? safe(targetChoices) : null), [mode]);
  const r = useMemo(() => (mode === 'residual' ? safe(() => residualAt(l, i, t)) : null), [mode, l, i, t]);
  const rProbes = useMemo(() => (mode === 'residual' ? safe(residualProbes) : null), [mode]);
  const aProbes = useMemo(() => (mode === 'residual' ? safe(appetiteProbes) : null), [mode]);
  const c = useMemo(() => (mode === 'register' ? safe(() => registerCount(population, score)) : null), [mode, population, score]);
  const pops = useMemo(() => (mode === 'register' ? safe(registerPopulations) : null), [mode]);
  const rows = useMemo(() => (mode === 'register' || mode === 'calendar' ? safe(obodoRegister) : null), [mode]);
  const cal = useMemo(() => (mode === 'calendar' ? safe(calendarProbes) : null), [mode]);

  return (
    <PanelShell
      title="Risk explorer"
      subtitle={`The five by five matrix, residual against inherent with the per-axis fallback, appetite against a target, and the OBODO register counted by band, every date read on the as-of date ${AS_OF_ISO}.`}
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'matrix' && <MatrixMode m={m} scale={scale} probes={bands} />}
        {mode === 'residual' && (
          <ResidualMode
            r={r}
            choices={choices}
            targets={targets}
            l={l}
            i={i}
            t={t}
            onL={setL}
            onI={setI}
            onT={setT}
            probes={rProbes}
            appetite={aProbes}
          />
        )}
        {mode === 'register' && (
          <RegisterMode
            c={c}
            pops={pops}
            rows={rows}
            population={population}
            score={score}
            onPopulation={setPopulation}
            onScore={setScore}
          />
        )}
        {mode === 'calendar' && <CalendarMode cal={cal} rows={rows} />}
      </div>
      <Note>
        Every score, band, verdict and count on this page is a return value of the vendored risk scoring engine through
        the teaching lab, printed the way the lessons quote it: statuses, bands and verdicts in double quotes
        exactly as the engine spells them, and dates as YYYY-MM-DD.
      </Note>
    </PanelShell>
  );
};

export default RiskExplorer;
