# The materials award end to end

{{panel:pr-award-calculator}}

This lesson runs the synthetic materials tender from the technical envelope to the award, with every setting stated and the Act applied under both readings of s.14. It is the Professional question in one tender: the lowest evaluated cost over the life of the asset, and what the Nigerian content Act does to it.

## Step 1: the technical envelope

Pass mark 60, three criteria weighted 60, 25 and 15. MS1, MS2, MS3 and MS4 pass; MS5 scores 50.000000 and its commercial envelope is not opened.

## Step 2: the evaluated costs

Omission rule average, delivery schedule minWeeks 8, maxWeeks 14 and ratePerWeek 0.0025, life cycle 5 years at 0.1 through the canonical npv. MS4's omitted inspection line is priced at the average of the other responsive bids, 12000.000000.

| bid | evaluated cost | above the lowest (percent) |
| --- | --- | --- |
| MS4 | 546244.982386 | 0.000000 |
| MS2 | 547863.577232 | 0.296313 |
| MS1 | 565746.220616 | 3.570054 |
| MS3 | 581453.933847 | 6.445634 |

The lowest evaluated cost is MS4.

## Step 3: Nigerian content

Each item measured in its Schedule unit, each bid's overall content the mean of its item contents weighted by its own quoted amounts: MS4 57.043637, MS2 61.584657, MS1 56.246451, MS3 86.240876.

## Step 4: sections 14 and 16

The s.14 group is MS4 and MS2. MS2 leads, and MS4 is the runner-up. The lead and the outcome depend on the reading of "at least 5% higher", which the Act does not settle, so both are shown. Section 16 protects MS3, an indigenous company with capacity 6.445634 percent above the lowest, and selects nothing: MS3 stays in the evaluation and the award is decided between MS4 and MS2 under either reading.

| | read as points | read as relative |
| --- | --- | --- |
| lead | 4.541020 percentage points | 7.960608 percent of the runner-up |
| s.14 applied | false | true |
| selected | MS4 | MS2 |

## Step 5: the award

The whole tender in one call, with the award on the lowest evaluated cost:

| s.14 reading | lowest evaluated cost | award | the engine's award reason |
| --- | --- | --- | --- |
| none stated (content not applied) | MS4 | MS4 | MS4 has the lowest evaluated cost |
| points | MS4 | MS4 | MS4 has the lowest evaluated cost |
| relative | MS4 | MS2 | the s.14 reason, which selects MS2 |

Under the relative reading, the award reason is the s.14 reason itself, readings included. Under the points reading, s.14 was tested and did not apply, so the award reason is the lowest evaluated cost's. With no content rule stated, s.14 is never tested.

When the content rule is stated, every bid that reaches the commercial stage must carry its overall content. A missing one is refused by name:

> bids[4].ncPct is required for every bid that reaches the commercial stage when nigerianContent is given

## Writing it up

A report on this award states, in order: the sources with their editions and the date read; the pass mark and MS5's exclusion with its reason; each term of every evaluated cost with the omission rule, the schedule and the life cycle; each bid's content by item and overall, in its units, with the weights; the s.14 group, leader, runner-up and lead under the reading applied, with the other reading's outcome beside it; the s.16 rows; and the award with the engine's reason. On this tender the two readings award different bids, and the report says so in plain words.

## Exercise

Open the award calculator on the view "Evaluated cost with a life-cycle cost" and confirm Step 2. Switch to "Nigerian content by item" and confirm Step 3. Switch to "Sections 14 and 16, both readings" and confirm Step 4 in both columns and the s.16 table. Then change the life-cycle discount rate to a value of your choosing, carry the new evaluated costs into the preference view by hand, and record whether the group, the lead and the selected bid change under each reading.
