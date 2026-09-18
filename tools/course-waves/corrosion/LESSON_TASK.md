# FC9 Corrosion & Integrity: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task file
is quoted from it. The wave's `RECON.md` and `FINDINGS.md`, the engine's own
source comments and the repair record vendored beside the oracle are all
PROVENANCE. A sibling course's Expert brief carried two recon figures and both
were wrong.

Quote a figure at the precision the digest prints it at. The digest's own header
declares the precisions: partial pressures in bar and psia, allowances in mm,
rates in mm/yr, lives in years, percentages, percentage points and dimensionless
ratios to SIX decimals; Reynolds numbers to FOUR; measured constants and ratios of
them to TWELVE; counts are whole numbers.

## WHAT A LESSON IS

`structure.py` is the authority on the 18 module keys, the 78 lesson keys, the
titles, the `est_minutes` and the panel tags. It self-checks and reports zero
problems. Do not add, rename or reorder a lesson: change `structure.py` and re-run
it.

Each lesson carries between its own minimum and 560 PROSE WORDS. The minimum is
derived from `est_minutes`: 420 at 12 minutes, 460 at 13, 500 at 14, and the same
three numbers are written into every lesson's `min_prose_words` in the manifest.
PROSE WORDS IS WHAT `lengths.py` COUNTS, and this paragraph is written from the
code rather than from an intention: front matter, markdown TABLE ROWS (a line
starting with a pipe) and PANEL lines (a line starting with `{{panel`) are
excluded, and HEADINGS ARE COUNTED. This file and the scaffold text both used to
say headings were excluded, which the counter never did, and a writer who
believed either ran twenty to forty words light on every lesson. A raw word count
over the whole file is a third measure again and runs materially higher, so say
which measure before quoting a number at anyone.

A lesson keeps the H1 that `scaffold.py` wrote, which is the lesson title exactly,
and the panel line where `structure.py` says one goes. Replace the body.

## THE ELEVEN HELD ITEMS AND THE ONE WITHDRAWAL

Digest section 21 lists all twelve. **A lesson may name every one of them and must
present none of them as a validated number.** The sentence to reach for is the
engine's own: the number is not sourced in this repository. Never invent a
citation, never quote a clause of a standard, never reconstruct one from memory,
and never write "typically" or "industry practice" where a source belongs.

**The withdrawal is taught twice and it is not history either time.** Beginner m01
l02 teaches it as the first thing to know about this app. Advanced m06 l01 teaches
it again as a general lesson about invented authority. Digest section 2's own
second line says the section is about behaviour the engine SHIPS, which is a
refusal to answer. A lesson that lets it read as something the engine might get
back is a defect.

## THE ONE HISTORY MODULE

Advanced m06 is the only module whose subject is what this engine used to do, and
its only source is digest SECTION 25, which says so in its own title and its first
line and which nothing follows. The frame lives in the module directory name and
in the lesson heading, which is where the gate and the reader both look.

**Everywhere else in these 78 lessons a sentence about former behaviour is a
defect.** That includes a sentence that begins "the engine used to", "before the
repair", "this was wrong" or "it no longer". The prose gate sweeps for exactly
that family and fails it inside a teaching section.

## SIX SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

Each of these is a real teaching point with its number in the digest. Use them as
the shape of a claim, and check every figure against the file.

1. **The shipped case, section 19.** The rate is 0.754524 mm/yr, which is
   29.705656 mpy, the effective corrosion inhibition is 85.500000 percent, the
   wall shear is 14.408065 Pa and the remaining life is 4.207953 yr.
2. **The corrosion inhibitor arithmetic, section 9.** A 95 percent corrosion
   inhibitor at 80 percent availability delivers 76.000000 percent effective
   protection, 19.000000 percentage points short, and the metal loss is 4.800000
   times the datasheet number.
3. **The shear coupling, section 11 and section 19.** At 60 ft/s the wall shear is
   362.474888 Pa against a measured 100.000000 Pa threshold, the credit is
   removed, and the rate is 13.080024 mm/yr against a credited 1.896603 mm/yr, a
   ratio of 6.896552, with the life falling from 4.207953 yr to 0.242737 yr.
4. **The film onset moves, section 6.** Across the swept fugacities it moves by
   96.443771 degrees Celsius. At the shipped fugacity of 1.344240 bar the computed
   onset is 80.984504 C.
5. **pH is now monotonic, section 7.** From 4.724817 mm/yr at pH 4.000000 to
   0.014941 mm/yr at pH 9.000000, a factor of 316.227766, and below the reference
   the engine refuses.
6. **The sulphide regime withholds, section 13 and section 19.** At 1 mol percent
   H2S the ratio is 0.333333333333, the regime is sulphide, and the rate is
   unchanged at 0.754524 mm/yr while the category and the life are WITHHELD.

## HOW TO WRITE A REFUSAL

The engine refuses in about thirty places and digest section 18 tables all of
them. **Quote the engine's own message in a blockquote.** A paraphrase teaches a
message the learner will never see. Five of those messages carry an "X, not Y"
contrastive that breaches the owner copy rule; quoting them verbatim inside a
blockquote is correct and the copy gate exempts exactly those five by exact
string. **Never write a contrastive of your own.**

And teach the distinction the engine draws: **a typed zero is not a blank.** A
typed zero CO2 mole fraction is a positive assertion of no CO2, so the engine
takes its no-CO2 branch and withholds the category and the life. A blank box is a
question it cannot answer, so it refuses.

## THE THREE VOCABULARY COLLISIONS

Binding. Digest section 22. Always "corrosion inhibitor", never bare "inhibitor".
Always "mechanical erosion" or "erosional wall loss", and always with the
statement that the engine has no erosional-velocity criterion. Always "this
module's friction factor" or "this module's Reynolds number", and always with the
statement that the line sizing course computes its own.

## THE SCOPE SEAMS

Digest section 23. Five quantities in this course's neighbourhood are owned by a
live course. **Name the owner, say what this module does differently, and stop.** A
lesson that re-derives an owned quantity teaches a second answer to a settled
question.

## THE COPY RULE, AND THE EXERCISE

No em dashes, no en dashes, no "X, not Y" contrastive. Headings included. Every
lesson ends with an `## Exercise` section that asks the learner to DO something
with a number the lesson printed, never to recall a number the lesson stated.

## WHAT GATES YOUR WORK

`gate_copy_rule.py` over every lesson body and manifest title; the kit's
`leakage.mjs` for graded answers and cross-tier reaches; the kit's `numsweep.mjs`
for literals that resolve against nothing; the kit's `litsweep.py` for the same
against the digest; and `gate_claims.mjs` for every number in every brief. Run
them before you hand off, and read the counts rather than the exit code.
