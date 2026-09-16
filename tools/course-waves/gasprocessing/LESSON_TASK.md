# FC4 LESSON TASK. Read every line before you write a word.

You are writing lessons for **FC4 `gasprocessing`, "Gas Processing"**, the
fourth course in the NextGen Facilities module, path_order 42.

## The one rule everything else serves

**`digest.txt` IS YOUR ONLY SOURCE OF NUMBERS.** Every figure in a lesson
must appear in `/root/fc-wip-gasprocessing/digest.txt`, at the rendering the
digest prints it at. You do not run the engine. You do not compute anything.
You do not round. If a number you want is not in the digest, the lesson does
not get that number, and you say so in your hand-back so the digest can be
extended rather than the lesson invented.

**Do NOT read `RECON.md` or `FINDINGS.md` for content.** They describe the
engine AS FOUND before FC4-0 repaired it. That is true of the WORK and is not
teaching truth. A number from either of those files in a lesson is a defect.

## SECTION 14 IS WITHHELD AND FOURTEEN LESSONS ARE HELD WITH IT

The Joule-Thomson chain was found wrong and is under repair. Digest Section
14 prints **nothing**, deliberately, so there is no provisional figure for
anyone to learn. **Do not write Expert m01, m02 or m03.** That is fourteen of
the seventy-eight lessons. The other sixty-four have their sources today and
are what you are here for.

If you have been told FC4-0 has landed, check first: the digest header line
naming Section 14 as withheld must be gone and Section 14 must have content.
If it does not, the repair has not been carried into the digest yet.

## Shape

- 6 modules a tier, 26 lessons a tier, 78 a wave. `structure.py` is the
  authority for every key, title, order, estimated minute and panel tag.
- **420 to 560 PROSE WORDS**, counted the way `lengths.py` counts them: front
  matter, markdown table rows, headings and `{{panel:...}}` lines are all
  excluded. A raw `wc -w` runs materially higher and is NOT the measure.
- H1 is the lesson title from `structure.py`, exactly.
- Panels are tagged where `structure.py` says and nowhere else.
- Every lesson ends with `## Exercise`, which asks the learner to record
  figures the digest carries and then say something about the relationship
  between them.

## Owner copy rule, and it applies to headings

**No em dashes. No en dashes. No "X, not Y" contrastive anywhere a learner
reads**, including the H1. Write "A is B" and then "B is not C" as two
sentences, or recast. `structure.py`'s titles already obey this.

## Which digest section owns which module

| tier | module | digest sections |
|---|---|---|
| Associate | m01 | 1, 2 |
| Associate | m02 | 3, 4 |
| Associate | m03 | 5, 6 |
| Associate | m04 | 7 |
| Associate | m05 | 5, 6, 7, 8 |
| Associate | m06 | 18 |
| Professional | m01 | 9 |
| Professional | m02 | 9 |
| Professional | m03 | 10 |
| Professional | m04 | 11 |
| Professional | m05 | 12 |
| Professional | m06 | 19 |
| Expert | m01, m02, m03 | **14, WITHHELD. DO NOT WRITE.** |
| Expert | m04 | 13 |
| Expert | m05 | 1, 2, 15, 16, 17 |
| Expert | m06 | 16, 17 |

A lesson does not reach forward into a later tier's sections.

## Three scope seams you must respect

These were checked against all 47 live course slugs. Teaching any of them
again is a defect even though the material is correct.

1. **Souders-Brown, the K value and the settling velocity belong to
   `separation` (FC1).** Professional m05 teaches the CONTACTOR's duty, the
   gas density the correlation gives at contactor pressure, and the liquid
   the engine assumes. It cites `separation` for the equation and does not
   derive it. Digest Section 12 opens by saying exactly this.
2. **The Joule-Thomson coefficient and mu times delta P belong to
   `flowassurance` (PD6) advanced m01.** When Expert m01 is unheld it starts
   from the plant, and from the fact that this is the only module in the
   package that COMPUTES the quantity flowassurance asks a caller to type.
3. **Hydrates belong to `flowassurance`**, which refuses to compute a hydrate
   boundary of its own. Dehydration is the OTHER answer to the same question.
   Hand the margin back rather than competing for it.

And one disambiguation: **"dew point" already means the saturation pressure
of a reservoir fluid** in `fluid` advanced m02. The first lesson in this
course that uses the phrase separates the water dew point, the hydrocarbon
dew point and the PVT dew point before using any of them.

## The digest rule, which has cost this programme more than any other

**A sentence may name a figure the digest computes. It may NOT characterise
the RELATIONSHIP between two figures unless the digest ITSELF computes and
prints that relationship.**

"About a tenth of" and "roughly a quarter of a psi" and "these agree better"
have all shipped in this programme and all three were false, one of them
backwards. A ratio nobody computed reads exactly like one somebody did.

So: if you want to write "twice", find the ratio printed in the digest. If it
is not printed, either write the two figures and let the reader divide, or
ask for the digest to compute it. **Sweep your own lesson for every two-figure
comparison before you hand it back, and treat each one as guilty until it
points at a printed comparison.** The digest's own first draft contained two
false characterisations and its claim gate caught both; yours will contain
some too.

## What the course is about

**Thesis:** gas conditioning is three separate balances over one stream, and
the discipline is knowing which of the numbers in front of you the engine
COMPUTED, which one you CHOSE, and which one it simply kept to itself.

**Associate. WATER, AND WHAT IT COSTS TO TAKE OUT.** The only chain in the
engine that runs end to end in closed form. Also where the difference between
an intensive answer and an extensive one is sharpest: the water content knows
nothing about the rate, and the circulation is nothing but the rate applied
to it.

**Professional. STAGES, SOLVENTS AND WHAT A COLUMN COSTS.** A contactor read
as a staged device has a ceiling no amount of steel buys past. The amine half
answers the same shape of question by a completely different route.

**Expert. THE COLD END, THE OVERHEAD, AND WHERE THE METHOD STOPS.** The two
things the rest of the platform hands to this engine and nobody else, and
then an unusually rich audit.

## Hand back

Per tier: the lessons written, the word count of each against the band, every
figure you wanted and could not find in the digest, every two-figure
comparison you wrote and the digest line it points at, and anything in the
digest you believe is wrong.
