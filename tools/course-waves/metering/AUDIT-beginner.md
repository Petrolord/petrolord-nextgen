# FC8 Associate tier, key-truth audit

Read in full on 2026-09-18: all 26 lessons under
`src/content/courses/metering/beginner/` and all 132 questions in the seven
banks under `tools/course-banks/metering/beginner/`, against `digest.txt` at
1277 lines, md5 `03fb67866328c1f3e0fdf7f6884c48c4`, verified before anything
else was read. (The Professional audit later rebuilt the digest to 1278 lines
for one false sentence in Section 20; nothing this tier cites moved.) Where a judgement needed more than the digest, the engine was
read at `packages/engines/engines/facilities/metering.js` in the worktree, and
the digest generator `fc8_dump.mjs` was read for what it actually called.

## Defects found and repaired

### Lessons

1. **m01 l03, exercise.** "Run one and run two share no input other than the
   fluid model." False. `fc8_dump.mjs` gives run two its own bores, differential,
   static pressure, density, viscosity and specific heat ratio: the two runs share
   NO input, which is what digest line 103 says. Now says so.
2. **m02 l04, an invented reason.** "Refusing would leave a user with no number
   and no explanation of what kind of number was unavailable." Every refusal in
   this engine carries an explanation (digest Section 30 lists 28), so the reason
   is false on its face, and nothing in the digest gives the engine's reason for
   answering above the band. Now states the behaviour and says the course gives
   no reason for it. Same sentence in `fc8b_m02` Q9's explanation, repaired there.
3. **m02 l05, a claim the tier does not measure.** "each clause is measured
   somewhere in this tier" and the beta "feeds that budget ... through the
   coefficient itself". The budget is printed at the ABOH beta only (Section 13),
   so the uncertainty clause is never measured in this tier; and
   `orificeUncertainty` takes `cdUncertaintyPct = 0.5` as a typed default that
   does not depend on beta, so the coefficient route does not exist. The beta
   reaches the budget only through the two bore sensitivities (`2 + 2b4/(1-b4)`
   and `2b4/(1-b4)`). Now says two clauses are measured here and the third is the
   engine's statement read at one beta. Title "in the engine own words" fixed.
4. **m03 l03, an order the message does not give, and an invented mechanism.**
   The message names "a differential range or a static pressure"; it gives no
   order, and the lesson's own exercise asks the learner to choose which to check
   first. "Propagates into a density, then into a Reynolds number" is invented:
   the density is stated, and digest line 228 says only that the case would fall
   through to a message about the Reynolds number. Both repaired to the digest.
5. **m04 l01, a false comparative.** "A loss across a meter run is small next to
   the loss across a control valve." Never computed anywhere in the digest.
   Deleted.
6. **m04 l02, a false claim about the engine.** "The engine itself refuses to do
   the second calculation." `fc8_dump.mjs` lines 509 to 510 compute the second
   figure BY CALLING `permanentLoss` with `cd: 0.61`. The engine refuses to
   ASSUME a coefficient; handed one, it computes. Now says that.
7. **m04 l03.** "neither the orifice module nor the turbine module" where both
   are functions of one module, `metering.js`, which contradicts m01 l01's count
   of three modules. Now "function".
8. **m04 l05, an invented reason.** Two elbows out of plane "is the arrangement
   most likely to be built on a congested platform". The engine's own words (digest
   line 492) are "the worst common upstream arrangement". Now quotes those.
9. **m05 l02, a count.** Heading "The four columns" over a five-column table.
   Now "The five columns". The exercise's "the four numbers" is correct (four
   numeric columns) and stays.
10. **m05 l03, a claim its own lesson refutes.** "the two limits are reached at
    different readings". The same lesson, twenty lines on, quotes the digest that
    at 22.222222 in H2O "both limits are reached at once" (Section 12, flow 3 and
    differential 9). Rewritten: the limits are one rule and are reached together;
    what matters is the quantity, and the three-to-one figure applied to the
    differential would flag the ABOH row (differential turndown 3.134796, flow
    1.770536, warning silent, digest line 312). The same false explanation was
    in `fc8b_m05` Q8, repaired there.
11. **m05 l04, an uncomputed ranking.** "the likeliest of these cases to arrive in
    real life". Nothing ranks the two edges. Ranking removed, the example kept.
    Same sentence in `fc8b_m05` Q11's explanation, repaired there.
12. **m06 l01, a false mathematical claim.** "A contribution and a share of
    variance are two different rankings of the same six terms." Squaring cannot
    reorder non-negative numbers, and the table (digest lines 364 to 369) shows the
    same order in both columns. Now says the order is the same and what squaring
    changes is the share of the whole. **The same falsehood was the KEY of
    `fc8b_m06` Q5** ("Because squaring reorders the six terms") and the
    explanation of Q4. Both repaired.
13. **m06 l03, the wrong term.** When the discharge coefficient owns the variance
    the lesson recommended "a tighter bore measurement", which is the orifice bore
    term at a 3.311074 percent share, not the coefficient. Replaced by what narrows
    the coefficient's own uncertainty.
14. **m06 l04, a plural over one row.** "the clear column ... shows those rows"
    for the interval between 16.862007 and 15.000000 in H2O, which holds exactly
    one printed row, 16.000000. Now names it.

