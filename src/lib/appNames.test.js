import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import {
  APP_NAMES, CERT_TIER_LABELS, appName, courseName, courseNameFrom, titleCaseSlug, formalDate,
} from './appNames';
import { HOME_COURSES } from './homeCatalog';

// Reads every academy_apps name the migrations set, in apply (file name)
// order: an insert with `on conflict (slug) do nothing` seeds a slug once,
// a later `update public.academy_apps set name = ... where slug = ...`
// renames it. The result is the name a fully migrated database carries.
const MIGRATIONS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../migrations');
const unq = (s) => s.replace(/''/g, "'");

function seededCourseNames(dir = MIGRATIONS) {
  const names = {};
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  for (const f of files) {
    const sql = fs.readFileSync(path.join(dir, f), 'utf8');
    const ins = /insert into public\.academy_apps\s*\(([^)]*)\)\s*values([\s\S]*?)(on conflict[^;]*;|;)/gi;
    let m;
    while ((m = ins.exec(sql))) {
      const cols = m[1].split(',').map((c) => c.trim());
      expect(cols.slice(0, 2), `${f}: academy_apps insert column order`).toEqual(['slug', 'name']);
      const overwrite = /do update/i.test(m[3]);
      for (const r of m[2].matchAll(/\(\s*'([a-z0-9_]+)'\s*,\s*'((?:[^']|'')*)'/g)) {
        if (overwrite || !(r[1] in names)) names[r[1]] = unq(r[2]);
      }
    }
    const upd = /^\s*update public\.academy_apps\s+set name\s*=\s*'((?:[^']|'')*)'\s+where slug\s*=\s*'([a-z0-9_]+)'/gim;
    while ((m = upd.exec(sql))) names[m[2]] = unq(m[1]);
  }
  return names;
}

describe('course names', () => {
  const seeded = seededCourseNames();

  it('reads the whole catalog from the migrations', () => {
    expect(Object.keys(seeded).length).toBeGreaterThanOrEqual(70);
  });

  it('has a static name for every seeded slug, equal to its latest seeded or renamed name', () => {
    const missing = Object.keys(seeded).filter((s) => !(s in APP_NAMES));
    expect(missing, 'slugs seeded in migrations/ with no entry in APP_NAMES').toEqual([]);
    for (const [slug, name] of Object.entries(seeded)) {
      expect(APP_NAMES[slug], `APP_NAMES.${slug}`).toBe(name);
    }
    const extra = Object.keys(APP_NAMES).filter((s) => !(s in seeded));
    expect(extra, 'APP_NAMES entries with no academy_apps row in migrations/').toEqual([]);
  });

  it('carries the 2026-09-26 skill names', () => {
    expect(APP_NAMES.seismolord).toBe('Seismic Interpretation');
    expect(APP_NAMES.reservoircalc).toBe('Reservoir Volumetrics');
    expect(APP_NAMES.welldata).toBe('Well Data Management');
    expect(APP_NAMES.mapping).toBe('Subsurface Mapping');
    expect(APP_NAMES.facies).toBe('Electrofacies Classification');
    expect(APP_NAMES.welltest).toBe('Well Test Analysis');
  });

  it('never returns a raw slug', () => {
    expect(appName('welltest')).toBe('Well Test Analysis');
    expect(courseName('some_new_course')).toBe('Some New Course');
    expect(courseName('newcourse')).toBe('Newcourse');
    expect(courseName(undefined)).toBe('Course');
    expect(titleCaseSlug('flow-assurance')).toBe('Flow Assurance');
    for (const slug of Object.keys(APP_NAMES)) expect(appName(slug)).not.toBe(slug);
  });

  it('prefers the live catalog name', () => {
    expect(courseName('seismolord', 'Seismic Interpretation (live)')).toBe('Seismic Interpretation (live)');
    expect(courseName('seismolord', '  ')).toBe('Seismic Interpretation');
    expect(courseNameFrom([{ slug: 'dca', name: 'Decline Curve Analysis' }], 'dca')).toBe('Decline Curve Analysis');
    expect(courseNameFrom([], 'welltest')).toBe('Well Test Analysis');
    expect(courseNameFrom(null, 'welltest')).toBe('Well Test Analysis');
  });

  it('labels the three certificate tiers', () => {
    expect(CERT_TIER_LABELS).toEqual({ associate: 'Associate', professional: 'Professional', expert: 'Expert' });
  });

  it('formats certificate dates formally, in UTC', () => {
    expect(formalDate('2026-09-26T10:00:00Z')).toBe('26 September 2026');
    expect(formalDate('2027-01-01T00:30:00+01:00')).toBe('31 December 2026');
    expect(formalDate('not a date')).toBe('');
  });

  it('keeps the homepage catalogue on the catalog names', () => {
    // Two homepage tiles carry a shortened marketing label for a long title.
    const SHORT = { hygiene: 'Occupational Hygiene', lopa: 'Process Safety: LOPA & SIL' };
    for (const co of HOME_COURSES) {
      expect(co.name, `HOME_COURSES ${co.slug}`).toBe(SHORT[co.slug] || APP_NAMES[co.slug]);
    }
  });
});
