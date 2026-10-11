# Lesson videos: the registry, the marker and the private host

Owner decisions: videos are optional enrichment (2026-10-09); build the
`{{video}}` marker and a code registry now, choose the private host later,
with Bunny Stream recommended, and play QI Module A from YouTube at launch
(D3, 2026-10-11).

## What ships now (V1)

| piece | file | what it does |
|---|---|---|
| marker | `src/lib/courseContent.js` | a line holding only `{{video:<id>}}` becomes a video segment, beside `{{panel:<id>}}` |
| registry | `src/content/videos/registry.js` | one entry per video: series, number, title, duration, chapters, access, YouTube id, host key, and the lessons it enriches |
| player | `src/components/course/VideoSegment.jsx` | youtube-nocookie embed, members player, or the "Video coming soon to your course" card; a one-line callout in print |
| service | `src/services/videoService.js` | asks `academy-video-url` for a signed URL; called only once a host is configured |
| function | `supabase/functions/academy-video-url/index.ts` | STUB: authenticates, then answers 503 `video_host_not_configured`; not deployed |
| gates | `src/content/videos/registry.test.js`, `VideoSegment.test.jsx` | shape, links both ways (no entry may point at a missing lesson; every marker is registered and listed), playback rules, and the rule that nothing outside the renderer imports the video code |

How each video plays today:

| access | YouTube id | host | the lesson shows |
|---|---|---|---|
| public | set | any | the privacy-enhanced YouTube player (`www.youtube-nocookie.com`) |
| public | null | any | the coming-soon card |
| members | null | none (today) | the coming-soon card; no network call |
| members | null | configured | the player, from a signed URL |

## Videos never gate anything

Completion, progress, quizzes, the final exam, capstones and certificates do
not read the registry. `registry.test.js` fails if any file other than the
lesson renderer, the segment, the service and the registry imports the video
code. A lesson must read complete without its video: write the lesson first,
then place the marker where the video walks through the same steps in the
Suite. Never put a figure in a video that a lesson, a question or a capstone
depends on.

## Adding a video

1. Record and master it (tools/demo-video in the Suite). The master's folder
   name under `/root/demo-videos` is the `hostKey`.
2. Add an entry to `VIDEOS`: title without the series suffix, `durationSec`
   from `ffprobe` on the master, chapters from `chapters.txt` in seconds.
3. Put the marker line in each lesson it enriches and list those lessons in
   `lessons` as `<app>/<tier>/<module key>/<lesson key>`.
4. `node_modules/.bin/vitest run src/content/videos src/lib/courseContent.test.js`.

## Publishing a public video

When a video is published on the Petrolord Suite channel, set its
`youtubeId` (the 11 characters after `watch?v=`). One line, no lesson change,
no `content_version` bump. Only `public` entries may carry a YouTube id; the
test refuses one on a members entry.

## V2: the private host (when the owner chooses it)

Owner steps:

1. Create the Bunny Stream library (or the chosen host), turn on embed token
   authentication and restrict embedding to `nextgen.petrolord.com`.
2. Upload the members-only masters (QI B4 to F18) or hand over an API key
   with upload scope.
3. Set the function secrets on the NextGen Supabase project:
   `BUNNY_STREAM_LIBRARY_ID`, `BUNNY_STREAM_TOKEN_KEY`.
4. Deploy: `supabase functions deploy academy-video-url`.

Agent steps (one NextGen PR):

1. Add the server-side map `video_id -> { app, tier, host id }` (a small
   `academy_videos` table with no client SELECT, or a JSON secret). The
   client's registry is never trusted for access.
2. In the function: check `academy_has_scope(app, scope)` called as the
   learner (beginner `learning`, intermediate `working`, advanced
   `advanced`), then return `{ url, expires }` signed as
   `token = hex(SHA-256(TOKEN_KEY + video_guid + expires))`,
   `https://iframe.mediadelivery.net/embed/<library>/<video_guid>?token=..&expires=..`,
   expiring in minutes.
3. Set `VIDEO_HOST.provider` to `'bunny'` in the registry. No lesson file
   changes, so no `content_version` bump and no learner notice.
4. Tests: a function test for 401 without a JWT, 403 without the scope, 503
   unconfigured, and a fixed-input signature matching Bunny's documented
   example.
