# Course content authoring guide

Deep course content is authored here, in the repo, as markdown. The
database never holds lesson prose; it holds only the course STRUCTURE
(module and lesson keys, mirrored into `academy_course_structures` by
each course's seed migration) plus everything gradeable (quiz banks,
capstone oracles), which must never reach the client bundle.

## Layout

```
src/content/courses/
  panelRegistry.js                  panel id -> lazy React component
  <app_slug>/
    course.json                     { "app_slug", "title" }
    <tier>/                         beginner | intermediate | advanced
      manifest.json                 the single source of structure metadata
      m01-<slug>/
        l01-<slug>.md
        l02-<slug>.md
        figures/<name>.png
    capstone/                       assessment datasets (not lesson prose)
```

## Manifest schema

```json
{
  "app_slug": "petrophysics",
  "tier": "beginner",
  "content_version": 1,
  "modules": [
    {
      "key": "m01-logging-foundations",
      "title": "Foundations of Well Logging",
      "order": 1,
      "lessons": [
        {
          "key": "l01-what-logs-measure",
          "title": "What logs measure",
          "order": 1,
          "est_minutes": 12,
          "panels": ["petro-typewell-viewer"],
          "has_exercise": true
        }
      ]
    }
  ]
}
```

## Hard rules

1. **Keys are permanent.** `module.key` and `lesson.key` are identity:
   learner progress rows in `academy_lesson_progress` reference them, and
   the seed migration copies them into `academy_course_structures`.
   Rename a title freely; NEVER rename a key after its seed migration has
   been applied. Adding new lessons/modules bumps `content_version` and
   ships a follow-up structure migration.
2. **No em dashes** in any lesson markdown or manifest (house copy rule;
   the content lint fails the test run on U+2014).
3. **No answers in content.** Quiz and exam questions live in the seed
   migrations (`academy_quiz_questions`, no client SELECT). Lesson
   markdown may pose exercises and give worked examples, but never the
   text of a graded question with its answer.
4. **Lesson body is pure markdown** (GFM + math). Display math with
   `$$ ... $$`, inline math with `$ ... $`. Figures are referenced
   relative to the lesson's module directory: `![caption](figures/x.png)`.
5. **Interactive panels** are embedded with a marker on its own line:

   ```
   {{panel:petro-vsh-explorer}}
   ```

   The id must exist in `panelRegistry.js`. In the admin handbook and
   any print rendering the marker degrades to a callout.
6. **Every lesson file must be listed in the manifest** and vice versa;
   the content lint enforces the pairing, key format
   (`m01-kebab-slug` / `l01-kebab-slug`), ordering, and `est_minutes`.

## Depth standard (owner-locked 2026-08-22)

Per course tier: 5-8 modules of 4-6 lessons each; 600-1200 words per
lesson with a worked example and an exercise; a module quiz bank of at
least 15 questions; a final exam bank of at least 40 questions. The
capstone remains the graded practical.
