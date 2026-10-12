import { supabase } from '@/lib/customSupabaseClient';

// Asks the academy-video-url edge function for a short-lived Cloudflare Stream
// player URL for a members-only video. The function checks the learner's
// enrolment and signs the token with a key that lives only in its secrets, so
// the browser never holds a reusable link. Called only when
// VIDEO_HOST.provider is set; any failure (function not deployed, video not
// uploaded, no enrolment) leaves the coming-soon card in place.
export async function fetchMemberVideoUrl(videoId) {
  const { data, error } = await supabase.functions.invoke('academy-video-url', {
    body: { video_id: videoId },
  });
  if (error) throw error;
  if (!data?.url) throw new Error(data?.error || 'no_url');
  return data.url;
}
