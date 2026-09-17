# FC5 LESSON TASK. 78 lessons. Read every line before you write a word.

## REPAIR HISTORY: FRAMED IS CURRICULUM, UNFRAMED IS A DEFECT.

**You may teach what this engine used to do. You must say that is what you are
doing.** An academy-wide sweep settled this: six live Economics courses teach
repair history deliberately, one of them in a module directory named for it,
and FC1's own sweep found 27 history-shaped sentences every one of which was
framed and none of which was a defect. **Every real defect this class has
produced was UNFRAMED.**

So the rule is not "no history". The rule is:

- **A sentence about former behaviour that reads as current behaviour is a
  defect.** That is the whole of it.
- **Framing comes from the HEADING above a passage, or the line immediately
  before it.** An inline "HISTORY." prefix inside a sentence is not framing and
  the gate does not read it as one. Put it in the heading, the way
  `advanced/m06-what-was-repaired-and-what-was-not` does.
- **Never repeat history you did not know was history.**

## THE FOUR PLACES HISTORY REACHES YOU, AND ONLY ONE IS FRAMED FOR YOU

This engine has just been through a 43-finding repair, 26 of them reachable by
typing into a box in the shipped studio. Four files near you are full of
sentences describing what it used to do and **none of them is teaching truth**:

1. **`digest.txt` SECTION 29, which IS framed for you.** It is the one section
   whose subject is what this engine used to do, it says so in its own title
   and its first line, nothing follows it, and it is the only place you should
   draw history from. Four items, each a general lesson that happens to have an
   example here.
2. **`RECON.md` and `FINDINGS.md`.** Both open with a banner saying they are
   provenance. They describe the engine AS FOUND, and **their numbers are
   stale**: five of the eighteen graded capstone fields moved when the repair
   was vendored and three more are new ground. Read them to understand the
   work. Do not take a figure from either.
3. **THE ENGINE SOURCE COMMENTS.** `engines/facilities/relief.js` is 620 lines
   long and carries 12 comment lines with the repair marker and 16 written in
   a past tense about former behaviour, which is roughly one line in 39.
   **NOTHING GATES A WRITER READING ENGINE COMMENTS.** A sibling wave shipped
   three repair-history sentences into committed lesson text and the worst came
   from an engine source comment. A sentence lifted out of a comment arrives
   with NO FRAME, and you cannot frame what you did not know was history.
   Digest section 29 counts them for you by reading the source.
4. **`packages/engines/tools/validation/facilities/FINDINGS-relief.md`**, the
   repair's own record, vendored beside the oracle. Same class as RECON.md.

**`digest.txt` is the only teaching truth.** Sweep your own work with the kit's
prose gate, over your files and not only over the digest:

    node /root/dc-wavekit/digestprose.mjs \
      /root/fc-wip-relief/digest.txt \
      --rules /root/fc-wip-relief --lessons <your content dir>

The digest's own run is exit 0 with 8 warnings, and **all eight sit inside
Section 29**. They are re-read by hand on every rebuild rather than cleared,
because clearing them would make the one place carrying history the one place
nobody checks. Expect to TRIAGE rather than get a clean binary: plain
past-tense narration WARNS, because no word list catches the worst instance
this programme has seen.

You are writing lessons for **FC5 `relief`, "Relief & Flare Systems"**, the
fifth course in the NextGen Facilities module, path_order 43. Read `BRIEF.md`
first: it carries the thesis, the tier split, the fourteen results the course is
built on, the nine held items and the digest section map, and **every figure in
it is quoted from the digest**.

## The one rule everything else serves

**`digest.txt` IS YOUR ONLY SOURCE OF NUMBERS.** Every figure in a lesson must
appear in `/root/fc-wip-relief/digest.txt` at the rendering the digest prints
it at. You do not run the engine. You do not compute anything. You do not
round. If a number you want is not in the digest, the lesson does not get that
number, and you say so in your hand-back so the digest can be extended rather
than the lesson invented.

**A RECON-REPORT NUMBER IS NOT DIGEST TRUTH.** Two figures in a sibling wave's
brief came from its recon report and both were wrong; the writer was right to
refuse them. If `BRIEF.md` and `digest.txt` ever disagree, the digest wins and
you report it.

## Shape

- 6 modules a tier, 26 lessons a tier, 78 in the wave. `structure.py` is the
  authority for every key, title, order, estimated minute and panel tag, and it
  checks itself: run `python3 structure.py`.
- **The word band is per lesson.** A twelve-minute lesson clears 420 prose
  words, a thirteen-minute one 460, a fourteen-minute one 500, and the ceiling
  is 560 for all of them. Both numbers are in each lesson's manifest entry as
  `min_prose_words` and `max_prose_words`.
