# H2 Occupational Hygiene: the key-truth writer's task

Read `BRIEF.md` first. Every number here is quoted from `digest.txt`, the only
teaching truth for this course. `FINDINGS-exposure.md` and the engine source
comments are PROVENANCE.

## WHAT A KEY TRUTH IS

One sentence a learner should be able to say afterwards, with the number that
makes it checkable. **A claim with evidence.**

## THE KEY TRUTHS THIS COURSE OWES ITS LEARNERS

### Associate

1. A noise dose is a percentage of a daily allowance against a named criterion,
   and the same OBEN day is 27.748183, 72.054478 and 265.610944 percent under the
   OSHA PEL, the OSHA action level and the NIOSH noise REL.
2. The threshold decides which periods count, and it is inclusive: the PEL setup
   integrates 2 of the 6 OBEN periods and the action level 5.
3. The TWA restates a noise dose as a level, with the coefficient the source
   prints: 16.61 for OSHA and 10.0 for NIOSH.
4. NIOSH Table 1-2 rejects the exact coefficient in 49 of 83 rows; OSHA Table A-1
   rejects it in 0 of 150, so for OSHA the Appendix A text fixes 16.61.
5. The action level is half a noise dose: a TWA of 85 on the OSHA scale is a
   noise dose of 50.000750 percent.
6. Above the table tops the engine warns and still integrates, and a record over
   24 hours is refused.

### Professional

7. LEX,8h is an energy average normalised to eight hours with no threshold, and
   HSE Figure 26 is reproduced at 86.613302 dBA against a printed 87.
8. The weekly level divides by five: the five-day week is 85.461288 dBA against
   an arithmetic mean of 84.860000.
9. Two protector estimates answer two questions: 89.000000 dBA for engineering
   controls and 80.000000 dBA for Appendix B on the same example.
10. The 8-hour chemical TWA divides by 8 whatever the record covers: 30.125000 ppm
    against 35.703704 over the hours covered.
11. The STEL is a fifteen-minute window, and a record over fifteen minutes is
    refused.
12. A mixture can exceed with every term under one: index 1.059500, largest term
    0.385000.

### Expert

13. WBGT depends on the form: the same outdoor readings give 31.410000 C
    outdoors and 32.560000 C through the indoor form.
14. The NIOSH limits apply to a one-hour average, and the teaching hour averages
    29.066667 C against a plain mean of 28.200000 C.
15. The RAL and REL are the NIOSH 2016-106 section 8.1 equations, checked for
    transcription only, and the document's own example prints 27.800000 C where
    the equation gives 27.458939 C.
16. A pinned erratum is a case the engine must miss, and the golden pins 5.
17. The extended-shift action level for ten hours is 83.390216 dBA, and the
    ten-hour noise dose of 57.350093 percent is never rescaled to eight hours.
18. Brief and Scala only lowers a limit, and the smaller of the daily and weekly
    factors governs: at 12 hours and 48 a week the daily 0.500000 governs over
    the weekly 0.781250.

## THE RULES

Digest section 24's vocabulary is binding. No em dashes, no en dashes, no "X, not
Y" contrastive. No key truth may state a transcription-only number as verified,
and no key truth may carry a graded capstone answer at any precision.
