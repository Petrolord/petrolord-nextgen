# FC5 BANK TASK. 396 questions.

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
3. **THE ENGINE SOURCE COMMENTS.** `engines/facilities/relief.js` is 619 lines
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

You are writing the question banks for **FC5 `relief`**, path_order 43.

## THIS FILE IS TRUE AS OF THE FOUNDATION HAND-OFF, AND SAYS WHAT IS BUILT

A sibling wave's BANK_TASK.md went stale mid-wave and misled a writer about
what existed. So, measured rather than remembered, at the moment this file was
written:

- **BUILT:** the vendored engine at 3bac13cd with its suite 52 of 52; the
  digest, 982 lines and 29 sections, all of it, nothing withheld; `fields.json`
  with all eighteen graded fields; `precision.json`; the scaffold, all 78
  lesson files with their H1 and panel line in place and a placeholder body;
  and every gate named in `wave.json`.
- **NOT BUILT YET:** no lesson body, no question, no capstone answer
  file seeded, no teaching lab, no panel, no migration. There is no `banks/`
  directory, which is why `sweep_literals.py` REFUSES with exit 2 today rather
  than reporting a clean pass over zero files.
- **HELD:** nothing. `structure.py`'s `HELD` list names seven lessons that were
  held until the engine repair landed. It has landed, so none is held now.

If any of that has changed by the time you read this, say so in your hand-back
and correct this file in the same commit.

**MEASURED AGAIN 2026-09-17, by the Associate bank writer.** Four of those
statements have moved. All 78 lesson bodies, the relief teaching lab and the
three panels ARE written and committed (worktree /root/wt-fc5-nextgen at
a6a5d5bf). The digest is 986 lines and 29 sections rather than 982, rebuilt on
nine defects. `banks/` now exists and `sweep_literals.py` returns a real count
rather than exit 2: 527 literals over the seven Associate banks, 0 unresolved.
The seven names in `structure.py`'s HELD list are still not held. Nothing else
in the list above has changed: no migration is written and no capstone answer
file is seeded, which is why `promptleak.py` has nothing to sweep.

## Shape

- **132 questions a tier**: 15 per module bank across six modules, which is 90,
  plus a 42-question tier exam. 396 in the wave.
- Four options each, one correct, an explanation on every one.
- Module banks draw only on their own module's lessons. The exam draws on the
  whole tier and is written LAST, after all six modules of that tier exist,
  because an exam is a sample of what the tier actually taught.

## THE ANSWER-LENGTH DEFECT. Read this before you write question one.

A shipped NextGen bank was passable WITHOUT READING: the **second-longest
option** scored about 80 percent across the banks measured, because a correct
answer tends to be written carefully and a distractor tends to be written
quickly. Twenty-five live courses still carry it.

Mechanically, for every bank:

- **The correct option must not be the longest more often than chance, and must
  not be the second-longest more often than chance.** With four options and 15
  questions each length rank should land roughly three to four times.
- Distractors get the same care as the answer. An obvious throwaway is a free
  mark.
- Do not pad a correct option with a justifying clause. The justification goes
  in the explanation, where it belongs and where it is not counted.
- **Report the length-rank histogram for every bank in your hand-back.** A bank
  without that histogram is not finished.

## Numbers

**Every numeric literal in every prompt, option and explanation must resolve
against `digest.txt`.** Two sweeps, and you run both:

1. `node /root/dc-wavekit/numsweep.mjs /root/fc-wip-relief --banks`, which
   checks literals with seven or more SIGNIFICANT figures and strips trailing
   zeros, so on a digest rendered to six decimals it cannot see most of the
   round figures;
2. `python3 /root/fc-wip-relief/sweep_literals.py /root/fc-wip-relief fc5`, the
   FULL-literal sweep with no significant-figure floor, which reads **prompts,
   options AND explanations**. The version this was ported from swept options
   only, which is half a bank, and the fix is verified in the file's own
   self-test.

Run both. Report both counts, and the number of literals each EXAMINED. "The
gate went green" and "the gate examined my files" are two separate claims and
both need a number beside them.

## Question quality, and what this course is actually about

- A question answerable by eliminating three absurdities has tested nothing.
  Every distractor should be something a learner who half understood the lesson
  would pick.
- **Prefer questions that turn on WHICH NUMBER ANSWERS WHICH QUESTION**, because
  that is this course's thesis. A required area and an orifice area answer
  different questions. A duty and a relief load answer different questions. A
  depth fraction and an area fraction answer different questions and agree at
  exactly one value.
- **Prefer questions that turn on whether the engine COMPUTED a figure or TYPED
  it.** Each API 520 route has exactly one computed correction and exactly one
  typed one, and a learner who can say which is which has the tier.
- The nine held items are excellent question material AS LIMITS: what the
  validation oracle can and cannot check, what a published case can and cannot
  discriminate, which two expressions this package shares with its oracle on
  purpose. They are not question material as answers.
- The four LIVE behaviours in `LESSON_TASK.md` are the best hard questions in
  the wave: the flat area across five back pressures, the ignored Kb, the
  Napier step, and the non-monotonic drum length.

## Do not leak the capstone

No question may state, imply or let a reader derive a capstone condition or a
graded value. The capstone plants are KOLO CREEK, OGBAINBIRI and GBARAN and
nothing about any of them is in the digest, which is how it stays. If you find
yourself wanting a number that is not in the digest, that is the mechanism
working. Run `node /root/dc-wavekit/leakage.mjs /root/fc-wip-relief --banks`
and report its counts.

## Owner copy rule

No em dashes and no "X, not Y" contrastives, in prompts, options or
explanations. The two engine sentences that carry one are quoted verbatim inside
backticks and nowhere else.

## Hand back

Per bank: the question count, the length-rank histogram of the correct option,
both sweep counts with the number of literals examined, the number of
unresolved literals, the leakage counts, and any question you are unsure of.

**MEASURED AGAIN 2026-09-17, by the FC5 repair pass that ran before the three
key-truth audits.** The digest is now 1020 lines and 29 sections, rebuilt on two
further repairs: digest section 18 said the depth fraction and the area fraction
agree at half depth and nowhere else while its own table printed an agreeing
empty row, and digest sections 12 and 16 printed figures that three committed
lessons then RANKED by eye and got wrong. Both rankings are now computed and
printed by the generator. The 396 bank questions ARE written and committed. No
migration is written and no capstone answer file is seeded, so `promptleak.py`
still has nothing to sweep and is not a pass on this wave.
