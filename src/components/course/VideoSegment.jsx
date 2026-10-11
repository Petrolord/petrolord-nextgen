import React, { useEffect, useState } from 'react';
import { Clapperboard, PlayCircle } from 'lucide-react';
import {
  getVideo, videoPlayback, youtubeEmbedUrl, formatDuration, SERIES, VIDEO_HOST,
} from '@/content/videos/registry';
import { fetchMemberVideoUrl } from '@/services/videoService';

// One lesson video, placed by a {{video:<id>}} marker line. Optional
// enrichment: the lesson around it is complete without it, and nothing here
// reports progress, completion or watch time anywhere.
//
//   public, YouTube id set      privacy-enhanced YouTube embed
//   members, host configured    signed embed URL from academy-video-url
//   anything else               the coming-soon card
//   printMode                   a one-line callout (handbook and print)
//   unknown id                  nothing (the content lint refuses one)

function Frame({ src, title }) {
  return (
    <div className="relative w-full overflow-hidden rounded-md border border-pl-border bg-black" style={{ paddingTop: '56.25%' }}>
      <iframe
        className="absolute inset-0 h-full w-full"
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

function Heading({ video }) {
  const series = SERIES[video.series];
  return (
    <div className="flex items-start gap-3 mb-3">
      <PlayCircle className="h-5 w-5 text-pl-accent-text shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-pl-text mb-0 break-words">{video.title}</p>
        <p className="text-xs text-pl-muted mb-0">
          {series ? `${series.title}, lesson ${video.number}` : `Lesson ${video.number}`}
          {' · '}
          {formatDuration(video.durationSec)}
        </p>
      </div>
    </div>
  );
}

function Chapters({ video, onSeek }) {
  if (!video.chapters?.length) return null;
  return (
    <ol className="mt-3 grid gap-1 sm:grid-cols-2 list-none pl-0 mb-0" aria-label="Chapters">
      {video.chapters.map((c) => (
        <li key={c.at} className="text-xs text-pl-muted leading-5">
          {onSeek ? (
            <button
              type="button"
              className="font-mono text-pl-primary-text hover:underline mr-2"
              onClick={() => onSeek(c.at)}
            >
              {formatDuration(c.at)}
            </button>
          ) : (
            <span className="font-mono mr-2">{formatDuration(c.at)}</span>
          )}
          {c.label}
        </li>
      ))}
    </ol>
  );
}

export function ComingSoonCard({ video }) {
  return (
    <div
      className="rounded-md border border-dashed border-pl-border-strong bg-pl-sunken px-4 py-6 flex flex-col items-center text-center gap-2"
      data-video-state="soon"
    >
      <Clapperboard className="h-7 w-7 text-pl-accent-text" />
      <p className="text-sm font-medium text-pl-text mb-0">Video coming soon to your course</p>
      <p className="text-xs text-pl-muted mb-0 max-w-md">
        This lesson is complete as written. The video walk-through of the same steps in the Suite
        will appear here when it is published.
      </p>
    </div>
  );
}

function MemberPlayer({ id, video }) {
  const [state, setState] = useState({ url: null, failed: false });
  useEffect(() => {
    let live = true;
    fetchMemberVideoUrl(id)
      .then((url) => { if (live) setState({ url, failed: false }); })
      .catch(() => { if (live) setState({ url: null, failed: true }); });
    return () => { live = false; };
  }, [id]);
  if (state.url) return <Frame src={state.url} title={video.title} />;
  if (state.failed) return <ComingSoonCard video={video} />;
  return <div className="w-full rounded-md border border-pl-border bg-pl-sunken" style={{ paddingTop: '56.25%' }} />;
}

export default function VideoSegment({ id, printMode = false, host = VIDEO_HOST }) {
  const video = getVideo(id);
  const [start, setStart] = useState(0);
  if (!video) return null;

  if (printMode) {
    return (
      <div className="rounded-md border border-dashed border-pl-border-strong bg-pl-sunken p-4 my-4 flex items-center gap-3">
        <PlayCircle className="h-5 w-5 text-pl-accent-text shrink-0" />
        <p className="text-sm text-pl-muted mb-0">
          Video: <span className="text-pl-text">{video.title}</span> ({formatDuration(video.durationSec)}), optional, in the online course.
        </p>
      </div>
    );
  }

  const mode = videoPlayback(video, host);
  return (
    <section className="my-6 rounded-lg border border-pl-border bg-pl-surface p-4" data-video-id={id} data-video-mode={mode}>
      <Heading video={video} />
      {mode === 'youtube' && <Frame key={start} src={youtubeEmbedUrl(video, start)} title={video.title} />}
      {mode === 'host' && <MemberPlayer id={id} video={video} />}
      {mode === 'soon' && <ComingSoonCard video={video} />}
      <Chapters video={video} onSeek={mode === 'youtube' ? setStart : null} />
    </section>
  );
}
