# Arps from the decline curve engine

{{panel:pf-uncertainty-explorer}}

A data-driven forecast earns its place by beating something simpler that an engineer would otherwise use. On a producing well that something is the Arps decline curve. The forecasting engine fits no decline curve of its own: `arpsForecast` calls the platform's decline curve engine and returns what it gives. This module reads that baseline, and the next one ranks the smoothing methods against it.

## One engine, imported

The basis names the functions it calls and how they fit:

> engines/dca/arps.js fitArpsModel (exponential by log-linear regression, harmonic by 1/q regression, hyperbolic by a b grid from 0.05 by 0.05 to 2 on q^-b; Auto-Select takes the lowest RMSE) and calculateArpsHyperbolic

Nothing about Arps is re-implemented in the forecasting engine. The decline curve analysis course teaches the equations, the meaning of qi, Di and b, and what an Arps curve says about reserves; this tier uses the fit as a baseline and reads its figures.

## The five long wells

Auto-Select, the default, fits all three models and keeps the one with the lowest RMSE. On the five 48-month wells:

| well | model chosen | qi (bbl/d) | Di (per month) | b | R2 | RMSE (bbl/d) | forecast step 12 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| EKENE-P1 | Hyperbolic | 1202.685523 | 0.060069 | 0.500000 | 0.997703 | 12.956885 | 156.514309 |
| EKENE-P2 | Hyperbolic | 979.700443 | 0.057021 | 0.950000 | 0.963683 | 37.405719 | 216.506813 |
| EKENE-P3 | Exponential | 1861.561504 | 0.044394 | 0.000000 | 0.951869 | 100.897804 | 135.629910 |
| EKENE-P4 | Hyperbolic | 781.211681 | 0.033337 | 0.400000 | 0.898126 | 53.006394 | 183.066176 |
| EKENE-P5 | Hyperbolic | 701.883754 | 0.110048 | 0.100000 | 0.993426 | 14.469146 | 4.713170 |

EKENE-P1 was drawn from an Arps curve: the generator stated qi 1200, Di 0.06 per month and b 0.5, and added noise of 3 percent. The fit returns qi 1202.685523, Di 0.060069 per month and b 0.500000, with R2 0.997703. The field is synthetic and this well was built that way, so the close agreement is by construction. The other wells carry planted structure that an Arps curve does not describe: a plateau on EKENE-P3, where Auto-Select chooses the exponential; a shut-in and a workover on EKENE-P2; heavy noise on EKENE-P4, where R2 is lowest at 0.898126.

## A model asked for by name

`modelType` names one model to fit alone. On EKENE-P1:

| requested | model returned | qi | Di (per month) | b | RMSE |
| --- | --- | --- | --- | --- | --- |
| Auto-Select | Hyperbolic | 1202.685523 | 0.060069 | 0.500000 | 12.956885 |
| Exponential | Exponential | 1039.558801 | 0.036564 | 0.000000 | 42.600547 |
| Harmonic | Harmonic | 1782.533063 | 0.151910 | 1.000000 | 122.013020 |
| Hyperbolic | Hyperbolic | 1202.685523 | 0.060069 | 0.500000 | 12.956885 |

Auto-Select and Hyperbolic agree here because the hyperbolic fit has the lowest RMSE of the three. A model the engine does not offer is refused, naming the field `modelType`:

> modelType must be 'Auto-Select', 'Exponential', 'Harmonic' or 'Hyperbolic'

## What the baseline is for

The Arps fit reads the same thing the smoothing methods read: one rate series, oldest month first. It is a least-squares fit of a decline shape, and its forecast at step 12 comes from the fitted curve, so it keeps declining where a flat or damped forecast levels off. That makes it a fair baseline. Whether it forecasts better is a question for a backtest on the same origins, never for the R2 of a fit on months already seen.

## A b that prints alike

EKENE-P1's b prints 0.500000, and the value as returned is not the decimal it looks like. The decline curve engine's b grid accumulates its steps in floating point, so a grid value differs from its printed decimal in the last bits: here by 5.55e-17. Quote b at six decimals, as the course does, and never test it for equality with 0.5.

## Exercise

Open the view "The Arps baseline" with EKENE-P1 and Auto-Select, h 12. Read the model, qi, Di, b, R2 and RMSE, and the declared block headed THE ENGINE. Switch the model to Exponential and then Harmonic and write down each RMSE. Then start from EKENE-P4 with Auto-Select and write one sentence on what its R2 says about how well an Arps curve describes that well.
