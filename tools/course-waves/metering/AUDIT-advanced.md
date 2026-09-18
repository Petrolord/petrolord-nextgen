# FC8 Expert tier, key-truth audit

Read in full on 2026-09-18: all 26 lessons under
`src/content/courses/metering/advanced/` and all 132 questions in the seven banks
under `tools/course-banks/metering/advanced/`, against `digest.txt` at 1278
lines, md5 `38a61245d55409620b1419de55e5cb41` (the rebuild recorded in
AUDIT-intermediate.md defect 26, which touched Section 20 only). Where a judgement
needed more than the digest, the engine was read at
`packages/engines/engines/facilities/storageTank.js` in the worktree.

## Defects found and repaired

### Lessons

1. **m01 l01, a count.** "Two of the answers in this tier are refused by the
   engine." The register's two outright refusals (digest Section 31) are the
   straight run for two elbows in different planes, which is METERING and belongs
   to the Associate tier, and the fire vent capacity. This tier has one. Fixed.
2. **m01 l03, an invented use.** "A movement calculation uses rates in barrels
   per hour against that working volume." `movementVenting` takes the rates and no
   volume at all. Now "a filling schedule".
3. **m01 l04, an uncomputed superlative.** "the simplest one in the whole wave".
   Now "a plain one".
4. **m02 l02, a false physical claim and an uncomputed superlative.** "On a tank
   holding anything lighter than water it is the wrong condition." Digest line 878
   puts the crossover at a gravity of 0.931727, BELOW water, and the sweep row at
   1.000000 already reads product design: a product at, say, 0.95 is lighter than
   water and governs. The allowable stresses at the two conditions differ, which is
   why the crossover is not at 1. Rewritten to this tank's crossover, with the
   point made explicitly. "The most common shell design mistake" is now "a common".
   **The same claim was the prompt of `fc8a_m02` Q11, where it made a DISTRACTOR
   TRUE** ("Nothing, as long as the product gravity is above the crossover of
   0.931727"): for a product lighter than water above 0.931727, that option is
   correct and the key is wrong. The prompt now states a gravity of 0.550000, a
   printed sweep row, which makes the key true and the option false.
5. **m02 l05, "The package does not publish any of them".** The list includes
   the heat input band edges, and the band NAMES carry them ("below 200 ft2",
   "200 to 1000 ft2", "1000 to 2800 ft2", digest Section 28). Now separates the
   two crossovers the package prints nowhere from the band edges its names
   announce, which the bisection confirms.
6. **m03 l02, an overstated structural claim.** "the thickness, the word and the
   note ... all come off one decision about which of three candidates is
   largest." In `shellCourse` the thickness is `Math.max(tDesign, tTest,
   minimum)` and the word comes from a SECOND comparison (`tTest > tDesign`); the
   venting predicate is one computation, the shell's is not. Now posed as the
   question to ask, which is the lesson's own reading rule.
7. **m04 l01, "proportional".** The heat input "is proportional to how much of
   that wetted shell the flame can reach". Only the band below 200 ft2 is
   proportional (`20000 * A`); the others are `A^0.566`, `A^0.338` and `A^0.82`
   (read in the engine; the digest's band sweep shows the same). Now "grows with
   ... by a relation that changes from band to band".
8. **m04 l03, an invented probability.** Picking one of two forms "means being
   wrong by a wide margin half the time". Nothing gives the two forms equal odds.
   Now "wrong by that factor whenever the other form is right". Same sentence in
   `fc8a_m04` Q7's explanation, repaired there. The lesson then measured 562
   words against a band of 520 to 560 and was trimmed by three words elsewhere.
9. **m05 l01, a count.** The vapour space is "the third time one geometry has
   produced a different answer in this tier, after the capacity and the wetted
   area". The shell is read off the same geometry (diameter and heights) and comes
   before both. Now "one more answer ... beside the capacity, the shell and the
   wetted area". Same count in `fc8a_m05` Q14's explanation, repaired.
10. **m06 l01, a claim about the register's words.** "The register uses its words
    carefully" under a heading of held, stated and withheld. The register never
    uses "held": its status words are NOT CARRIED, STATED and WITHHELD (digest
    lines 1180 to 1194). Now says that, and that this course calls the first kind
    held. `fc8a_m06` Q5's prompt and `fc8a_exam` Q17's explanation carried the same
    attribution and now name the register's word.
11. **m06 l02, an exercise whose premise fails.** "pick any function with more
    than one refusal ... say which is an impossible input rather than an absent
    one". Of the eight functions with two or more refusals, `sizeOrifice` (flows
    past either plate) and `noiseIndication` (two absent inputs) have no such
    pair. The exercise is about the tank engine, so it now names the two tank
    functions it works for, `lossControl` and `thermalVenting`.
12. **m06 l04, "This file pins fifty engine strings"** in a lesson, where "this
    file" is the lesson. Now "the digest". Same in `fc8a_m06` Q12's prompt.

### Banks

13. **`fc8a_m02` Q11**, defect 4: prompt now fixes the gravity, and with it the
    truth of the key and the falsity of the option that was true.
14. **`fc8a_m04` Q7** explanation: defect 8.
15. **`fc8a_m05` Q14** explanation: defect 9.
16. **`fc8a_m06` Q5** prompt: defect 10.
17. **`fc8a_m06` Q12** prompt: defect 12.
18. **`fc8a_exam` Q3, two right answers.** Option "Each is the input at which two
    returned figures are exactly equal" is true in substance: the gravity crossover
    is where the design and test thicknesses meet, and the draw rate crossover is
    where the two totals meet. Replaced with a false option (the warning and the
    word disagreeing, which the one predicate makes impossible).
19. **`fc8a_exam` Q17** explanation: defect 10.
20. **`fc8a_exam` Q31, a key that contradicted the tier.** "both start outside
    this package", against m04 l05 ("Both routes start from a quantity the engine
    does return") and `fc8a_m04` Q9's key ("Both start from the fire duty"). Now
    "neither is carried by this package", which is true and consistent with both.

Every bank repair was made in the `.py` and re-emitted; bankkit's gates passed on
every emit. No answer key moved position; two keys' text moved (Q11's through its
prompt, and `fc8a_exam` Q31).

## Examined and cleared

- **m03 l01 "Volatility doubles one of the four"**: the thermal outbreathing also
  moves with volatility (11765.0907 against 19608.4845 scfh), but the heading
  claims only that ONE term doubles, which is the RELATION at digest line 974.
- **m02 l04 "the heads are ... measured from the design liquid level down to a
  point in the course"**: digest Section 26 prints 34.6 at a course bottom of 0,
  26.6 at 8; the head is to the course bottom and the engine subtracts the foot
  inside the relation (`h - 1`). The lesson's "a point in the course" is true.
- **`fc8a_exam` Q7, "Neither shares one"**: venting takes a capacity and two
  rates, the loss takes a diameter, a vapour space height, a vapour pressure and
  a throughput. No stated input is shared.
- **`fc8a_exam` Q19 option 1**, the stated minimum governing the bottom course:
  false on this tank at every gravity, because the test thickness of 0.218926 in
  is independent of the product and above the 0.187500 in floor.
- **Fabricated history.** The only past tense about the engine is inside verbatim
  engine strings (the fire vent withholding's "used to be here", digest line 996)
  and the digest's own framed account of the venting predicate, which
  `fc8a_m03` Q5's explanation quotes. digestprose: 0 framed, 0 failing.

## Gates, after the repairs

| gate | number |
| --- | --- |
| dupaxes 0.45 advanced | 34584 comparisons, 0 pairs |
| lengthtails advanced | worst single strategy 33.3 pct against a refusal above 40.0 |
| litsweep banks | 413 literals, 0 not in the digest, 0 forward, 14 flagged, all read |
| litsweep lessons | 412 literals, 0 not in the digest, 0 forward, 4 flagged, all read |
| bankleak | 132 questions, 459 literals, 18 fields, 5 shiftings, 10 tolerances, 0 within |
| numsweep banks / lessons | 169 / 129 checked at 7+ significant figures, 0 unresolved |
| leakage banks / lessons | 0 fatal, 0 same-tier |
| digestprose | 1278 lines, 26 lessons, 0 failing |
| bankrepro | 7 sources, 7 reproduced, 0 drifted |
| lengths | 78 measured, 0 out of band (after the m04 l03 trim) |

## Verdict

**FIT TO SEED.** Twenty defects repaired: twelve in lessons and eight in banks.
Two questions had two right answers (`fc8a_m02` Q11, `fc8a_exam` Q3) and one key
contradicted the tier's own lesson and a sibling key (`fc8a_exam` Q31). No
repair needed the digest to change beyond the Professional rebuild, and no graded
field moved.
