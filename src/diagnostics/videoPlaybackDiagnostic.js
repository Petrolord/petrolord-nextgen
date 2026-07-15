import { supabase } from '@/lib/customSupabaseClient';

export const runVideoDiagnostic = async () => {
  console.log("==================================================");
  console.log("🔍 STARTING VIMEO VIDEO PLAYBACK DIAGNOSTIC");
  console.log("==================================================");
  
  const results = {
    totalLessons: 0,
    lessonsWithVideo: 0,
    samples: [],
    errors: []
  };

  try {
    console.log("[Diagnostic] Querying course_lessons table...");
    
    // Get total count
    const { count: totalCount, error: countError } = await supabase
      .from('course_lessons')
      .select('*', { count: 'exact', head: true });
      
    if (countError) throw countError;
    results.totalLessons = totalCount;
    console.log(`[Diagnostic] Total lessons in database: ${totalCount}`);

    // Get lessons with videos
    const { data: videoLessons, error: videoError } = await supabase
      .from('course_lessons')
      .select('id, title, lesson_type, video_url')
      .not('video_url', 'is', null)
      .neq('video_url', '');

    if (videoError) throw videoError;
    
    results.lessonsWithVideo = videoLessons?.length || 0;
    console.log(`[Diagnostic] Lessons with video_url: ${results.lessonsWithVideo}`);

    // Sample up to 10 records
    const samples = videoLessons?.slice(0, 10) || [];
    console.log(`[Diagnostic] Analyzing ${samples.length} sample records...`);

    samples.forEach((lesson, index) => {
      console.log(`\n--- Sample ${index + 1} ---`);
      console.log(`ID: ${lesson.id}`);
      console.log(`Title: ${lesson.title}`);
      console.log(`Type: ${lesson.lesson_type}`);
      console.log(`Raw video_url: "${lesson.video_url}"`);
      
      // Test parsing
      const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)(?:\/([a-zA-Z0-9]+))?/;
      const match = lesson.video_url?.match(vimeoRegex);
      
      const sampleResult = {
        id: lesson.id,
        title: lesson.title,
        type: lesson.lesson_type,
        rawUrl: lesson.video_url,
        isValidVimeo: false,
        extractedId: null,
        extractedHash: null,
        parseError: null
      };

      if (match && match[1]) {
        sampleResult.isValidVimeo = true;
        sampleResult.extractedId = match[1];
        sampleResult.extractedHash = match[2] || null;
        console.log(`✅ Valid Vimeo URL. ID: ${match[1]}${match[2] ? `, Hash: ${match[2]}` : ''}`);
      } else {
        sampleResult.parseError = "Regex match failed. Not a recognized Vimeo format.";
        console.log(`❌ Invalid/Unrecognized Vimeo URL format.`);
      }
      
      results.samples.push(sampleResult);
    });

  } catch (err) {
    console.error("[Diagnostic] Database query failed:", err);
    results.errors.push(err.message);
  }

  console.log("==================================================");
  console.log("🏁 DIAGNOSTIC COMPLETE");
  console.log("==================================================");
  
  return results;
};