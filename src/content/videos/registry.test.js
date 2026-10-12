// THE LESSON VIDEO REGISTRY: SHAPE, LINKS BOTH WAYS, AND THE ENRICHMENT RULE.
//
// 1. Every entry has the fields the player needs, with sane values.
// 2. No entry points at a lesson that does not exist, every listed lesson
//    carries the marker, and every {{video:<id>}} marker in any lesson names
//    a registered video that lists that lesson. A link that breaks in either
//    direction fails here, not in front of a learner.
// 3. Videos are optional enrichment: nothing that decides completion,
//    progress, quizzes, exams, capstones or certificates imports the video
//    registry, the video segment or the video service.
// Each check proves it can fail on a planted defect before its zero counts.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  VIDEOS, SERIES, VIDEO_HOST, getVideo, videoPlayback, youtubeEmbedUrl, formatDuration, videosForLesson,
} from './registry.js';
import { splitLessonSegments } from '@/lib/courseContent.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, '../..');
const COURSES = path.join(SRC, 'content/courses');
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const LESSON_PATH = /^[a-z0-9]+\/(beginner|intermediate|advanced)\/m\d{2}-[a-z0-9-]+\/l\d{2}-[a-z0-9-]+$/;

// Every lesson file on disk, keyed '<app>/<tier>/<module>/<lesson>'.
function lessonFiles() {
  const out = new Map();
  for (const app of fs.readdirSync(COURSES)) {
    const appDir = path.join(COURSES, app);
    if (!fs.statSync(appDir).isDirectory()) continue;
    for (const tier of fs.readdirSync(appDir)) {
      const tierDir = path.join(appDir, tier);
      if (!fs.statSync(tierDir).isDirectory()) continue;
      for (const mod of fs.readdirSync(tierDir)) {
        const modDir = path.join(tierDir, mod);
        if (!fs.statSync(modDir).isDirectory()) continue;
        for (const f of fs.readdirSync(modDir)) {
          if (f.endsWith('.md')) out.set(`${app}/${tier}/${mod}/${f.slice(0, -3)}`, path.join(modDir, f));
        }
      }
    }
  }
  return out;
}

// The link check as a pure function, so a planted defect can be shown to fail.
export function linkProblems(videos, files, readBody) {
  const problems = [];
  const markers = new Map(); // lesson path -> [ids]
  for (const [lp, file] of files) {
    const ids = splitLessonSegments(readBody(file)).filter((s) => s.type === 'video').map((s) => s.id);
    if (ids.length) markers.set(lp, ids);
  }
  for (const [id, v] of Object.entries(videos)) {
    for (const lp of v.lessons) {
      if (!files.has(lp)) problems.push(`${id}: lesson ${lp} does not exist`);
      else if (!(markers.get(lp) || []).includes(id)) problems.push(`${id}: lesson ${lp} carries no {{video:${id}}} marker`);
    }
  }
  for (const [lp, ids] of markers) {
    for (const id of ids) {
      if (!videos[id]) problems.push(`${lp}: marker {{video:${id}}} names no registered video`);
      else if (!videos[id].lessons.includes(lp)) problems.push(`${lp}: marker {{video:${id}}} is not listed in that video's lessons`);
    }
  }
  return { problems, markerCount: [...markers.values()].reduce((s, a) => s + a.length, 0) };
}

