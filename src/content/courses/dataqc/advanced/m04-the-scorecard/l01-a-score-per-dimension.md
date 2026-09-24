# A score per dimension

{{panel:dq-monitor-explorer}}
{{panel:dq-checks-explorer}}

The engine's scorecard gives each dimension one score, either a score passed in directly or 1 - failed / checked. On EKENE-3, each dimension was counted from a check this course has already run. Completeness scores 0.966667 from the oil column, 3 missing in 90. Validity scores 0.977011 from the rate check, 2 failed in 87. Consistency scores 0.988506 from the phase sum, 1 failed in 87. Uniqueness scores 0.538462 from the well names, 6 failed in 13. Plausibility scores 0.977011 from the modified z-score on oil, 2 flagged in 87.

| dimension | the check it was counted from | checked | failed | score |
| --- | --- | --- | --- | --- |
| completeness | completeness, oil | 90 | 3 | 0.966667 |
| validity | rateCheck, oil | 87 | 2 | 0.977011 |
| consistency | phaseSumCheck, oil + water against gross | 87 | 1 | 0.988506 |
| uniqueness | duplicateIdentifiers, the 13 names | 13 | 6 | 0.538462 |
| plausibility | modifiedZScores, oil | 87 | 2 | 0.977011 |

## The five dimensions

The dimensions are the five names the engine exports in `DIMENSIONS`, in display order: completeness, validity, consistency, uniqueness and plausibility. The first four are the Associate tier's questions and the fifth is the Professional tier's. A scorecard does not invent a new measurement. It collects counts from checks already run, one per dimension, and turns each into a number between 0 and 1.

## How a failure is counted

Each dimension says what counts as checked and what counts as failed, and the choice belongs to whoever builds the scorecard. On EKENE-3 the counts were stated this way. Completeness counts the oil column's 90 days with 3 missing. Validity and consistency count the 87 days with every input present. For uniqueness, a name is failed when it duplicates an earlier one, so 6 of the 13 names fail. Plausibility counts the entries the modified z-score flags on oil.

## One entry, two dimensions

The oil column's modified z-score flags entries 46 and 59, which are days 47 and 60: the negative rate and a shut-in day. The negative rate, day 47, is also what the rate check flags under validity. The scorecard counts flags from checks, and two checks can flag the same entry. A score per dimension is therefore a statement about that dimension's check. The scores do not add up to a count of distinct bad days, and a note that treats them as if they did will count day 47 twice.

## A direct score

A dimension can also carry a score directly, with no counts. The engine's basis block states the rule verbatim: "score, or 1 - failed / checked". The next lessons use both kinds side by side.

## Exercise

In the checks panel, run completeness on EKENE-3's oil column and confirm 3 missing in 90. Compute 1 - 3 / 90 and check it against 0.966667. Then open the scorecard view of the monitor panel, change the uniqueness row's failed count from 6 to 5, and read the new uniqueness score. Say in one sentence which of the 13 names you would have had to stop counting as a duplicate for that to be the honest count.
