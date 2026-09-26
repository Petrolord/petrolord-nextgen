# Buy-in at a stated multiple

{{panel:joa-agreement-calculator}}

A party that declined an operation may later want in. A buy-in lets it enter by paying the consenting parties a stated multiple of its proportionate share of the cost, at once. The engine computes it with the same `nonConsent` function as premium recovery from production, under the stated mode "buy-in".

## The same base, a different mode

The base does not change between the two modes: the entering party's proportionate share of the cost of the operation. On the Ekene-4 sidetrack, costing 18000000.000000, PB's proportionate share is 2700000.000000. Under the mode "buy-in" at a stated multiple of 1000.000000 percent, PB pays 27000000.000000 to enter (engine). The engine writes the payment in its own words:

> PB: to enter it pays 1000% of its share 2700000 = 27000000, apportioned to the consenting parties in their shares

| mode | multiple | base | what PB owes | when |
| --- | --- | --- | --- | --- |
| buy-in | 1000.000000 | 2700000.000000 | 27000000.000000 | at once, to enter |
| recover-from-production | 400.000000 | 2700000.000000 | 10800000.000000 | out of its share of net value |

## A buy-in states no years

A buy-in is a single payment, so a call in this mode takes no production years. A box that states them is refused, and the engine prints the years it was given:

> years must be left out when mode is "buy-in"; got [{"year":2031,"grossValue":30000000,"deductions":10000000},{"year":2032,"grossValue":26000000,"deductions":9000000},{"year":2033,"grossValue":22000000,"deductions":8000000},{"year":2034,"grossValue":19000000,"deductions":7000000},{"year":2035,"grossValue":16000000,"deductions":6000000},{"year":2036,"grossValue":14000000,"deductions":6000000}]

The refusal is the engine keeping a term from being silently dropped: a box that carried years into a buy-in would suggest a premium recovery ledger the call never computes.

## The multiple is still stated

The multiple has no default in either mode. The same refusal guards both:

> premiumMultiplePct must be a number at or above 100 (a stated contract figure; 100 recovers the cost alone); got nothing

A buy-in at 100 percent would let the entering party in at its cost alone, with nothing for the risk the others ran. Any figure the contract states at or above 100 is accepted.

## The consenting list

The consenting parties are named once each, in the list `consenting`. The payment goes to them, so the list decides who is paid. A party named twice is refused before anything is computed:

> consenting[1] must be an id not already listed; got "EKO"

Every party the list leaves out is a non-consenting party, and each one pays its own entry on its own proportionate share.

## Exercise

Open the agreement calculator on the view "Buy-in at a stated multiple". It starts on the Ekene-4 sidetrack with the mode stated as a buy-in payment and the multiple at 1000. Read the tile for what PB pays to enter and the reason under the tables. Use the control "Premium multiple, percent (stated)" to state 400 and read the payment again, then compare it with PB's premium on the sole risk view at the same multiple. Last, paste the `years` list from the sole risk box into this box and read the refusal.
