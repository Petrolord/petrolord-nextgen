# H2 Occupational Hygiene: the panel author's task

Read `BRIEF.md` first. Every number here is quoted from `digest.txt`, the only
teaching truth for this course. `FINDINGS-exposure.md` and the engine source
comments are PROVENANCE.

## WHAT IS SHIPPED IN THE FOUNDATION

Under `src/components/course/panels/hygiene/` in the NextGen repository:

* `gradedTolerance.js`: **the only place a grading tolerance is made**,
  `max(stated, half a unit in the last place the course prints that class)`.
  `fields.json` and `precision.json` are written out of it by `make_fields.mjs`.
* `gradedAnswerGuard.js`: every string shape a graded answer can reach a learner
  as, four of them.
* `hygieneLab.js`: the one teaching lab. Every reader calls the vendored engine
  on the TEACHING records, which are a verbatim copy of `h2_fields.mjs`.
* `hygieneKit.jsx`: formatting atoms and the transcription-only banner.
* three panels, each with four views:

| panel id | component | views |
| --- | --- | --- |
| `hy-noise-dosimeter` | `NoiseDosimeterExplorer.jsx` | criteria, tables, lex, shift |
| `hy-protection-chemicals` | `ProtectionChemicalsExplorer.jsx` | protectors, averages, mixture, reduction |
| `hy-heat-stress` | `HeatStressExplorer.jsx` | wbgt, limits, evidence, errata |

* `src/pages/apps/HygieneLearningPage.jsx` at `/dashboard/apps/hygiene`.

The gates: `hygieneLab.test.js` (every finite number every reader returns must be
printed in its declared digest sections; the 18 graded fields recomputed through
the vendored engine; leak, evidence, vocabulary and refusal gates),
`panelCapstoneGuard.test.js`, `waveMirror.test.js` and `hygienePanels.test.jsx`
(all twelve views render numbers). None names a path under `/root`.

## WHAT EACH PANEL MUST SAY

* **Noise dosimeter.** One record under three criteria side by side, so no one
  reads as the answer: 27.748183, 72.054478 and 265.610944 percent on the OBEN
  day. The threshold is inclusive. The printed coefficients, and that Table A-1
  cannot tell 16.61 from the exact one. LEX,8h and the week. The ten-hour noise
  dose of 57.350093 percent beside the rescaled 45.880074, labelled as not a
  defined quantity.
* **Protection and chemicals.** Four protector methods, the two OSHA Technical
  Manual answers of 89.000000 and 80.000000 dBA, and the NIOSH derating and dual
  protection marked oracle only. Divided by 8 against the hours covered. The
  mixture that exceeds with every term under one. The weekly reduction factor
  marked oracle only.
* **Heat stress.** Every RAL, REL, margin and weighted WBGT carries the
  TRANSCRIPTION ONLY banner in the same view. The worked example that disagrees.
  The evidence class of every door. The five errata.

## THE RULES FOR EVERY PANEL

1. No graded capstone answer in any of four shapes, and no capstone site name.
2. No path under `/root`, no clock, no random number.
3. The copy rule, and every engine message surfaced verbatim from the lab.
4. The vocabulary: "noise dose", "decibel exchange rate", "heat stress".
5. **Extend `EXPECTED_SOURCES`** in `panelCapstoneGuard.test.js` and
   `READER_SECTIONS` in `hygieneLab.test.js` in the same commit that adds a file
   or a reader.
