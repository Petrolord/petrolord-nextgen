// The video segment renders the right thing for each playback state, and the
// lesson renderer places it at its marker.
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('@/services/videoService', () => ({ fetchMemberVideoUrl: vi.fn(() => new Promise(() => {})) }));
vi.mock('@/content/videos/registry', async (orig) => {
  const real = await orig();
  return {
    ...real,
    VIDEOS: {
      ...real.VIDEOS,
      'zz-public-live': { ...real.VIDEOS['qi-a1'], youtubeId: 'dQw4w9WgXcQ' },
    },
    getVideo: (id) => ({ ...real.VIDEOS, 'zz-public-live': { ...real.VIDEOS['qi-a1'], youtubeId: 'dQw4w9WgXcQ' } }[id] || null),
  };
});

const { default: VideoSegment } = await import('./VideoSegment.jsx');
const { default: MarkdownLesson } = await import('./MarkdownLesson.jsx');

describe('VideoSegment', () => {
  it('a public video with an id embeds youtube-nocookie with its chapters', () => {
    const html = renderToStaticMarkup(<VideoSegment id="zz-public-live" />);
    expect(html).toContain('data-video-mode="youtube"');
    expect(html).toContain('src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?');
    expect(html).toContain('Feasibility first');
    expect(html).not.toContain('youtube.com/embed');
  });

  it('a public video still waiting for its YouTube id shows the coming-soon card', () => {
    const html = renderToStaticMarkup(<VideoSegment id="qi-a1" />);
    expect(html).toContain('data-video-mode="soon"');
    expect(html).toContain('Video coming soon to your course');
    expect(html).not.toContain('<iframe');
  });

  it('a members video with no host shows the coming-soon card and makes no call', async () => {
    const { fetchMemberVideoUrl } = await import('@/services/videoService');
    const html = renderToStaticMarkup(<VideoSegment id="qi-f15" />);
    expect(html).toContain('Video coming soon to your course');
    expect(html).toContain('Impedance Inversion');
    expect(fetchMemberVideoUrl).not.toHaveBeenCalled();
  });

  it('a members video with a host configured waits for its signed URL', () => {
    const html = renderToStaticMarkup(<VideoSegment id="qi-f15" host={{ provider: 'bunny' }} />);
    expect(html).toContain('data-video-mode="host"');
    expect(html).not.toContain('Video coming soon');
  });

  it('print mode is a one-line callout and an unknown id renders nothing', () => {
    const html = renderToStaticMarkup(<VideoSegment id="qi-b4" printMode />);
    expect(html).toContain('Shear Logs and the Local Shear Trend');
    expect(html).not.toContain('<iframe');
    expect(renderToStaticMarkup(<VideoSegment id="zz-nobody" />)).toBe('');
  });

  it('MarkdownLesson places the video between the prose either side of its marker', () => {
    const html = renderToStaticMarkup(
      <MarkdownLesson raw={'# Title\n\nBefore.\n\n{{video:qi-a2}}\n\nAfter.'} app="qi" tier="beginner" moduleKey="m01-x" />,
    );
    const a = html.indexOf('Before.');
    const v = html.indexOf('data-video-id="qi-a2"');
    const b = html.indexOf('After.');
    expect(a).toBeGreaterThan(-1);
    expect(v).toBeGreaterThan(a);
    expect(b).toBeGreaterThan(v);
    expect(html).not.toContain('{{video');
  });
});
