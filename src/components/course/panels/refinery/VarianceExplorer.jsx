import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  START_YEAR, START_YEAR_CHECK, odiomaPlan, odiomaActuals, varianceOf, expansionOf,
  usd, bbl, pbl, pct, mmd,
} from './refineryLab';
import {
  AXIS, TOOLTIP, GRID, SERIES, txt, yes, Tbl, Refused, Note, Lead, Empty, safe, usable, BoxField, Button, Check, toneOf,
} from './panelBits';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid,
} from '@/components/course/panels/petrophysics/panelKit';

// Variance explorer, the Expert tier throughout.
//
// THE ACTUALS ARE READ AGAINST THE PLAN LINE BY LINE, ON WHAT EACH GAP DID TO
// MARGIN. ODIOMA's plan ledger sits beside what the month did, and each actual
// can be edited. Every line's volume, price and unexplained variance, its
// direction and its margin effect are return values of the vendored
// refineryPlanning and streamModel engines through the teaching lab, and each
// line is coloured by its margin effect: green where the gap helped the margin,
// red where it hurt.
//
// THE EXPANSION IS READ AS ITS TAX. The conversion expansion's cash flow comes
// from the screening engine through feasibilityEconomics, with a switch for the
// loss carry-forward. The NPV is shown as one reading beside the table and is
// never a control or a headline.

export const MODES = [
  ['ledger', 'The plan ledger beside the actuals, and every variance line'],
  ['totals', 'Totals on margin, the unmatched movements and the units against plan'],
  ['expansion', 'The expansion through the screening engine, and the loss carried forward'],
];

// ---------------------------------------------------------------------------

export const LedgerMode = ({
  ledger, actuals, onActual, onReset, v,
}) => {
  if (!Array.isArray(ledger) || !Array.isArray(actuals)) return <Empty>The plan ledger has returned nothing.</Empty>;
  return (
    <>
      <Lead>The plan ledger, summed from the scheduled events by material and type, beside what the month did.</Lead>
      <Tbl
        head={['material', 'type', 'plan events', 'plan quantity (bbl)', 'plan value', 'actual quantity (bbl)', 'actual value']}
        rows={actuals.map((a, k) => {
          const p = ledger.find((r) => r.materialId === a.materialId && r.type === a.type);
          return [a.materialId, a.type, p ? p.events : 'not in the plan', p ? bbl(p.quantity) : '', p ? usd(p.value) : '',
            <BoxField key="q" value={a.quantity} onChange={(x) => onActual(k, 'quantity', x)} width="w-28" />,
            <BoxField key="c" value={a.cost} onChange={(x) => onActual(k, 'cost', x)} width="w-32" />];
        })}
      />
      <div className="flex gap-2 mt-2"><Button onClick={onReset}>Put back the month as recorded</Button></div>
      <Note>A delivery&apos;s value is what it sold for; every other event&apos;s value is what it cost. A value box left blank is recorded as no value.</Note>
      <div className="mt-3">
        {!v || typeof v !== 'object' ? <Empty>The variance reader has returned nothing.</Empty> : null}
        {v && v.error ? <Refused label={`makeEvent, ${txt(v.materialId)} ${txt(v.type)}`} sentence={v.error} /> : null}
        {usable(v) && Array.isArray(v.lines) && (
          <>
            <Tbl
              head={['material', 'type', 'direction', 'volume variance', 'price variance', 'unexplained', 'total variance', 'margin effect', 'costed']}
              rows={v.lines.map((l) => [l.materialId, l.type, l.direction, usd(l.volumeVariance), usd(l.priceVariance), usd(l.unexplained), usd(l.totalVariance),
                <span key="m" className={toneOf(l.marginEffect)}>{usd(l.marginEffect)}</span>, yes(l.costed)])}
            />
            <Tbl
              head={['material', 'type', 'plan unit value', 'actual unit value', 'quantity gap (bbl)']}
              rows={v.lines.map((l) => [l.materialId, l.type, pbl(l.planUnitValue), pbl(l.actualUnitValue), bbl(l.quantityGap)])}
            />
            <Note>
              The margin effect is the total variance with its sign set by what it did to margin: as it is on a revenue
              line, reversed on a cost line. The unexplained column is money that moved with no barrels to explain it.
            </Note>
          </>
        )}
      </div>
    </>
  );
};

