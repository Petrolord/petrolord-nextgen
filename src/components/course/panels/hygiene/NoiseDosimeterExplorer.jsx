import React, { useMemo, useState } from 'react';
import {
  threeCriteria, warnings, publishedTables, inverses, extendedShift, lex,
} from './hygieneLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, cell, Tbl, Quote, safe,
} from './hygieneKit';

// The noise dosimeter: one record read under three criteria, the published
// tables the engine reproduces, the daily and weekly exposure levels, and the
// shift that is not eight hours.
//
// A NOISE DOSE IS ALWAYS A NOISE DOSE AGAINST A CRITERION. The same record is
// under the OSHA PEL, over the OSHA action level and over the NIOSH noise REL,
// and the panel prints all three side by side so that no one of them reads as
// the real answer.
//
// Every figure on this page is a return value of the vendored exposure engine
// through hygieneLab. Nothing here computes a noise dose, a TWA or a level.

export const MODES = [
  ['criteria', 'One record under three criteria'],
  ['tables', 'The published tables and the printed coefficients'],
  ['lex', 'LEX,8h and the week'],
  ['shift', 'The shift that is not eight hours'],
];

export const CriteriaMode = ({ c, w, inv, period }) => {
  if (!c) return <Note>The dosimeter reader did not return.</Note>;
  const i = Number(period);
  return (
    <>
      <TileGrid>
        {c.oben.map((r) => (
          <Tile key={r.id} label={`${r.label}: noise dose against a limit of ${six(r.limitDosePct)} percent`} value={six(r.dosePct)} unit="percent" />
        ))}
        <Tile label="Time left at 95 dBA under the OSHA PEL" value={six(c.timeLeft.leftMin)} unit="min" />
      </TileGrid>
      <Tbl
        head={['criterion', 'criterion level dBA', 'decibel exchange rate dB', 'threshold dBA', 'noise dose percent', 'TWA dBA', 'exceeds its limit']}
        rows={c.oben.map((r) => [r.label, six(r.criterionLevelDbA), six(r.exchangeRateDb), six(r.thresholdDbA), six(r.dosePct), six(r.twaDbA), String(r.exceedsLimit)])}
      />
      <Tbl
        head={['level dBA', 'hours', 'OSHA PEL percent', 'OSHA action level percent', 'NIOSH noise REL percent']}
        rows={c.record.map((p, k) => [six(p.levelDbA), six(p.durationH), cell(c.oben[0].contributions[k].dosePct), cell(c.oben[1].contributions[k].dosePct), cell(c.oben[2].contributions[k].dosePct)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Period {i + 1} at {six(c.record[i].levelDbA)} dBA has an OSHA reference duration of {cell(c.referenceDurations[i].oshaH)} h
        {' '}and a NIOSH reference duration of {cell(c.referenceDurations[i].nioshH)} h. The loudest period carries
        {' '}{six(c.loudestSharePct)} percent of the PEL noise dose, so it is one term of the sum and never the answer on its own.
      </p>
      <Tbl
        head={['threshold record, level dBA', 'hours', 'OSHA PEL', 'OSHA action level', 'NIOSH noise REL']}
        rows={c.oroni[0].contributions.map((p, k) => [six(p.levelDbA), six(p.durationH), cell(c.oroni[0].contributions[k].dosePct), cell(c.oroni[1].contributions[k].dosePct), cell(c.oroni[2].contributions[k].dosePct)])}
      />
      <Note>The threshold is inclusive: a period exactly at 80 dBA counts under the action level, and one at 79.9 dBA counts under nothing.</Note>
      {w && w.map((x) => (
        <div key={x.label} className="mt-2">
          <p className="text-xs text-slate-300 mb-0">{x.label}: noise dose {six(x.dosePct)} percent, TWA {six(x.twaDbA)} dBA.</p>
          {x.warnings.map((m) => <Quote key={m}>{m}</Quote>)}
        </div>
      ))}
      {inv && <Quote>{inv.overADay.message}</Quote>}
    </>
  );
};

export const TablesMode = ({ t, inv }) => {
  if (!t) return <Note>The table reader did not return.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="Exact 5 dB coefficient, 5 over log10 2" value={t.exact5.toFixed(12)} />
        <Tile label="Exact 3 dB coefficient, 3 over log10 2" value={t.exact3.toFixed(12)} />
        <Tile label="Table A-1 rows the exact coefficient fails" value={`${t.a1ExactFailures} of ${t.a1.length}`} />
        <Tile label="NIOSH Table 1-2 rows the exact coefficient fails" value={`${t.t12ExactFailures} of ${t.t12.length}`} />
      </TileGrid>
      <Note>
        Each preset uses the coefficient its source prints, because that is what reproduces the source&apos;s own table.
        The cost: eight hours at a constant 100 dBA reads {six(t.nioshAt100)} dBA on the NIOSH preset and
        {' '}{six(t.nioshAt100Exact)} dBA with the exact coefficient.
      </Note>
      <Tbl
        head={['level dBA', 'engine hours', 'Table G-16a printed hours']}
        rows={t.g16a.filter((r, k) => k % 5 === 0).map((r) => [six(r.argument), six(r.engine), six(r.printed)])}
      />
      <Tbl
        head={['noise dose percent', 'TWA with 16.61', 'Table A-1 printed', 'TWA with the exact coefficient']}
        rows={t.a1.filter((r, k) => k % 15 === 0).map((r) => [six(r.argument), six(r.engine), six(r.printed), six(r.exact)])}
      />
      {inv && (
        <>
          <Tbl
            head={['TWA dBA', 'OSHA noise dose percent', 'NIOSH noise dose percent']}
            rows={inv.doses.map((r) => [six(r.twaDbA), six(r.oshaPct), six(r.nioshPct)])}
          />
          <Note>
            One decibel on the TWA multiplies the OSHA noise dose by {six(inv.oneDbOsha)} and the NIOSH noise dose by
            {' '}{six(inv.oneDbNiosh)}. A noise dose of zero has no TWA, and the engine says so:
          </Note>
          <Quote>{inv.zeroDoseTwa.message}</Quote>
        </>
      )}
    </>
  );
};

export const LexMode = ({ l }) => {
  if (!l) return <Note>The LEX reader did not return.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="L108 Figure 26, LEX,8h" value={six(l.figure26.lexDbA)} unit="dBA" />
        <Tile label="L108 Figure 26, exposure points" value={six(l.figure26.exposurePoints)} />
        <Tile label="Teaching day, LEX,8h" value={six(l.day.lexDbA)} unit="dBA" />
        <Tile label="Longer day, still divided by 8" value={six(l.long.lexDbA)} unit="dBA" />
      </TileGrid>
      <Tbl
        head={['LAeq dBA', 'hours', 'task LEX dBA', 'task points']}
        rows={l.day.tasks.map((t, k) => [six(t.laeqDbA), six(t.durationH), six(l.day.contributions[k].lexDbA), six(l.day.contributions[k].exposurePoints)])}
      />
      <Note>
        The longer day&apos;s energy averaged over its own {six(l.long.hours)} hours is {six(l.long.overOwnHoursDbA)} dBA, which is
        the LAeq over the day and a different quantity from LEX,8h. The EU lower and upper action values are
        {' '}{six(l.euValues.lowerActionLexDbA)} and {six(l.euValues.upperActionLexDbA)} dBA, and the limit value is
        {' '}{six(l.euValues.limitLexDbA)} dBA at the ear.
      </Note>
      <Tbl
        head={['week', 'days', 'weekly LEX dBA', 'arithmetic mean of the days dBA']}
        rows={l.weeks.map((x) => [x.label, String(x.count), six(x.lexWeeklyDbA), six(x.meanDbA)])}
      />
      <Note>
        The divisor is five whatever the number of days. Remove the {six(l.loudestDayDbA)} dBA day from the five-day week and
        the weekly level is {six(l.withoutLoudestDbA)} dBA.
      </Note>
      <Tbl
        head={['LAeq dBA', 'hours to 80', 'hours to 85', 'hours to 87']}
        rows={l.allowed.map((r) => [six(r.laeqDbA), six(r.to80), six(r.to85), six(r.to87)])}
      />
    </>
  );
};

export const ShiftMode = ({ s }) => {
  if (!s) return <Note>The extended-shift reader did not return.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="Ten-hour record, action-level noise dose over the whole shift" value={six(s.actionDosePct)} unit="percent" />
        <Tile label="The same, rescaled to eight hours (not a defined quantity)" value={six(s.rescaledPct)} unit="percent" />
        <Tile label="TWA the action-level dosimeter reports" value={six(s.actionTwaDbA)} unit="dBA" />
        <Tile label="Action level for a ten-hour shift" value={six(s.shiftActionLevelDbA)} unit="dBA" />
      </TileGrid>
      <Tbl
        head={['shift hours', 'action level dBA', 'Table IV-3 printed dBA']}
        rows={s.sweep.map((r) => [six(r.hours), six(r.actionLevelDbA), r.printed === null ? 'not printed' : six(r.printed)])}
      />
      <Tbl
        head={['level dBA', 'hours', 'action-level contribution percent']}
        rows={s.record.map((p, k) => [six(p.levelDbA), six(p.durationH), cell(s.contributions[k])])}
      />
      <Note>
        The noise dose sums every period of the shift. Comparing the reported TWA with the ten-hour action level gives the same
        verdict as comparing the noise dose with 50 percent. The PEL noise dose on the same record is {six(s.pelDosePct)} percent.
      </Note>
    </>
  );
};

