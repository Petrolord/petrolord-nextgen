# The Ekene production wells

{{panel:pf-smoothing-explorer}}

Every series in this course comes from the Ekene field, and the Ekene field is synthetic. One generator draws it through the platform's seeded random numbers on a single stated seed, 20260925, shapes each decline with the decline curve engine, and rounds every rate to the tenth of a bbl/d. The same inputs give the same series anywhere, so a figure in a lesson is a figure you can reproduce.

## Six wells, each with a purpose

Each well was built to show one thing a forecaster meets in real data.

| well | months | what is planted |
| --- | --- | --- |
| EKENE-P1 | 48 | a clean hyperbolic decline |
| EKENE-P2 | 48 | a three month shut-in and a workover |
| EKENE-P3 | 48 | a facility-limited plateau |
| EKENE-P4 | 48 | a noisy allocation |
| EKENE-P5 | 48 | a steep decline to a low tail |
| EKENE-P6 | 3 | a new well, three months on production |

The declines were drawn from Arps curves with stated inputs. EKENE-P1, for example, was built from qi 1200 bbl/d, Di 0.06 per month and b 0.5, with noise of 3 percent. The decline curve analysis course teaches those equations; this course uses them only to explain why each well looks the way it does.

## What each well shows at this tier

EKENE-P1 is the teaching well. It declines steadily from 1176.100000 bbl/d in month 0 to 211.400000 bbl/d in month 47, and most worked figures in the Associate tier are fitted on it.

EKENE-P2 holds a shut-in. Months 22 to 24, counted from 0, are exactly 0, and from month 25 on the rate is lifted by a workover. Its months 20 to 27 read 439.800000, 364.000000, 0.000000, 0.000000, 0.000000, 456.100000, 469.700000 and 442.300000. A smoothing method sees those zeros as rates like any other.

EKENE-P3 is held by the facility at exactly 1500.000000 bbl/d for months 0 to 8, then declines. A flat start is a real pattern and it behaves differently under every method.

EKENE-P4 carries noise of 12 percent. Fitted with simple smoothing, it takes alpha 0.528376, where the other four long wells fit alpha at its upper bound 1. Noise makes the fit lean on the average of several months.

EKENE-P5 falls steeply to a low tail, ending at 11.100000 bbl/d. Holt's straight trend, fitted on it, runs below zero within the forecast, and the damped trend stays above zero. Module three reads that case.

EKENE-P6 has three months: 1075.800000, 963.100000 and 906.300000. Holt fits on three months with one scored error, which is the least it can work with.

## Why a synthetic field

A synthetic field lets every planted feature be stated and then found. The course can say that EKENE-P1 was drawn from a hyperbolic curve, because the generator did exactly that. On a real well no one knows the true shape, and a method's success on a synthetic well built for it says little about a field it was not built for. Keep that in mind wherever a lesson leans on how a well was made.

## Exercise

In the smoothing explorer choose "Fit a method" and step through the six Ekene wells with ses and alpha left blank. For each, write down the fitted alpha. Then load EKENE-P2, find the three zero months and the first month after them, and fit holt. Read the fitted parameters and compare them with holt on EKENE-P1.
