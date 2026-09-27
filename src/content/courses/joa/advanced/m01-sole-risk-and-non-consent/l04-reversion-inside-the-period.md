# Reversion inside the period

{{panel:joa-agreement-calculator}}

The premium recovery ends in some year, and in that year the declining party's share of net value is usually larger than the balance left. The contract has to say who takes the rest. The engine's stated convention is reversion inside the period: once the balance is paid off, the rest of that year's share already belongs to the non-consenting party.

## Three cases side by side

The engine's recovery rule ends with that convention:

> recovered each year from the non-consenting party's share of max(0, grossValue - deductions); in the year the premium is recovered the rest of that year's share is the non-consenting party's (reversion inside the period)

Two small golden cases show the boundary. In each, A holds 50, B 30 and C 20 percent of a well costing 1000.000000; A and B consent and C declines at a multiple of 300.000000 percent, so C's premium is 600.000000.

| case | year | due | share of net value | recovered | closing | C receives |
| --- | --- | --- | --- | --- | --- | --- |
| last barrel | 2030 | 600.000000 | 200.000000 | 200.000000 | 400.000000 | 0.000000 |
| last barrel | 2031 | 400.000000 | 400.000000 | 400.000000 | 0.000000 | 0.000000 |
| last barrel | 2032 | 0.000000 | 200.000000 | 0.000000 | 0.000000 | 200.000000 |
| mid-year | 2030 | 600.000000 | 200.000000 | 200.000000 | 400.000000 | 0.000000 |
| mid-year | 2031 | 400.000000 | 600.000000 | 400.000000 | 0.000000 | 200.000000 |
| mid-year | 2032 | 0.000000 | 200.000000 | 0.000000 | 0.000000 | 200.000000 |

On the last barrel the share of 2031 equals the balance exactly. The premium recovery takes all of it, C receives nothing that year, and its whole share comes back from 2032. The engine says so:

> C 2031: the balance 400 is recovered exactly by the 400 available; the non-consenting party receives 0 of its share 400

In the mid-year case the 2031 share is larger than the balance, and the rest is C's inside the year:

> C 2031: the balance 400 is recovered with 400 of the 600 available; the non-consenting party receives 200 of its share 600

Both cases report that C's interest reverts in 2031 (engine). The Ekene sidetrack behaves as the mid-year case: in 2035 PB's share of net value is 1500000.000000 against a balance of 1350000.000000, and PB receives 150000.000000 that year.

## Why the convention matters

A contract could hold the whole payout year for the consenting parties and revert only from the next year. That choice would move money between parties in the payout year and nowhere else: on the mid-year case, C's 2031 receipt of 200.000000 would go to A and B. The texts this course reads print no payout-year rule, so the engine states its convention, and a partner report that quotes a payout-year receipt names it too. The balance, the premium and every year before the payout are the same under either choice.

## Exercise

Open the agreement calculator on the view "Sole risk: the premium recovered from production" and replace the whole box with the last-barrel case:

```
{"parties":[{"id":"A","participatingPct":50},{"id":"B","participatingPct":30},{"id":"C","participatingPct":20}],
 "consenting":["A","B"],"operation":{"name":"well","cost":1000},
 "premiumMultiplePct":300,"mode":"recover-from-production",
 "years":[{"year":2030,"grossValue":1000,"deductions":0},{"year":2031,"grossValue":2000,"deductions":0},{"year":2032,"grossValue":1000,"deductions":0}]}
```

Read C's ledger, its reversion tile and the 2031 reason. Then change the 2031 `grossValue` from 2000 to 3000 and read the same three things again. Write two sentences: what C receives in 2031 in each case, and why the reversion year is the same in both.
