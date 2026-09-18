# FC8 Professional tier, key-truth audit

Read in full on 2026-09-18: all 26 lessons under
`src/content/courses/metering/intermediate/` and all 132 questions in the seven
banks under `tools/course-banks/metering/intermediate/`, against `digest.txt`
(1277 lines, md5 `03fb67866328c1f3e0fdf7f6884c48c4` when the read began; see
defect 26 for the one-line rebuild). Where a judgement needed more than the
digest, the engine was read at `packages/engines/engines/facilities/controlValve.js`
in the worktree and evaluated directly in node.

## Defects found and repaired

### Lessons

1. **m01 l02, the allowable drop "belongs to the valve and to the fluid rather
   than to the operating point".** The engine forms it as
   `FL^2 * (P1 - FF * Pv)`, so it moves with the INLET pressure, which is an
   operating condition. It holds still down the march because the march moves
   only the outlet. Now says so, and the build list names the inlet and the
   vapour pressure.
2. **m01 l03, an exhaustive claim.** "Four quantities are returned on each row"
   where the digest's own table (Section 17) shows the allowable drop and the drop
   used returned too, and the engine returns more. Now "four of the quantities
   ... are the subject of this lesson".
3. **m01 l04, an uncomputed superlative.** "The commonest error in this
   subject". Nothing ranks errors. Now "a common error".
4. **m01 l05, physics stated backwards, and a borrowed reason.** "the liquid
   cannot have its pressure pulled all the way down to the vapour pressure before
   it flashes". The relation the engine uses puts the choked throat pressure at
   FF times the vapour pressure, BELOW it, not short of it. Rewritten to what the
   engine computes, checked against digest Section 17 (0.81 x (246.9 - 0.892161 x
   28.74) = 179.220032). The same lesson said FF "is the reason the vapour
   pressure is an input this engine refuses to work without"; the refusal (digest
   line 582) gives the cavitation index as its reason. Now attributed correctly.
   "One of the few places" (uncomputed) went too.
5. **m02 l01, a count.** "five of the nine rows ... three of which the engine
   itself labels with a cavitation word". The five rows above the crossing carry
   incipient, incipient, cavitating, cavitating: FOUR. Fixed.
6. **m02 l02, a self-contradiction.** "that term is the inlet pressure alone, the
   index is infinite". P1 over a finite drop is finite. Now attributed to the
   engine's own account, which says infinite, without the inference that
   contradicts it. Same inference in `fc8i_exam` Q8's explanation, repaired there.
7. **m02 l04, "only the regime word records" the change to flashing.**
   `liquidValve` returns a `flashing` flag on every call (digest Section 19 prints
   it). Now "the regime word and the flashing flag". **The same claim was the KEY
   of `fc8i_m01` Q10**, repaired there.
8. **m03 l01, the terminal ratio "can be quoted for a valve style without knowing
   anything about the service".** The terminal ratio on this valve is Fk times xT
   (0.907143 x 0.75 = 0.680357), so it depends on the gas. Only xT is a style
   property. Now says so and points at lesson three. The same clause was shared by
   the key and two distractors of `fc8i_m03` Q4; all three repaired alike so the
   discriminating clause is unchanged.
9. **m03 l03, a false claim about the equation, and an exercise built on it.** Fk
   "moves the choking boundary rather than the answer at a given operating point,
   so its effect is invisible on any service comfortably away from the boundary".
   `gasValve` forms `y = 1 - x / (3 * fk * xt)`, so Fk is in the coefficient on
   EVERY row. Rewritten, and the exercise now asks for both places. **The same
   claim was the KEY of `fc8i_m03` Q12** (and its explanation); the key is
   replaced and the old claim kept as a now-false distractor.
10. **m03 l04, two styles.** "the same service on two different styles chokes at
    two different outlet pressures". globeSingleFlow and globeCage share FL
    0.900000, and butterfly90 and ballFullBore share 0.550000 (digest Section 21),
    so two styles can choke at the SAME outlet. Now "two styles with different FL".
    **Same claim was the KEY of `fc8i_m03` Q15**, repaired. Title grammar fixed and
    a "decision and not a detail" contrastive rephrased.
11. **m03 l05, "does almost nothing".** On an unchoked service FL does not enter
    the coefficient at all (`cv = q/fp * sqrt(sg/dpUsed)`, `dpUsed` the stated
    drop). The exercise's "far less" becomes "leave the coefficient unmoved".
12. **m04 l04, an uncomputed magnitude.** A travel on the wrong curve "is wrong by
    a large margin at both ends of the range". Never computed. Now says what is
    known: it rests on a curve the valve does not have.
13. **m05 l03, a false definition.** Stream power "is the product of the flow and
    the pressure drop". `noiseIndication` forms it from the mass flow, the absolute
    temperature and ln(P1/P2). Rewritten. **Same definition was the KEY of
    `fc8i_m05` Q9**, repaired.
14. **m05 l04, a false input list.** The indication "takes a service and a valve
    style". `noiseIndication({ p1Psia, p2Psia, qScfh, gasSg, tF })` takes no
    style. Rewritten; same in `fc8i_m05` Q3's explanation.
