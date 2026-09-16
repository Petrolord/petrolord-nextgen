# FC4 LESSON TASK. Read every line before you write a word.

## REPAIR HISTORY: FRAMED IS CURRICULUM, UNFRAMED IS A DEFECT.

**You may teach what this engine used to do. You must say that is what you
are doing.** An academy-wide sweep settled this: six live Economics courses
teach repair history deliberately, one of them in a module directory named
for it and a lesson titled "What was repaired and what was not", with 29
graded items on the subject. FC1's own sweep found 27 history-shaped
sentences and every one was framed and none was a defect. **Every real defect
this class has produced was UNFRAMED.**

So the rule is not "no history". The rule is:

- **A sentence about former behaviour that reads as current behaviour is a
  defect.** That is the whole of it.
- **Framing comes from the HEADING above a passage, or the line immediately
  before it.** An inline "HISTORY." prefix inside a sentence is not framing,
  and the gate does not read it as framing either. Put it in the heading, the
  way `Expert m05 l01` does.
- **Never repeat history you did not know was history.** That is what the
  three sources below are about.

## THE THREE PLACES HISTORY REACHES YOU, AND ONLY ONE IS FRAMED FOR YOU

The engine this course teaches has just been through a 49-finding repair.
That means three files near you are FULL of sentences describing what it used
to do, and **none of them is teaching truth**:

1. **`digest.txt` SECTION 20, which IS framed for you.** It is the one
   section of the digest whose subject is what this engine used to do, it
   says so in its title and its first line, and it is the only place you
   should be drawing history from. Four items, each a general lesson that
   happens to have an example here.
2. **`RECON.md` and `FINDINGS.md`.** Both open with a banner saying they are
   provenance. They describe the engine AS FOUND, in far more detail than
   Section 20, and **their numbers are stale**: fourteen of the eighteen
   graded capstone fields moved when the repair was vendored. Read them to
   understand the work. Do not take a figure from either.
3. **THE ENGINE SOURCE COMMENTS.** `engines/facilities/gasProcessing.js` is
   dense with them: "The 379.49 this file used to quote", "It used to carry
   two", "This function divided by one until FC4-0", "the march used to
   evaluate mu at each interval MIDPOINT PRESSURE but at the temperature it
   started with". **NOTHING GATES A WRITER READING ENGINE COMMENTS.** A
   sibling wave shipped three repair-history sentences into committed lesson
   text and the worst of the three came from an engine source comment.
   **Engine source comments are provenance.** Digest Section 20 counts them
   for you, by reading the source, and there are dozens across the vendored
   engines. A sibling course carries 12 history instances in its lesson text,
   5 of them H2 headings, traced to a changelog block in one engine file. The danger is
   not that the subject is forbidden. It is that **a sentence lifted out of a
   comment arrives with no frame around it**, and you cannot frame something
   you did not know was history. Before using any sentence you found in the
   source, establish whether it describes what the engine does now.
4. **Anything you remember from a briefing.** Including this one.

**`digest.txt` is the only teaching truth**, and Section 20 is the only part
of it that is history. It is swept by the kit's `digestprose.mjs` with this
wave's own claims, cleared phrases and 33 engine pins:

    node /root/dc-wavekit/digestprose.mjs \
      /root/fc-wip-gasprocessing/digest.txt \
      --rules /root/fc-wip-gasprocessing --lessons <your content dir>

**RUN IT OVER YOUR LESSONS, not only over the digest.** It sweeps lesson
headings as well as lesson prose, because one sibling leak was a lesson H2:
"One sentence used to answer several questions".

**Expect to TRIAGE rather than to get a clean binary.** The gate carries two
families. High-confidence keywords FAIL when unframed. Plain past-tense
narration WARNS, because no word list catches the worst instance this
programme has seen, which was "the object looked healthy, the coefficient was
right" with no trigger word in it. Read every warning against what the engine
does today, and either frame it or rewrite it.

This wave's own digest raises three warnings and all three are inside Section
20. They are re-read by hand on every rebuild rather than cleared, because
clearing them would make the one place carrying history the one place nobody
checks.

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

## SECTION 14 IS BUILT. ALL 78 LESSONS ARE WRITABLE.

It was withheld while the Joule-Thomson chain was under repair, and it
printed nothing rather than printing behind a banner, which is why no lesson
ever took a wrong coefficient. FC4-0 is merged and vendored, the digest is
rebuilt against it, and Section 14 now carries the coefficient, the
derivative behind it, the march, the step-count convergence, the cold
separator and the seam to Flow Assurance.

**What that means for you: nothing is held.** Expert m01, m02 and m03 have
their source.

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
| Expert | m01, m02, m03 | 14 |
| Expert | m04 | 13 |
| Expert | m05 | 1, 2, 15, 16, 17 |
| Expert | m06 | 16, 17 |

A lesson does not reach forward into a later tier's sections.

## Two behaviour changes the digest now teaches, and both are LIVE

Both are reachable by typing into a box in the shipped Suite studio, so both
belong in a lesson rather than in a footnote.

1. **A gas above 140 degF is REFUSED BY NAME in the water-content path.** The
   vapour-pressure fit holds to 60 degC and the guard now enforces exactly
   that. The refusal carries the band in both units and the temperature it
   was handed, converted. Digest Section 4 reads it from both sides of both
   edges, and separates it from the two limits that only WARN: the narrower
   band the coefficients were published over, and the pressure above which
   ideal mixing stops being the right method at all. Three limits, three
   different behaviours, and Associate m02 l05 is where they belong.

2. **The lean glycol strength drives the loop water balance.** A gallon of
   lean solution already carries water before it meets the gas, and the
   engine reports both that and the strength the rich glycol returns at.
   **It does NOT set the outlet spec**, and the engine says so on every
   answer through `outletSpecBasis`: the dew point a lean strength can
   deliver is a chart this module does not carry. Digest Section 6 teaches
   both halves, including the circulation ratio low enough that the rich
   glycol comes back below the strength the module accepts as a lean one.
   Teach the seam rather than implying the engine derives one from the other.

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
