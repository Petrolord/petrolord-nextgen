// Deep-course content loader. Lesson prose is authored as markdown under
// src/content/courses/<app>/<tier>/<moduleKey>/<lessonKey>.md with one
// manifest.json per (app, tier) as the structure source of truth (see
// src/content/README.md). Manifests load eagerly (navigation is
// synchronous); lesson bodies are lazy per-file chunks.
//
// The server enforces unlock order against academy_course_structures,
// which each course's seed migration generates FROM these manifests.
// Client-side, manifest presence (hasDeepCourse) is only a routing flag.

const manifestModules = import.meta.glob('/src/content/courses/*/*/manifest.json', { eager: true });
const lessonModules = import.meta.glob('/src/content/courses/*/*/*/*.md', { as: 'raw' });
const figureModules = import.meta.glob('/src/content/courses/*/*/*/figures/*', { eager: true, as: 'url' });

const manifests = {};
for (const [path, mod] of Object.entries(manifestModules)) {
  const m = mod.default || mod;
  if (m?.app_slug && m?.tier) manifests[`${m.app_slug}/${m.tier}`] = m;
}

export function getManifest(app, tier) {
  return manifests[`${app}/${tier}`] || null;
}

export function hasDeepCourse(app, tier) {
  if (tier) return Boolean(getManifest(app, tier));
  return Object.keys(manifests).some((k) => k.startsWith(`${app}/`));
}

export function listDeepCourses() {
  return Object.values(manifests);
}

function lessonPath(app, tier, moduleKey, lessonKey) {
  return `/src/content/courses/${app}/${tier}/${moduleKey}/${lessonKey}.md`;
}

// Resolves to the raw markdown of one lesson.
export async function loadLesson(app, tier, moduleKey, lessonKey) {
  const loader = lessonModules[lessonPath(app, tier, moduleKey, lessonKey)];
  if (!loader) throw new Error(`Unknown lesson ${app}/${tier}/${moduleKey}/${lessonKey}`);
  return loader();
}

// Resolve a figure src referenced from a lesson (relative to its module
// directory) to the bundled asset URL.
export function figureUrl(app, tier, moduleKey, relSrc) {
  const clean = String(relSrc).replace(/^\.\//, '');
  return figureModules[`/src/content/courses/${app}/${tier}/${moduleKey}/${clean}`] || relSrc;
}

// Navigation helpers over a manifest. Modules and lessons are kept in
// manifest order (the lint enforces order fields match array order).
export function flatLessons(manifest) {
  const out = [];
  for (const mod of manifest?.modules || []) {
    for (const les of mod.lessons || []) {
      out.push({ moduleKey: mod.key, moduleTitle: mod.title, ...les });
    }
  }
  return out;
}

export function adjacentLessons(manifest, moduleKey, lessonKey) {
  const flat = flatLessons(manifest);
  const i = flat.findIndex((l) => l.moduleKey === moduleKey && l.key === lessonKey);
  return {
    prev: i > 0 ? flat[i - 1] : null,
    next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : null,
  };
}

// Split raw lesson markdown into renderable segments. A line consisting
// solely of {{panel:<id>}} becomes a panel segment; everything else stays
// markdown. Pure function (unit-tested; the renderer and the printed
// handbook both consume it).
const PANEL_MARKER = /^\{\{panel:([a-z0-9-]+)\}\}\s*$/;

export function splitLessonSegments(raw) {
  const segments = [];
  let buf = [];
  const flush = () => {
    const text = buf.join('\n');
    if (text.trim()) segments.push({ type: 'markdown', content: text });
    buf = [];
  };
  for (const line of String(raw ?? '').split('\n')) {
    const m = line.match(PANEL_MARKER);
    if (m) {
      flush();
      segments.push({ type: 'panel', id: m[1] });
    } else {
      buf.push(line);
    }
  }
  flush();
  return segments;
}

// Total estimated minutes for a module / manifest (syllabus display).
export function estMinutes(lessons) {
  return (lessons || []).reduce((s, l) => s + (Number(l.est_minutes) || 0), 0);
}
