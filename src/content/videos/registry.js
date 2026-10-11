// The lesson video registry. One entry per recorded video, kept in code so
// every change is reviewed in a pull request. A lesson embeds a video with a
// marker line of its own, `{{video:<id>}}`, the way it embeds a panel.
//
// Videos are optional enrichment. Nothing in lesson completion, quizzes,
// exams, capstones or certificates reads this file, and a lesson reads the
// same with or without its video (registry.test.js holds both rules).
//
// Each entry:
//   series       the series key in SERIES below
//   number       the lesson number inside the series, as the video says it
//   title        the video's title, without the series suffix
//   durationSec  the running time of the master file, whole seconds
//   chapters     [{ at: seconds, label }], ascending, the first at 0
//   access       'public'  plays from YouTube (youtube-nocookie) once
//                          youtubeId is set; until then the lesson shows the
//                          coming-soon card
//                'members' plays from the private host (VIDEO_HOST) through
//                          the academy-video-url edge function, which checks
//                          the learner's enrolment; until a host is
//                          configured the lesson shows the coming-soon card
//   youtubeId    the 11 character YouTube id of a public video, or null
//   hostKey      the master's key in the video store (the folder name under
//                demo-videos and the R2 key prefix); V2 maps it to the
//                private host's own id
//   lessons      lesson paths this video enriches, as
//                '<app>/<tier>/<module key>/<lesson key>'. Every path must
//                exist and every listed lesson must carry the marker, and
//                every marker must be listed here (registry.test.js).
//
// docs/video/VIDEO-HOSTING.md explains how to add a series and how V2 wires
// the private host.

export const SERIES = {
  qi: {
    title: 'QI with Petrolord',
    app: 'qi',
    source: 'QI Studio on the Ekene demonstration kit v3 (ekene-demo-v3)',
  },
};

// The private host for members-only videos. null until the owner chooses a
// host and the academy-video-url function is deployed with its secrets
// (Bunny Stream is the recommended host; see docs/video/VIDEO-HOSTING.md).
// While it is null no members-only video makes a network call.
export const VIDEO_HOST = {
  provider: null,
};

