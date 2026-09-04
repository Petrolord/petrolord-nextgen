# A guard that fires by accident

`logLogSlope` computes its fit quality as `r2 = syy > 0 ? (sxy * sxy) / (sxx * syy) : 1`, and the value after the colon is a guard for the case where every y is identical.

{{panel:pd-candidate-explorer}}

## What the guard was for

A fit through identical y values has no variance to explain, so the ratio defining r-squared is zero over zero. The author chose a side: hand back a perfect fit, since a horizontal line through identical points misses nothing. Whether that is right is a separate argument. The question here is when the branch runs.

## Where it does run

A derived case, four points with y identical at 5, comes back ok = true, slope 0.000000e+0, r2 1.000000e+0, n = 4. The guard returned 1.000000e+0, which is 0.000000e+0 short of the value the branch exists to produce. Four copies of one logarithm average back to that logarithm exactly here, so every deviation is exactly zero, `syy` is exactly zero, and `syy > 0` is false.

A sweep of the sample count against the value says how little that generalises. At n = 3 and n = 4 it fires on every value tried. At n = 5 it splits, firing on y = 5 and not on y = 0.9. From n = 8 it mostly does not fire. There is no rule here a caller could hold in their head.

## Where it does not, which is on real data

Real data reaches this branch through logarithms, and the cancellation stops being exact. A ratio rising exactly logarithmically has an exactly constant derivative. The teaching demonstration is WOR = 2.0 + 0.9 ln t, 20 samples from t = 20 to 2000 days, the derivative reported as 0.900000000 at every one. The fit through those identical derivatives, over the late window `chanDiagnosis` reads at its default `lateFraction` of 0.5, starting at 225.767578 days, returns a slope of -9.465333e-33 and an r-squared of 2.271680e-31.

There `syy` does not accumulate to zero. It lands around 1e-31, `syy > 0` is true, and the ordinary formula runs on a denominator that is pure rounding noise.

## What that number then meets

`minR2` is 0.5, held as a fraction, and a fit quality of 2.271680e-31 fails it by every digit it has. The error text prints the same quantity as a percentage, so 0.5 in the defaults and 0.0 in the message are one fit quality in two scales.

## The mistake

Assuming a guard that is written is a guard that runs where you need it. This one is correct in intent, fires on small tidy cases, and misses the case it was written for. That pattern survives a test suite and fails in production, which is worse than dead code: dead code is harmless once you know it is dead.

## Exercise

Write down what the guard was intended to return, what the four-point derived case returns, and what the constant-derivative demonstration returns over the late window from 225.767578 days. Then say why the two differ, and name the gate that turns the second into a refusal.
