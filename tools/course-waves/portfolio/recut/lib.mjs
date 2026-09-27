// The engines, loaded the way the digest generator loads them (ec5_dump.mjs:
// the vendored engines/economics/portfolio.js and afe.js under packages/engines),
// plus the published goldens and the teaching fields the course teaches on.
// Key-truth checks import this and CALL the engine; nothing here restates a
// formula. The teaching fields are copied verbatim from ec5_dump.mjs.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = process.env.EC5_ENGINES || path.resolve(HERE, '../../../../packages/engines');
export const P = await import(`${ROOT}/engines/economics/portfolio.js`);
export const A = await import(`${ROOT}/engines/economics/afe.js`);
export const ST = await import(`${ROOT}/lib/stats/stats.js`);
export const GP = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/portfolio_cases.json`, 'utf8'));
export const GA = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/afe_cases.json`, 'utf8'));
const byId = (list, key = 'id') => Object.fromEntries(list.map((c) => [c[key], c]));
/** Published portfolio cases by group then id: GPC.optimize.rawDollars. */
export const GPC = Object.fromEntries(Object.entries(GP).filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, byId(v)]));
/** Published AFE cases by group then name: GAC.metrics['suite test: CPI 1.25']. */
export const GAC = Object.fromEntries(Object.entries(GA).filter(([, v]) => Array.isArray(v) && v[0]?.name).map(([k, v]) => [k, byId(v, 'name')]));
export const clone = (o) => (o === undefined ? undefined : JSON.parse(JSON.stringify(o)));

/** Run fn; the value, or the engine's refusal as { refused: message }. */
export const attempt = (fn) => { try { return fn(); } catch (e) { return { refused: e.message, name: e.name }; } };
/** The engine's refusal message for fn, or null when it does not refuse. */
export const refusal = (fn) => { try { fn(); return null; } catch (e) { return e.message; } };

export const OKONO = [
  { id: 'OK-1', name: 'Infill drilling', capex: 120, npv_p50: 95, npv_p10: 150, npv_p90: 50, pos: 0.95, fail_cost: 10 },
  { id: 'OK-2', name: 'Gas compression', capex: 180, npv_p50: 130, npv_p10: 190, npv_p90: 80, pos: 0.9, fail_cost: 20 },
  { id: 'OK-3', name: 'Exploration well', capex: 90, npv_p50: 420, npv_p10: 700, npv_p90: 210, pos: 0.25, fail_cost: 85 },
  { id: 'OK-4', name: 'Waterflood', capex: 240, npv_p50: 210, npv_p10: 320, npv_p90: 120, pos: 0.8, fail_cost: 40 },
  { id: 'OK-5', name: 'Workovers', capex: 60, npv_p50: 38, npv_p10: 55, npv_p90: 22, pos: 1 },
  { id: 'OK-6', name: 'Satellite tie-back', capex: 310, npv_p50: 360, npv_p10: 560, npv_p90: 190, pos: 0.55, fail_cost: 120 },
];
export const OFON_AFE = { afe_number: 'OFON-1', start_date: '2027-02-01', end_date: '2027-11-30', currency: 'USD' };
export const OFON_ITEMS = [
  { code: 'DRL-01', description: 'Rig and drilling services', budget: 14200000, commitment: 2600000, actual: 9800000, progress: 72 },
  { code: 'CSG-02', description: 'Casing and tubulars', budget: 3900000, commitment: 0, actual: 4300000, progress: 100 },
  { code: 'CMT-03', description: 'Cementing', budget: 1250000, commitment: 300000, actual: 640000, forecast: 1400000, progress: 55 },
  { code: 'LOG-04', description: 'Logging and testing', budget: 2100000, commitment: 900000, actual: 350000, progress: 20 },
  { code: 'CMP-05', description: 'Completion', budget: 5600000, commitment: 1200000, actual: 0, progress: 0 },
];
export const OFON_INVOICES = [
  { invoice_date: '2027-02-20', amount: 3100000 },
  { invoice_date: '2027-04-10', amount: 5200000 },
  { invoice_date: '2027-06-05', amount: 4400000 },
  { invoice_date: '2027-07-18', amount: 2390000 },
];
export const OFON_PARTNERS = [
  { name: 'Ofon Energy', working_interest: 40 },
  { name: 'Enang Petroleum', working_interest: 22.5 },
  { name: 'Mfem Resources', working_interest: 12.5 },
];

/** A funded set joined the digest's way ("OK-1 + OK-3 + OK-4", "none"). */
export const setIds = (ps) => ps.map((p) => p.id).join(' + ') || 'none';
/** optimizePortfolio on OKONO (or a list) at a limit, with any extra args. */
export const okono = (capexLimit, extra = {}, projects = OKONO) => P.optimizePortfolio({ projects: clone(projects), capexLimit, ...extra });
/** A published optimize case run by the engine (extra args such as exactStateLimit ride along from the case). */
export const optCase = (id, extra = {}) => {
  const c = GPC.optimize[id];
  const { projects, capexLimit, ...rest } = c.input ?? c;
  return P.optimizePortfolio({ projects: clone(projects ?? c.projects), capexLimit: capexLimit ?? c.capexLimit, ...pick(rest), ...extra });
};
const pick = (o) => Object.fromEntries(Object.entries(o).filter(([k]) => ['correlation', 'seed', 'iterations', 'exactStateLimit'].includes(k)));
/** portfolioRiskMetrics on a list of projects. */
export const risk = (projects, correlation = 0, opts = {}) => P.portfolioRiskMetrics(clone(projects), correlation, opts);
/** OFON-1 metrics at an as-of date (items and invoices may be replaced). */
export const ofon = (asOf = '2027-08-15', items = OFON_ITEMS, invoices = OFON_INVOICES, afe = OFON_AFE) => A.calculateMetrics(clone(afe), clone(items), clone(invoices), asOf);
/** OFON-1 S-curve at an as-of date. */
export const ofonCurve = (asOf = '2027-08-15', items = OFON_ITEMS, invoices = OFON_INVOICES, afe = OFON_AFE) => A.generateSCurveData(clone(afe), clone(items), clone(invoices), asOf);
/** A published AFE metrics case run by the engine at its own asOf (or the stated one). */
export const metricsCase = (name, asOf) => {
  const c = GAC.metrics[name];
  const i = c.inputs;
  return A.calculateMetrics(clone(i.afe ?? {}), clone(i.costItems ?? []), clone(i.invoices ?? []), asOf ?? i.asOf ?? c.asOf ?? '2030-01-01');
};
/** A published AFE sCurve case run by the engine at its own asOf (or the stated one). */
export const curveCase = (name, asOf) => {
  const c = GAC.sCurve[name];
  const i = c.inputs;
  return A.generateSCurveData(clone(i.afe ?? {}), clone(i.costItems ?? []), clone(i.invoices ?? []), asOf ?? i.asOf ?? c.asOf ?? '2026-09-14');
};
/** The item from OFON_ITEMS by code, with fields replaced. */
export const item = (code, patch = {}) => ({ ...clone(OFON_ITEMS.find((x) => x.code === code)), ...patch });
