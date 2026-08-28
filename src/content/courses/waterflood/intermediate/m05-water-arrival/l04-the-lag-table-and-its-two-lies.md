# The lag table and its two lies

Cross-correlating injector rates against producer rates looks like it should answer the central question of this tier: which injector supports which producer, and how long does the response take. The engine computes it. The result on Ekene is wrong in two independent ways, and both are structural rather than statistical, which makes this the most useful negative result in the course.

## What the engine computes

For each injector-producer pair: first-difference both series to remove the shared trend, then compute the Pearson correlation at each lag from 0 up to a maximum, and keep the lag with the highest positive correlation. Pairs whose peak correlation clears a threshold are reported, sorted strongest first.

First-differencing matters. Without it, an injection ramp and a producer decline are both trending, and any two trending series correlate strongly at every lag for reasons that have nothing to do with connectivity.

## The Ekene result

| injector | producer | lag | correlation | overlap |
|---|---|---|---|---|
| Ekene-2 | Ekene-5 | 6 | 0.798407395054563 | 29 |
| Ekene-4 | Ekene-5 | 6 | 0.7984073950545626 | 29 |
| Ekene-2 | Ekene-3 | 3 | 0.7810227961471732 | 32 |
| Ekene-4 | Ekene-3 | 3 | 0.781022796147173 | 32 |
| Ekene-4 | Ekene-1 | 2 | 0.7771615767762312 | 33 |
| Ekene-2 | Ekene-1 | 2 | 0.7771615767762309 | 33 |
| Ekene-2 | Ekene-6 | 0 | 0.7718602890660337 | 35 |
| Ekene-4 | Ekene-6 | 0 | 0.7718602890660337 | 35 |

Eight rows, all with correlations near 0.78, all apparently strong.

## The first lie: the units

The column is called `lag_days`. The engine counts lag in ROWS, and Ekene's rows are monthly. So these are lags of 0, 2, 3 and 6 MONTHS, mislabelled as days.

That is a genuine trap in the engine, and the reason it exists is that the surveillance schema was designed for daily rows, where a row is a day and the label is correct. Feed it monthly rows and the arithmetic is still correct while the label is not.

The general form of this problem: any routine that counts samples and reports a time will be wrong whenever the sample interval changes. Check the cadence of the data against the units of the output, every time.

## The second lie: the injectors are indistinguishable

Look down the correlation column in pairs. Ekene-2 and Ekene-4 against Ekene-5: 0.798407395054563 and 0.7984073950545626. Against Ekene-3: 0.7810227961471732 and 0.781022796147173. Against Ekene-1: 0.7771615767762312 and 0.7771615767762309. Against Ekene-6: identical to all sixteen digits.

Every producer returns the SAME lag and essentially the same correlation for both injectors. The differences are in the fifteenth decimal place, which is floating point, not information.

The reason is in the fixture design. The injection split is a fixed 0.6 to Ekene-2 and 0.4 to Ekene-4 for the whole record, so the two injectors' rate series are exact scalar multiples of each other. Correlation is invariant under scaling. Two series that differ only by a constant factor have identical correlations with everything.

So the method cannot separate them, in principle, on this data. Not with more data, not with a better estimator, not with a longer record. The information required is not present.

## Why this matters beyond Ekene

Proportional injectors are not a quirk of a teaching fixture. Fields routinely operate injectors from a common header at a fixed split, or ramp the whole flood together, or shut the field in for maintenance and restart everything at once. Whenever injectors move together, rate correlation cannot attribute a producer's response between them.

The identifiability requirement for these methods, including capacitance resistance modelling, is that the injectors vary INDEPENDENTLY. That is an operational requirement, not a data-processing one, and if you want connectivity from rate data you have to design for it: stagger the shut-ins, vary the rates independently, run a rate test on one injector at a time.

## And the lags themselves are backwards

One more thing, for completeness. The planted flood response in the fixture has Ekene-6 responding first at 3 months, then Ekene-1 at 5, Ekene-3 at 6, and Ekene-5 at 9. The correlation table reports the reverse ordering: Ekene-6 at 0, Ekene-1 at 2, Ekene-3 at 3, Ekene-5 at 6.

The ORDER happens to be right, which is a genuine partial success. The VALUES are all too small, roughly half the planted lags. First-differencing an injection ramp against a producer whose rate is a smooth response to it produces a correlation peak that is biased toward zero lag, because the differenced series are dominated by the shared ramp rather than by the response delay.

## The honest summary

The lag table on Ekene gets the ranking of response times roughly right, gets the values wrong by about a factor of two, labels months as days, and cannot distinguish the two injectors at all. That is a diagnostic worth running for its ordering and worth trusting for nothing else.

## The misconception to avoid

"Correlation of 0.78 across eight pairs is strong evidence of connectivity." All eight pairs share the same underlying field trend, and the two injectors are scalar multiples. High correlation here measures the strength of the common signal, not the strength of any particular connection. A correlation is only evidence of connectivity if the candidate drivers can be told apart.

## Exercise

First, prove that the Pearson correlation of $x$ with $y$ equals that of $\alpha x$ with $y$ for any $\alpha > 0$, and use it to explain the identical correlations in the table.

Second, design a two-month field test on Ekene that would let rate correlation distinguish the two injectors. State what you would change, for how long, and what production you would risk.
