# RECUT: EC2 Fiscal Regime Design (fiscal), the lessons and the question banks

Engines: main 709172f (PRs #183 to #194).

Every OLD question string below was compared against a dump of the LIVE production rows taken on 2026-09-16 (academy_quiz_questions, 396 rows per course); every OLD lesson string was compared against the working tree. A manifest row is only written after that comparison.

| tier | lessons changed | lesson edits | questions changed | question field edits |
| --- | --- | --- | --- | --- |
| beginner | 13 | 22 | 17 | 22 |
| intermediate | 17 | 53 | 48 | 170 |
| advanced | 24 | 112 | 70 | 229 |
| **total** | **54** | **187** | **135** | **421** |

Every OLD question string was compared against the live production rows: **421 of 421 matched**, 0 did not.

The full OLD and NEW text of every change is in the JSON beside this file. The row-update migrations are written from that JSON, not from this summary.

## Question edits by field

- `explanation`: 96
- `options`: 241
- `prompt`: 84