describe('video registry: shape', () => {
  const entries = Object.entries(VIDEOS);

  it('holds the 18 QI lesson videos', () => {
    expect(entries.length).toBeGreaterThanOrEqual(18);
    expect(entries.filter(([, v]) => v.series === 'qi').length).toBe(18);
  });

  it('every entry is complete and consistent', () => {
    for (const [id, v] of entries) {
      expect(ID.test(id), `${id}: id`).toBe(true);
      expect(SERIES[v.series], `${id}: series ${v.series}`).toBeTruthy();
      expect(Number.isInteger(v.number) && v.number > 0, `${id}: number`).toBe(true);
      expect(typeof v.title === 'string' && v.title.length > 3, `${id}: title`).toBe(true);
      expect(v.title.includes('—') || v.title.includes('–'), `${id}: dash in title`).toBe(false);
      expect(Number.isInteger(v.durationSec) && v.durationSec > 0, `${id}: duration`).toBe(true);
      expect(['public', 'members'], `${id}: access`).toContain(v.access);
      expect(typeof v.hostKey === 'string' && v.hostKey.length > 0, `${id}: hostKey`).toBe(true);
      if (v.youtubeId !== null) {
        expect(/^[A-Za-z0-9_-]{11}$/.test(v.youtubeId), `${id}: youtubeId`).toBe(true);
        expect(v.access, `${id}: only a public video may carry a YouTube id`).toBe('public');
      }
      expect(Array.isArray(v.chapters) && v.chapters.length > 0, `${id}: chapters`).toBe(true);
      expect(v.chapters[0].at, `${id}: first chapter at 0`).toBe(0);
      for (let i = 1; i < v.chapters.length; i += 1) {
        expect(v.chapters[i].at > v.chapters[i - 1].at, `${id}: chapters ascend`).toBe(true);
      }
      expect(v.chapters[v.chapters.length - 1].at < v.durationSec, `${id}: last chapter inside the video`).toBe(true);
      expect(Array.isArray(v.lessons), `${id}: lessons`).toBe(true);
      for (const lp of v.lessons) expect(LESSON_PATH.test(lp), `${id}: lesson path ${lp}`).toBe(true);
    }
  });

  it('ids, host keys and series numbers are unique', () => {
    const ids = entries.map(([id]) => id);
    const keys = entries.map(([, v]) => v.hostKey);
    const nums = entries.map(([, v]) => `${v.series}:${v.number}`);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(nums).size).toBe(nums.length);
  });

  it('QI Module A (lessons 1 to 3) is public and the rest are members-only', () => {
    for (const [id, v] of entries.filter(([, e]) => e.series === 'qi')) {
      expect(v.access, id).toBe(v.number <= 3 ? 'public' : 'members');
    }
  });
});

describe('video registry: links both ways', () => {
  const files = lessonFiles();
  const read = (f) => fs.readFileSync(f, 'utf8');

  it('reads the lesson tree it checks', () => {
    expect(files.size).toBeGreaterThan(1000);
  });

  it('no entry points at a missing lesson, and every marker is registered and listed', () => {
    const { problems } = linkProblems(VIDEOS, files, read);
    expect(problems).toEqual([]);
  });

  it('negative controls: each kind of broken link is reported', () => {
    const [someLesson] = [...files.keys()];
    const planted = {
      ...VIDEOS,
      'zz-missing': { ...Object.values(VIDEOS)[0], lessons: ['qi/beginner/m99-nowhere/l99-nothing'] },
      'zz-unmarked': { ...Object.values(VIDEOS)[0], lessons: [someLesson] },
    };
    const { problems } = linkProblems(planted, files, read);
    expect(problems.some((p) => p.startsWith('zz-missing:') && p.includes('does not exist'))).toBe(true);
    expect(problems.some((p) => p.startsWith('zz-unmarked:') && p.includes('carries no'))).toBe(true);

    const fakeFiles = new Map([['qi/beginner/m01-x/l01-y', 'virtual']]);
    const orphan = linkProblems(VIDEOS, fakeFiles, () => 'Text.\n\n{{video:zz-nobody}}\n');
    expect(orphan.problems.some((p) => p.includes('names no registered video'))).toBe(true);
    const unlisted = linkProblems(VIDEOS, fakeFiles, () => 'Text.\n\n{{video:qi-a1}}\n');
    expect(unlisted.problems.some((p) => p.includes('is not listed'))).toBe(true);
    expect(unlisted.markerCount).toBe(1);
  });

  it('videosForLesson returns the entries that list a lesson', () => {
    for (const [id, v] of Object.entries(VIDEOS)) {
      for (const lp of v.lessons) {
        const [app, tier, mod, les] = lp.split('/');
        expect(videosForLesson(app, tier, mod, les).map((e) => e.id)).toContain(id);
      }
    }
    expect(videosForLesson('qi', 'beginner', 'm99-x', 'l99-y')).toEqual([]);
  });
});

