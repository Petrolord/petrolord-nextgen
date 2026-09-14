# NPV row by row

An NPV is the sum of every row's net cash flow divided by that row's factor, nothing more. ISIALA's twenty rows add to 208.0250 million USD of undiscounted cash and to an NPV of 81.0464 at 12 percent.

{{panel:ec-screening-explorer}}

## Building it from the ledger

Each row contributes its discounted net cash flow, and the NPV is their total. The first six rows of ISIALA:

| year | ncf | cumulativeNCF | factor | discounted ncf (derived) |
| --- | --- | --- | --- | --- |
| 2027 | -17.8210 | -17.8210 | 1.058301 | -16.8393 |
| 2028 | -26.7825 | -44.6035 | 1.185297 | -22.5956 |
| 2029 | 35.9654 | -8.6381 | 1.327532 | 27.0919 |
| 2030 | 31.4546 | 22.8165 | 1.486836 | 21.1554 |
| 2031 | 27.4850 | 50.3015 | 1.665256 | 16.5050 |
| 2032 | 23.9918 | 74.2934 | 1.865087 | 12.8636 |

The remaining fourteen rows are built the same way and are smaller twice over: the field declines, from 35.9654 in 2029 to 2.6534 in 2046, and the factor grows every year. The panel prints every row; add them and the total is the engine's 81.0464. Check the sign of each discounted row against its net cash flow: 2027 and 2028 stay negative at -16.8393 and -22.5956, and the positive rows from 2029 have to repay both before the running total turns positive.

## The discount rate moves only NPV

The published sweeps on the 10 year base case hold the ledger fixed and change the rate alone.

| case | npv | irr | payback |
| --- | --- | --- | --- |
| sweep_discount_0 | 908.4827 | 41.0683 | 3.1115 |
| sweep_discount_10 | 472.6082 | 41.0683 | 3.1115 |
| sweep_discount_20 | 234.9911 | 41.0683 | 3.1115 |

At a rate of 0 the NPV is 908.4827, which is exactly the closing cumulative of that case's ledger: with every factor at 1 the NPV is plain addition. As the rate rises the NPV falls, while the IRR and payback do not move at all, because neither uses the discount rate. A rate changes what the rows are worth today and changes nothing about when or whether they recover.

## Every row counts, including the bad ones

The screening engine has no economic limit, so every row of the twenty is in the sum. The edge field OKPOMA loses money in 2046, with net cash flow of -0.5576 on gross revenue of 4.4603 against opex of 4.5718, and that loss is discounted and subtracted from its NPV like any other row. A project that would really be shut in is valued as if it kept producing to the end of its fixed life.

## The mistake

The most common wrong answer is the undiscounted total. ISIALA's closing cumulative of 208.0250 is a real number, and it is not the value: quoting it as the NPV overstates ISIALA more than twofold. The second is to discount the cumulative column instead of the net cash flow column, which counts early cash again in every later year. The third is to compare NPVs struck at different rates: 472.6082 and 234.9911 are the same project.

## What it refuses

NPV reports one number at one rate. It does not say when the value arrives, how deep the hole is on the way, or how certain any row is: ISIALA's 81.0464 is built from a price of 70.0000 USD per bbl in every year and a decline that never varies.

## Exercise

Write ISIALA's discounted net cash flow for 2029 and 2032, and say why the later one is smaller for two reasons. Then give the base case NPV at rates of 0 and 20 percent, and say which ledger number the rate of 0 reproduces.
