# FC2 linesizing: items HELD by the coordinator, and what to do when the hold lifts

Written 2026-09-16 by the digest-correction pass (Suite commits 2881b799 and
f0c0ebc4). Every item below was FOUND and DELIBERATELY NOT FIXED. None is a
guess: each was examined and the reason for holding it is recorded.

## THE HOLD WAS LIFTED 2026-09-16 AND EVERY ITEM BELOW IS DONE

Both FC2 audits landed (Professional b21c63ea, Expert bfb9e900) and the full
pass ran. The digest went 557 lines to 560 and now hashes to
cab779499f107d48717d777352180e07. WHAT WAS DONE, against what this file held:

  ITEM 1, the six uncomputed comparisons in Sections 1 to 6: all six now print
  the comparison they make. Lines 87, 119, 127, 164, 173 and 194.
  ITEM 2, the Section 10 repair-history sentence: STRUCK, with the replacement
  wording this file recorded.
  ITEM 2b, line 386's contrastive: STRUCK.
  ITEM 2c, the nine backward reaches: closed ADDITIVELY. Section 9 now reads
  the feet in a mile out of the gas elevation guard and Section 10 measures the
  atmospheric floor of its own bracket, both inside the Professional range.
  Professional backward reaches went from 7 to 0.
  ITEM 3, the eleven over-length Professional lessons: folded into the
  Professional audit, which landed.
  ITEMS 4 and 5 were never ours and stay routed.

AND FIVE MORE FROM THE EXPERT AUDIT, all done in the same pass:
  Line 553 said "the three pipes" where it is TWO, a false count this pass's
  own Section 18 repair introduced. Fixed, with its coupled mirror in
  linesizingLab.test.js.
  Line 449 said "the last two are extrapolations" where the table puts THREE
  rows past the published limit. It now counts the rows.
  Line 549's second half was the same repair history as its first. Both gone.
  Line 532's "the one that was NOT repaired" was repair history that passed the
  gate clean. Gone, and the gate now catches the shape.
  Section 16 now DERIVES the counts a lesson teaches and two questions grade
  on: 24 entries, 18 distinct messages, 6 repeated, split 3 and 3 between one
  guard reached from two functions and one function refusing two bad values.
  They were hand-counted and correct; they are now computed.

WHAT REMAINS, and it is not a defect:
  Six BACKWARD reaches from Expert lessons into Section 3's published liquid
  goldens, in m03/l01 and m05/l02. A recap quoting a published case from an
  earlier tier is what backward reaches are for, which is why they report
  without failing. Left deliberately.


## THE SEED LADDER, AND THE ONE ITEM IT HANDS ON (added by the migration pass)

The five migrations are cut and pinned: `20260922_fc2_linesizing_course`,
three deep seeds and `20260922_fc2_linesizing_go_live`. The ladder is
content-addressed by sha256 in `apply_fc2_linesizing.sh`, so it cannot be
applied against SQL that is not the SQL it was proved on.

HANDED ON, NOT FIXED HERE. `gradeprecision.py` (commit ef5d67fc, the precision
pass running in parallel in this same worktree) reports two graded Expert
fields whose tolerance is not satisfiable at the precision this course prints:

    quaiboe_pig_run_hours        graded at 1e-7, hours print to six decimals
    quaiboe_pigging_interval_days graded at 1e-7, days print to four decimals

The Expert capstone lesson `advanced/m06-the-expert-reading/l02` still states
"Barrels, hours and days print to four decimals", which the Professional side
of that same claim has already been corrected for. A learner who quotes the
printed precision fails both fields.

WHY THE MIGRATION PASS DID NOT CHANGE IT. The fix is to a tolerance in
`fc2_capstone.mjs` or to a printed precision, both of which are the capstone's
contract, and the precision pass owns that contract and is mid-flight in this
worktree. Two editors in one worktree is a failure this programme has already
paid for. Nothing is lost by waiting: the ladder pins file CONTENT, so if the
tolerances move, `apply_fc2_linesizing.sh verify` REFUSES, names the file that
drifted and prints the `pin` command that reprints the table. A repaired
capstone cannot be applied as the unrepaired one, and an unrepaired one cannot
be applied silently after the repair lands.

WHAT TO DO WHEN THE HOLD LIFTS. Repair the tolerance or the precision claim,
re-run `gen_course.py` and `gen_golive.py`, re-run `verify_sql.py` and
`dryrun_fc2.sh`, then `apply_fc2_linesizing.sh pin <ref>` and paste the new
table into the script with the PR number that moved it.
