# Recovery from the non-consenting party's production

{{panel:joa-agreement-calculator}}

A premium is a sum owed. Under the mode "recover-from-production" nobody writes a cheque for it: the consenting parties take it, year by year, out of the value the operation produces that would otherwise belong to the declining party. This lesson reads that premium recovery ledger on the Ekene-4 sidetrack.

## The rule

The engine states where the premium recovery comes from and what happens in the year it ends:

> recovered each year from the non-consenting party's share of max(0, grossValue - deductions); in the year the premium is recovered the rest of that year's share is the non-consenting party's (reversion inside the period)

Each year of the call states a `grossValue` for the operation and its `deductions`. The engine takes the net value, floored at zero, and gives the non-consenting party its participating interest of it. That share of net value is what the premium recovery draws on. Until the premium is recovered, all of it goes to the consenting parties.

## The Ekene ledger

On the Ekene-4 sidetrack the 2031 year states a gross value of 30000000 with deductions of 10000000, and PB's share of net value is 3000000.000000 (engine). PB owes a premium of 10800000.000000 at the stated 400.000000 percent.

| year | opening | due | share of net value | recovered | closing | non-consenting party receives |
| --- | --- | --- | --- | --- | --- | --- |
| 2031 | 0.000000 | 10800000.000000 | 3000000.000000 | 3000000.000000 | 7800000.000000 | 0.000000 |
| 2032 | 7800000.000000 | 7800000.000000 | 2550000.000000 | 2550000.000000 | 5250000.000000 | 0.000000 |
| 2033 | 5250000.000000 | 5250000.000000 | 2100000.000000 | 2100000.000000 | 3150000.000000 | 0.000000 |
| 2034 | 3150000.000000 | 3150000.000000 | 1800000.000000 | 1800000.000000 | 1350000.000000 | 0.000000 |
| 2035 | 1350000.000000 | 1350000.000000 | 1500000.000000 | 1350000.000000 | 0.000000 | 150000.000000 |
| 2036 | 0.000000 | 0.000000 | 1200000.000000 | 0.000000 | 0.000000 | 1200000.000000 |

Read it as a running balance: each opening is the previous closing, and the recovered amount is the smaller of the due amount and the year's share. PB's interest reverts in 2035 (engine).

The engine writes each year in its own words. The first and the last lines of the ledger:

> PB 2031: 3000000 recovered of 10800000 due; 7800000 carried to 2032

> PB 2035: the balance 1350000 is recovered with 1350000 of the 1500000 available; the non-consenting party receives 150000 of its share 1500000

## What the premium recovery does not carry

The engine adds nothing to the balance while it waits. There is no uplift on the premium and no default interest on it: the multiple is the whole price of the risk, stated once. A contract that charged something on the unrecovered premium would state it, and this engine computes no such term. The gross values and deductions are stated inputs, so a computed premium recovery says what the stated terms produce and forecasts nothing a partner will pay.

## Two parties declining

When two parties decline, each has its own ledger on its own share, and the engine reports a reversion year for each. The consenting parties carry the whole cost in their shares of the project either way.

## Exercise

Open the agreement calculator on the view "Sole risk: the premium recovered from production", which starts on the Ekene-4 sidetrack with the control "Mode (stated)" on recovered from production. Trace the ledger: for every year, check that the opening equals the previous closing and that the recovered amount is the smaller of the due amount and the share of net value. Read PB's reversion tile. Then type "penalty" as the `mode` in the box and read the refusal:

> mode must be one of "recover-from-production", "buy-in"; got "penalty"

Set the mode back with the control. Last, state a premium multiple of 300 and read the year in which PB's interest now reverts.
