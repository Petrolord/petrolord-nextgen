-- ============================================================================
-- academy_videos: the server-side map from a members-only lesson video to its
-- Cloudflare Stream uid (owner decision 2026-10-12: Cloudflare Stream is the
-- private video host).
--
-- The academy-video-url edge function reads this table with the service role
-- to find a video's app, tier and Stream uid, checks academy_has_scope(app,
-- scope) as the learner (beginner learning, intermediate working, advanced
-- advanced) and signs a short-lived playback token. The client's registry
-- (src/content/videos/registry.js) is never trusted for access, so the table
-- has RLS on and NO client policies: anon and authenticated read nothing.
--
-- Rows are written by the upsert that tools/video/cf-stream-upload.mjs
-- generates after each upload. Idempotent.
-- ============================================================================

create table if not exists public.academy_videos (
  video_id   text primary key check (video_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  app        text not null,
  tier       text not null check (tier in ('beginner', 'intermediate', 'advanced')),
  stream_uid text not null check (stream_uid ~ '^[A-Za-z0-9]+$'),
  created_at timestamptz not null default now()
);

comment on table public.academy_videos is
  'Members-only lesson video -> Cloudflare Stream uid. Service role only (academy-video-url).';

alter table public.academy_videos enable row level security;
revoke all on table public.academy_videos from anon, authenticated;
