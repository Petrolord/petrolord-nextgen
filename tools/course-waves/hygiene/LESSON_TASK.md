# H2 Occupational Hygiene: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task file
is quoted from it. `FINDINGS-exposure.md` and the engine's source comments are
PROVENANCE. Quote a figure at the precision the digest prints it: sound levels,
doses, durations, concentrations, indices, temperatures and watts to SIX
decimals; measured constants to TWELVE; counts whole.

Run `python3 /root/dc-wavekit/digestpromise.py /root/hse-wip-hygiene` BEFORE you
write, and read `digest.txt` section by section against the table beneath each
sentence. The generated rows are gated; the sentences between them are the least
gated text in a wave.

## WHAT A LESSON IS

`structure.py` is the authority on the 18 module keys, the 78 lesson keys, the
titles, the `est_minutes` and the panel tags. Do not add, rename or reorder a
lesson: change `structure.py` and re-run it.

Each lesson carries between its own minimum and 560 PROSE WORDS: 420 at 12
minutes, 460 at 13, 500 at 14. Prose words is what `lengths.py` counts: front
matter, table rows (a line starting with a pipe) and panel lines are excluded,
and HEADINGS ARE COUNTED. Keep the H1 `scaffold.py` writes and the panel line
where `structure.py` puts one.

## THE HEAT DECISION IN EVERY EXPERT LESSON

Every RAL, REL, margin and WBGT-from-thermometers figure you write carries its
status in the same sentence: **the NIOSH 2016-106 section 8.1 equation, checked
for transcription only.** Never write one as a verified value and never write
one as a graded one. Expert m03 l03 is the lesson that explains why, from digest
sections 2, 18 and 23. The worked example that disagrees is 27.800000 C printed
against 27.458939 C by the equation at 348.900000 W.

## THE JUDGEMENT CALLS, TAUGHT BY NAME

Digest section 1 tables J1 to J10 with a measurement each. A lesson that meets
one says which, in the engine's terms: the threshold is inclusive (J2); above the
table tops the engine warns and still integrates (J3); the chemical TWA always
divides by 8 (J6); a mixture index of exactly 1 passes (J7); the Brief and Scala
factor only lowers a limit (J8); the weekly LEX always divides by 5 (J10).

## SIX SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

1. **One record, three criteria, section 7.** The OBEN day is 27.748183 percent
   of the OSHA PEL, 72.054478 percent against the action level, and 265.610944
   percent of the NIOSH noise REL.
2. **The threshold, section 6.** The PEL setup integrates 2 of the 6 OBEN
   periods; the action level and the NIOSH noise REL integrate 5.
3. **The printed coefficient, section 5.** The exact NIOSH coefficient fails 49
   of the 83 rows of Table 1-2; the exact OSHA coefficient fails 0 of the 150 rows
   of Table A-1, so for OSHA it is the Appendix A text that fixes 16.61.
4. **The normaliser, section 11.** The longer day is 87.207845 dBA as LEX,8h and
   86.026852 dBA averaged over its own hours.
5. **Unsampled time, section 14.** The partial record is 30.125000 ppm as an
   8-hour TWA and 35.703704 ppm over its own hours.
6. **The long shift, section 20.** The ten-hour action-level noise dose is
   57.350093 percent; rescaled to eight hours it would read 45.880074 percent.

## HOW TO WRITE A REFUSAL

Digest section 10 tables every refusal in the golden, run through the engine,
with the field it names. **Quote the engine's own message in a blockquote.** None
of this engine's messages breaches the copy rule. Never write a contrastive of
your own.

## THE VOCABULARY COLLISIONS AND THE SCOPE SEAMS

Binding. Digest sections 24 and 25. "noise dose", "decibel exchange rate",
"heat stress", qualified "exposure", "NIOSH noise REL" and "NIOSH heat REL".
Cite the owning course for flare radiation, BTEX emissions, incident rates and
the risk matrix, and stop.

## NO HISTORY

This engine has no repair history. "Used to", "no longer", "before the fix" and
their family are defects in every lesson. Expert m04 teaches ERRATA IN THE
SOURCES, which are current.

## THE COPY RULE, AND THE EXERCISE

No em dashes, no en dashes, no contrastive of the form "X" comma "not Y", headings included. Every
lesson ends with an `## Exercise` that asks the learner to DO something with a
number the lesson printed. No licensed limit is ever quoted.

## WHAT GATES YOUR WORK

`gate_copy_rule.py`; the kit's `leakage.mjs`, `numsweep.mjs` (harvest
`truth-hygiene.json` first) and `litsweep.py`; `gate_capstone_leak.py`; and
`gate_claims.mjs` for every number in every brief. Read the counts as well as the
exit code.
