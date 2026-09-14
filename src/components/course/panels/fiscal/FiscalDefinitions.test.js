// The fiscal course's Definitions block must say exactly what the shared
// conventions module says, word for word, and in headline order.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import FiscalDefinitions, { DEFINITION_ROWS, BASIS_NOTE } from './FiscalDefinitions';
import {
  FISCAL_METRICS, GOVERNMENT_CASH_FLOW, metricLabel, metricDefinition,
} from '@petrolord/engines/engines/economics/fiscalConventions.js';

const html = renderToStaticMarkup(React.createElement(FiscalDefinitions));
const text = html.replace(/<[^>]+>/g, ' ').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/\s+/g, ' ');

describe('the fiscal course definitions come from the shared constant', () => {
  it('renders both metric definitions and the cash flow definition verbatim', () => {
    expect(text).toContain(FISCAL_METRICS.governmentTake.definition);
    expect(text).toContain(FISCAL_METRICS.governmentShareOfNetRevenue.definition);
    expect(text).toContain(GOVERNMENT_CASH_FLOW.definition);
  });

  it('puts the headline first and states the basis on every term', () => {
    expect(DEFINITION_ROWS.map((r) => r.key)).toEqual(['governmentTake', 'governmentShareOfNetRevenue', 'governmentCashFlow']);
    expect(text.indexOf(metricLabel('governmentTake'))).toBeLessThan(text.indexOf(metricLabel('governmentShareOfNetRevenue')));
    expect(DEFINITION_ROWS[0].term).toBe('Government take (undiscounted)');
    expect(DEFINITION_ROWS[1].term).toBe('Government share of net revenue (undiscounted)');
    expect(text).toContain('discounted at 10 percent');
  });

  it('carries each definition on hover', () => {
    expect(html).toContain(`title="${metricDefinition('governmentTake').replace(/'/g, '&#x27;')}"`);
    expect(DEFINITION_ROWS[1].hover).toBe(metricDefinition('governmentShareOfNetRevenue'));
  });

  it('keeps the copy rule and never calls either ratio a tax rate', () => {
    expect(text).not.toMatch(/[–—]/);
    expect(BASIS_NOTE).toMatch(/Neither ratio is a tax rate/);
    expect(text.toLowerCase()).not.toMatch(/effective tax rate/);
  });
});
