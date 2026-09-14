// The fiscal course's definitions (naming wave, 2026-09-14). Rendered from the
// shared conventions module the Suite's Fiscal Regime Designer also imports, so
// the course and the app it teaches cannot word a metric differently.
import React from 'react';
import {
  FISCAL_METRICS, GOVERNMENT_CASH_FLOW, basisLabel, metricLabel, metricDefinition,
} from '@petrolord/engines/engines/economics/fiscalConventions.js';

export const DEFINITION_ROWS = [
  {
    key: 'governmentTake',
    term: metricLabel('governmentTake'),
    role: 'The headline metric.',
    definition: FISCAL_METRICS.governmentTake.definition,
    hover: metricDefinition('governmentTake'),
  },
  {
    key: 'governmentShareOfNetRevenue',
    term: metricLabel('governmentShareOfNetRevenue'),
    role: 'Always shown second.',
    definition: FISCAL_METRICS.governmentShareOfNetRevenue.definition,
    hover: metricDefinition('governmentShareOfNetRevenue'),
  },
  {
    key: 'governmentCashFlow',
    term: GOVERNMENT_CASH_FLOW.title,
    role: 'The money both ratios divide.',
    definition: GOVERNMENT_CASH_FLOW.definition,
    hover: `${GOVERNMENT_CASH_FLOW.title}: ${GOVERNMENT_CASH_FLOW.definition}`,
  },
];

export const BASIS_NOTE = `Every ratio states its basis. The default is ${basisLabel()}; a discounted value is labelled with its rate, for example "${metricLabel('governmentTake', 10)}". Neither ratio is a tax rate: royalty and the government's share of profit oil are in the numerator.`;

const FiscalDefinitions = () => (
  <div className="rounded-lg border border-gray-700 bg-[#1E293B] p-4" data-testid="fiscal-definitions">
    <h3 className="text-white font-semibold mb-2">Definitions</h3>
    <dl className="space-y-2 text-sm">
      {DEFINITION_ROWS.map((row) => (
        <div key={row.key}>
          <dt className="text-[#BFFF00] font-semibold" title={row.hover}>{row.term}</dt>
          <dd className="text-slate-300">
            <span className="text-slate-400">{row.role}</span>
            {' '}
            {row.definition}
          </dd>
        </div>
      ))}
    </dl>
    <p className="text-xs text-slate-400 mt-3 mb-0">{BASIS_NOTE}</p>
  </div>
);

export default FiscalDefinitions;