export const VIDEOS = {
  'qi-a1': {
    series: 'qi',
    number: 1,
    title: 'What a QI Study Asks, and Setting One Up',
    durationSec: 210,
    chapters: [
      { at: 0, label: 'Introduction' },
      { at: 5, label: 'Lesson 1' },
      { at: 34, label: 'Feasibility first' },
      { at: 57, label: 'A new study' },
      { at: 119, label: 'The dates' },
      { at: 142, label: 'The data inventory' },
    ],
    access: 'public',
    youtubeId: null,
    hostKey: 'lesson-qi-a1',
    lessons: ['qi/beginner/m01-what-a-qi-study-asks/l01-why-a-qi-study'],
  },
  'qi-a2': {
    series: 'qi',
    number: 2,
    title: 'The Usability Matrix: Every Well Against Every Target',
    durationSec: 197,
    chapters: [
      { at: 0, label: 'Introduction' },
      { at: 5, label: 'Lesson 2' },
      { at: 22, label: 'What is graded' },
      { at: 48, label: 'The matrix' },
      { at: 140, label: 'The issue register' },
    ],
    access: 'public',
    youtubeId: null,
    hostKey: 'lesson-qi-a2',
    lessons: ['qi/beginner/m02-the-data-inventory/l02-the-usability-matrix'],
  },
  'qi-a3': {
    series: 'qi',
    number: 3,
    title: 'Seismic QC: Bandwidth, Noise and Footprint',
    durationSec: 190,
    chapters: [
      { at: 0, label: 'Introduction' },
      { at: 6, label: 'Lesson 3' },
      { at: 30, label: 'Resolution' },
      { at: 63, label: 'Running QC' },
      { at: 85, label: 'Spectra' },
      { at: 147, label: 'Footprint' },
    ],
    access: 'public',
    youtubeId: null,
    hostKey: 'lesson-qi-a3',
    lessons: ['qi/beginner/m03-seismic-qc/l01-the-amplitude-spectrum'],
  },
  'qi-b4': {
    series: 'qi',
    number: 4,
    title: 'Shear Logs and the Local Shear Trend',
    durationSec: 231,
    chapters: [
      { at: 0, label: 'Introduction' },
      { at: 5, label: 'Lesson 4' },
      { at: 33, label: 'Elastic attributes' },
      { at: 55, label: 'Ekene-1' },
      { at: 98, label: 'When there is no shear log' },
      { at: 129, label: 'A local trend' },
    ],
    access: 'members',
    youtubeId: null,
    hostKey: 'lesson-qi-b4',
    lessons: ['qi/beginner/m04-elastic-logs-at-the-wells/l03-the-local-shear-trend-and-its-interval'],
  },
  'qi-b5': {
    series: 'qi',
    number: 5,
    title: 'Fluids and Gassmann: How Much Does the Oil Soften the Rock?',
    durationSec: 234,
    chapters: [
      { at: 0, label: 'Introduction' },
      { at: 5, label: 'Lesson 5' },
      { at: 31, label: 'The fluids' },
      { at: 56, label: 'Ekene conditions' },
      { at: 105, label: 'Gassmann' },
      { at: 159, label: 'The answer' },
    ],
    access: 'members',
    youtubeId: null,
    hostKey: 'lesson-qi-b5',
    lessons: ['qi/beginner/m05-will-the-fluid-show/l02-oil-to-brine-substitution-on-a-log'],
  },
  'qi-b6': {
    series: 'qi',
    number: 6,
    title: 'Crossplots and Rock Models: Where Oil, Brine and Shale Fall',
    durationSec: 221,
    chapters: [
      { at: 0, label: 'Introduction' },
      { at: 5, label: 'Lesson 6' },
      { at: 26, label: 'The crossplot' },
      { at: 48, label: 'Ekene-1' },
      { at: 95, label: 'Template lines' },
      { at: 138, label: 'Which model fits?' },
    ],
    access: 'members',
    youtubeId: null,
    hostKey: 'lesson-qi-b6',
    lessons: ['qi/beginner/m05-will-the-fluid-show/l04-the-wet-trend-on-a-crossplot'],
  },
  'qi-b7': {
    series: 'qi',
    number: 7,
    title: 'Modelled AVO: What the Seismic Should Show',
    durationSec: 272,
    chapters: [
      { at: 0, label: 'Introduction' },
      { at: 5, label: 'Lesson 7' },
      { at: 30, label: 'Intercept and gradient' },
      { at: 59, label: 'Top Ekene Sand' },
      { at: 125, label: 'The wet trend' },
      { at: 180, label: 'The synthetic gather' },
      { at: 227, label: 'Feasibility' },
    ],
    access: 'members',
    youtubeId: null,
    hostKey: 'lesson-qi-b7',
    lessons: ['qi/beginner/m06-the-feasibility-verdict/l01-modelled-avo-at-the-zone-top'],
  },
  'qi-c8': {
    series: 'qi',
    number: 8,
    title: 'Synthetics and Wavelets: What the Well Predicts the Seismic Shows',
    durationSec: 228,
    chapters: [
      { at: 0, label: 'Introduction' },
      { at: 5, label: 'Lesson 8' },
      { at: 26, label: 'The recipe' },
      { at: 52, label: 'A textbook wavelet' },
      { at: 96, label: 'A wavelet from the seismic' },
      { at: 121, label: 'Phase' },
      { at: 146, label: 'A wavelet from the well' },
      { at: 176, label: 'Which wavelet?' },
    ],
    access: 'members',
    youtubeId: null,
    hostKey: 'lesson-qi-c8',
    lessons: ['qi/intermediate/m01-from-feasibility-to-the-tie/l03-statistical-and-well-wavelets'],
  },
  'qi-c9': {
    series: 'qi',
    number: 9,
    title: 'Shifts, Anchors and the Time-Depth Record',
    durationSec: 212,
    chapters: [
      { at: 0, label: 'Introduction' },
      { at: 5, label: 'Lesson 9' },
      { at: 23, label: 'No density' },
      { at: 74, label: 'Bulk shift' },
      { at: 97, label: 'Committing a tie' },
      { at: 116, label: 'Anchors' },
      { at: 143, label: 'The record' },
    ],
    access: 'members',
    youtubeId: null,
    hostKey: 'lesson-qi-c9',
    lessons: ['qi/intermediate/m02-the-tie-and-the-field-wavelet/l01-bulk-shift-and-anchors'],
  },
  'qi-c10': {
    series: 'qi',
    number: 10,
    title: 'The Field Wavelet: Every Tie in One Place',
    durationSec: 164,
    chapters: [
      { at: 0, label: 'Introduction' },
      { at: 5, label: 'Lesson 10' },
      { at: 23, label: 'The ties' },
      { at: 65, label: 'One wavelet' },
      { at: 111, label: 'Tie issues' },
    ],
    access: 'members',
    youtubeId: null,
    hostKey: 'lesson-qi-c10',
    lessons: ['qi/intermediate/m02-the-tie-and-the-field-wavelet/l04-aligning-and-averaging-one-field-wavelet'],
  },
  'qi-d11': {
    series: 'qi',
    number: 11,
    title: 'Gathers on the Worker, and Prestack QC',
    durationSec: 221,
    chapters: [
      { at: 0, label: 'Introduction' },
      { at: 5, label: 'Lesson 11' },
      { at: 31, label: 'The gather store' },
      { at: 71, label: 'What QC measures' },
      { at: 103, label: 'QC the gathers' },
    ],
    access: 'members',
    youtubeId: null,
    hostKey: 'lesson-qi-d11',
    lessons: ['qi/intermediate/m03-gathers-and-their-qc/l01-offset-gathers-and-bin-width'],
  },
  'qi-d12': {
    series: 'qi',
    number: 12,
    title: 'Angles From Velocity, and Angle Stacks',
    durationSec: 195,
    chapters: [
      { at: 0, label: 'Introduction' },
      { at: 5, label: 'Lesson 12' },
      { at: 31, label: 'Offset to angle' },
      { at: 53, label: 'The velocity' },
      { at: 74, label: 'Angle ranges' },
      { at: 98, label: 'The usable angle' },
      { at: 127, label: 'Making the stacks' },
    ],
    access: 'members',
    youtubeId: null,
    hostKey: 'lesson-qi-d12',
    lessons: ['qi/intermediate/m04-angles-from-velocity/l02-waldens-straight-ray-angle'],
  },
  'qi-e13': {
    series: 'qi',
    number: 13,
    title: 'AVO Volumes: Intercept, Gradient and the Fluid Factor',
    durationSec: 204,
    chapters: [
      { at: 0, label: 'Introduction' },
      { at: 5, label: 'Lesson 13' },
      { at: 26, label: 'The fluid factor' },
      { at: 49, label: 'The stacks' },
      { at: 60, label: 'Are the stacks balanced?' },
      { at: 140, label: 'Computing the volumes' },
      { at: 156, label: 'In Seismolord' },
    ],
    access: 'members',
    youtubeId: null,
    hostKey: 'lesson-qi-e13',
    lessons: ['qi/intermediate/m05-avo-volumes/l02-intercept-and-gradient-volumes'],
  },
  'qi-e14': {
    series: 'qi',
    number: 14,
    title: 'AVO at the Wells: Is the Seismic Telling the Truth?',
    durationSec: 187,
    chapters: [
      { at: 0, label: 'Introduction' },
      { at: 5, label: 'Lesson 14' },
      { at: 29, label: 'What is compared' },
      { at: 58, label: 'The comparison' },
      { at: 108, label: 'On the crossplot' },
      { at: 134, label: 'When they disagree' },
    ],
    access: 'members',
    youtubeId: null,
    hostKey: 'lesson-qi-e14',
    lessons: ['qi/intermediate/m06-avo-at-the-wells/l01-one-scale-over-every-well'],
  },
  'qi-f15': {
    series: 'qi',
    number: 15,
    title: 'Impedance Inversion: From Reflections to Rock',
    durationSec: 210,
    chapters: [
      { at: 0, label: 'Introduction' },
      { at: 5, label: 'Lesson 15' },
      { at: 29, label: 'How it works' },
      { at: 56, label: 'Setting it up' },
      { at: 81, label: 'The wells in time' },
      { at: 111, label: 'The blind-well check' },
      { at: 173, label: 'Inverting the survey' },
    ],
    access: 'members',
    youtubeId: null,
    hostKey: 'lesson-qi-f15',
    lessons: ['qi/advanced/m02-post-stack-inversion/l01-model-based-least-squares'],
  },
  'qi-f16': {
    series: 'qi',
    number: 16,
    title: 'Simultaneous Inversion: AI, SI and Density at Once',
    durationSec: 195,
    chapters: [
      { at: 0, label: 'Introduction' },
      { at: 5, label: 'Lesson 16' },
      { at: 29, label: 'The physics' },
      { at: 58, label: 'The stacks' },
      { at: 76, label: 'Wavelets by angle' },
      { at: 116, label: 'Blind wells' },
      { at: 159, label: 'Inverting the survey' },
    ],
    access: 'members',
    youtubeId: null,
    hostKey: 'lesson-qi-f16',
    lessons: ['qi/advanced/m03-simultaneous-inversion/l01-fattis-three-parameters'],
  },
  'qi-f17': {
    series: 'qi',
    number: 17,
    title: 'Properties From Impedance: What the Checks Say',
    durationSec: 203,
    chapters: [
      { at: 0, label: 'Introduction' },
      { at: 5, label: 'Lesson 17' },
      { at: 30, label: 'A first fit' },
      { at: 55, label: 'The reservoir window' },
      { at: 78, label: 'Why the sign is wrong' },
      { at: 108, label: 'The leave-one-out check' },
    ],
    access: 'members',
    youtubeId: null,
    hostKey: 'lesson-qi-f17',
    lessons: ['qi/advanced/m04-properties-from-impedance/l02-left-out-wells-and-the-widened-band'],
  },
  'qi-f18': {
    series: 'qi',
    number: 18,
    title: 'Prospects and the Report: The QI Assessment',
    durationSec: 251,
    chapters: [
      { at: 0, label: 'Introduction' },
      { at: 5, label: 'Lesson 18' },
      { at: 30, label: 'Feasibility on record' },
      { at: 47, label: 'The trap' },
      { at: 66, label: 'The anomaly' },
      { at: 83, label: 'Evidence' },
      { at: 106, label: 'Competing explanations' },
      { at: 135, label: 'The assessment' },
      { at: 199, label: 'The record' },
      { at: 226, label: 'QI with Petrolord' },
    ],
    access: 'members',
    youtubeId: null,
    hostKey: 'lesson-qi-f18',
    lessons: ['qi/advanced/m05-prospects/l04-the-qi-assessment'],
  },
};

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

