# QI Quantitative Interpretation: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** This is
the last course of the Geoscience module (path order 80), slug `qi`, after
Basin & Charge. It is an APP COURSE: the Suite app is QI Studio, in the
Suite's Geoscience module, with Rock Physics Studio beside it; both run the
same engine files. Every practical also runs in the course's own four explorer
panels over the vendored engines, so a learner without a Suite seat can work
every exercise. Prerequisite: Well Data Management (Associate). Recommended
before: Rock Physics and Seismic Interpretation (stated on the course page;
enforced by nothing).

## THE ONE RULE ABOUT NUMBERS

**Every figure you write is quoted from `digest.txt`.** The digest is the only
teaching truth for this course. These look like truth and are not:

| file | what it is |
| --- | --- |
| the kit's `10-qi/ekene-qi-truth.md` and its CSVs | PROVENANCE. The kit generator's truth rows; the logs are tool measurements of them, so the pack's figures land near these and never on them. |
| the QI with Petrolord videos and their storyboards | PROVENANCE. Measured in QI Studio on the full survey with the app's own selections. Never quote a video figure. |
| the engines' oracles, goldens and source comments | PROVENANCE. |
| the capstone case files | NEVER. They hold graded answers' inputs. Do not open them. |

## THE COURSE STATEMENT, IN ONE SENTENCE

A quantitative interpretation asks two questions, is the data good enough and
can the seismic see the fluid, and answers them with stated engines on stated
data: feasibility at Associate, from the tie to AVO on the seismic at
Professional, and inversion, properties and the decision at Expert.

## AN APP COURSE, SAID PLAINLY

Name QI Studio where the practicals come up, once, as the tool a Suite user
has (Rock Physics Studio for the elastic logs, fluids and substitution). Every
exercise runs in the course's own panel: the feasibility explorer at
Associate, the prestack explorer at Professional, the inversion and prospect
explorers at Expert. Never write that a learner must open the Suite, and never
describe a Suite screen the digest does not describe.

## WHO OWNS WHAT

| tier | question | modules | digest sections |
| --- | --- | --- | --- |
| Associate | FEASIBILITY | what a QI study asks, the data inventory, seismic QC, elastic logs at the wells, will the fluid show, the feasibility verdict | 1 to 21 and 60 |
| Professional | FROM THE TIE TO AVO ON THE SEISMIC | from feasibility to the tie, the tie and the field wavelet, gathers and their QC, angles from velocity, AVO volumes, AVO at the wells | 1 to 6 and 22 to 41 and 60 |
| Expert | INVERSION, PROPERTIES AND THE DECISION | the forward model, post-stack inversion, simultaneous inversion, properties from impedance, prospects, the report and the limits | 1 to 6 and 42 to 60 |

`structure.py` is the authority on the module and lesson keys and it
self-checks. Section 60 is the vocabulary, and every tier owns it.

## THE DATASET

The Ekene field, SYNTHETIC, the teaching pack cut from release ekene-demo-v3
of the Ekene demonstration kit (digest section 3): Ekene-1 to Ekene-4 logs
over the Ekene Sand and the shale above it with the kit's PHIT, VSH and SW,
every well's headers, full-stack traces spread over the survey and along the
inline through Ekene-1, an RMS amplitude slice, angle-stack traces at the
wells, gathers next to Ekene-1 and the RMS velocity table. Depth is in FEET
everywhere a learner reads (the kit writes metres; the digest converts).

## THE SELECTIONS AND CHOICES THE COURSE STATES

Every result depends on stated choices, and every lesson that uses one names
it: the net sand cut-off, the oil leg, the water leg and the cap rock (digest
section 3), the taper and the time window of a spectrum, the maximum lag of
signal to noise, the periods searched for a footprint, the form and the level
of the shear fit, the conditions and the fluids, the block length of the wet
trend, and the line a distance is read from. Teach them as inputs a study must
name, never as facts about the field.

## WHAT IS GRADED, AND WHAT NEVER IS

Each tier's capstone grades six figures, every one a return value of an engine
on a HELD-OUT SYNTHETIC CASE supplied as a case file (never Ekene: the
members-only videos speak the Ekene answers aloud). The case names, inputs and
values are NOT in the digest and must never enter a lesson, a bank or a panel;
`gate_capstone_leak.mjs` sweeps all of them. The tolerance of every field is
made in exactly one place, `gradedTolerance.js`. **Never type a tolerance.**
The capstone brief lesson (m06 l04 of each tier) describes what the capstone
asks in words, with no case figure.

## VIDEOS

Eighteen lessons carry a `{{video:<id>}}` line the scaffold wrote. Keep it
exactly where it is. Videos are optional enrichment: a lesson must read
complete without its video, and no lesson may depend on, quote or describe a
figure from a video. Module A (Associate m01 l01, m02 l02, m03 l01) is public
on YouTube; the rest are members-only and show a coming-soon card until the
host is chosen. Do not write about the card.

## THE REFUSALS

Digest section 5 tables the Associate refusals, each with the input that
produced it and the engine's message verbatim. Quote a refusal in a blockquote
as the engine's own words. Two gassmann.js messages carry a punctuation mark
the course does not print: name them by what they refuse and never quote them.
A result with NaN fields is a result and no refusal.

## SCOPE SEAMS

Batzle-Wang, Gassmann, Greenberg-Castagna, Shuey, the classes, exact Zoeppritz
and wedge tuning belong to the Rock Physics course; the synthetic seismogram,
the bulk shift and single-well tuning to the Seismic Interpretation course;
Bayesian classification as a subject to the Facies course; Q10, Q50 and Q90
and Monte Carlo as a subject to the uncertainty course; gridding and closure
mapping to the Mapping course. Recap each in at most one lesson, link back in
one sentence ("the Rock Physics course"), and never re-derive it.

## THIS COURSE TEACHES NO REPAIR HISTORY

A sentence about former engine or app behaviour anywhere in this course is a
defect.

## THE COPY RULE

British English. No em dashes, no en dashes, no "X, not Y" contrastive, and
none of its cousins ("rather than", ", never", "instead of", "and not", "and
never") anywhere a learner reads, headings and titles included. Never cite the
digest or its section numbers in learner text: say "the course". "AI" in this
course means acoustic impedance and is always written next to its definition
the first time a lesson uses it; never use AI for artificial intelligence.

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. Every lesson carries
between its own minimum and 560 prose words: 420 at 12 minutes, 460 at 13, 500
at 14. 132 questions a tier: 15 per module bank plus a 42 question exam.
