# FC4 BANK TASK. 396 questions, and the one defect that got past this before.

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

You are writing the question banks for **FC4 `gasprocessing`**, path_order 42.

## Shape

- **132 questions a tier**: 15 per module bank across six modules (90) plus a
  42-question tier exam. 396 in the wave.
- Four options each, one correct, an explanation on every one.
- Module banks draw only on their own module's lessons. The exam draws on the
  whole tier.

## THE ANSWER-LENGTH DEFECT. Read this before you write question one.

A shipped NextGen bank was passable WITHOUT READING: the **second-longest
option** scored about 80 percent across the banks measured, because a correct
answer tends to be written carefully and a distractor tends to be written
quickly. Twenty-five live courses still carry it.

So, mechanically, for every bank:

- **The correct option must not be the longest option more often than chance,
  and must not be the second-longest more often than chance.** Measure it.
  With four options and 15 questions, each length rank should land roughly
  three to four times.
- Distractors get the same care as the answer. A distractor that is obviously
  a throwaway is a free mark.
- Do not pad a correct option with a justifying clause. Put the justification
  in the explanation, which is where it belongs and where it cannot be
  counted.
- Report the length-rank histogram for every bank in your hand-back. A bank
  without that histogram is not finished.

## Numbers

**Every numeric literal in every prompt, option and explanation must resolve
against `digest.txt`.** There are two sweeps and you run both:

1. the wave's `numsweep`, which SKIPS round literals whose significant
   figures fall below seven once trailing zeros are stripped, which on a
   digest rendered to six decimals is most of the round figures in it;
2. a **FULL-LITERAL substring sweep against `digest.txt` with no
   significant-figure floor at all**, matching on float value so that 880
   resolves against the digest's `880.000000`.

Run both. Report both counts. **"The gate went green" and "the gate examined
my files" are two separate claims and both need a number beside them.**

## SECTION 14 IS WITHHELD AND THREE EXPERT MODULE BANKS ARE HELD WITH IT

Expert m01, m02 and m03 have no lessons, because the Joule-Thomson chain is
under repair and digest Section 14 prints nothing. **Do not write those three
module banks, and do not write any exam question that touches the
Joule-Thomson coefficient, the marched let-down, the cold separator
temperature or the water the cold gas can hold.** That is 45 module-bank
questions and however many exam questions would have drawn on them.

The Expert exam is written LAST, after those three modules exist.

## Do not leak the capstone

No question may state, imply or let a reader derive a capstone condition or a
graded value. The capstone streams are IKOT ABASI, OTUMARA and ESCRAVOS, and
nothing about any of them is in the digest, which is how it stays. If you
find yourself wanting a number that is not in the digest, that is the
mechanism working.

## WHERE THE DIGEST PRINTS A TABLE AND NO RATIO

The Associate writer found the right move here and it is now the house
pattern for this wave: **teach the DIRECTION the table shows, then tell the
learner not to form the ratio, and say why.**

The digest prints a ratio whenever it is entitled to one. Where it prints a
table and no ratio, that is not an oversight: it means the two figures are
not in a relationship this engine computes, and a learner who divides them
produces a number nothing stands behind. Saying so out loud turns the digest
rule into part of the curriculum rather than an invisible constraint on the
writer, and it teaches the more useful habit, which is asking whether a
quantity is entitled to be compared before comparing it.

## Question quality

- A question whose answer can be reached by eliminating three absurdities has
  not tested anything. Every distractor should be something a learner who
  half-understood the lesson would actually pick.
- Prefer questions that turn on WHICH number answers WHICH question, because
  that is this course's thesis. "The circulation is 6.4 gpm" and "the duty
  per gallon is 1815.85 Btu" answer different questions and one of them does
  not know the rate exists.
- The three scope seams are fair game as questions about BOUNDARIES: what
  this engine hands to Flow Assurance, what Separation already owns, what
  the published cases can and cannot catch. They are not fair game as
  questions about the other course's content.

## Owner copy rule

No em dashes and no "X, not Y" contrastives, in prompts, options or
explanations.

## Hand back

Per bank: the question count, the length-rank histogram of the correct
option, both sweep counts with the number of literals examined, the number of
unresolved literals, and any question you are unsure of.
