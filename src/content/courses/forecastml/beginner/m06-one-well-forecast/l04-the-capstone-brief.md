# The capstone brief

{{panel:pf-smoothing-explorer}}

The Associate capstone hands you a field of producing wells and asks for six numbers. Every one answers this tier's question, smoothing a rate series into a forecast, and every one is a value the engine returns. Each has a worked twin in this tier, computed on an Ekene well with the same rule.

| the kind of field | the rule it tests | a worked twin in this tier |
| --- | --- | --- |
| a fitted simple smoothing alpha | ses, alpha left free | EKENE-P4, 0.528376 |
| the MSE of a Holt fit with its parameters given | SSE over the scored errors, alpha and beta held fixed | EKENE-P1 at alpha 0.5 and beta 0.2, 635.441241 |
| a fitted Holt beta | holt, alpha and beta left free | EKENE-P1, 0.381513 |
| a Holt forecast at a named step | holt fitted, the h-step forecast at that step | EKENE-P4, step 12, 172.008815 |
| a fitted damped phi | damped, every parameter left free | EKENE-P1, 0.960949 |
| a damped forecast at a named step | damped fitted, the h-step forecast at that step | EKENE-P1, step 12, 169.556510 |

## What each field asks of you

The alpha field asks for the fitted value. A fitted alpha may land inside the box or on a bound; either is an answer, and `atBounds` tells you which.

The MSE field asks for the SSE divided by the scored errors only. Holt spends month 1 on the start, so on a 48-month series it divides by 46. Dividing by the number of months gives a different, wrong figure.

The beta field asks for the beta Holt fits when alpha is left free as well. A beta fitted with alpha given is a different number.

The two forecast fields each ask for one step of the h-step forecast, counted from 1 past the last month. Step 1 of a 48-month series forecasts month 48. Read the step the brief names, and check you have not read a fitted value from inside the series instead.

The phi field asks for a fitted phi, searched from 0.8 to 0.98. A phi you type in is a given phi, and it answers a different question.

## How to work it

Read the brief for its wells, its months and any parameter it gives, and use exactly those. Check for missing months first: the engine refuses a null by name. Fit each method with only the stated parameters given, and read `converged` and `atBounds` before you copy a number. Before you open the capstone, reproduce every twin in the table in the smoothing explorer and check each to the last printed digit.

## What the capstone will not ask

It asks for no error on held-back months and no comparison of methods on months the fit never saw. Those are the Professional tier's. It asks for no interval around a forecast and nothing from a decline curve fit, which are the Expert tier's. An answer that brings any of them in has answered a question nobody asked.

## Exercise

Reproduce all six worked twins from the table in the smoothing explorer. Use "Fit a method" for the fitted alpha, beta and phi and for the MSE with parameters given, and "h-step forecasts" for the two forecasts at step 12. For each, write down the well, the method, which parameters were given and which fitted, and the figure.
