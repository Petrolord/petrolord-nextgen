# FC5 KEY TRUTH TASK. The capstones and their answer files.

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

## What a capstone is here

Three capstones, one a tier, **six engine-derived graded fields each**, eighteen
in the wave. A graded field is a RETURN VALUE OF THE ENGINE. It is never
arithmetic performed in the generator, never a figure typed by hand, and never a
value that reads a held-for-literature item.

The generator is `fc5_capstone.mjs`. **It is written, it runs, and all eighteen
fields are cut.** It imports `fc5_fields_capstone.mjs` and the one tolerance
derivation in the repository, and nothing else from this wave. Nothing in
`fc5_dump.mjs` imports either of them, which is what keeps the two roads apart.

## The plants

| tier | plant | what it is |
|---|---|---|
| Associate | KOLO CREEK | a gas plant with three relief cases on one train |
| Professional | OGBAINBIRI | a flow station: a vessel in a pool fire, a knockout tower, and the flare knockout drum |
| Expert | GBARAN | a compression station: one vessel depressuring, and the flare it discharges to |

## EVERY HELD ITEM IS NEUTRALISED BY CONSTRUCTION, AND EVERY CLEARANCE IS AN ASSERTION

Twenty-eight of them run in the generator. Do not change a condition without
re-running it and reading the assertion block, because each one is load bearing:

- **The bellows chart is cleared TWICE.** The critical case is a CONVENTIONAL
  valve whose back-pressure ratio is asserted under 0.3 with the engine's own
  warning asserted null. The subcritical case is cleared BY CONSTRUCTION,
  because the engine ignores Kb above the critical ratio, and the generator
  PROVES it by running the same call at a different Kb and asserting the area is
  identical.
- **The Kv fit is cleared by an INVISCID liquid case**, with Kv asserted exactly
  1.0 and the returned Reynolds number asserted null, and a viscous call run
  beside it to prove the branch is not dead.
- **The Napier boundaries are cleared** by a relieving pressure asserted below
  half the threshold, with KN asserted exactly 1.0 and no warning.
- **The orifice table and the pool fire constants are cleared** by asserting
  over all eighteen keys that none names a letter, a margin, a duty or a load.
- **The sphere-drag correlation is cleared** because the drum STATES its design
  dropout velocity and its rate in actual cubic feet a second, with the absence
  of a droplet, a viscosity and a density from the condition set asserted.
- **The 25 ft limit is cleared** because a horizontal vessel's wetted height
  cannot exceed its diameter and both vessels are asserted short enough.
- **The choked assumption is cleared** because the end pressure is asserted more
  than three times the engine's own choked floor with its warning asserted null,
  and refining the time step by ten is asserted to move the answer by less than
  a thousandth of a second.
- **The radiation table is cleared** because the allowable is a STATED project
  design basis and the generator asserts it is none of the four customary values.

## A TOLERANCE IS DERIVED IN ONE PLACE AND NOWHERE ELSE

`src/components/course/panels/relief/gradedTolerance.js` in the NextGen
repository holds the quantity class and the stated tolerance of each field and
derives the rest. `fc5_capstone.mjs` imports it. `make_fields.mjs` writes
`fields.json` and `precision.json` out of the same derivation. **The teaching
lab must IMPORT it rather than restate a number from it.**

The rule is `max(stated, half a unit in the last place the course PRINTS that
class)`, **MAX AND NEVER MIN**, so it only ever loosens and nothing that graded
correct before can grade wrong now. A tolerance no printed precision can satisfy
is not a hard field, it is a broken one.

Five of the eighteen were RAISED by the printed-precision floor and none is
trivially wide. `make_fields.mjs --bare-stated-tolerances` is the negative
control: it skips the widening, leaves `PRINTED_DECIMALS` alone, and exits 1
naming all five fields with the figure a learner could quote and the error that
quoting it carries. Mutating the declared precision instead would move the floor
and the tolerance together and could not fail.

## A STABILITY CLAIM IS MEASURED, NEVER REASONED ABOUT

`gate_movement.mjs` re-measures all eighteen against the PRE-REPAIR engine at
82ec6d4 and fails if the declared stable set is not EXACTLY what held. **Ten
held bit for bit, five moved and three are new ground**, and every one that
moved has a named cause that the gate checks is not a dead row.
`--claim-everything-stable` is the negative control.

## THE DISCRIMINATE SWEEP

`discriminate.mjs` aims 104 plausible wrong methods at the eighteen routes, at
least three a field, and reports **zero WEAK routes** with a closest miss of
1.436e+4 tolerances. Three restatements are declared EQUIVALENT with a reason
and asserted NOT to move their answer, which is a second check rather than an
exemption: one is the liquid route working on a pressure DIFFERENCE so that
reading both pressures as absolute cannot change it, and two are the blowdown's
final temperature being independent of the compressibility and readable off the
pressures or the masses. `--slack-tolerances` is the negative control and
reports eighteen weak routes. **Run it after any change to a condition.**

## THE LEAK GATE RUNS IN FOUR DIRECTIONS

`gate_capstone_leak.py` checks 38 conditions against the digest and the
generator, 18 graded values against the digest at three renderings each, **11
recorded ENGINE CALLS against all 49 published golden rows by input set**, and
all 18 graded values against the graded answer key of the merged `separation`
course, because that course grades a flare setback off the same API 521 point
source this engine carries a second copy of.

The third direction exists because a sibling repair wave took a capstone's exact
conditions for a published golden row and the golden then handed back a graded
answer. The same reach was available here, because the realistic relief
conditions are the ones this wave already uses. It caught three digit
collisions on the first run, all coincidental and all retuned away: a vessel
length that matched the liquid leading constant, a tower length that matched a
section number, and a discharge coefficient that matched the pool fire exponent.

**The guard on the panels holds four shapes of every graded answer** rather than one.
`gradedAnswerGuard.js` derives the full float, twelve figures, nine figures and
the printed precision, 68 searchable renderings. A sibling guard held the
nine-figure shape only, and the SAME NUMBER at full double precision went
straight past it, which is the likelier leak because a bare template
substitution prints the full float.

## Write the go-live assertions from the engine's OUTPUT

Not from the intuition the prompt was written with. A previous wave's first
clean go-live run refused because the assertion encoded an expectation the
course itself disproved. Run the generator, read the number, assert the number.

## Hand back

The eighteen fields with their values, classes and tolerances; the clearance
assertion block re-run with its count and its failures; the movement gate's ten
held and five moved and three new; the discriminate result with its closest
miss; and the leak gate's four counts.
