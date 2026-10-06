import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hasDeepCourse, deepCourseKeys } from './courseIndex.js';

// courseIndex answers "does this course have deep content?" from file paths
// alone, so the dashboard home never loads the 2.1 MB of manifests. It must
// agree with what courseContent.js keys on: each manifest's own app_slug
// and tier fields.
const COURSES_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../content/courses');

function manifestKeys() {
  const out = [];
  for (const app of fs.readdirSync(COURSES_DIR)) {
    const appDir = path.join(COURSES_DIR, app);
    if (!fs.statSync(appDir).isDirectory()) continue;
    for (const tier of fs.readdirSync(appDir)) {
      const file = path.join(appDir, tier, 'manifest.json');
      if (!fs.existsSync(file)) continue;
      const m = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (m?.app_slug && m?.tier) out.push(`${m.app_slug}/${m.tier}`);
    }
  }
  return out.sort();
}

describe('courseIndex agrees with the manifests', () => {
  const keys = manifestKeys();

  it('lists exactly the (app, tier) pairs that have a manifest', () => {
    expect(deepCourseKeys().sort()).toEqual(keys);
    expect(keys.length).toBeGreaterThan(100);
  });

  it('answers hasDeepCourse per tier and per app', () => {
    const apps = [...new Set(keys.map((k) => k.split('/')[0]))];
    for (const app of apps) {
      expect(hasDeepCourse(app)).toBe(true);
      for (const tier of ['beginner', 'intermediate', 'advanced']) {
        expect(hasDeepCourse(app, tier)).toBe(keys.includes(`${app}/${tier}`));
      }
    }
    expect(hasDeepCourse('no-such-app')).toBe(false);
    expect(hasDeepCourse('petrophysics', 'expert')).toBe(false);
  });
});
