# The mechanism gate

Past the water cut the mechanism decides, and the four mechanisms decide four different things about the same 75 percent water.

{{panel:pd-channel-explorer}}

## Four published histories, four verdicts nobody asserted

The golden file publishes four labelled histories of 40 samples each, t from 10.000000 to 3000.000000 days, with a late derivative slope for each. It publishes no expected mechanism, confidence, verdict or no expected block reason. The mechanism and verdict columns are derived: the shipped engine run on those published histories at the default window, which starts at t = 186.345364 days and covers the last 20 samples across 1.206802663 log cycles.

| History | Published slope | Engine slope, same window | Mechanism | Water shutoff | Reduce drawdown | Recompletion |
| --- | --- | --- | --- | --- | --- | --- |
| channelling | 1.600000000000 | 1.600000000000 | channelling | candidate | no | candidate |
| coning | -0.555098339661 | -0.539955222223 | coning | blocked | candidate | consider |
| displacement | 1.000000000000 | 1.000000000000 | displacement | blocked | no | consider |
| flat | null | n/a | displacement | blocked | no | consider |

## Only one row recommends the squeeze

Channelling is plumbing and can be sealed. Coning is drawdown pulling water through the same rock as the oil, so the squeeze is blocked and reduce drawdown becomes the candidate instead. Displacement is a swept reservoir and both are refused. Recompletion moves with the same reading: candidate on channelling, since a channel is often a cement bond or a perforation into the wrong interval, and consider elsewhere.

## Where the two routes separate

The published slopes are Theil-Sen, the median of every pairwise slope, and the engine fits ordinary least squares. On channelling and displacement they agree to 2.220446e-16 and 4.440892e-16. On coning they part in the second decimal, 1.514312e-2 apart, on data with no noise in it, because the coning shape is not a power law and the estimators weight a curved trend differently. The engine's coning fit reports a fit quality of 0.948751314445. Neither number is wrong, and neither measures a slope that exists.

## The flat history gets there by not being read

Every derivative on the flat history is 0.000000000, so the derivative fit returns ok = false with n = 0 and no slope. The classifier still returns a mechanism, displacement, at confidence n/a, and the shutoff is blocked. Its note reads "The ratio is sitting flat at 1.20 and its derivative is zero throughout. Nothing is changing, so there is no mechanism to diagnose and nothing on this well for an intervention to fix. That is a finding, not a failure to reach one."

## The mistake

Treating the three blocked rows as one. Coning is blocked with another treatment recommended in its place, displacement is blocked with nothing recommended, and flat is blocked on a reading that failed. A planner who records only "blocked" has thrown away the row that says what to do instead.

## Exercise

Run the four published histories in the panel and record the mechanism, the shutoff verdict and the drawdown verdict for each, with the window they were read on.

Then say which row would change if the coning history were fitted by Theil-Sen rather than least squares.
