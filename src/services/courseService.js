import { supabase } from '@/lib/customSupabaseClient';

/**
 * Read-only remnant of the legacy LMS course service. The authoring
 * methods went with the CourseManager module (2026-07-15); the legacy
 * course rows are deleted, so these return empty results and exist
 * only to keep the remaining legacy learner pages compiling.
 */
export const courseService = {
  async getCourseRequirements(courseId) {
    const { data, error } = await supabase
      .from('course_passing_requirements')
      .select('*')
      .eq('course_id', courseId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getCourseStructure(courseId) {
    const { data, error } = await supabase
      .from('course_modules')
      .select(`
        *,
        lessons:course_lessons(*)
      `)
      .eq('course_id', courseId)
      .order('module_order', { ascending: true });

    if (error) throw error;

    return data.map(m => ({
      ...m,
      lessons: (m.lessons || []).sort((a, b) => a.lesson_order - b.lesson_order)
    }));
  }
};
