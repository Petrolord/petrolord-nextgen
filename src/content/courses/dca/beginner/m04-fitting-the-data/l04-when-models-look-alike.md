# When models look alike

Ekene-1 was the easy case: an exponential well, fitted with an exponential model, R2 exactly 1. This lesson runs the uncomfortable experiment. Take a well whose true model you know, deliberately fit it with the wrong one, and see whether the statistics catch you. On a three year window, mostly they do not.

{{panel:dca-fit-explorer}}

## The experiment

Select Ekene-3 in the panel with the primary window. This is the hyperbolic well: 34 monthly rows from 2020-03-01, where it opens at exactly 150 stb/d, through 2022-12-01, where it reads 37.3132007885523 stb/d. The planted truth is $q_i = 150$ stb/d, $D_i = 0.002$ per day, $b = 0.5$.

Now work the model selector through all three families and write down what comes back.

| Model forced | qi (stb/d) | Di (per day) | R2 | RMSE (stb/d) | Tier |
|---|---|---|---|---|---|
| Hyperbolic (correct) | 150.000000000000 | 0.00200000000000000 | 1.00000000000000 | 4.14314051144892e-14 | Excellent |
| Exponential | 137.390666611994 | 0.00136416266227741 | 0.987334417750128 | 3.58830309063897 | Excellent |
| Harmonic | 179.338857993516 | 0.00359325039110851 | 0.951593684935824 | 7.01499799089027 | Excellent |

Read the last column again. Two models that are provably wrong about this well, fitted to data with no noise in it whatsoever, both land in the Excellent band. The correct hyperbolic recovers the planted parameters to fourteen decimal places, and the quality tier cannot tell it apart from the two impostors.

So the first rule of this lesson: **R2 does not choose your model.** A three year window of a gently declining well simply does not contain enough shape to separate the Arps family. The engine reports a decline exponent of 0.49999999999999994 for the correct fit, which is the planted 0.5 arriving as a raw floating point value, and it would report something with equal confidence if you had asked for a family that cannot describe the well at all.

## What the wrong fits had to do to survive

The impostors did not get away with it for free. Look at what each one paid.

The forced exponential cannot bend the way a hyperbolic does, so it compromises. It lowers qi from the true 150 to 137.390666611994 stb/d, which means its very first prediction misses the well's opening month by 12.6093333880061 stb/d, 8.40622225867073 percent of the actual rate. That is its worst month, and the misses that follow are not random: across the 34 rows the fitted curve runs below the data for the first seven months, above it for the next nineteen, and below it again for the final eight. A residual pattern that changes sign in orderly blocks like that is the signature of a wrong model, and it is visible on the semilog plot in a way it is not visible in a single number.

The forced harmonic compromises in the opposite direction. Harmonic declines are flatter in the tail than $b = 0.5$, so to match the observed drop the fit has to start much higher: qi 179.338857993516 stb/d, missing the opening month by 29.3388579935164 stb/d, 19.5592386623443 percent high. Its RMSE of 7.01499799089027 stb/d is 1.95496250280271 times the exponential's, and 9.31188487385036 percent of the window's mean rate of 75.3338135718343 stb/d.

That comparison is the practical takeaway. RMSE ranked the three models correctly even when the quality tier could not, because RMSE keeps its units and its resolution. This is exactly why Auto-Select picks on lowest RMSE rather than highest R2, and on this window it picks the hyperbolic without hesitation.

Stop before reading on and predict, for each forced model, whether its curve starts above or below the well's first month. Then check the qi column. Getting the sign right from the shape of the model is worth more than memorising either table.

## Where the disagreement lives

Three models can agree over the data and still disagree about everything that matters, because what matters is outside the data. Follow the three curves forward from the same fitted parameters:

| Time (days) | True rate | Forced exponential | Forced harmonic |
|---|---|---|---|
| 365 | 80.5055750110695 | 83.5052143457569 | 77.5842675701083 |
| 1036 | 36.1855944665954 | 33.4334177350111 | 37.9745430027676 |
| 1825 | 18.7955204009711 | 11.3956487077711 | 23.7293470211050 |
| 3650 | 6.93721817551162 | 0.945193823374231 | 12.7052238195246 |

Inside the fitted window, to 1036 days, the three columns are within a few barrels a day of each other. At five years the forced exponential is already predicting 0.606295993123038 of the true rate. At ten years the forced harmonic predicts 13.4419242967209 times the rate of the forced exponential, and the truth sits between them. Everything that decides a reserves booking, the tail, the life of the well, the volume still to come, is being set by the model choice that R2 declared it could not care less about.

## What to do about it at this level

Four habits, all of them available to you in the panel today.

**Compare RMSE, not R2, when you are choosing between families.** R2 saturates near the top of its range and stops discriminating. RMSE keeps counting.

**Look at the residual pattern.** Scatter that flips sign at random is noise. Misfit that curves, negative then positive then negative, is a structural mismatch. The statistic averages that away; your eye does not.

**Prefer the model the physics suggests, and say so.** Solution gas drive, transient flow and boundary dominated flow have known decline signatures. A number cannot referee that argument, and it should not have to.

**Say how long your window is.** A model chosen on 34 months of clean data and extrapolated to ten years is an extrapolation more than a fit, and the honest booking memo says which one it is.

The Professional tier of this course takes this exact problem apart under its real name, the b problem: how much history it takes before the decline exponent is genuinely identified, and what to do while you are waiting. For now, know that the question exists and that a high R2 is not an answer to it.

## Exercise

Repeat the experiment on Ekene-5, the harmonic well, over its primary window. Force the exponential model and record qi, Di, R2, RMSE and the tier, then do the same with the harmonic model, and compare the two RMSE values. Note which of the two fits reports a lower qi than the well's actual opening rate of 100 stb/d, and explain that direction from the shape of the two decline families rather than from the numbers.