export const TotalsMode = ({ v }) => {
  if (!v || typeof v !== 'object') return <Empty>The variance reader has returned nothing.</Empty>;
  if (v.error) return <Refused label={`makeEvent, ${txt(v.materialId)} ${txt(v.type)}`} sentence={v.error} />;
  if (!Array.isArray(v.unmatched) || !v.total) return <Empty>The variance reader has returned no totals.</Empty>;
  return (
    <>
      <Lead>Movements in one ledger and not the other, listed apart and folded into no variance line:</Lead>
      {v.unmatched.length ? (
        <Tbl
          head={['material', 'type', 'present in', 'quantity (bbl)', 'value']}
          rows={v.unmatched.map((u) => [u.materialId, u.type, u.presentIn, bbl(u.quantity), usd(u.cost)])}
        />
      ) : <Note>None: every movement matched a planned one.</Note>}
      <TileGrid>
        <Tile label="Total variance on margin, the matched lines" value={usd(v.total.totalVariance)} unit="USD" />
        <Tile label="Margin variance, the two ledgers" value={usd(v.marginVariance)} unit="USD" />
        <Tile label="The gap between them" value={usd(v.marginGap)} unit="USD" />
        <Tile label="The unmatched movements on margin" value={usd(v.unmatchedOnMargin)} unit="USD" />
      </TileGrid>
      <Note>
        The ledger margins count every movement; the variance lines count only the matched ones, so the gap between the
        two totals is the unmatched movements, deliveries counted as revenue and the rest as cost. The engine states its
        headline basis as: {txt(v.total.basis)}.
      </Note>
      <Tbl
        head={['total', 'volume variance', 'price variance', 'unexplained', 'total variance']}
        rows={[
          ['on margin (the headline)', usd(v.total.volumeVariance), usd(v.total.priceVariance), usd(v.total.unexplained), usd(v.total.totalVariance)],
          ['cost lines, as recorded', usd(v.cost.volumeVariance), usd(v.cost.priceVariance), usd(v.cost.unexplained), usd(v.cost.totalVariance)],
          ['revenue lines, as recorded', usd(v.revenue.volumeVariance), usd(v.revenue.priceVariance), usd(v.revenue.unexplained), usd(v.revenue.totalVariance)],
        ]}
      />
      <Note>Every line&apos;s total variance as recorded, cost and revenue added together: {usd(v.recordedSum)}.</Note>
      <Tbl
        head={['ledger', 'events', 'cost', 'revenue', 'margin', 'uncosted events']}
        rows={v.ledgers.map((d) => [d.ledger, d.events, usd(d.cost), usd(d.revenue), usd(d.margin), d.uncostedEvents])}
      />
      <Note>Plan margin {usd(v.planMargin)}, actual margin {usd(v.actualMargin)}; the plan&apos;s own margin {usd(v.planOwnMargin)}, {pbl(v.planGrossMarginPerBbl)} a barrel of crude.</Note>
      <Lead>Each unit against plan. The app reports the gap and does not say why it happened.</Lead>
      <Tbl
        head={['unit', 'planned (bbl)', 'actual (bbl)', 'difference (bbl)', 'utilisation of plan (percent)']}
        rows={v.unitPerformance.map((u) => [u.unitId, bbl(u.planned), bbl(u.actual), bbl(u.difference), pct(u.utilisationOfPlan)])}
      />
    </>
  );
};

