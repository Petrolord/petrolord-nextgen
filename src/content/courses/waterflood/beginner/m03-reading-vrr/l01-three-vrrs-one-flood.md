# Three VRRs, one flood

Ask a waterflood engineer for the VRR and you will get a number. Ask two of them and you may get two different numbers, both correct, because "the VRR" is at least three quantities wearing one name. This lesson separates them and gives each one a job.

## Instantaneous

The instantaneous VRR is this period's injected voidage over this period's produced voidage. It answers: right now, is the field replacing what it takes?

For Ekene it reproduces the design target profile exactly, because the injection volumes were computed from the produced voidage:

$$0.85,\ 0.89,\ 0.93,\ 0.97,\ 1.01,\ 1.05,\ 1.05,\ \dots$$

for 36 months, the first five ramping and the remaining 31 all at 1.05.

Note the float tails in the published series: the third value prints as 0.9299999999999999 and the fourth as 0.9700000000000001. Those are not measurement noise. They are the exact binary result of the design arithmetic $0.85 + 0.04m$, and they are worth seeing once so that you learn not to chase them. A number that differs from a round value in the sixteenth digit is that round value.

## Cumulative

The cumulative VRR is total injected voidage over total produced voidage, from the start of the record to this period. It answers: over the life of this flood so far, has the field replaced what it took?

Ekene's cumulative series climbs monotonically from 0.85, crosses 1.0 for the first time at the twelfth period, and finishes at

$$\text{VRR}_{\text{cum}} = 1.034899536109$$

on totals of 229474.93559224083 rb injected and 221736.43680913927 rb produced, a net surplus of 7738.498783101561 rb.

Cumulative VRR is the quantity that connects to pressure, because pressure responds to accumulated net withdrawal, not to this month's. It is also the quantity with the longest memory: a bad first year is still in the number three years later, which is either a feature or an annoyance depending on what you are asking.

## Rolling

The rolling VRR is the trailing average over the last $n$ periods: sum the injected voidage over the window, sum the produced voidage over the window, divide. It answers: over the recent past, wide enough to be less noisy than one month, is the field on target?

It is the operational number, the one that goes on a dashboard, because month-to-month VRR on a real field is genuinely noisy and cumulative VRR is too slow to react. Ekene's three-period rolling series ends at 1.05.

Crucially, the rolling VRR is not the average of the monthly ratios. It is the ratio of the summed voidages. On a field where produced voidage varies month to month, those two are different numbers, and the ratio of sums is the correct one because it weights each month by how much voidage it actually created.

## Seeing all three at once

{{panel:wf-ledger-explorer}}

Cyan is instantaneous, lime is rolling at the window you select, pink is cumulative. Start with the window at 1 and watch lime sit exactly on cyan. Move it to 3 and watch lime smooth and lag. Move it to 12 and watch lime approach the cumulative line without ever reaching it, because a window of 12 is still shorter than the record.

## The three-number report

Ekene ends the record with cumulative 1.034899536109, latest instantaneous 1.05, and three-period rolling 1.05. Those three numbers together say something no one of them says: the field is currently on target, has been on target long enough for a three-month average to agree, and carries a small historical surplus from the period after start-up when it was injecting 1.05 against an early deficit of 0.85.

That is a complete pressure story in three numbers. Quote one of them alone and the reader has to guess which.

## The misconception to avoid

"Cumulative VRR of 1.0 means the pressure came back to where it started." It does not, and module 4 will make the reason exact. Cumulative VRR is computed with formation volume factors evaluated at a chosen convention, and the pressure the reservoir actually reaches depends on the tank's own compressibility and its own reference conditions. For Ekene the pressure break-even sits at a cumulative VRR of 0.9869719699960521, not 1.0. Close to one, and not one, and the difference is a convention rather than an error.

## Exercise

First, using the cumulative totals above, compute what the cumulative VRR would have been if the field had injected 5000 rb less in total. Then state how many months at the 1.05 target it would take to recover to the actual value, using the last month's produced voidage of 5445.272709028624 rb as a typical month.

Second, construct a two-month example where the average of the monthly VRRs and the ratio of summed voidages differ by more than ten percent. State what feature of your example creates the gap.
