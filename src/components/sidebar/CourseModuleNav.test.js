/**
 * The sidebar's course navigation.
 *
 * WHY THIS EXISTS. The sidebar rendered one flat group per module that had
 * an `available` course. With only Geoscience live it looked like an
 * academy with one subject, and the six Reservoir courses - built, seeded,
 * still held at `coming_soon` - were invisible. There was no way to see
 * from the sidebar how many courses the academy actually had, which is the
 * one question it needs to answer.
 */
import { describe, it, expect } from 'vitest';
import { groupByModule, orderModules, MODULE_ORDER } from './CourseModuleNav';
import { MODULE_LABELS } from '@/lib/academyModules';

const catalog = [
  { slug: 'welldata', name: 'Well Data', module: 'geoscience', path_order: 1, status: 'available' },
  { slug: 'basin', name: 'Basin', module: 'geoscience', path_order: 10, status: 'available' },
  { slug: 'dca', name: 'Decline Curve Analysis', module: 'reservoir', path_order: 11, status: 'coming_soon' },
  { slug: 'mbal', name: 'Material Balance', module: 'reservoir', path_order: 12, status: 'coming_soon' },
];

describe('groupByModule', () => {
  it('keeps every known module, including the ones with no courses', () => {
    // An empty module is information: it is the part of the academy that
    // has not been built, and hiding it is what made the roadmap invisible.
    const g = groupByModule(catalog);
    Object.keys(MODULE_LABELS).forEach((m) => expect(g[m]).toBeDefined());
    expect(g.drilling).toEqual([]);
  });

  it('groups courses under their module', () => {
    const g = groupByModule(catalog);
    expect(g.geoscience.map((a) => a.slug)).toEqual(['welldata', 'basin']);
    expect(g.reservoir.map((a) => a.slug)).toEqual(['dca', 'mbal']);
  });

  it('counts a course that is built but not yet released', () => {
    // The whole point: six Reservoir courses existed and the sidebar showed
    // nothing at all for them.
    const g = groupByModule(catalog);
    expect(g.reservoir).toHaveLength(2);
    expect(g.reservoir.every((a) => a.status !== 'available')).toBe(true);
  });

  it('orders courses by path_order, not by insertion', () => {
    const g = groupByModule([
      { slug: 'b', module: 'reservoir', path_order: 20, status: 'available' },
      { slug: 'a', module: 'reservoir', path_order: 10, status: 'available' },
    ]);
    expect(g.reservoir.map((a) => a.slug)).toEqual(['a', 'b']);
  });

  it('survives an empty or missing catalog', () => {
    expect(groupByModule([]).geoscience).toEqual([]);
    expect(groupByModule(null).geoscience).toEqual([]);
  });

  it('keeps a module slug that is not in the label registry', () => {
    // A new module must never vanish from the sidebar just because the
    // label map has not caught up.
    const g = groupByModule([{ slug: 'x', module: 'brand_new', path_order: 1, status: 'available' }]);
    expect(g.brand_new).toHaveLength(1);
  });
});

describe('orderModules', () => {
  it('teaches in the order the Suite modules were built', () => {
    expect(orderModules(['drilling', 'geoscience', 'reservoir']))
      .toEqual(['geoscience', 'reservoir', 'drilling']);
  });

  it('puts an unknown module after the known ones rather than dropping it', () => {
    expect(orderModules(['zzz_new', 'geoscience'])).toEqual(['geoscience', 'zzz_new']);
  });

  it('lists every module in the label registry', () => {
    const ordered = orderModules(Object.keys(MODULE_LABELS));
    expect(ordered).toHaveLength(Object.keys(MODULE_LABELS).length);
    MODULE_ORDER.forEach((m) => expect(ordered).toContain(m));
  });
});