### Banks

15. **`fc8b_m02` Q9** explanation: defect 2's invented reason. Replaced.
16. **`fc8b_m05` Q8, two right answers and a false explanation.** Option "Both,
    because a result that passes one limit always passes the other" is TRUE: with
    limits of 3 and 9 and a differential turndown equal to the square of the flow
    turndown, passing one is passing the other. Replaced with a clearly false
    "both, each against the three-to-one figure". Explanation carried defect 10.
17. **`fc8b_m05` Q11** explanation: defect 11's ranking. Removed.
18. **`fc8b_m05` Q15, two right answers.** Option "a wider span carries a
    proportionally wider band at every point" is TRUE of the engine: percent of
    reading is accuracy times span over reading. Replaced with the false belief
    module five exists to correct, that a percentage does not depend on the range
    it is quoted on.
19. **`fc8b_m06` Q4** explanation and **Q5 KEY**: defect 12. The key now says the
    total is formed from the squares, so the share of that sum is what says where
    to spend. Q5's option "the share column is the one that sums to the total"
    was ambiguous (the shares sum to one hundred percent) and was replaced with a
    clearly false one.
20. **`fc8b_exam` Q6, two right answers.** Option "the pressure the differential
    is subtracted from to give the downstream pressure the flow equation uses" is
    TRUE: `expansibility` forms `tau = (p1 - dp) / p1`. Replaced with a false one
    the digest refutes (the inch of water factor is identical at a different static
    pressure, Section 3).
21. **`fc8b_exam` Q12** explanation: "The other three evaluate the correlation
    themselves." `orificeUncertainty` takes a beta and never evaluates or takes the
    coefficient. Now says which two do.

Every bank repair was made in the `.py` and re-emitted; bankkit's gates passed on
every emit. No answer key POSITION moved; one key's TEXT moved (item 19).

## Examined and cleared

- **m02 l03 "applied below a pipe bore of 2.800000" beside a row at 2.800000
  reading true.** The engine tests `D < 71.12` mm and 2.8 in converts to just
  under that in floating point, so the flag is true at the printed edge. The
  digest owns the sentence and the row; no question asks which side of the edge
  2.8 itself falls on. Left, and noted for the wave lead.
- **m04 l04 "fires above a meter factor of 1.010000"** beside a row at 1.010000
  reading "fires": the same floating-point edge (|1.01 - 1| exceeds 0.01 by one
  ulp). Both rows are printed by the digest; no question asks about the edge.
- **`fc8b_m02` Q6 option 4**, "the step is smaller than the span". True as
  arithmetic, but the question asks what the digest LICENSES, and the digest's
  own rule (lines 28 to 32) licenses a comparison only where a RELATION prints
  it. Kept: the key is the one RELATION line, and the course teaches that rule.
- **`fc8b_m05` Q2 option 4**, "roughly a factor of ten for every tenfold fall".
  True of the formula, but the question asks what the digest PRINTS at the top and
  bottom; the key is the printed RELATION. Kept on the same ground.
- **m01 l03, "published conversion factors differ in the fourth significant
  figure"**: general knowledge, carries no course figure, true in magnitude.
- **m05 l03 exercise** (differential turndown four): flow turndown two, silent;
  the table row at 40 in H2O confirms the direction.
- **The fabricated-history sweep.** Both corpora searched for "used to", "no
  longer", "was fixed", "survived", "before the repair", "repaired", and read. The
  only hits are verbatim engine strings (the straight-run withholding, digest line
  490) and m03 l03's hypothetical "alternative", which is now anchored to digest
  line 228. digestprose: 0 framed, 0 failing.

## Gates, after the repairs

| gate | number |
| --- | --- |
| dupaxes 0.45 beginner | 34584 comparisons, 0 pairs |
| lengthtails beginner | worst single strategy 33.9 pct against a chance of 25.0 and a refusal above 40.0 |
| litsweep banks | 0 not in the digest, 0 forward; 2 REVIEW flags, both correct on inspection |
| litsweep lessons | 0 not in the digest, 0 forward; 2 REVIEW flags (0.235110 as percent), both correct |
| bankleak | 132 questions, 510 literals, 18 fields, 5 shiftings, 10 tolerances, 0 within |
| numsweep banks | 86 checked at 7+ significant figures, 0 unresolved |
| numsweep lessons | 99 checked, 0 unresolved |
| leakage banks / lessons | 0 fatal, 0 same-tier |
| digestprose | 1277 lines, 26 lessons, 0 failing, 4 deferred (verbatim engine strings) |
| bankrepro | 7 sources, 7 reproduced, 0 drifted |
| gate_copy_rule | 0 violations, 5 engine exemptions all live |
| lengths | 78 measured, 0 out of band or out of rank |

The leak gate and numsweep were each proved on this wave before being trusted:
a planted Expert answer in an Associate bank went FATAL at the grader's
tolerance, and a last-digit mutation of a 16-digit lesson literal went
UNRESOLVED. See NOTES.md.

## Verdict

**FIT TO SEED.** Twenty-one defects repaired in the file that owns each: fourteen
in lessons and seven in banks. Three were two-right-answer questions and one was
a false answer key. No repair needed the digest to change, and no graded field
moved.
