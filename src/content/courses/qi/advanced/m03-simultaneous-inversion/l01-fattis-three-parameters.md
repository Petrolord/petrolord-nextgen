# Fatti's three parameters

Post-stack inversion recovers one property, AI (acoustic impedance). The angle stacks carry more: the reflection changes with angle, and the way it changes depends on the shear contrast and the density contrast as well. Simultaneous inversion reads all three from the near, mid and far stacks at once. On the Ekene pack the coefficients that weight each parameter show at a glance which of the three the angles can see.

{{video:qi-f16}}

## The linearisation

Fatti and others (1994), in the engine's `fattiCoefficients`, write the reflection at angle theta as a sum of three small contrasts:

R(theta) = G1 dln(AI) + G2 dln(SI) + G3 dln(rho)

with G1 = (1 + tan^2 theta) / 2, G2 = -4 K^2 sin^2 theta, G3 = (4 K^2 sin^2 theta - tan^2 theta) / 2, and K the background Vs/Vp. SI is shear impedance, Vs x density. The contrasts are differences of logs, as in the post-stack model, now with three unknowns.

The Professional tier read intercept and gradient off the same stacks with the Shuey fit, which the Rock Physics course teaches in full.

## The solver

`simultaneousInversion` runs pylops' PrestackLinearModelling with the Fatti linearisation, kind centred. It solves for ln(AI), ln(SI) and ln(rho) together by CGLS, the solver of the model-based lesson, with each parameter pulled towards its own LFM by its own weight. Three LFMs, three weights and one wavelet per stack are all stated inputs; the course states weights of 0.050000 for each and 60 iterations.

## The Ekene background

K is the mean of Vs / Vp over every logged sample of the four pack wells in the window: 0.394396. The coefficients at that K:

| angle degrees | G1 (AI) | G2 (SI) | G3 (density) |
| --- | --- | --- | --- |
| 0 | 0.500000 | 0.000000 | 0.000000 |
| 10 | 0.515546 | -0.018761 | -0.006165 |
| 20 | 0.566237 | -0.072783 | -0.029846 |
| 30 | 0.666667 | -0.155548 | -0.088893 |
| 40 | 0.852044 | -0.257075 | -0.223507 |

## Reading the table

At normal incidence only AI contributes. At every angle G1 is the largest, so AI is the parameter every stack sees.

G2 grows steadily with angle and is the second voice. G3 is negative and the smallest of the three in size at every non-zero angle in the table, and it grows fastest between 30 and 40 degrees. Density is the parameter the angles see least. At the pack's near angle of 10 degrees G3 is -0.006165.

That ordering is the forecast for the module: AI recovered well, Vp/Vs less well, density worst. The next lessons test it at the wells.

## What K does

K enters G2 and G3 through K^2 and leaves G1 untouched. On the pack it is one number for the window, averaged over sand and shale at four wells, and every SI and density figure depends on it.

## What a study states

The angle of each stack, K and its samples, the three LFMs, the three weights, the iterations and one wavelet per stack.

{{panel:qi-inversion-explorer}}

## Exercise

In the inversion explorer, set View to "Simultaneous inversion by stacks" and Data to "Ekene teaching pack". Read the background Vs/Vp under the stack table and the angle of each stack. Set Well to Ekene-1, "The well's own log" to left out, "Stacks used" to near, mid and far, the weights to 0.050000, 0.050000, 0.050000 and Iterations to 60, and read the correlation and error for AI, Vp/Vs and density. Write one sentence on whether the order of the three matches the order of G1, G2 and G3 at 30 degrees.
