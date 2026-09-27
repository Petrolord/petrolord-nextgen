# Net value and deductions

{{panel:joa-agreement-calculator}}

The premium recovery draws on a share of net value, so the net value is where a premium ledger starts. The engine takes it as the gross value of the operation less its stated deductions, and it never lets it fall below zero.

## What each year states

Every year of a recovery call states two figures:

- `grossValue`, the value the operation produces that year;
- `deductions`, the costs the contract lets the consenting parties take off before the premium recovery, for example the operating cost of the operation, as the contract lists them.

Which costs count as deductions is a contract term. The engine takes the figure as stated and computes net value as max(0, grossValue - deductions). The non-consenting party's share is its participating interest of that net value.

On the Ekene-4 sidetrack the six years state their gross values and deductions, and PB's share of net value falls as the well declines:

| year | share of net value (engine) | recovered | non-consenting party receives |
| --- | --- | --- | --- |
| 2031 | 3000000.000000 | 3000000.000000 | 0.000000 |
| 2032 | 2550000.000000 | 2550000.000000 | 0.000000 |
| 2033 | 2100000.000000 | 2100000.000000 | 0.000000 |
| 2034 | 1800000.000000 | 1800000.000000 | 0.000000 |
| 2035 | 1500000.000000 | 1350000.000000 | 150000.000000 |
| 2036 | 1200000.000000 | 0.000000 | 1200000.000000 |

## Deductions above the gross value

A year can cost more to run than it earns. The engine then sets the net value to zero, recovers nothing that year and carries the whole balance to the next. It never turns a negative net value into a charge on the declining party. The golden case with two declining parties shows it: A alone consents to a well costing 1000.000000 at a premium multiple of 100.000000 percent, and B and C decline. Its first year states deductions above the gross value, and the engine writes:

> 2030: deductions 150 exceed the gross value 100: no net value, nothing recovered

| party | participating interest | premium | 2030 recovered | 2031 share of net value | 2031 recovered | 2031 receives |
| --- | --- | --- | --- | --- | --- | --- |
| B | 30.000000 | 300.000000 | 0.000000 | 1200.000000 | 300.000000 | 900.000000 |
| C | 20.000000 | 200.000000 | 0.000000 | 800.000000 | 200.000000 | 600.000000 |

Both balances wait a year untouched. In 2031 each is recovered from its own share of the same net value, and both interests revert in 2031 (engine). Each declining party has its own ledger: the engine never pools two premiums into one balance.

## Why this belongs in a report

Two figures drive the timing of every premium recovery: the stated multiple, which sets how much is owed, and the stated net value, which sets how fast it is paid. A partner report quotes both. It names what the deductions include, because a wider list of deductions slows the premium recovery and pushes the reversion year later, with the premium unchanged.

## Exercise

Open the agreement calculator on the view "Sole risk: the premium recovered from production", which starts on the Ekene-4 sidetrack. In the box, change the 2032 `deductions` from 9000000 to 30000000, which is above that year's gross value of 26000000. Read PB's 2032 row and the reason the engine writes for it, then read the reversion tile and state the year PB's interest now reverts. Put the deductions back, then set 2031's `deductions` equal to its `grossValue` of 30000000 and read that year's row. Write one sentence on what a zero net value does to the premium recovery and one on what it does to PB.
