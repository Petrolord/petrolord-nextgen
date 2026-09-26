# Reliability, resolution and uncertainty

{{panel:ae-trust-explorer}}

The Brier score is one number, and the calibration module showed that it mixes two properties: whether the probabilities mean what they say, and whether they separate relevant rows from the others. The Murphy decomposition pulls the score apart into terms that measure each, plus a term that belongs to the outcomes alone.

## The identity, in the engine's words

> Brier = REL - RES + UNC + WBV - WBC (Stephenson, Coelho and Jolliffe 2008, eq. 7): REL = sum n_k (mean p_k - observed_k)^2 / N, RES = sum n_k (observed_k - base rate)^2 / N, UNC = base rate (1 - base rate), WBV = sum (p - mean p_k)^2 / N, WBC = 2 sum (y - observed_k)(p - mean p_k) / N (the fifth term of their eq. 7, so twice the pooled within-bin covariance); closure = Brier - that sum (0 up to rounding)

The terms use the reliability table's bins: n_k rows in bin k, of N in all.

## The three classic terms

**Reliability, REL**, is the squared gap of the reliability table, weighted by each bin's rows. It is small when each bin's mean probability matches its observed frequency, and it enters the Brier score with a plus sign: poor calibration costs.

**Resolution, RES**, is how far each bin's observed frequency sits from the base rate, squared and weighted. It is large when the bins' frequencies differ from the base rate, which is what a system that separates relevant from not relevant does. It enters with a minus sign: separation earns.

**Uncertainty, UNC**, is base rate x (1 - base rate). It depends on the outcomes alone. No system can change it.

## The Ekene calibration set, ten bins

| term | value (10 bins) |
| --- | --- |
| reliability REL | 0.080032 |
| resolution RES | 0.064570 |
| uncertainty UNC | 0.153900 |
| within-bin variance WBV | 0.000689 |
| within-bin covariance term WBC (twice the pooled within-bin covariance) | 0.001669 |
| REL - RES + UNC + WBV - WBC | 0.168382 |
| Brier | 0.168382 |

Uncertainty is 0.190000 x 0.810000, 0.153900. Reliability, 0.080032, is the cost of the over-confidence the reliability table showed in every bin. Resolution, 0.064570, is the credit for the bins' observed frequencies moving away from 0.190000, most of all in bin 9, where 0.904762 of the rows are relevant.

The three classic terms alone do not reach the Brier score. REL - RES + UNC is 0.169362, and the Brier score is 0.168382. The missing piece is the within-bin terms, which the next lesson takes up.

## One bin resolves nothing

Put every row in one bin and the bin's observed frequency is the base rate itself. Resolution is then 0.000000: one bin cannot resolve anything. Reliability becomes the squared distance between the overall mean probability and the base rate, 0.043806. A single bin tests only the average.

## How the terms move with the bins

REL and RES are computed on the bins, so each can move when the bin count changes, while UNC and the Brier score never do. A decomposition is quoted with its bin count, exactly as ECE and MCE are.

## Exercise

Open the trust explorer on "The Murphy decomposition" with the Ekene set loaded at 10 bins. Confirm the table above and the closure. Set the bins to 1 and read REL and RES; check that RES is 0 and REL matches the figure above. Then try 5 and 20 bins and, for each, write down which terms moved and which stayed still, with the bin count beside every figure.
