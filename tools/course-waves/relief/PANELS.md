# FC5 PANELS TASK. Three panels over one teaching lab.

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

## Shape

One lab, `src/components/course/panels/relief/reliefLab.js`, exporting the
values three panels render. **Every exported value is pinned by vitest** in
`reliefLab.test.js` against the figures the digest prints, so a panel and a
lesson can never disagree.

Register the three ids in `src/content/courses/panelRegistry.js`.

## THE FOUR RULES THE FOUNDATION ALREADY BUILT AROUND YOU

1. **READ THE WAVE INPUTS THROUGH THE RESOLVER.** `waveInput('relief', 'digest.txt')`
   from `tools/course-waves/waveInputs.mjs`. **No test file may contain a
   `/root/` path**, and `panelCapstoneGuard.test.js` asserts that of every
   source beside it. The committed copy under `tools/course-waves/relief` is the
   default read, which is what makes the suite run on a CI runner at all; point
   it at the live wave directory mid-build with `NEXTGEN_WAVE_DIR_RELIEF`.
2. **NEVER GUARD A READ WITH `existsSync` AND A RETURN, OR WITH `skipIf`.**
   Absence is a FAILURE that names the file. Thirty such fail-open skips were
   removed across sixteen waves, four of them whole agreement-with-the-digest
   blocks that had never run. `waveMirror.test.js` shows the accepted shape for
   the one case that genuinely has two jobs: it byte-compares against a live
   wave directory where one exists, ASSERTS there is none where there is not,
   and prints which of the two it did.
3. **IMPORT THE TOLERANCE, NEVER RESTATE IT.** `gradedTolerance.js` is the only
   place a tolerance is made. A hand-kept mirror inside a lab is the three-copy
   trap two sibling waves shipped.
4. **THE GUARD HOLDS FOUR SHAPES.** `gradedAnswerGuard.js` already exists and
   the guard suite already runs over every source in the panel directory. When
   you add the lab and the three panels you MUST extend `EXPECTED_SOURCES` in
   `panelCapstoneGuard.test.js` in the same commit, because a listing that does
   not match the declared inventory fails. That is deliberate: it is what stops
   a rename quietly emptying the gate.

## The three

**`fc-sizing-explorer`** (Associate throughout, and Expert m05 for the audit)

- the four API 520 routes side by side, so a learner can see that each has
  exactly one computed correction and one typed one;
- C and the critical pressure ratio against the isentropic exponent, digest
  section 4;
- **F2 across the back pressure with the BRANCH drawn**, section 4. The teaching
  point of the tier is that the required area is FLAT across the first five rows
  in critical flow, so draw that flatness rather than leaving it in a table;
- Kv against the Reynolds number, section 6, **with the clamp shown and the
  three fit terms separated**, because the only honest way to say one term has a
  band is to show what each is worth where;
- KN across the whole published range, section 8, **with both crossings of unity
  marked and the step at the threshold visible**, because between the threshold
  and the crossing the correction makes the valve BIGGER and a smooth curve
  would hide it;
- the API 526 ladder with the selection boundaries, section 10. Draw the ratio
  of each row to the one below: the ladder is not geometric and that is the
  point.

**`fc-fire-drum-explorer`** (Professional throughout, and Expert m05 for the
input that changes nothing)

- the wetted area against level in BOTH orientations, section 12, **with half
  full marked**, because that is the one level with an analytic answer and the
  one case anybody checks;
- the duty and the load, sections 14 and 15, with the environment credit and the
  drainage answer as the two things that move the duty;
- **the segment area fraction against the depth fraction, section 18, with the
  one point where the two agree marked.** That single crossing is the whole
  Professional lesson about what a stated fraction is a fraction OF;
- settling against droplet size, section 17, with the low-Reynolds cap drawn;
- the drum length and the L over D against diameter, section 18, **with the note
  band drawn at BOTH edges**, and the holdup sweep drawn as well, because the
  required length is NOT monotonic in the holdup and a reader who sees the turn
  understands two effects moving against each other.

**`fc-blowdown-explorer`** (Expert m01 to m04)

- the march, section 21, **with the closed form drawn over it**. That overlay is
  the point of the panel: the closed-form integral of the same balance is what
  makes a hidden coefficient visible, and the ratio is printed in the digest;
- the step refinement study, section 23, with the times at seven halvings, so a
  learner can see the answer stop moving;
- time against orifice, section 22, **with the customary fifteen minutes marked
  and the orifice that meets it read off the curve** rather than asserted;
- **the final temperature shown FLAT across the orifice sweep.** The end state
  is fixed by the pressure ratio and the exponent, and the orifice only decides
  how long it takes to get there. That flat line is a harder teaching point than
  the time curve beside it;
- the point source asked both ways, section 25. **Do not draw a setback against
  the four customary allowable intensities.** That table is held for literature
  and the merged `separation` course teaches and GRADES the setback. Draw the
  intensity against distance and the inverse against a STATED allowable, and say
  which course owns the setback.

## Owner copy rule, and no clocks

No em dashes, no en dashes, no contrastives, in any panel string. No panel reads
`new Date`, `Date.now` or `Math.random`, and no panel imports an engine
directly: every number a panel shows comes through the lab, which comes through
the vendored engine. The guard suite asserts all of that.

## Hand back

The three panel ids registered; every lab export with the digest line it is
pinned against; the guard suite's count after you extended the inventory; and
the result of `npx vitest run src/components/course/panels` **with the wave
directory renamed aside**, because that is the only check that the suite will
run on a CI runner at all.
