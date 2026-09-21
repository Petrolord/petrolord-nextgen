# H2 Occupational Hygiene: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, the only teaching truth for this course. `FINDINGS-exposure.md`
and the engine source comments are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four options
each, one correct, and an explanation that says WHY the wrong ones are wrong.

## THE ANSWER-LENGTH DEFECT

A shipped bank was passable without reading the question, because the
second-longest option scored about four answers in five. **Balance the option
lengths**, and never edit the correct option to satisfy the length gate.

## WHAT MAY NOT BE AN ANSWER

* **No RAL, REL, heat margin or heat exceedance verdict** as an answer or a
  figure to compute, and no WBGT built from thermometer readings. A question MAY
  ask the learner to recognise that these are transcription only, or why the
  document's worked example (27.800000 C) and the equation (27.458939 C) differ.
* no NIOSH protector derating by type, no dual-protection figure and no Brief and
  Scala weekly factor as an answer to compute.
* no verdict word as the thing being tested where the number is the point.
* **no ACGIH value of any kind.**

## WHAT MAKES A GOOD H2 QUESTION

The engine's own distinctions, all in the digest:

1. **one record against three criteria**: 27.748183, 72.054478 and 265.610944
   percent on the OBEN day.
2. **the threshold decides what counts**: 2 of 6 periods integrated under the
   PEL, 5 of 6 under the action level.
3. **the energy average against the arithmetic mean**: 85.461288 dBA against
   84.860000 for the five-day week.
4. **the eight-hour normaliser**: 87.207845 dBA against 86.026852 over the day's
   own hours.
5. **two protector estimates for two questions**: 89.000000 and 80.000000 dBA on
   the OSHA Technical Manual example.
6. **divided by 8 against divided by the hours covered**: 30.125000 against
   35.703704 ppm.
7. **every term under one and the index over one**: largest term 0.385000,
   index 1.059500.
8. **the long shift is not rescaled**: 57.350093 percent, never 45.880074.
9. **evidence classes**: published and reproduced, oracle only, transcription
   only (digest section 2).

## VOCABULARY

Digest section 24 is binding on every prompt, option and explanation: "noise
dose", never bare "dose"; qualified "exposure"; "decibel exchange rate"; "heat
stress"; "NIOSH noise REL" and "NIOSH heat REL".

## THE CAPSTONE CONDITIONS: YOU DO NOT RESTATE THEM

The three capstone sites live in `h2_capstone.mjs` and nothing about them is in
`digest.txt`: not a site name, a level, a duration, a concentration, a limit, a
shift length, a readout or a rate. `gate_capstone_leak.py` fails a digest or a
bank that carries any of them. Teach the METHOD with the digest's own worked
cases.

## NO LEAKS AND NO FORWARD REACHES

No question may carry a graded capstone answer at any precision, and no question
may reach into a later tier's digest sections. Every bank gets a KEY TRUTH second
reader before it is migrated (kit README section 10).

## THE COPY RULE

No em dashes, no en dashes, no contrastive of the form "X" comma "not Y". Quote an engine message
verbatim and say it is the engine's own words.
