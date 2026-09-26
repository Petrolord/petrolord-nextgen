# Completion time and its adjustment

{{panel:pr-envelope-calculator}}

A contractor who finishes later keeps the wells shut in longer, and that costs the company. The tender can price the delay into the comparison: each week beyond a stated minimum adds a fraction of the price. This lesson reads the schedule the well services tender states, applies it to each bid and names the one figure in the rule that the engine chose.

## The schedule

The World Bank Standard Procurement Document, Request for Bids, Works, two-envelope (September 2025) provides for a time for completion adjustment in its Section III. The well services tender states minWeeks 6, maxWeeks 10 and ratePerWeek 0.005. The engine's basis:

> ratePerWeek 0.005 of (corrected price - discount) for each week beyond 6; beyond 10 weeks the bid is rejected (World Bank SPD Request for Bids, Works, two-envelope (Sep 2025) Section III, time for completion)

The adjustment is ratePerWeek times the weeks beyond minWeeks times the corrected price less the discount.

## The four bids

| bid | weeks | weeks beyond 6 | corrected price less discount | schedule adjustment |
| --- | --- | --- | --- | --- |
| WS1 | 6 | 0 | 928200.000000 | 0.000000 |
| WS3 | 7 | 1 | 918000.000000 | 4590.000000 |
| WS2 | 8 | 2 | 867400.000000 | 8674.000000 |
| WS5 | 9 | 3 | 849400.000000 | 12741.000000 |

The engine's reasons:

> WS5: completion in 9 weeks is 3 weeks beyond the minimum 6 weeks; 0.005 x 3 x 849400 = 12741 is added

> WS1: completion in 6 weeks is not beyond the minimum 6 weeks; no adjustment and no credit for earlier completion

WS5 carries the largest adjustment and still holds the lowest evaluated cost, 862141.000000, with omissions at the average and this schedule.

## No credit for finishing early

A bid that promises fewer weeks than the minimum earns nothing. The rule treats the minimum as the fastest completion the company will value, so a promise to finish sooner adds nothing to the comparison. A bid that offers more than maxWeeks is rejected at the commercial stage and excluded with the engine's reason.

## The base is a stated choice

The Standard Procurement Document gives the rate and leaves open what price it multiplies. The engine multiplies the corrected price less the discount, an engine convention it names in its basis. The alternatives are the quoted total, which would carry an arithmetic slip into the adjustment, or the corrected price before the discount, which would charge WS1 for time on money it has already given back. A different base would move every adjustment, so any report quoting one names the base.

## Refusals on the schedule

> schedule must be { minWeeks, maxWeeks, ratePerWeek } when given

> schedule.maxWeeks must be a finite number at or above minWeeks

> schedule.ratePerWeek must be a fraction from 0 to 1 of the price for each week beyond minWeeks

And with a schedule stated, every bid must say how long it takes:

> bids[0].completionWeeks must be a finite number at or above 0 when a schedule is given

## Exercise

In the envelope calculator choose "Evaluated cost of the passing bids". Work WS2's adjustment by hand from its corrected price and weeks, then check it. Change ratePerWeek to 0.01 and see whether the ranking changes. Restore it, then set WS2's completionWeeks to 11 and read how the panel reports WS2. Finally, set maxWeeks to 5 with minWeeks 6 and read the refusal.