15. **m03 l02, the quoted digest line** "two thirds to the last bit a double
    carries". See defect 26: the line was false and was rebuilt at the generator.
    The lesson now quotes the corrected line.

### Banks

16. **`fc8i_m01` Q2 key**: defect 1.
17. **`fc8i_m01` Q10 KEY**: defect 7.
18. **`fc8i_m01` Q15** explanation: defect 4's borrowed reason.
19. **`fc8i_m03` Q4** key and two distractors: defect 8.
20. **`fc8i_m03` Q12 KEY** and explanation: defect 9.
21. **`fc8i_m03` Q15 KEY**: defect 10.
22. **`fc8i_m05` Q3** explanation: defect 14.
23. **`fc8i_m05` Q9 KEY**: defect 13.
24. **`fc8i_exam` Q8** explanation: defect 6.
25. **`fc8i_exam` Q14 KEY.** "the engine says so where a reader can see it". The
    sigma thresholds are called a stated screen only in a source comment and in the
    digest; no returned string says it (the authority boundaries DO carry
    `thresholdBasis`, the sigma ladder does not). Now says the thresholds are the
    engine's stated screen, exported so a reader can see them.
    Also **`fc8i_exam` Q1** explanation carried defect 1; its first repair then
    made a 0.46 dupaxes pair with `fc8i_m01` Q2 (each explanation would have served
    the other), so it was re-angled to the column comparison instead.

### The digest

26. **Digest line 637, "which is two thirds to the last bit a double carries".**
    FALSE for this gas. `gasValve` on BELEMA_GAS returns `y = 0.6666666666666667`
    on all three choked rows, one unit in the last place ABOVE the double nearest
    two thirds (evaluated in node). The generator asserted it only to 1e-15 and then
    printed the stronger claim, and the shipped choking panel's own reader
    (`floorIsTwoThirdsExactly` false, `floorIsOneUlpFromTwoThirds` true) says the
    opposite on screen. Repaired in `fc8_dump.mjs`: the assertion now measures the
    gap against `Number.EPSILON / 2`, and the printed line says which side of two
    thirds the double lands. `finalise.sh` rebuilt the digest to 1278 lines, md5
    `38a61245d55409620b1419de55e5cb41`, byte-identical over 12 builds;
    `fields.json` byte-identical, so no graded value moved.

## Examined and cleared

- **The regime ladder thresholds (m02 l03)**: "the engine exports them" is true
  (`SIGMA_THRESHOLDS`); lesson makes no claim the engine returns a provenance line.
- **"That is as clean a boundary as this course carries" (m02 l04, `fc8i_m02` Q13)**:
  the RELATION prints a difference of 0.000000; a zero gap cannot be bettered.
- **m06 l02, "needs more opening on equal percentage trim"**: true for this duty
  (74.737770 against 37.222222) and stated of this duty, not in general.
- **`fc8i_exam` Q10 option 3**, the choked and the flashing flag "which the march
  prints side by side": false by its own clause (Section 17 prints no flashing
  column).
- **Fabricated history**: the only past-tense engine history in the tier is inside
  verbatim engine strings (`quickOpening` "used to be treated silently", digest
  line 803). digestprose: 0 framed, 0 failing.
- **The 41 bank and 64 lesson litsweep REVIEW flags**: every one is a printed
  outlet pressure, drop or power that matches two rows because the liquid and gas
  marches share outlet values; each question and lesson was read against its own
  section.

## Also found outside this tier's files, and repaired

- `WithheldExplorer.jsx` and `meteringInputs.test.js` carried two unframed
  "used to" comments that `sourceprose` failed. Reworded to the present;
  `sourceprose` 0 failing.

## Gates, after the repairs

| gate | number |
| --- | --- |
| dupaxes 0.45 intermediate | 34584 comparisons, 0 pairs (1 introduced by a repair, then re-angled) |
| lengthtails intermediate | worst single strategy 33.9 pct against a refusal above 40.0 |
| litsweep banks | 365 literals, 0 not in the digest, 0 forward, 41 flagged, all read |
| litsweep lessons | 378 literals, 0 not in the digest, 0 forward, 64 flagged, all read |
| bankleak | 132 questions, 365 literals, 18 fields, 5 shiftings, 10 tolerances, 0 within |
| numsweep banks / lessons | 47 / 85 checked at 7+ significant figures, 0 unresolved |
| leakage banks / lessons | 0 fatal, 0 same-tier |
| digestprose | 1278 lines, 26 lessons, 0 failing |
| bankrepro | 7 sources, 7 reproduced, 0 drifted |
| gate_copy_rule / gate_wavejson | 0 violations / 0 stale claims |
| lengths | 78 measured, 0 out of band |

## Verdict

**FIT TO SEED.** Twenty-six defects repaired: fifteen in lessons, ten in banks
and one in the digest. Seven answer keys changed TEXT (no key moved
position). **Five of them were false outright** (`fc8i_m01` Q10, `fc8i_m03` Q12,
`fc8i_m03` Q15, `fc8i_m05` Q9, `fc8i_exam` Q14), which the tier would have graded
learners against; the other two (`fc8i_m01` Q2, `fc8i_m03` Q4) carried a false
clause beside the discriminating one. No graded capstone field moved.