export function getVideo(id) {
  return Object.prototype.hasOwnProperty.call(VIDEOS, id) ? VIDEOS[id] : null;
}

// How a video plays right now: 'youtube' (public, id set), 'host' (members,
// host configured) or 'soon' (anything else). Pure, so tests pin it.
export function videoPlayback(video, host = VIDEO_HOST) {
  if (!video) return 'none';
  if (video.access === 'public') {
    return video.youtubeId && YOUTUBE_ID.test(video.youtubeId) ? 'youtube' : 'soon';
  }
  if (video.access === 'members') {
    return host && host.provider ? 'host' : 'soon';
  }
  return 'none';
}

// The privacy-enhanced YouTube embed. Only the id and a whole-second start
// go into the URL.
export function youtubeEmbedUrl(video, startSec = 0) {
  if (!video?.youtubeId || !YOUTUBE_ID.test(video.youtubeId)) return null;
  const start = Math.max(0, Math.floor(Number(startSec) || 0));
  const params = new URLSearchParams({ rel: '0', modestbranding: '1' });
  if (start > 0) params.set('start', String(start));
  return `https://www.youtube-nocookie.com/embed/${video.youtubeId}?${params.toString()}`;
}

export function formatDuration(sec) {
  const s = Math.max(0, Math.round(Number(sec) || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// Every video that names this lesson, in registry order.
export function videosForLesson(app, tier, moduleKey, lessonKey) {
  const path = `${app}/${tier}/${moduleKey}/${lessonKey}`;
  return Object.entries(VIDEOS)
    .filter(([, v]) => v.lessons.includes(path))
    .map(([id, v]) => ({ id, ...v }));
}
