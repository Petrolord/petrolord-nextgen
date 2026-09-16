# FC1 wave findings (foundation phase, 2026-09-15)

Things seen while building the digest and the capstone that are NOT defects
this wave repaired. They are teaching material, or work for a later wave.

1. **The Stokes field constant sits about four parts in a thousand below the
   SI derivation.** `1.78e-6 dm^2 dSG / mu` against `g d^2 dRho / 18 mu`
   gives a ratio of 1.004184 on all three published cases, in the same
   direction every time. It is a rounded packaging rather than an error, and
   the goldens carry the SI value, so any gate on droplet settling must keep
   a tolerance wider than that. It matters where a residence time sits close
   to a droplet time: the capstone's own water drop needs 388.0364 s against
   419.9999 s of residence, and four parts in a thousand of either figure is
   nowhere near the gap, but a case cut tighter could flip a verdict on the
   constant alone.
2. **A residence time under the retention-proportional split is the
   retention time that was typed in.** The split is made to give both phases
   the same length, so `residenceOilS` comes back as the oil retention in
   seconds and `residenceWaterS` as the water retention. That is recorded in
   FINDINGS-separation as D4 and is taught in Expert m02; it is not graded,
   because reading an input back is not an answer.
3. **Gas can only control a horizontal vessel that is already failing.** The
   gas length is the velocity ratio times the gas height, and the capacity
   rule caps that ratio at 1, so a vessel that carries its gas has a gas
   length no larger than its gas height. Every published case where gas
   controls is a case where `gasCapacityOk` is false. This is a consequence
   of the HELD settling-velocity packaging and will have to be re-read if the
   literature check moves it.
4. **The spacing table has no entry for most modern equipment.** A flow
   meter, a skid, a pig launcher or a booster package returns null from
   `requiredSpacingM`, which makes a real layout incomplete the moment it
   contains one. ERHA reports 12 unknown type pairs from one skid. That is
   honest behaviour and it means `complete` is false on almost any real
   plot, so a Suite-side default policy (or a site table) is a live question
   for the Layout Mapper rather than for this course.
5. **Zero-requirement pairs dominate a small plot.** ERHA reports 21 pairs
   with no requirement against 69 checks, all of them valve and relief-valve
   pairs the table scores at 0. The count is reported separately, which is
   the FC1-0 repair, but a reviewer reading only `checked` still sees a
   number that depends on how many zero-scored items happen to be on the
   plan.
6. **Nothing reconciles a vendor K against the derated table K.** The engine
   accepts `kOverride` and says `source: typed`, and it never compares the
   two or warns when a typed K sits far from the table value at that
   pressure. A vendor K of 0.9 would be taken silently.
