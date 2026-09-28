// Batch 1C routes (docs/scope/DesignSystem-Rollout.md section 3): the course
// reader (course home, module, lesson, module quiz, final exam and the
// capstone redirect, all under one pattern) and the course handbook frame.
export default [
  '/dashboard/apps/:slug/course/*',
  '/dashboard/admin/handbook',
];
