# Zero hours is a refusal

`derivePoint` returns null for all four producing-day rates when `hours_on` is zero. It is the single most important refusal in the module, and the reason is arithmetic rather than policy.

{{panel:pd-ledger-explorer}}

## Why a null and not an Infinity

Dividing by zero hours gives an Infinity, and an Infinity does not stay in the row it was born in. It propagates into every window mean downstream, so one shut-in day would turn a well's recent mean producing-day rate into a fabricated record and every comparison built on it would be worthless. A null is skipped by the mean instead.

## The two rows that look alike and are not

The published golden commits both shapes. The row of 2025-01-03 books 0.000000 stb of oil, 0.000000 stb of water, 0.000000 Mscf of gas and 0.000000 hours, and returns `liquid` = 0.000000000 stb, `watercut` = null, `gor` = null, and `oilPd`, `waterPd`, `gasPd` and `liquidPd` all null.

The row of 2025-01-05 books 0.000000 stb of oil, 0.000000 stb of water, 120.000000 Mscf of gas and 24.000000 hours, and returns `liquid` = 0.000000000 stb, `watercut` = null, `gor` = null, `oilPd` = 0.000000000 stb/d, `gasPd` = 120.000000000 Mscf/d and `liquidPd` = 0.000000000 stb/d.

Both rows made no oil. The first has no producing-day oil rate at all, because the well was never open. The second has one and it is zero, because the well was open for a full day and made none. A tool that reads a null as a zero has collapsed those two wells into one story.

## The negative hours case

A derived sweep sets `hours_on` to -3.0 on a constructed row of 600 stb of oil. `oilPd` comes back null, which is right, and `hoursOn` comes back as -3, which is what was handed in. The rate is protected and the hours column is not, so a downtime check that averages `hoursOn` can average a negative number of hours and report it as an operating figure.

## The same column one file away

A derived comparison of one hours column across two modules the shipped studio calls on the same ledger.

| hours_on | surveillance oilPd, stb/d | allocation uptime | allocation theoretical oil, stb |
| --- | --- | --- | --- |
| 24 as a number | 800.000000000 | 1.000000000 | 1000.000000000 |
| 0 | null | 0.000000000 | 0.000000000 |
| null | 800.000000000 | 1.000000000 | 1000.000000000 |

A stated zero is the one spelling the two modules agree on. `derivePoint` refuses the rate and `computeAllocation` gives that well a theoretical oil of 0.000000000 stb, so a well that recorded itself shut for the day takes no share of the metered total.

## The mistake

Filling a blank hours column with a zero to tidy the data. A zero is a claim that the well was shut, and it costs that well its whole allocated share for the day and nulls every producing-day rate on the row. Leaving it empty makes a different claim, and the two modules read that one differently.

## Exercise

Put both published zero-oil rows through the panel and record `oilPd` on each.

Then say what a null tells a reader that a 0.000000000 stb/d producing-day oil rate does not.
