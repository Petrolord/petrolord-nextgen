# SC5 Contract & Supplier Management: panels

**This course has no calculator panels.** It is a practice course (Suite
`docs/scope/NextGen-Catalog-Regroup-PLAN.md` section 3): there is no engine to
reach, so `structure.py` declares no panel id and every manifest lesson
carries `panels: []`, `has_exercise: true` and `exercise: 'written-scenario'`.

The practicals are WRITTEN SCENARIO WORK, set in the lesson itself: each
lesson's `## Exercise` gives a short task on one of the synthetic Ekene
contracts (the pack's section 4) and a `### A reading` that sets out the
answer the cited sources support (`LESSON_TASK.md`).

What the course page shows in the place of panels
(`src/pages/apps/PracticeCourseLearningPage.jsx`): the practice course notice
(the badge, the date the sources were checked and the review date), each
tier's syllabus from its manifest, a card describing the written scenario
work, and each tier's certificate card, issued from the tier's final exam.
`src/components/course/practiceCourse.test.jsx` pins all of it.
