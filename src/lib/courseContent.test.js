import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { splitLessonSegments, flatLessons, adjacentLessons, estMinutes } from './courseContent.js';
import { PANELS } from '@/content/courses/panelRegistry.js';

const COURSES_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '../content/courses',
);

const KEY_MODULE = /^m\d{2}-[a-z0-9]+(-[a-z0-9]+)*$/;
const KEY_LESSON = /^l\d{2}-[a-z0-9]+(-[a-z0-9]+)*$/;
const EM_DASH = '—';

function loadManifests() {
  const out = [];
  if (!fs.existsSync(COURSES_DIR)) return out;
  for (const app of fs.readdirSync(COURSES_DIR)) {
    const appDir = path.join(COURSES_DIR, app);
    if (!fs.statSync(appDir).isDirectory()) continue;
    for (const tier of fs.readdirSync(appDir)) {
      const file = path.join(appDir, tier, 'manifest.json');
      if (fs.existsSync(file)) {
        out.push({ app, tier, dir: path.join(appDir, tier), manifest: JSON.parse(fs.readFileSync(file, 'utf8')), raw: fs.readFileSync(file, 'utf8') });
      }
    }
  }
  return out;
}

describe('splitLessonSegments', () => {
  it('returns one markdown segment for plain prose', () => {
    expect(splitLessonSegments('# Title\n\nBody text.')).toEqual([
      { type: 'markdown', content: '# Title\n\nBody text.' },
    ]);
  });

  it('splits panel markers into panel segments', () => {
    const segs = splitLessonSegments('Intro.\n\n{{panel:petro-vsh-explorer}}\n\nAfter.');
    expect(segs).toEqual([
      { type: 'markdown', content: 'Intro.\n' },
      { type: 'panel', id: 'petro-vsh-explorer' },
      { type: 'markdown', content: '\nAfter.' },
    ]);
  });

  it('ignores markers that are not alone on a line and tolerates trailing spaces', () => {
    expect(splitLessonSegments('see {{panel:x}} inline')).toEqual([
      { type: 'markdown', content: 'see {{panel:x}} inline' },
    ]);
    expect(splitLessonSegments('{{panel:abc-1}}  ')).toEqual([{ type: 'panel', id: 'abc-1' }]);
  });

  it('handles empty and nullish input', () => {
    expect(splitLessonSegments('')).toEqual([]);
    expect(splitLessonSegments(null)).toEqual([]);
  });
});

describe('manifest navigation helpers', () => {
  const manifest = {
    modules: [
      { key: 'm01-a', title: 'A', lessons: [{ key: 'l01-x', est_minutes: 10 }, { key: 'l02-y', est_minutes: 5 }] },
      { key: 'm02-b', title: 'B', lessons: [{ key: 'l01-z', est_minutes: 8 }] },
    ],
  };

  it('flattens lessons in manifest order', () => {
    expect(flatLessons(manifest).map((l) => `${l.moduleKey}/${l.key}`)).toEqual([
      'm01-a/l01-x', 'm01-a/l02-y', 'm02-b/l01-z',
    ]);
  });

  it('finds prev/next across module boundaries', () => {
    const { prev, next } = adjacentLessons(manifest, 'm01-a', 'l02-y');
    expect(prev.key).toBe('l01-x');
    expect(next.moduleKey).toBe('m02-b');
    expect(adjacentLessons(manifest, 'm01-a', 'l01-x').prev).toBeNull();
    expect(adjacentLessons(manifest, 'm02-b', 'l01-z').next).toBeNull();
  });

  it('sums estimated minutes', () => {
    expect(estMinutes(manifest.modules[0].lessons)).toBe(15);
  });
});

