# The recovery order is a stated term

{{panel:gsa-ledger-calculator}}

When a buyer holds make-up and takes gas, which gas is the year's own and which is make-up? The answer moves both the make-up recovered and what the year counts. The texts answer differently, so the engine takes the recovery order as a required input with no default.

## Three orders in the texts

The Commonwealth model gas sales agreement (2025, Creative Commons Attribution 4.0, read 2026-09-26) takes make-up only after the buyer has taken the Adjusted ACQ of the year. ESMAP Report 152/93 (January 1993, read 2026-09-26) describes a lower threshold:

> "Normally, make-up quantities are accounted for after the minimum-pay quantity for the year has been taken." (ESMAP Report 152/93 (1993) para 6.59)

The HMRC Oil Taxation Manual (OT05435, updated 19 December 2019, read 2026-09-26) names two orders:

> "in priority over that period’s contract amount; or only when the minimum for that period has been taken." (HMRC Oil Taxation Manual OT05435 (updated 19 December 2019))

The engine computes three orders and states which one is the reference text's. Its basis on the power plant ledger, verbatim:

> after-adjusted-acq: make-up only after the Adjusted ACQ of the year is taken (Commonwealth Secretariat, Gas Sales Agreement, Contract 2 in the Commonwealth Model Contract Series (2025, CC BY 4.0) Article 12.7.1 (Alternative 1&2A)); a required input with no default. 'after-adjusted-acq' is the reference text's order (Commonwealth Secretariat, Gas Sales Agreement, Contract 2 in the Commonwealth Model Contract Series (2025, CC BY 4.0) Article 12.7.1); 'after-top-quantity' and 'first' are variants the engine also computes.

So `after-top-quantity` (ESMAP's) and `first` (make-up in priority) are variants beside the reference order. Anything else is refused:

> makeUp.order must be one of "after-adjusted-acq", "after-top-quantity", "first"; got "fifo"

## The same years under each order

Each case below has an ACQ of 1000.000000, take-or-pay at 80 percent and a 2027 deficiency of 200.000000 paid and opened as make-up. Only the order differs.

| order | 2028 taken | 2028 make-up taken | 2028 counted | 2028 deficiency |
| --- | --- | --- | --- | --- |
| after-adjusted-acq | 1100.000000 | 100.000000 | 1000.000000 | 0.000000 |
| after-top-quantity | 1100.000000 | 200.000000 | 900.000000 | 0.000000 |
| first | 1100.000000 | 200.000000 | 900.000000 | 0.000000 |
| first | 800.000000 | 200.000000 | 600.000000 | 200.000000 |

Under the model agreement's order the buyer recovers only what it takes above the Adjusted ACQ, 100.000000, and the other 100.000000 expires at the end of 2029. Above the take-or-pay quantity the threshold is lower, so all 200.000000 comes back in 2028. The last row has the sharpest edge: under `first`, a take of 800.000000 counts only 600.000000 against the year and opens a fresh deficiency of 200.000000. The engine's reason says so: "2028: make-up of 200 taken from the make-up aggregate 200 (make-up taken in priority, before the year's own quantity), first in first out: 200 from 2027"

No order is the law. Each is a term the parties write, and a make-up figure is quoted with its order and period.

## Exercise

Work in the course's own ledger calculator, on the view "The take-or-pay ledger".

1. Replace the power plant inputs with three years of your own: `acq` 1000 in each year, taken 600, 1100 and 1000, `contractPrice` and `topPrice` 3, `makeUpPrice` 0, `topPct` 80, and `makeUp` with `periodYears` 2, `order` "after-adjusted-acq" and `endOfTerm` "forfeit". Check the first row of the table.
2. Change `order` to "after-top-quantity", then to "first". For each, write the 2028 make-up taken, counted and deficiency.
3. With `order` "first", change the 2028 take to 800 and read the new 2028 deficiency and its reason.
4. Set `order` to "fifo" and read the refusal.