describe('video registry: playback rules', () => {
  const pub = { access: 'public', youtubeId: 'dQw4w9WgXcQ' };

  it('a public video with an id plays from youtube-nocookie', () => {
    expect(videoPlayback(pub)).toBe('youtube');
    const url = youtubeEmbedUrl(pub, 34.7);
    expect(url.startsWith('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?')).toBe(true);
    expect(new URL(url).searchParams.get('start')).toBe('34');
    expect(new URL(youtubeEmbedUrl(pub, 0)).searchParams.has('start')).toBe(false);
  });

  it('a public video without an id, or with a malformed one, shows the coming-soon card', () => {
    expect(videoPlayback({ access: 'public', youtubeId: null })).toBe('soon');
    expect(videoPlayback({ access: 'public', youtubeId: 'x"><script>' })).toBe('soon');
    expect(youtubeEmbedUrl({ youtubeId: 'x"><script>' })).toBeNull();
  });

  it('a members video waits for a host, then plays from it', () => {
    const mem = { access: 'members', youtubeId: null };
    expect(VIDEO_HOST.provider).toBe('cloudflare-stream');
    expect(videoPlayback(mem, { provider: null })).toBe('soon');
    expect(videoPlayback(mem)).toBe('host');
  });

  it('unknown ids and access values play nothing', () => {
    expect(getVideo('zz-nobody')).toBeNull();
    expect(getVideo('constructor')).toBeNull();
    expect(videoPlayback(null)).toBe('none');
    expect(videoPlayback({ access: 'secret' })).toBe('none');
  });

  it('durations print as m:ss', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(209.6)).toBe('3:30');
    expect(formatDuration(65)).toBe('1:05');
  });
});

describe('videos never gate anything', () => {
  // Every file that may import the video code. Anything else that does is a
  // place where a video could start to decide progress or a grade.
  const ALLOWED = new Set([
    'content/videos/registry.js',
    'content/videos/registry.test.js',
    'components/course/VideoSegment.jsx',
    'components/course/VideoSegment.test.jsx',
    'components/course/MarkdownLesson.jsx',
    'services/videoService.js',
  ].map((p) => path.join(SRC, p)));
  const IMPORT = /from\s+['"](@\/content\/videos\/registry|@\/components\/course\/VideoSegment|@\/services\/videoService|\.\/registry(\.js)?|\.\/VideoSegment|\.\.\/videos\/registry)['"]/;

  function offenders(root) {
    const out = [];
    const walk = (d) => {
      for (const f of fs.readdirSync(d)) {
        const full = path.join(d, f);
        const st = fs.statSync(full);
        if (st.isDirectory()) { if (f !== 'node_modules') walk(full); }
        else if (/\.(jsx?|mjs)$/.test(f) && !ALLOWED.has(full) && IMPORT.test(fs.readFileSync(full, 'utf8'))) out.push(full);
      }
    };
    walk(root);
    return out;
  }

  it('only the lesson renderer reaches the video code', () => {
    expect(offenders(SRC)).toEqual([]);
  });

  it('negative control: a planted import is found', () => {
    const tmp = fs.mkdtempSync(path.join(fs.realpathSync(path.join(SRC, '..')), '.vidtest-'));
    try {
      fs.writeFileSync(path.join(tmp, 'useProgress.js'), "import { VIDEOS } from '@/content/videos/registry';\n");
      expect(offenders(tmp).length).toBe(1);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
