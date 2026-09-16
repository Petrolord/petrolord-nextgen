# Working the capstone

A graded screening question hands you a field's quick inputs and asks for readings. The method is to expand the case, prove two ledger rows by hand, read the value metrics against their flags, and only then read the range.

{{panel:ec-screening-explorer}}

## Step one: write the case before any arithmetic

Copy the quick inputs and write down what the engine will do with them: a 20 year life from the first year, capex half in each of the first two years, fixed opex flat, variable opex as volume times its rate over a million, and one price in every year. On ISIALA, 4400 bopd makes 1606000.0000 bbl in 2027, capex 180 makes 90.0000 twice, and variable opex at 13 USD per bbl makes 20.8780. If year 1 does not match, nothing downstream will.

## Step two: prove a capex row and a tax row

| year | grossRevenue | royalty | capex | opex | tax | ncf |
| --- | --- | --- | --- | --- | --- | --- |
| 2027 | 112.4200 | 16.8630 | 90.0000 | 23.3780 | 0.0000 | -17.8210 |
| 2029 | 87.0580 | 13.0587 | 0.0000 | 18.6679 | 19.3660 | 35.9654 |

In 2027 revenue less royalty, capex and opex is negative, so tax is 0.0000 and the net cash flow is -17.8210. In 2029 the same base is positive and 35 percent of it is 19.3660. A tax above 0.0000 in 2027 means the base was not allowed to go negative. A 2029 tax too high means royalty was left in the base.

## Step three: value, one flag at a time

Discount by the mid-year factor: 2029's 35.9654 over 1.327532 is 27.0919, and the twenty rows sum to 81.0464. Read payback from the cumulative column, 3 + 8.6381 / 31.4546 = 3.2746. Read irrStatus ok beside the IRR of 53.7148 percent. Read peak exposure with its sign, -44.6035.

Then read each beside its status. A payback of null with paybackStatus not-recovered means the cumulative never turned non-negative. A payback of 0.0000 says no-investment when no year was under water and recrossed when a later year was, as OKPOMA's -2.2287 in 2028 shows, where paybackLast 2.0385 is the real recovery. An IRR of null names its reason: NTEJE reports irrStatus no-root on an NPV of -123.9923.
## Step four: the range, with its limits

Name what each sensitivity row scales: Production is narrower than Oil Price, 4.1176 against -17.3893 at 0.7, because variable opex follows the volume. Read the scenarios' NPVs first, -57.8151, 81.0464 and 226.0140, and read Low's payback and High's IRR with the status printed beside them. Never write a P-label on a scenario.

## Step five: three closing checks

The totals must close: 864.1699 less royalty 129.6255, capex 180.0000, opex 210.4887 and tax 136.0307 leaves 208.0250, the closing cumulative. Government take on every row is royalty plus tax, 13.0587 and 19.3660 making 32.4247 in 2029. And the NPV mid-year over the NPV at year end is the first factor, 81.0464 over 76.5817 giving 1.058301.

## The mistake

The careful mistake is to read the metrics straight off the summary card. Every number on it is true to the engine, and payback and IRR can be a status.

## What the method refuses

It proves two rows and trusts eighteen. It cannot say whether the price or the decline is right, and it attaches no probability to the range.

## Exercise

Build ISIALA's 2027 and 2029 rows from the quick inputs and confirm -17.8210 and 35.9654. Then run the three closing checks and say which value metric on the High scenario you would refuse to quote as a rate.