export const ExpansionMode = ({
  exp, carry, onCarry, year, onYear,
}) => {
  const controls = (
    <div className="flex flex-wrap gap-4">
      <Check label="Carry the tax loss forward, as the feasibility studio does" checked={carry} onChange={onCarry} />
      <SelectField label="Start year the years are labelled from" value={String(year)} onChange={(x) => onYear(Number(x))} options={[[String(START_YEAR), String(START_YEAR)], [String(START_YEAR_CHECK), String(START_YEAR_CHECK)]]} />
    </div>
  );
  if (!exp || typeof exp !== 'object') return <>{controls}<Empty>The expansion reader has returned nothing.</Empty></>;
  if (exp.error) return <>{controls}<Refused label="feasibilityEconomics" sentence={exp.error} /></>;
  if (!Array.isArray(exp.rows)) return <>{controls}<Empty>The expansion reader has returned no years.</Empty></>;
  const data = exp.rows.map((r, k) => ({ year: r.year, tax: r.tax, off: Array.isArray(exp.taxOptionOff) ? exp.taxOptionOff[k] : null }));
  return (
    <>
      {controls}
      <TileGrid>
        <Tile label="First year with tax to pay" value={exp.firstTaxYear < 0 ? 'none' : `year ${exp.firstTaxYear}`} />
        <Tile label="Tax that year" value={exp.firstTax === null ? 'none' : mmd(exp.firstTax)} unit="MM USD" />
        <Tile label="Total tax over the life" value={mmd(exp.totalTax)} unit="MM USD" />
        <Tile label="Capital" value={usd(exp.capital)} unit="USD" />
      </TileGrid>
      <Note>
        The expansion: gross value {pbl(exp.grossValuePerBbl)} a barrel of crude, {bbl(exp.annualBbl)} bbl a year, gross margin
        {' '}{pbl(exp.grossMarginPerBbl)} a barrel. What the screening engine is handed: fiscal type {exp.inputs.fiscalType},
        royalty rate {exp.inputs.royaltyRate}, tax rate {exp.inputs.taxRate}, discount rate {exp.inputs.discountRate}, loss
        carry-forward {yes(exp.inputs.lossCarryForward)}, {exp.inputs.projectLife} years from {exp.inputs.startYear}.
      </Note>
      <Tbl
        head={['year', 'calendar year', 'gross revenue (MM)', 'opex (MM)', 'capex (MM)', 'taxable income before relief (MM)', 'tax (MM)', 'loss carried forward (MM)', 'net cash flow (MM)']}
        rows={exp.rows.map((r) => [r.index, r.year, mmd(r.grossRevenue), mmd(r.opex), mmd(r.capex), mmd(r.taxableBeforeRelief), mmd(r.tax), mmd(r.lossCarriedForward), mmd(r.ncf)])}
        tone={(k) => (k === exp.firstTaxYear ? 'text-[#BFFF00]' : '')}
      />
      <div className="mt-3">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={AXIS} />
            <YAxis tick={AXIS} width={50} />
            <Tooltip contentStyle={TOOLTIP} formatter={(x) => mmd(x)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="tax" name={carry ? 'tax, loss carried forward (MM)' : 'tax, option off (MM)'} fill={SERIES[0]} />
            <Bar dataKey="off" name="tax, option off (MM)" fill={SERIES[1]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Total tax with the loss carried forward {mmd(exp.totalTaxOn)} MM, with the option off {mmd(exp.totalTaxOff)} MM; the
        difference {exp.totalTaxDifference} MM. The capital is expensed in the years it is spent, so the construction years
        make a tax loss.
      </Note>
      <Note>
        The screen&apos;s valuation reading, NPV at the discount rate with mid-year discounting: {mmd(exp.npvReading)} MM. The
        Economics courses teach and grade it; here it is read as the screen&apos;s output.
      </Note>
    </>
  );
};

// ---------------------------------------------------------------------------

const VarianceExplorer = ({ initialMode = 'ledger' }) => {
  const [mode, setMode] = useState(initialMode);
  const [actuals, setActuals] = useState(() => odiomaActuals());
  const [carry, setCarry] = useState(true);
  const [year, setYear] = useState(START_YEAR);

  const ledger = useMemo(() => (mode === 'ledger' ? safe(() => odiomaPlan().ledger) : null), [mode]);
  const v = useMemo(() => (mode === 'expansion' ? null : safe(() => varianceOf(actuals))), [mode, actuals]);
  const exp = useMemo(() => (mode === 'expansion' ? safe(() => expansionOf({ lossCarryForward: carry, startYear: year })) : null), [mode, carry, year]);

  const onActual = (k, field, value) => setActuals((a) => a.map((r, i) => (i === k ? { ...r, [field]: value } : r)));

  return (
    <PanelShell
      title="Variance explorer"
      subtitle="ODIOMA, a month's plan read against what the month did, line by line on margin, and a conversion expansion valued through the screening engine with its tax loss carried forward."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'ledger' && <LedgerMode ledger={ledger} actuals={actuals} onActual={onActual} onReset={() => setActuals(odiomaActuals())} v={v} />}
        {mode === 'totals' && <TotalsMode v={v} />}
        {mode === 'expansion' && <ExpansionMode exp={exp} carry={carry} onCarry={setCarry} year={year} onYear={setYear} />}
      </div>
      <Note>
        Every variance, margin and tax figure on this page is a return value of the vendored refineryPlanning,
        streamModel and modularRefinery engines and the screening engine through the teaching lab. Every refusal is the
        engine&apos;s own sentence. Every price is illustrative, in US dollars.
      </Note>
    </PanelShell>
  );
};

export default VarianceExplorer;