const NoiseDosimeterExplorer = ({ initialMode = 'criteria' }) => {
  const [mode, setMode] = useState(initialMode);
  const [period, setPeriod] = useState('0');

  const c = useMemo(() => safe(threeCriteria), []);
  const w = useMemo(() => safe(warnings), []);
  const t = useMemo(() => safe(publishedTables), []);
  const inv = useMemo(() => safe(inverses), []);
  const l = useMemo(() => safe(lex), []);
  const s = useMemo(() => safe(extendedShift), []);

  return (
    <PanelShell
      title="Noise dosimeter"
      subtitle="One dosimeter record read under the OSHA PEL, the OSHA action level and the NIOSH noise REL; the published tables the engine reproduces; the daily and weekly exposure levels; and the shift that is not eight hours."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        {mode === 'criteria' && c && (
          <SelectField
            label="Period"
            value={period}
            onChange={setPeriod}
            options={c.record.map((p, k) => [String(k), `${k + 1}: ${p.levelDbA} dBA for ${p.durationH} h`])}
          />
        )}
      </FieldGrid>
      <div className="mt-3">
        {mode === 'criteria' && <CriteriaMode c={c} w={w} inv={inv} period={period} />}
        {mode === 'tables' && <TablesMode t={t} inv={inv} />}
        {mode === 'lex' && <LexMode l={l} />}
        {mode === 'shift' && <ShiftMode s={s} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored exposure engine on the teaching records and the published
        tables, printed to the precision the teaching digest prints. Sound levels are A-weighted, in dBA.
      </Note>
    </PanelShell>
  );
};

export default NoiseDosimeterExplorer;
