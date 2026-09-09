# Working interest scales inside

A partner with 60 percent of a joint venture gets 60 percent of every money line after the regime has run, not 60 percent of the volumes fed into it.

{{panel:ec-ledger-explorer}}

## What scales and what does not

AKATA at five working interests, the 2029 row and the lifetime readings:

| WI percent | gross_revenue | royalty | tax | net_cash_flow | total oil bbl | take percent |
| --- | --- | --- | --- | --- | --- | --- |
| 100 | 186032000.00 | 27904800.00 | 45250880.00 | -121123680.00 | 9680000.00 | 66.1723 |
| 75 | 186032000.00 | 20928600.00 | 33938160.00 | -90842760.00 | 9680000.00 | 74.6292 |
| 60 | 186032000.00 | 16742880.00 | 27150528.00 | -72674208.00 | 9680000.00 | 79.7034 |
| 40 | 186032000.00 | 11161920.00 | 18100352.00 | -48449472.00 | 9680000.00 | 86.4689 |
| 25 | 186032000.00 | 6976200.00 | 11312720.00 | -30280920.00 | 9680000.00 | 91.5431 |

Royalty, tax and net cash flow scale with the interest: at 60 percent the royalty is 16742880.00, the tax 27150528.00 and the net -72674208.00. Gross revenue does not: the row prints the field's 186032000.00 at every interest, the total oil stays at 9680000.00 bbl, and the unit technical cost stays at 40.006602 USD/boe, because its numerator and denominator are both field-level. The engine reports working_interest_pct beside the result.

## Inside, not outside

Scaling inside the regime means the fiscal cascade runs once on the whole field and the partner takes a share of each result. Scaling the volumes first gives the same answer under a flat royalty and a flat tax, because every line is proportional to revenue, and a different answer as soon as anything in the regime is not: a rate tier on the field's daily production, a lifetime cumulative cap, a fixed lump sum. Those are Expert edges, but the habit is formed here: interest is applied to results, not to inputs.

The hand-derived case says the same thing with round numbers. At 60 percent the year 1 royalty is 12000000.00, the tax 19500000.00, the net -7500000.00 and the year 2 net 22500000.00; at 25 percent the year 2 net is 9375000.00.

## The take column moves, and that is the trap

Take rises as the interest falls: 66.1723 percent at 100, 79.7034 at 60, 91.5431 at 25. The regime has not changed. What changed is that the engine's take compares the partner's scaled net cash flow with the field's unscaled pre-take value, so at 25 percent the number reads as the share of the field's value that this partner does not keep, which includes the other partners as much as the government. Quoting 91.5431 percent as the fiscal take of a 25 percent interest misreads the column; the government's share of the field is the 66.1723 percent on the 100 percent row, whatever interest is held.

## What it refuses

Working interest is one number for the whole life; it cannot step at a date or after payout. It scales money lines only, so volumes, prices and unit costs stay field-level. There is no carried interest and no partner-specific cost. And one caution for the Expert tier: an abandonment lump sum is entered as the user's share and is not scaled, so it must be typed already at the interest held.

## Exercise

Read the 2029 royalty, tax and net cash flow at 100 and at 40 percent and confirm each scales by the same factor. Then explain why the take at 40 percent reads 86.4689 percent when the government has not been given anything more.
