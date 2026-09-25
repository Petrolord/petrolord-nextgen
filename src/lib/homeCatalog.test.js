import { describe, it, expect } from 'vitest';
import { HOME_COURSES, HOME_MODULES, mergeCatalog, catalogStats } from './homeCatalog';
import { MODULE_LABELS } from './academyModules';

describe('homepage catalogue', () => {
  it('has unique slugs and only known modules', () => {
    const slugs = HOME_COURSES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const keys = new Set(HOME_MODULES.map((m) => m.key));
    for (const co of HOME_COURSES) {
      expect(keys.has(co.module)).toBe(true);
      expect(MODULE_LABELS[co.module]).toBeTruthy();
    }
  });

  it('keeps em dashes out of the marketing copy', () => {
    for (const co of HOME_COURSES) expect(`${co.name} ${co.blurb}`).not.toMatch(/—/);
  });

  it('falls back to the static status when there are no live rows', () => {
    expect(mergeCatalog(HOME_COURSES, [])).toBe(HOME_COURSES);
    expect(mergeCatalog(HOME_COURSES, null)).toBe(HOME_COURSES);
    expect(catalogStats(HOME_COURSES)).toEqual({ courses: 68, disciplines: 12, certifications: 204 });
  });

  it('takes status from the live catalogue and counts only available courses', () => {
    const live = [
      { slug: 'welldata', status: 'available' },
      { slug: 'petrophysics', status: 'available' },
      { slug: 'dataqc', status: 'coming_soon' },
    ];
    const merged = mergeCatalog(HOME_COURSES, live);
    const by = Object.fromEntries(merged.map((c) => [c.slug, c.status]));
    expect(by.welldata).toBe('available');
    expect(by.dataqc).toBe('coming_soon');
    expect(by.nodal).toBe('coming_soon'); // not listed live yet
    expect(catalogStats(merged)).toEqual({ courses: 2, disciplines: 1, certifications: 6 });
  });
});
