# Lesson videos: the registry, the marker and the private host

Owner decisions: videos are optional enrichment (2026-10-09); build the
`{{video}}` marker and a code registry, play QI Module A from YouTube at
launch (D3, 2026-10-11); the private host for members-only videos is
Cloudflare Stream (2026-10-12).

## What ships now (V1)

| piece | file | what it does |
|---|---|---|
| marker | `src/lib/courseContent.js` | a line holding only `{{video:<id>}}` becomes a video segment, beside `{{panel:<id>}}` |
| registry | `src/content/videos/registry.js` | one entry per video: series, number, title, duration, chapters, access, YouTube id, host key, and the lessons it enriches |
| player | `src/components/course/VideoSegment.jsx` | youtube-nocookie embed, members player, or the "Video coming soon to your course" card; a one-line callout in print |
| service | `src/services/videoService.js` | asks `academy-video-url` for a signed player URL; any failure leaves the coming-soon card |
| function | `supabase/functions/academy-video-url/` | checks the learner and the tier scope, then signs a Cloudflare Stream playback token (`handler.ts`, tested in `handler.test.ts`; signer in `_shared/streamToken.ts`) |
| map | `migrations/20261012023113_academy_videos.sql` | `academy_videos`: video id to app, tier and Stream uid; service role only |
| uploader | `tools/video/cf-stream-upload.mjs` | uploads a series' members-only masters, locks them to signed URLs, writes the uid upsert |
| gates | `src/content/videos/registry.test.js`, `VideoSegment.test.jsx` | shape, links both ways (no entry may point at a missing lesson; every marker is registered and listed), playback rules, and the rule that nothing outside the renderer imports the video code |

How each video plays today:

| access | YouTube id | host | the lesson shows |
|---|---|---|---|
| public | set | any | the privacy-enhanced YouTube player (`www.youtube-nocookie.com`) |
| public | null | any | the coming-soon card |
| members | null | `provider: null` | the coming-soon card; no network call |
| members | null | `cloudflare-stream` (set) | the Stream player from a signed URL; the coming-soon card if the function is not deployed, the video is not uploaded or the learner lacks the tier |

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

## The private host: Cloudflare Stream

Members-only videos play from Cloudflare Stream. Each video is uploaded with
`requireSignedURLs` and `allowedOrigins: ["nextgen.petrolord.com"]`, so its
public links do not play and no other site can embed it. The lesson asks
`academy-video-url` for a player URL. The function:

1. answers 401 without a signed-in learner and 400 without a well-formed id;
2. answers 503 until `CF_STREAM_KEY_ID`, `CF_STREAM_JWK` and
   `CF_STREAM_CUSTOMER_CODE` are all set;
3. looks the video up in `academy_videos` with the service role (404 if it
   is not uploaded yet); the client's registry is never trusted for access;
4. runs `academy_has_scope(app, scope)` AS THE LEARNER, with the scope the
   video's tier opens (beginner `learning`, intermediate `working`, advanced
   `advanced`), so the activation gate and the scope ladder apply (403);
5. signs an RS256 token with the Stream signing key (header `kid`; payload
   `sub` the Stream uid, `kid`, `exp` five minutes ahead, `nbf` a minute back)
   and returns `{ url, expires }`, where `url` is
   `https://customer-<code>.cloudflarestream.com/<token>/iframe`.

No call to Cloudflare happens per view. A video's tier is the lowest tier of
the lessons it enriches (the uploader reads it from the registry).

Pricing (Cloudflare list rates, 2026): 5 US dollars per 1,000 minutes stored
a month and 1 US dollar per 1,000 minutes delivered, each rounded up to the
next 1,000; no charge for encoding or bandwidth. The 15 QI members videos
(about 54 minutes) fit inside the first 1,000 stored minutes.

### Owner steps, in order

1. In the Cloudflare dashboard, turn on Stream for the account and note the
   account id.
2. Create an API token with the permission Account, Stream, Edit.
3. In your own SSH terminal (never in a chat), write the env file:
   `printf 'CF_API_TOKEN=%s\nCF_ACCOUNT_ID=%s\n' 'TOKEN' 'ACCOUNT_ID' > /root/.cloudflare-stream.env && chmod 600 /root/.cloudflare-stream.env`
4. Create the signing key (shown once, saved to
   `/root/.cloudflare-stream-signing-key.json`, mode 600, never printed):
   `node tools/video/cf-stream-signing-key.mjs`
5. In your own SSH terminal, set the two key secrets with the command the
   script prints (it reads the key file inside your shell).
6. Apply `migrations/20261012023113_academy_videos.sql` to the NextGen
   project.
7. Deploy the function:
   `supabase functions deploy academy-video-url --project-ref txcsbtvcdaqmkjjbhbeg`
8. Upload the QI members videos (lessons 4 to 18), first as a dry run:
   `node tools/video/cf-stream-upload.mjs --series qi --dry-run`, then
   `node tools/video/cf-stream-upload.mjs --series qi`.
   It writes `/root/video-host/cloudflare-stream/qi.json` (re-runs skip what
   is there) and `qi-academy-videos.sql`, and prints the customer code.
9. Set `CF_STREAM_CUSTOMER_CODE` to that code:
   `supabase secrets set CF_STREAM_CUSTOMER_CODE=<code> --project-ref txcsbtvcdaqmkjjbhbeg`
   (the code is not a secret).
10. Apply `/root/video-host/cloudflare-stream/qi-academy-videos.sql` to the
    NextGen project. The videos play from the next page load; no NextGen
    upload is needed, because the registry already names the host.

To stop every members-only call, set `VIDEO_HOST.provider` to `null`. To
revoke every link at once, delete the signing key in Cloudflare.
