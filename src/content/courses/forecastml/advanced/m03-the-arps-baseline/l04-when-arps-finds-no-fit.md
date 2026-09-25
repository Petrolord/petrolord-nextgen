# When Arps finds no fit

{{panel:pf-uncertainty-explorer}}

An Arps curve describes a decline. A series that does not decline gives it nothing to describe, and the decline curve engine then finds no fit with a finite, positive qi and a positive Di. The forecasting engine refuses the call and says exactly why.

## A rising series

Pass the rising series 100, 120, 150, 190, 240 to `arpsForecast`. The call is refused, naming the field `y`, in these words:

> y gives no Arps fit: fitArpsModel found no exponential, harmonic or hyperbolic fit with finite qi > 0 and Di > 0 on the 5 positive values (a least-squares line through the rates on the log, reciprocal or q^-b scale that shows no decline gives Di <= 0)

Read the parenthesis closely. Each model is a least-squares line through the rates on its own scale. On a rising series every such line slopes the wrong way, the Di it implies is 0 or below, and no model survives.

Ask for one model by name and the message names that model alone:

> y gives no Arps fit: fitArpsModel found no exponential fit with finite qi > 0 and Di > 0 on the 5 positive values (a least-squares line through the rates on the log, reciprocal or q^-b scale that shows no decline gives Di <= 0)

## Inside a comparison

In a comparison the smoothing methods and the Arps baseline are fitted at every origin on the training window alone. If a window leaves Arps nothing to fit, the comparison is not refused: the arps row carries no metrics and an error, and it is left out of the ranking. The smoothing methods are still scored and ranked.

The course's stated case is the series 900, 880, 0, 0, 0, 0, 0, 0, 870, 860, 850, 845, compared from first origin 6, horizon 2, step 2. At origin 6 the training window has two positive months, and the arps row reads:

> at origin 6 the training window has 2 positive values: fitArpsModel needs at least 3 (it drops zero and negative rates)

The arps row is unranked, and the smoothing methods rank ses, damped, holt.

## What to write

A baseline that cannot be fitted is a finding about the data. Write down that Arps had no fit, where, and the engine's words for why. Never quote a ranking on such a well as though the baseline had been beaten: it was never in the race.

## Exercise

Open the view "The Arps baseline", type the series 100, 120, 150, 190, 240 and read the engine's words. Change the model to Exponential and read them again. Then open "Methods ranked against Arps", type the twelve-month series above with first origin 6, horizon 2 and step 2, and read the ranking, the unranked list and the arps row's error.