- The measure is **PROSE WORDS**, counted the way `lengths.py` counts them:
  front matter, markdown table rows and `{{panel:...}}` lines are all excluded
  and **HEADINGS ARE COUNTED**. A raw `wc -w` runs materially higher and is NOT
  the measure. Say which measure before quoting a number at anyone. Headings in
  this wave carry 22 to 50 words each: counting them the other way aims you 22
  to 50 words light on every lesson, which is the trap every sibling wave's
  `lengths.py` docstring already records. Run `python3 lengths.py` and read what
  it prints rather than counting by hand.
- H1 is the lesson title from `structure.py`, exactly. Panels are tagged where
  `structure.py` says and nowhere else. Every lesson ends with `## Exercise`.
- The scaffold has already written all 78 files with a placeholder body and the
  right H1 and panel line. Replace the body. Do not touch the H1 or the panel
  line. `scaffold.py` never overwrites a written lesson, so it is safe to rerun.

## THE DIGEST RULE, which has cost this programme more than any other

**A sentence may NAME a figure the digest computes. It may NOT characterise the
RELATIONSHIP between two figures unless the digest ITSELF computes and prints
that relationship.**

"About a tenth of" and "these agree better" have both shipped in this programme
and both were false, one of them backwards. A ratio nobody computed reads
exactly like one somebody did. So if you want to write "twice", find the ratio
printed in the digest. This digest prints a ratio wherever it is entitled to
one: the ratio of the viscous area to the inviscid one, the ratio of the
marched time to the closed form, the ratio of each orifice to the one below it,
the ratio of the two wetted-area readings, and the relative difference between
the engine and the published case on every golden row. **Sweep your own lesson
for every two-figure comparison before you hand it back and treat each one as
guilty until it points at a printed comparison.**

## WHERE THE DIGEST PRINTS A TABLE AND NO RATIO

Teach the DIRECTION the table shows, then tell the learner not to form the
ratio, and say why. Where the digest prints a table and no ratio it means the
two figures are not in a relationship this engine computes, and a learner who
divides them produces a number nothing stands behind. Saying that out loud
turns the constraint into curriculum and teaches the more useful habit, which
is asking whether a quantity is entitled to be compared before comparing it.

## Which digest section owns which module

| tier | module | digest sections |
|---|---|---|
| Associate | m01 | 1, 2, 3 |
| Associate | m02 | 4, 5 |
| Associate | m03 | 6, 7 |
| Associate | m04 | 8, 9 |
| Associate | m05 | 10 |
| Associate | m06 | 11 |
| Professional | m01 | 1, 2, 12 |
| Professional | m02 | 12, 13 |
| Professional | m03 | 14, 15 |
| Professional | m04 | 15, 16 |
| Professional | m05 | 17, 18, 19 |
| Professional | m06 | 20 |
| Expert | m01 | 21 |
| Expert | m02 | 22 |
| Expert | m03 | 23, 24 |
| Expert | m04 | 25 |
| Expert | m05 | 26, 27, 28 |
| Expert | m06 | 29 |

A lesson does not reach forward into a later tier's sections.

## Four LIVE behaviours the digest teaches, and each belongs in a lesson

Every one is reachable by typing into a box in the shipped Suite studio, so
each belongs in the body of a lesson rather than in a footnote.

1. **In critical flow the required area does not move with the back pressure at
   all.** Section 4's sweep is the evidence: five identical rows. A learner who
   has not seen that believes the outlet pressure always matters.
2. **A typed Kb is IGNORED in subcritical flow and the engine says so.** Two
   rows identical to twelve decimals, with the engine's own warning on the
   second. Section 4 and section 27. Quote the warning inside backticks as the
   engine's own words.
3. **The Napier correction STEPS at its threshold and makes the valve BIGGER
   for eighty psi above it.** Section 8 prints the step across two millionths
   of a psi and both crossings of unity.
4. **The knockout drum's required length is NOT monotonic in the holdup.**
   Section 18 prints the whole sweep. Two effects move against each other and
   the column turns. Say where it turns by reading the column.

## Four naming collisions and five scope seams

Both lists are in `BRIEF.md` and in the header of `structure.py`. They were
measured against the live catalogue rather than guessed. The one that will bite hardest
is the flare setback: `separation` is merged, teaches it, and GRADES it. Expert
m04 l03 exists to hand it back by name. Do not compute a setback anywhere in
this course.

## Owner copy rule, and it applies to headings

No em dashes. No en dashes. No "X, not Y" contrastive anywhere a learner reads,
including the H1. `structure.py`'s titles already obey it and
`gate_copy_rule.py` sweeps the digest and every lesson body and manifest title.
**TWO SENTENCES IN THIS COURSE ARE ALLOWED TO BREAK IT** and only because they
are the engine's own words quoted verbatim: its drainage refusal and its
subcritical Kb warning. Quote them inside backticks as the engine's own text.
Never write a contrastive of your own.

## Hand back

Per tier: the lessons written, each one's prose word count against its own
minimum and the 560 ceiling, every figure you wanted and could not find in the
digest, every two-figure comparison you wrote and the digest line it points at,
and anything in the digest you believe is wrong.