// Content lint: every authored course must satisfy the rules in
// src/content/README.md. Vacuously green until the first course lands.
describe('content lint', () => {
  const entries = loadManifests();

  it('manifests are structurally valid with stable, ordered keys', () => {
    for (const { app, tier, manifest } of entries) {
      expect(manifest.app_slug, `${app}/${tier} app_slug`).toBe(app);
      expect(manifest.tier, `${app}/${tier} tier`).toBe(tier);
      expect(Number.isInteger(manifest.content_version)).toBe(true);
      expect(manifest.modules.length, `${app}/${tier} modules`).toBeGreaterThan(0);
      const moduleKeys = new Set();
      manifest.modules.forEach((mod, mi) => {
        expect(mod.key, `${app}/${tier} module key ${mod.key}`).toMatch(KEY_MODULE);
        expect(moduleKeys.has(mod.key)).toBe(false);
        moduleKeys.add(mod.key);
        expect(mod.order, `${app}/${tier}/${mod.key} order`).toBe(mi + 1);
        expect(mod.title?.length).toBeGreaterThan(0);
        expect(mod.lessons.length, `${app}/${tier}/${mod.key} lessons`).toBeGreaterThan(0);
        const lessonKeys = new Set();
        mod.lessons.forEach((les, li) => {
          expect(les.key, `${app}/${tier}/${mod.key}/${les.key}`).toMatch(KEY_LESSON);
          expect(lessonKeys.has(les.key)).toBe(false);
          lessonKeys.add(les.key);
          expect(les.order).toBe(li + 1);
          expect(les.title?.length).toBeGreaterThan(0);
          expect(Number(les.est_minutes), `${app}/${tier}/${mod.key}/${les.key} est_minutes`).toBeGreaterThan(0);
        });
      });
    }
  });

  it('every manifest lesson has a file and every file is in the manifest', () => {
    for (const { app, tier, dir, manifest } of entries) {
      const listed = new Set();
      for (const mod of manifest.modules) {
        for (const les of mod.lessons) {
          const rel = `${mod.key}/${les.key}.md`;
          listed.add(rel);
          expect(fs.existsSync(path.join(dir, rel)), `${app}/${tier}/${rel} missing`).toBe(true);
        }
      }
      for (const modDir of fs.readdirSync(dir)) {
        const full = path.join(dir, modDir);
        if (!fs.statSync(full).isDirectory()) continue;
        for (const f of fs.readdirSync(full)) {
          if (!f.endsWith('.md')) continue;
          expect(listed.has(`${modDir}/${f}`), `${app}/${tier}/${modDir}/${f} not in manifest`).toBe(true);
        }
      }
    }
  });

  it('no em dashes in lesson markdown or manifests (house copy rule)', () => {
    for (const { app, tier, dir, raw } of entries) {
      expect(raw.includes(EM_DASH), `${app}/${tier}/manifest.json contains an em dash`).toBe(false);
      const walk = (d) => {
        for (const f of fs.readdirSync(d)) {
          const full = path.join(d, f);
          if (fs.statSync(full).isDirectory()) walk(full);
          else if (f.endsWith('.md')) {
            expect(
              fs.readFileSync(full, 'utf8').includes(EM_DASH),
              `${full} contains an em dash`,
            ).toBe(false);
          }
        }
      };
      walk(dir);
    }
  });

  it('every panel referenced by a manifest or marker is registered', () => {
    const registered = new Set(Object.keys(PANELS));
    for (const { app, tier, dir, manifest } of entries) {
      for (const mod of manifest.modules) {
        for (const les of mod.lessons) {
          for (const id of les.panels || []) {
            expect(registered.has(id), `${app}/${tier}: panel ${id} not registered`).toBe(true);
          }
          const body = fs.readFileSync(path.join(dir, mod.key, `${les.key}.md`), 'utf8');
          for (const seg of splitLessonSegments(body)) {
            if (seg.type === 'panel') {
              expect(registered.has(seg.id), `${app}/${tier}/${mod.key}/${les.key}: marker panel ${seg.id} not registered`).toBe(true);
              expect((les.panels || []).includes(seg.id), `${app}/${tier}/${mod.key}/${les.key}: marker panel ${seg.id} not declared in manifest`).toBe(true);
            }
          }
        }
      }
    }
  });
});
