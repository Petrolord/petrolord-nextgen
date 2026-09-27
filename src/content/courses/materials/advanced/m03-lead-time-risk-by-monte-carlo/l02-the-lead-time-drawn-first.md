# The lead time drawn first

{{panel:materials-spares-calculator}}

A Monte Carlo is only as reproducible as the order in which it spends its random numbers. The engine states that order in its basis, and this lesson reads it on the mechanical seal: which number is drawn first, what each draw becomes, and how long a drawn demand rate lasts.

## One draw, step by step

For each draw the engine takes one uniform number for the lead time and then one for the demand rate, from a single mulberry32 stream on the stated seed. Each uniform passes through the triangular inverse to become a lead time in days and a demand rate a day. The lead-time demand for that draw is the rate times the days. The basis for the seal, verbatim:

> 20000 iterations, one mulberry32(20270301) stream; per iteration a uniform for the lead time then one for the demand rate; triangular inverse CDF (lib/stats triInvCDF); the rate holds for the whole lead time

Because the order is fixed and stated, a second run on the same seed and draws spends its uniforms the same way and returns the same draws. The course's own replay of the seal, done by hand from mulberry32 and triInvCDF, found the same count of stockouts as the engine.

## The seal's two triangles

| input | minimum | mode | maximum |
| --- | --- | --- | --- |
| lead time, days | 70 | 90 | 160 |
| demand a day, seals | 0.01 | 0.016 | 0.03 |

Both triangles lean right: the long tail is on the slow side for the lead time and the busy side for the demand. A late delivery and a busy spell together make the draws that run out.

## One rate for the whole lead time

The rate drawn for a lead time holds for the whole of it. A draw with a high rate is high every day of that lead time, and no quiet day inside it offsets a busy one. That is a stated choice of the engine; a fresh demand draw every day is the alternative, and it would narrow the spread of the lead-time demand. The course states which one a figure rests on: every lead-time figure in this tier rests on one rate a lead time.

## A triangle must be in order

A triangle needs its minimum at or below its mode, and its mode at or below its maximum. Out of order, it is refused, verbatim:

> leadTimeDays must have min <= mode <= max; got min 90, mode 70, max 160

A negative demand is refused at the term that carries it:

> demandPerDay.min must be at or above 0; got -0.01

Each refusal names the input by its path, so a learner can find the control that wrote it.

## Exercise

Open the spares calculator on the view "Lead-time risk by Monte Carlo (ungraded)" and start from "The mechanical seal on the Ekene register". Read the sampling line and check it against the quotation above. Set "Lead time, days: min (stated)" to 90 and "Lead time, days: mode (stated)" to 70, predict the refusal, and read it. Restore 70 and 90. Set "Demand a day: min (stated)" to -0.01 and read the second refusal. Restore 0.01. Then write two sentences on how a fresh demand draw every day would change the widest lead-time demands, and why the engine states which choice it makes.
