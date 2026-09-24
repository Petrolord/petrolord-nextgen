# What is not built

{{panel:dq-outliers-explorer}}

An honest reading of a tool starts with what it does not do. The quality engine builds no test for several outliers, no robust covariance, no CUSUM design helper, no plausibility range for any basin or tool, no grade band, no unit conversion and no fallback when the MAD is zero. Each absence has a named substitute, stated in the engine's basis blocks and messages.

| not built | what the engine does instead |
| --- | --- |
| a test for several outliers (generalised ESD) | Grubbs for one, and the masking it suffers is shown in the Professional tier |
| a robust covariance for Mahalanobis | the classical estimate, labelled "sample covariance (n - 1), classical (not robust)" |
| a CUSUM design helper from alpha and beta | k and h are inputs with a stated unit |
| plausibility ranges for any basin or tool | definitional limits only; the caller supplies ranges |
| grade bands for a scorecard | a total and the weakest dimension |
| unit conversion | an unlisted unit is refused |
| a fallback when the MAD is zero | a refusal |

## One outlier at a time

Grubbs tests for one outlier. On EKENE-7's core plugs it rejects with G 2.985356 against a critical 2.507321. Add a second high plug and G falls to 2.275359: the test no longer rejects, because the sample SD rises from 0.019859 to 0.024800 with the second plug in it. That is masking. NIST points to the generalised ESD test for several outliers, and the engine does not build it. A policy that expects more than one outlier runs a median based test beside Grubbs and says so.

## A classical covariance

The Mahalanobis distance uses the classical mean and the sample covariance, and those are themselves pulled by outliers. The engine labels its basis exactly so. On EKENE-7's oil sand it flags entry 60 at d^2 22.397696 against a cutoff of 7.377759, and the engine offers no robust alternative to set beside it.

## Where the output needs reading with care

Four points in the engine's output need care.

The ceiling on |z| follows the chosen standard deviation. With the population SD on nine zeros and a one, at threshold 2.9, the engine returns a ceiling of 3.000000, `thresholdReachable` true and 1 flag at z 3.000000, and its basis names the ceiling "sqrt(n - 1), population SD". With the sample SD the same ten values reach 2.846050 at most.

A reason string prints every figure as the shortest decimal that reads back to its field, so a computed statistic can print every digit. The flag above reads, verbatim, "value 1 has z = 2.9999999999999996, beyond the threshold 2.9", and its `statistic` field at six decimals is 3.000000.

The Mahalanobis refusal for a singular covariance uses an absolute pivot test inside lib/linalg. Variables with very small variance in the caller's units can be refused as singular, and rescaling them avoids it.

The Hampel decision is imported from the petrophysics engine, whose own entry point turns a null into 0. The quality engine converts missing values to NaN before the call, so its results are unaffected.

## Why list the absences

A user who assumes a tool builds something it does not will read its silence as an answer. A scorecard with no grade band is silent on whether 0.927390 is good; a Grubbs test that does not reject on two high plugs is silent on whether either is an outlier. Knowing what is not built tells the reader which silences are answers and which are gaps.

## Exercise

In the outliers panel's Grubbs view, run EKENE-7's core plugs and confirm G 2.985356 and a rejection. Change the plug at entry 2 to 0.279000 and confirm G 2.275359 and no rejection. Then run the modified z-score view on the same two-plug series and list the entries it flags. Write one sentence for a quality note on what the Grubbs result alone would have hidden.
