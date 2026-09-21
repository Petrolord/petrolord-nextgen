# The TWA restates the noise dose

{{panel:hy-noise-dosimeter}}

The OBEN record gives a PEL noise dose of 27.748183 percent and a PEL TWA of 80.752126 dBA. Those are one fact written twice. The TWA is the constant sound level that, held for 8 hours, would give the same noise dose against the same criterion.

The formula is TWA = K log10(D/100) + Lc, where D is the noise dose in percent, Lc the criterion level and K a coefficient. OSHA prints K = 16.61 with Lc = 90. NIOSH prints K = 10.0 with Lc = 85. The engine's door for it is `noiseTwaFromDoseDbA`.

## One record, three restatements

| criterion | noise dose, percent | TWA, dBA |
| --- | --- | --- |
| OSHA PEL | 27.748183 | 80.752126 |
| OSHA action level | 72.054478 | 87.635749 |
| NIOSH noise REL | 265.610944 | 89.242460 |

The PEL TWA of 80.752126 dBA sits below the PEL criterion level of 90 because the noise dose sits below 100 percent. The NIOSH TWA of 89.242460 dBA sits above 85 because the noise dose sits above 100 percent. The action level and the PEL share a criterion level and a coefficient, so their two TWAs differ only because the thresholds let different periods in.

## Reading the formula

At a noise dose of exactly 100 percent the logarithm is zero and the TWA equals the criterion level. On OSHA Table A-1 a noise dose of 100.000000 percent gives 90.000000 dBA. On NIOSH Table 1-2 it gives 85.000000 dBA.

Doubling the noise dose adds one decibel exchange rate, near enough. On OSHA, 200.000000 percent gives 95.000108 dBA. On NIOSH, 200.000000 percent gives 88.010300 dBA. The small amounts past 95 and 88 come from the printed coefficients, and two lessons in this module are about them.

Halving works the same way downwards. On OSHA, 50.000000 percent gives 84.999892 dBA and 25.000000 percent gives 79.999784 dBA.

## What the TWA is for

A TWA lets a reader compare a day with a level they already know. A noise dose of 27.748183 percent is hard to picture. A TWA of 80.752126 dBA can be set beside the criterion level and read at a glance. The two carry the same information, so a report should give both and name the criterion once for the pair.

The one case with no TWA at all is a noise dose of zero, where the logarithm has nothing to work on. A later lesson in this module reads that edge and the refusal the engine gives for it.

## Exercise

Take the OBEN action level noise dose of 72.054478 percent. Put it into TWA = 16.61 log10(D/100) + 90 and check that you reproduce the 87.635749 dBA the engine reports. Then take the NIOSH noise dose of 265.610944 percent through TWA = 10.0 log10(D/100) + 85 and compare your answer with 89.242460 dBA.
