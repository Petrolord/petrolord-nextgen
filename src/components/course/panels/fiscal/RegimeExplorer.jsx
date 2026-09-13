import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, BarChart, Bar, Line, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  ODIDI_LABEL, PROJECT_KEYS,
  templates, projects, ledger, projectLife, volumeProbe, priceProbe, templateTotals,
} from './fiscalLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Regime explorer, the Associate tier. THE INSTRUMENTS AND THE LEDGER: the six
// templates as data, one template on one project row by row in cascade order,
// the production and price the project generates before any regime touches
// them, and all six templates on one project side by side.
//
// Every figure on this page is a return value from fiscalLab, which is a
// return value from the vendored fiscal regime engine. Nothing here computes a
// dollar or a barrel.

const mm = (v) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
  : 'null');
const ratio = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'null');
const pct = (v) => (Number.isFinite(v) ? `${Number(v).toFixed(4)} percent` : 'null');
const yr = (v) => (v === null || v === undefined ? 'never' : String(v));

const MODES = [
  ['instruments', 'Instruments: the six templates as data'],
  ['ledger', 'Ledger: one template on one project, all 25 rows'],
  ['project', 'Project: the volumes and the applied price, before any regime'],
  ['totals', 'Totals: all six templates on one project'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;
const compact = (v) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : Number(v).toFixed(0));

const PROJECT_OPTIONS = PROJECT_KEYS.map((k) => [k, k === 'odidi' ? 'ODIDI, the teaching field' : (k === 'default' ? 'DEFAULT PROJECT, published' : 'TEST PROJECT, published')]);

const Tbl = ({ head, rows, highlight = -1 }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>{head.map((h, i) => <th key={i} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={i === highlight ? 'text-white font-semibold' : ''}>
            {r.map((c, j) => <td key={j} className={`${j < r.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Instruments = () => {
  const list = useMemo(() => { try { return templates(); } catch { return null; } }, []);
  if (!list || !list.length) {
    return <Note>The template list did not load. A regime carries four instruments and nothing else, and with no template there is nothing to read them off.</Note>;
  }
  return (
    <>
      <div className="grid gap-3 lg:grid-cols-2">
        {list.map((t) => (
          <div key={t.id} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
            <p className="text-white text-sm font-medium mb-0">{t.name}</p>
            <p className="text-xs text-slate-500 font-mono mb-1">{t.id}</p>
            <p className="text-xs text-slate-400 mt-1 mb-2">{t.description}</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div>
                <p className="text-slate-500 mb-0">Royalty</p>
                <p className="mb-0">{t.royaltyType === 'flat'
                  ? `flat ${t.royalty.rate} percent`
                  : t.royalty.tiers.map((x) => `${x.threshold} USD/bbl to ${x.rate} percent`).join(', ')}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-0">Cost recovery limit</p>
                <p className="mb-0">{t.costRecoveryLimit} percent of revenue after royalty</p>
              </div>
              <div>
                <p className="text-slate-500 mb-0">Profit split</p>
                <p className="mb-0">{t.profitSplitType === 'flat'
                  ? `flat ${t.profitSplit.split} percent to the contractor`
                  : t.profitSplit.tiers.map((x) => `R ${x.threshold} to ${x.split} percent`).join(', ')}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-0">Tax stack</p>
                <p className="mb-0">CIT {t.tax.cit}, RRT {t.tax.rrt}, minimum {t.tax.minTax} percent{t.rrtUpliftPct === null ? '' : `, RRT uplift ${t.rrtUpliftPct} percent`}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Note>
        Four instruments and nothing else. Three of the six take a flat 100 percent of profit oil and recover cost
        at 100 percent, which is what a concession looks like inside a model built around a production sharing
        ledger: the contractor keeps whatever the taxes do not take. The other three split profit oil on the R
        factor and cap cost recovery at 80, 90 and 50 percent. Where the RRT uplift is not written it defaults to
        20 percent, and that default is charged in every one of the 25 years.
      </Note>
    </>
  );
};

const Ledger = () => {
  const [regimeId, setRegimeId] = useState('usa___gulf_of_mexico');
  const [projectKey, setProjectKey] = useState('default');
  const led = useMemo(() => { try { return ledger(regimeId, projectKey); } catch { return null; } }, [regimeId, projectKey]);
  const list = useMemo(() => { try { return templates(); } catch { return []; } }, []);
  if (!led) {
    return <Note>The engine returned no ledger. A ledger needs a regime carrying all four instruments and a project carrying production, prices and costs; without them there is nothing to cascade.</Note>;
  }
  const paybackIdx = led.rows.findIndex((x) => x.year === led.paybackYear);
  const chart = led.rows.map((x) => ({ year: x.year, ncf: x.contractorNCF, cumulative: x.cumulativeNCF, gov: x.governmentTake }));
  return (
    <>
      <FieldGrid>
        <SelectField label="Template" value={regimeId} onChange={setRegimeId} options={list.map((t) => [t.id, t.name])} />
        <SelectField label="Project" value={projectKey} onChange={setProjectKey} options={PROJECT_OPTIONS} />
      </FieldGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">{led.regimeLine}.</p>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Total gross revenue" value={mm(led.totals.rev)} unit="million USD" />
          <Tile label="Total contractor net cash flow" value={mm(led.totals.ncf)} unit="million USD" />
          <Tile label="Total government take" value={mm(led.totals.gov)} unit="million USD" />
          <Tile label="Total tax" value={mm(led.totals.tax)} unit="million USD" />
          <Tile label="Total cost recovered" value={mm(led.totals.rec)} unit="million USD" />
          <Tile label="Closing unrecovered pool" value={mm(led.closingUnrecoveredPool)} unit="million USD" />
          <Tile label="Payback year" value={yr(led.paybackYear)} />
          <Tile label="R factor payout year" value={yr(led.payoutYear)} />
          <Tile label={`NPV at ${led.discountRatePct} percent`} value={mm(led.npv)} unit="million USD" />
          <Tile label="IRR" value={pct(led.irrPct)} />
          <Tile label="Rows the engine returns" value={String(led.rowCount)} unit="years" />
          <Tile label="Total capex, all in year 1" value={mm(led.totals.capex)} unit="million USD" />
        </TileGrid>
      </div>
      <Tbl
        highlight={paybackIdx}
        head={['year', 'grossRevenue', 'royalty', 'costRecovered', 'unrecoveredCostPool', 'profitOil', 'tax', 'opex', 'capex', 'contractorNCF', 'governmentTake', 'cumulativeNCF', 'rFactor']}
        rows={led.rows.map((x) => [
          x.year, mm(x.grossRevenue), mm(x.royalty), mm(x.costRecovered), mm(x.unrecoveredCostPool), mm(x.profitOil),
          mm(x.tax), mm(x.opex), mm(x.capex), mm(x.contractorNCF), mm(x.governmentTake), mm(x.cumulativeNCF), ratio(x.rFactor),
        ])}
      />
      <p className="text-xs text-slate-500 mt-1 mb-0">
        The bold row is the payback year, the first year cumulative contractor net cash flow is above zero.
        {led.paybackYear === null ? ' On these inputs there is no such year and nothing is marked.' : ''}
      </p>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="year" tick={AXIS} />
            <YAxis tick={AXIS} tickFormatter={compact} label={{ value: 'million USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => mm(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#64748b" />
            <Bar dataKey="ncf" name="contractor net cash flow" isAnimationActive={false}>
              {chart.map((c) => <Cell key={c.year} fill={c.ncf < 0 ? '#f87171' : '#38bdf8'} />)}
            </Bar>
            <Line type="monotone" dataKey="cumulative" name="cumulative contractor net cash flow" stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="gov" name="government take" stroke="#f472b6" dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Read the columns left to right and the cascade is the whole subject. Royalty comes off GROSS revenue before
        any cost is deducted. Cost recovered is the smaller of the recoverable pool and the limit applied to revenue
        after royalty, and whatever is not recovered carries forward. Profit oil is what is left, split on the R
        factor or flat. Tax is charged on the contractor share of profit oil and on nothing else. The contractor
        receives cost oil AND its profit share and pays the costs and the tax. In every year the contractor net cash
        flow plus the government take equals gross revenue less opex less capex: the regime decides who gets what
        and when, and does not change what there is to get.
      </Note>
    </>
  );
};

const Project = () => {
  const [projectKey, setProjectKey] = useState('odidi');
  const vol = useMemo(() => { try { return volumeProbe(projectKey); } catch { return null; } }, [projectKey]);
  const price = useMemo(() => { try { return priceProbe(projectKey); } catch { return null; } }, [projectKey]);
  const list = useMemo(() => { try { return projects(); } catch { return []; } }, []);
  if (!vol || !price) {
    return <Note>The probes did not run. The engine does not export its production profile or its price resolver, so both are read back out of a run whose regime takes nothing at all, and without that run there is nothing to read.</Note>;
  }
  const info = list.find((x) => x.key === projectKey);
  const chart = vol.byYear.map((x, i) => ({ year: x.year, oil: x.oil, gas: x.gas, ngl: x.ngl, price: price.applied[i] }));
  return (
    <>
      <FieldGrid>
        <SelectField label="Project" value={projectKey} onChange={setProjectKey} options={PROJECT_OPTIONS} />
      </FieldGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">{info ? info.line : ''}.</p>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="year" tick={AXIS} />
            <YAxis yAxisId="v" tick={AXIS} label={{ value: 'million bbl or million Mscf', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="p" orientation="right" tick={AXIS} label={{ value: 'applied oil price, USD per bbl', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => ratio(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="v" type="monotone" dataKey="oil" name="oil, million bbl" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line yAxisId="v" type="monotone" dataKey="ngl" name="NGL, million bbl" stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line yAxisId="v" type="monotone" dataKey="gas" name="gas, million Mscf" stroke="#f472b6" dot={false} isAnimationActive={false} />
            <Line yAxisId="p" type="stepAfter" dataKey="price" name="applied oil price" stroke="#fbbf24" dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['year', 'oil, million bbl', 'gas, million Mscf', 'NGL, million bbl', 'applied oil price, USD/bbl']}
        rows={vol.byYear.map((x, i) => [x.year, ratio(x.oil), ratio(x.gas), ratio(x.ngl), ratio(price.applied[i])])}
      />
      <div className="mt-3 text-xs text-slate-300">
        Neither table is a forecast anybody uploaded. The engine GENERATES the profile from an initial rate and a
        decline over a fixed horizon of 25 years, and there is no input that changes the horizon. Two properties are
        visible in the volume columns and both matter. The decline is applied AFTER the year is booked, so year 1 is
        the initial rate times 365 days with no decline taken. And the profile never stops: year 25 still produces,
        because the horizon is fixed rather than set by an economic limit.
      </div>
      <Note>
        The price column is a STEP function. The resolver walks the deck in list order and keeps the last point whose
        year the current year has reached, so a price holds until the next point and is never interpolated, and past
        the last point it holds rather than escalating. The probe that reads it holds production at one barrel a day
        so the revenue the engine returns IS the price. {ODIDI_LABEL} holds 45 through year 5 and steps to 65 at year
        6, which is why a royalty keyed at 50 USD per bbl changes tier inside the life of that field.
      </Note>
    </>
  );
};

const Totals = () => {
  const [projectKey, setProjectKey] = useState('default');
  const rows = useMemo(() => { try { return templateTotals(projectKey); } catch { return null; } }, [projectKey]);
  if (!rows || !rows.length) {
    return <Note>No template ran on this project, so there is nothing to line up. The comparison is the point of the sandbox and it needs at least one regime.</Note>;
  }
  const bars = rows.map((t) => ({ name: t.name, contractor: t.totalContractorNCF, government: t.totalGovernmentTake }));
  return (
    <>
      <FieldGrid>
        <SelectField label="Project" value={projectKey} onChange={setProjectKey} options={PROJECT_OPTIONS} />
      </FieldGrid>
      <Tbl
        head={['regime', 'total revenue', 'total contractor NCF', 'total government take', 'total tax', 'total cost recovered', 'closing pool', 'payback', 'payout', 'NPV at the project rate', 'IRR, percent']}
        rows={rows.map((t) => [
          t.name, mm(t.totalRevenue), mm(t.totalContractorNCF), mm(t.totalGovernmentTake), mm(t.totalTax),
          mm(t.totalCostRecovered), mm(t.closingUnrecoveredPool), yr(t.paybackYear), yr(t.payoutYear), mm(t.npv), Number(t.irrPct).toFixed(4),
        ])}
      />
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} interval={0} angle={-12} textAnchor="end" height={60} />
            <YAxis tick={AXIS} tickFormatter={compact} label={{ value: 'million USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => mm(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#64748b" />
            <Bar dataKey="contractor" name="total contractor net cash flow" fill="#BFFF00" isAnimationActive={false} />
            <Bar dataKey="government" name="total government take" fill="#f472b6" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Total revenue is identical down the column, because the regime never touches production or price. Everything
        else moves. Payback is the first year cumulative contractor net cash flow is above zero and payout is the
        first year the R factor passes 1.0; they answer different questions and they often differ, because the R
        factor is gross revenue over cost while payback is cash after tax and after the government share. Both read
        "never" when they do not happen inside the 25 years.
      </Note>
    </>
  );
};

const RegimeExplorer = () => {
  const [mode, setMode] = useState('instruments');
  const life = useMemo(() => { try { return projectLife(); } catch { return null; } }, []);
  return (
    <PanelShell
      title="Regime explorer"
      subtitle={`The four instruments a regime carries, one template on one project row by row in cascade order, the production and price a project generates before any regime touches them, and all six templates side by side. The horizon is fixed at ${life === null ? '25' : life} years.`}
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'instruments' && <Instruments />}
        {mode === 'ledger' && <Ledger />}
        {mode === 'project' && <Project />}
        {mode === 'totals' && <Totals />}
      </div>
    </PanelShell>
  );
};

export default RegimeExplorer;
