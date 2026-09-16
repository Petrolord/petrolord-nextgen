# RECUT: EC2 Fiscal Regime Design (fiscal), the lessons and the question banks

Engines: main 709172f (PRs #183 to #194).

Every OLD question string below was compared against a dump of the LIVE production rows taken on 2026-09-16 (academy_quiz_questions, 396 rows per course); every OLD lesson string was compared against the working tree. A manifest row is only written after that comparison. Every question row was finally re-derived field by field from the live production row and the regenerated bank, so each OLD is production text and each NEW is exactly what the bank now holds; the writers' reasons are carried across by row and field.

| tier | lessons changed | lesson edits | questions changed | question field edits |
| --- | --- | --- | --- | --- |
| beginner | 13 | 22 | 17 | 22 |
| intermediate | 17 | 53 | 48 | 170 |
| advanced | 24 | 112 | 70 | 232 |
| **total** | **54** | **187** | **135** | **424** |

Each question row is verified in BOTH directions: its OLD against the live production rows, its NEW against the regenerated bank. Of 424 field edits, **424 OLD matched production** (0 did not) and **424 NEW matched the bank** (0 did not). Live rows: 2026-09-16, academy_quiz_questions, 396 rows per course, re-read at the end of the recut with zero drift. Set equality: the rows the manifest claims are exactly the rows that differ from production, per tier.

The full OLD and NEW text of every change is in the JSON beside this file. The row-update migrations are written from that JSON, not from this summary.

## Question edits by field

- `explanation`: 96
- `options`: 244
- `prompt`: 84