7. **A K two thousandths above the floor is reported exactly like a robust
   derated value.** The published case `verticalNoneAt650psig` returns K
   0.125000 with `derated` true and `floored` false. It is 0.005000 above
   the 0.12 floor, which is the width of one step of the derating rule per
   50 psi, so 50 psig more of operating pressure would floor it, and nothing
   in the return says the answer is sitting on the edge of the range where
   the rule of thumb stops meaning anything. `floored` is a cliff, and there
   is no flag beside it for the approach to the cliff.
   **IMPLEMENTED 2026-09-16 (engines PR #195, branch `fix/fc1-near-floor-k`).**
   `kValue` now returns `nearFloor` beside `floored`: true when the floor did
   NOT catch this K and one more 100 psi step of the same published rule
   WOULD put it under. The flag is derived from the rule rather than from a
   chosen threshold, so `K_DERATE_PER_100PSI` is exported and the flag moves
   if the literature ever moves the slope. The two flags are mutually
   exclusive, and a typed K reports `nearFloor` false with the other two so
   the return shape does not change between branches. It is a flag and not a
   warning: `warning` stays null on a near-floor row, and finding 6 (nothing
   reconciles a vendor K against the table) is still open.
   **A second defect fell out of the oracle sweep and was repaired with it.**
   The floor comparison was made in binary floating point, so a derating
   landing EXACTLY on the floor (`verticalMesh` at 2400 psig, where the rule
   gives `0.35 - 0.01 * 23 = 0.12`) read as 0.11999999999999997 and was
   floored by the engine while the exact-rational oracle was not. Both floor
   comparisons now carry 1e-9 of slack. Five pressures in 0 to 4000 psig are
   affected, one per base row, and none is a published golden.
   **What moved.** Goldens gained `nearFloor` on all six `kValue` cases, with
   `verticalNoneAt650psig` the only true; no `k`, `kDerated`, `floored` or
   `derated` value changed. The digest stayed at 559 lines and 18 lines
   changed, all of them modifications and no insertions: the Section 3 table
   header, separator and eight rows gained a column (all false, because no
   teaching stream sits near the floor), the override JSON on line 113 gained
   the field, the six published kValue lines gained `nearFloor`, and line 123
   was rewritten because its closing clause ("the return carries no flag")
   had become false. Engine against the exact-rational oracle over six rows
   at every half psi from 0 to 4000, 48006 points: 0 mismatches.
   **No graded capstone value moved, verified rather than assumed.** Every
   capstone tier states a vendor K and the capstone generator calls
   `kValue({ kOverride })` only, so no graded field reads the table, the
   derating or the floor. `fields.json` was regenerated against the vendored
   repaired engine and diffed byte for byte against its previous state: all
   eighteen graded values across the three tiers are identical, and the
   capstone generator's whole narrative output is identical too.
8. **Two lab guards assert wording the digest never promised, and one
   asserts an import the generator does not need.** Found when the standard
   rate rows were added (2026-09-15) and the panel and lab agent's
   `separationLab.test.js` was run against the regrown digest. They are gate
   defects rather than content defects, and they belong to the lab file, so
   they are recorded here rather than fixed under a running agent:
   - the held gate expects the digest to contain `taught as limits and never
     as answers`, which is the BRIEF's wording. The digest marks every held
     item with `# HELD FOR LITERATURE, taught as a limit and never graded`
     and opens Section 17 with `Four things this course teaches as limits and
     never as answers`. The marker to assert is `HELD FOR LITERATURE`, which
     is the one string every held block actually carries.
   - the teaching-field gate asserts `fc1_dump.mjs` imports `atM`. It does
     not and should not: `atM` is the helper `fc1_fields.mjs` uses INTERNALLY
     to build `ERHA_ITEMS` from metre offsets, and the dump imports the built
     items. The honest assertion is that every name the LAB copied is
     exported by `fc1_fields.mjs`, not that the dump imports it. Importing an
     unused symbol to turn the gate green would be the gate writing the
     content instead of checking it.
   A third, `CONTROL: there is no dated or seeded surface to fake`, greps the
   lab's own source for `today` and hits the word in its own prose. Same
   class: a grep guard that catches its own commentary.
9. **Three figures the bank writers wanted were absent, and all three were
   legitimately derivable, so all three were added in the 2026-09-15
   additive pass rather than left to prose.**
   - `0.008750` ft/s, the half-speed foil. A learner who reads Stokes as
     linear in droplet diameter halves the 500 micron velocity for a 250
     micron drop. It is arithmetic on a digest value stated on its own row,
     so Section 14 now prints it beside the engine's 0.004375 and the
     difference between them. A distractor that names a real misreading
     beats a distractor that names a mechanism in words.
   - `0.005000`, the near-floor gap of finding 7. Derived on the row from
     the published K 0.125000 less the floor 0.120000, now in Section 3.
   - `6371008.8` m, the earth radius. `R_EARTH_M` is NOT exported by
     spacing.js, so typing it would have broken the rule that every digest
     number is an engine return or stated arithmetic. Section 11 instead
     measures a quarter turn along the equator with `haversineM` and divides:
     radius = distance times two over pi. The figure is now the engine's own
     answer about itself rather than a constant copied out of the source.
10. **A committed Expert lesson claims the retired chord rule always put the
    oil layer ABOVE its exact height, and the digest refutes it in every
    published case, not just one.** Reported by a bank writer against
    `thickOilWaterCarryover` (retired oil 0.906229 below exact 0.911299).
    Checked across all six published threePhase cases and the retired oil
    layer is BELOW the exact one in every one of them: 2.356194 against
    2.459309, 2.945243 against 3.173523, 2.356194 against 2.459309, 0.906229
    against 0.911299, 1.544424 against 1.750672, 1.413717 against 1.475585.
    The mechanism is that the retired layers are each an area divided by the
    SAME gas-liquid chord, so they sum to the liquid area over the chord and
    not to the liquid depth: 3.926991 against a depth of 5.000000 on the four
    half-full 10 ft cases, 2.162194 against 3.000000, 2.356194 against
    3.000000. Two layers that do not add up to the liquid they describe can
    both be wrong in the same direction, which is exactly what they do.
    `advanced/m01/l02` is for the key-truth audit to fix; the digest already
    carries both layers for all six cases, so the correction needs no new
    number.
11. **A typed editorial ratio got into the digest and two files inherited it
    before an auditor caught it.** Digest line 343 ended "so a reviewer
    reading the retired figure saw a breach a tenth of its true size". The
    arithmetic is 0.3696 over 9.3696, which is 0.039447, about a
    twenty-fifth. It was wrong by a factor of two and a half, it was mine,
    and it broke the digest's own rule, because "a tenth" is an editorial
    characterisation and not an engine return. The Expert auditor found it,
    judged it the generator owner's call, dropped the phrase from its own
    text and escalated rather than editing the shared file, which is the
    right order of operations.
    **Fixed 2026-09-16 by DROPPING the ratio rather than correcting it**:
    the two figures, 9.3696 m against 0.3696 m, carry the whole lesson, and
    the difference between them is the 9.0000 m half bund the same line
    already derives. Propagated to `separationLab.test.js` (the pinned
    template) and to `intermediate/m05/l04`.
    **The sibling sweep the escalation prompted found two more typed
    comparisons, and they were judged separately rather than as a batch.**
    - "A pair 2 m short of 3 m ... a control room 40 m short of 90 m" in
      Section 16 were typed roundings of figures the engine has exactly.
      Cascade was ZERO, no lesson and no bank quoted them, so they are now
      derived from a live `checkLayout` run of `s4RankingsDisagree`:
      2.0011 m of 3.0000 m and 40.0561 m of 90.0000 m.
    - "about four parts in a thousand" in Section 14 was KEPT. It is true
      (the ratio 1.004184 is printed on every row of the table directly
      above it) and it is hedged. Its cascade is large and settled: two
      Expert lessons including a section heading, eight or more bank entries
      across three banks in both .py and .json, `SlugExplorer.jsx`, and the
      lab pin. Churning audited banks to restate a true hedged figure buys
      nothing.
    **The rule this leaves behind: a digest sentence may name a figure the
    file computes, and may not characterise the RELATIONSHIP between two
    figures unless that relationship is itself computed and printed.** A
    ratio nobody computed reads exactly like one somebody did.
