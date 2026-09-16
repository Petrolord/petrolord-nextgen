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

SETTLED 2026-09-16, and the ladder was recut for it. `gradeprecision.py`
(commit ef5d67fc, the precision pass running in parallel in this same
worktree) found that two graded Expert fields carried a tolerance no precision
this course prints could satisfy:

    quaiboe_pig_run_hours         graded at 1e-7, hours print to six decimals
    quaiboe_pigging_interval_days graded at 1e-7, days print to four decimals

The coordinator ruled (f48e3374) that each becomes half a unit in the last
place the course actually prints that quantity, 5e-7 and 5e-5. No expected
value moved. A tolerance nothing printed can satisfy does not grade the
learner, it grades their guess at unprinted digits.

WHAT THE MIGRATION PASS DID ABOUT IT. The drift control in `gen_course.py`
caught it before anything was seeded, reporting DISAGREE on both tolerances
between the capstone draft and `fields.json`. The draft was re-synced for
those two field objects, the course migration was recut, and both collision
sweeps were re-run AT THE NEW, WIDER TOLERANCES, because widening a tolerance
can reveal a collision a tighter one hid: 0 against the 46 published headline
values, 0 against the 37 numbers handed to a learner in a prompt, 0 pairwise.
The three deep seeds regenerate byte-identical, because no bank moved.

THE APPLY SCRIPT PROVED ITSELF ON THIS, LIVE. Run against the recut tree while
still pinned to the pre-recut content it printed:

    STALE     20260922_fc2_linesizing_course
                expected 2a442a099ddf04ae39db283cf5be63b51c34a678742ab442657e33a5bad2d7e0
                found    520333b80dbb31de101ad11fe42c6dee15f4a887343bf035dd50b5303bcf35a6

and refused, naming the one file that moved and leaving the other four alone.
It has since been re-pinned with `pin HEAD`.

NOTHING IS OUTSTANDING FROM THIS PASS.


## THE PRECISION CHECK ITSELF, 2026-09-16 (the gradeprecision close-out)

The item above closed two tolerances. It did not close the CHECK. Run again
once `gradeprecision.py` had been repaired to print `N OF M CLASSIFIED` and to
REFUSE when N is not M, FC2 came back at **7 of 18**: eleven graded tolerances
had never been examined at all, because the gate classifies a field by matching
its KEY against the digest header's English and eleven of these keys carry none
of those words. Seven checks had been standing in for eighteen, and the run
before the repair exited 0.

WHAT WAS DONE. `fc2_capstone.mjs` now carries one table of what this course
prints at what precision, keyed by quantity class, with the digest evidence for
each line beside it, and a `FIELD_CLASS` map putting each of the eighteen in
one class. Each number was read off the digest and confirmed twice, by the
header sentence a learner reads and by the formatter in `fc2_dump.mjs` that
produced the page. `precision.json` is GENERATED from that table, in the shape
the gate reads, so the gate and the grader cannot disagree: there is one
statement of the precision, not two. The gate now reports 18 OF 18 CLASSIFIED
and exits 0.

THE RULE, unchanged and applied to all eighteen rather than to two:
`tol = max(stated, halfUlp(printed decimals of that class))`, MAX AND NEVER
MIN, so it can only widen and nothing that graded correct before can grade
wrong now. TWO MORE MOVED, both Expert, both the same defect the item above
closed for hours and days:

    quaiboe_required_wall_in   1e-8 -> 5e-7   inches print to six decimals, so
                                              0.462362 is 1.17e-7 out, 11.7
                                              tolerances, and a reader doing
                                              exactly as told FAILED
    quaiboe_swept_volume_bbl   1e-5 -> 5e-5   barrels print to four decimals,
                                              so 2342.7305 is 2.17e-5 out,
                                              2.2 tolerances

The other sixteen did not move. `--bare-stated-tolerances` on the generator is
the negative control: it grades against the stated figures alone and must name
all four fields and exit 1.

THE LADDER was recut and re-pinned for the one migration whose content moved,
`20260922_fc2_linesizing_course` at 9a53c2c9. Both collision sweeps were re-run
AT THE WIDER TOLERANCES, because widening can reveal a collision a tighter
tolerance hid: 0 against the 46 published headline figures, 0 against the 9
held quantities, 0 against the 37 numbers handed to a learner in a prompt, 0
pairwise, 0 cross-tier. The whole five-migration ladder then ran against
production inside one rolled-back transaction and every assertion passed, with
production re-read afterwards and unchanged. `dryrun_fc2.sh` now carries the
negative control that proves it: `NEGATIVE_CONTROL=1` widens the Expert MAOP
band to 50 psi, which puts the graded 1586.484375 psig within its own band of
the 1633.5349 the digest publishes, and the go-live refuses BY NAME.

THE SEED WAS NOT APPLIED when this landed. Production was read: no `linesizing`
row in `academy_apps`, 0 structures, 0 questions, 0 capstones, 0 graded fields,
catalogue 44 available and 0 coming_soon. So no learner had ever been graded
against either tolerance, the migration content could move in place, and no
correction migration is needed. An owner apply of the re-pinned ladder is what
puts the answerable tolerances on production.

## TWO THINGS FOUND HERE AND DELIBERATELY NOT FIXED

ITEM A. HOURS PRINT TO SIX DECIMALS AND TWO PLACES SAY FOUR. The digest header
and every hours call site in `fc2_dump.mjs` agree on six: 2.444444 hours,
1.666667 h. The comment on `r4` in the dump lists hours among the four-decimal
quantities, and the Expert m06 question on the capstone conventions carries the
same claim in its keyed answer and in its explanation. Neither is a tolerance,
and a graded value and a question are both out of scope for a precision pass,
so both are recorded rather than touched. The tolerance was derived from what
the page prints, which is six, and that is the figure that protects a learner.
A reader who quotes the pig run to four decimals as that question tells them to
is 6.7e-5 out against a 5e-7 band and fails. THAT IS A LIVE DEFECT IN A KEYED
ANSWER and it needs the question re-keyed or the convention restated.

ITEM B. TEN OF THE TWENTY-ONE BANK SOURCES NO LONGER REPRODUCE THEIR JSON.
`bankrepro.py` on the wave directory: fc2a_exam (9 questions), fc2a_m02,
fc2a_m04, fc2a_m05, fc2i_exam, fc2i_m01, fc2i_m02, fc2i_m03, fc2i_m04,
fc2i_m06. The JSON was edited without its `.py`, so the next re-emit reverts
those edits silently. The shipped SQL is correct: `verify_sql.py` compares all
396 migration rows against the committed JSON field for field and AGREES, so
nothing a learner sees is wrong today. It is the SOURCE that is stale, and the
hazard is the next person who regenerates a bank.
