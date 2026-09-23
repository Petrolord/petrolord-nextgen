# The printed constant and its reciprocal

{{panel:dq-outliers-explorer}}

The modified z-score multiplies by 0.6745. The Hampel window multiplies the MAD by 1.4826. These two constants look unrelated and are one idea written from opposite sides, and the engine keeps both exactly as their sources print them.

The engine's exported constants and the derived comparison on the gauge:

| what | value |
| --- | --- |
| `MODIFIED_Z_SCALE`, Iglewicz and Hoaglin as NIST/SEMATECH 1.3.5.17 prints it | 0.6745 |
| `HAMPEL_MAD_SCALE`, the petrophysics conditioning engine | 1.4826 |
| 1 / 1.4826, derived | 0.674491 |
| modified z of gauge entry 7, the engine with 0.6745 | 186.162000 |
| modified z of gauge entry 7 with 0.674491, derived | 186.159450 |

## What the constant is for

For data drawn from a normal distribution, the raw MAD is smaller than the standard deviation by a fixed factor. Scaling the MAD up by 1.4826 turns it into an estimate of the standard deviation, which is how the Hampel window uses it: a threshold of nSigma times 1.4826 x MAD is a threshold in standard deviation units. The modified z-score does the same job from the other side. It keeps the raw MAD in the denominator and multiplies the numerator by 0.6745, which is the reciprocal of that scale factor to the four decimals Iglewicz and Hoaglin printed.

## Printed or exact

The reciprocal of 1.4826 is 0.674491 to six decimals. The engine uses 0.6745, the figure as printed. On the gauge glitch the difference shows in the second decimal: 186.162000 with the printed constant, 186.159450 with the reciprocal.

The engine uses the printed figure so its output matches the published page. A reader holding NIST/SEMATECH 1.3.5.17 can reproduce the engine's modified z-score with a calculator and the constant on the page, and a reader holding the engine can check it against the source. A constant computed to more places would sit closer to the Hampel scale and would no longer match the page.

That is a choice, and the alternative is reasonable. The engine takes the printed constant, names it `MODIFIED_Z_SCALE` in its exported `CONSTANTS`, and writes the formula it used into the basis block of every result.

## Does it matter

On the gauge the two versions differ at 186.162000 against 186.159450, and both are far beyond 3.5, so the flag is the same. The difference only decides a flag when a value sits almost exactly on the threshold. A report that quotes a modified z to six decimals should say which constant it used, because at that precision the two are different numbers.

The same care applies when comparing the modified z with a Hampel flag on the same value. The Hampel threshold is built with 1.4826 and the modified z with 0.6745, and the small gap between them means the two rules are not exactly interchangeable at the edge.

## Naming the spread

In this course a spread built from the MAD is always named with its scale: the raw MAD inside the modified z-score, or 1.4826 x MAD inside the Hampel window. The engine's basis blocks name them the same way.

## Exercise

Open the explorer's modified z view with the gauge readings and read the formula the engine reports in its basis block. By hand, recompute the modified z of entry 7 twice, once with 0.6745 and once with 0.674491, and check that you reach 186.162000 and 186.159450. State in one sentence which constant you would quote in a report and why.
