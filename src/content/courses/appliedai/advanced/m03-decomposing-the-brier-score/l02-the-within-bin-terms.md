# The within-bin terms that close the identity

{{panel:ae-trust-explorer}}

Reliability and resolution treat every row in a bin as though it carried the bin's mean probability, although a bin from 0.6 to 0.7 holds 0.61 and 0.69 alike. The two within-bin terms account for that spread, and with them the Brier score equals its decomposition exactly.

## The source and its labels

Stephenson, Coelho and Jolliffe (2008) write the Brier score out in their eq. 7 with five components, and the line after it names them: BS = REL - RES + UNC + WBV - WBC. The fifth component of the equation is

-(2/N) sum over bins k and rows j in bin k of (y_kj - observed_k)(p_kj - mean p_k)

and WBC is that term without its minus sign. So the factor 2 belongs to WBC as the paper labels it: WBC is twice the pooled within-bin covariance. The engine's WBC is the paper's, and the identity it closes is Brier = REL - RES + UNC + WBV - WBC, with no further 2 anywhere. This course calls it the within-bin covariance term WBC, and when it names the covariance itself it says WBC is twice it.

The fourth term, the within-bin variance WBV, is the spread of the probabilities inside each bin.

## Six rows, worked by hand

Six stated rows with probabilities 0.61, 0.62, 0.64, 0.66, 0.68 and 0.69 and outcomes 1, 0, 1, 0, 1, 1 all fall in bin 6. The bin's mean probability is 0.650000 and its observed frequency 0.666667:

| p | y | p - mean p | y - observed | product |
| --- | --- | --- | --- | --- |
| 0.61 | 1 | -0.04 | 0.333333 | -0.013333 |
| 0.62 | 0 | -0.03 | -0.666667 | 0.020000 |
| 0.64 | 1 | -0.01 | 0.333333 | -0.003333 |
| 0.66 | 0 | 0.01 | -0.666667 | -0.006667 |
| 0.68 | 1 | 0.03 | 0.333333 | 0.010000 |
| 0.69 | 1 | 0.04 | 0.333333 | 0.013333 |

The products add to 0.02, and divided by the 6 rows that is the pooled within-bin covariance, 0.003333. WBC as the paper labels it is 2 x 0.003333 = 0.006667, which is the engine's figure. WBV squares the probability deviations instead: they add to 0.0052, and over 6 rows that is 0.000867. With these two terms the closure on the six rows is 0.

Drop the 2 from WBC and the identity no longer closes.

## On the Ekene calibration set

At 10 bins the two within-bin terms are small: WBV 0.000689 and WBC 0.001669. They are small because each bin is a tenth wide, so no row can sit far from its bin's mean. Without them REL - RES + UNC is 0.169362, and the Brier score is 0.168382. With them the sum is 0.168382 and the closure is -8.33e-17, rounding in the last bits of a double.

The closure comes back with every call. A closure near 1e-16 says the five terms and the Brier score agree; one the size of a term would say a term was wrong.

## Reading the sign of WBC

WBC is positive when, inside a bin, the rows with higher probabilities are more often the relevant ones: the system ranks well even within the bin. It enters the identity with a minus sign, so that ranking lowers the Brier score.

## Exercise

Open the trust explorer on "The Murphy decomposition". Clear both boxes and type the six stated rows: outcomes 1, 0, 1, 0, 1, 1 and probabilities 0.61, 0.62, 0.64, 0.66, 0.68, 0.69, at 10 bins. Confirm WBV, WBC and the closure. Then swap the outcomes of the first two rows, predict the sign of the change in WBC from the table above, and read the engine's figure.
