// Which courses have deep content, answered from file paths alone.
//
// courseContent.js loads every manifest eagerly (237 files, 2.1 MB) because
// the reader navigates synchronously. The dashboard home only needs a yes or
// no per course, so it reads this index instead: a lazy glob whose keys are
// the manifest paths, and whose loaders are never called here. Directory
// names are the manifest's app_slug and tier (courseIndex.test.js checks
// every one against the manifests).

const manifestLoaders = import.meta.glob('/src/content/courses/*/*/manifest.json');

const KEYS = Object.keys(manifestLoaders)
  .map((p) => p.match(/\/src\/content\/courses\/([^/]+)\/([^/]+)\/manifest\.json$/))
  .filter(Boolean)
  .map(([, app, tier]) => `${app}/${tier}`);
const KEY_SET = new Set(KEYS);

export function deepCourseKeys() {
  return [...KEYS];
}

export function hasDeepCourse(app, tier) {
  if (tier) return KEY_SET.has(`${app}/${tier}`);
  return KEYS.some((k) => k.startsWith(`${app}/`));
}
