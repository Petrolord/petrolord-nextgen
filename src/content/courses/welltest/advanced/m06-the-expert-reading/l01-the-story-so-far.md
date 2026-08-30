# The story so far

Five modules, and a set of limits on what a well test can say.

## The claim

A regression is a better measurement than a straight line, and it introduces a new class of error: it will fit any model you name, report parameters and confidence intervals for it, and give you no signal that the model was wrong or that a parameter was never constrained by the data.

## What each module established

**Module 1.** A model fit uses every point instead of a window, models wellbore storage instead of discarding it, and has no asymptotic bias, so on the buildup it recovers the planted 85 mD, 6.5 skin and 0.015 bbl/psi storage to six significant figures where the best straight line was three percent low. The residuals are logarithmic, so every decade of the log-log plot carries equal weight, and the derivative enters the residual vector alongside the pressure so that the fit has to match the shape and not only the level. Every parameter is fitted inside bounds, several on a logarithmic scale, and the skin is bounded at zero for every model except the homogeneous one because the effective-radius mapping does not commute with image wells or fissure functions.

**Module 2.** The confidence interval on that fit is about five parts in a billion, and it measures how well the optimiser converged rather than how well the reservoir is known. The sealing-fault model fitted to the same boundary-free buildup converges on a fault at about three thousand feet with a tight interval, and rewriting the identical pressure change in an arithmetically equivalent way, a difference of 4.547473508864641e-13 psi, moves that fault 116.33147724595392 ft to a non-overlapping interval while the permeability does not move at all. The dual-porosity model on the same data drives omega to its bound of 1, recovers the right permeability and skin, and reports that it failed to converge.

**Module 3.** Superposition generalises to any rate history. The equivalent producing time for a three-rate history is nearly twice the duration of the final rate period. The multi-rate semilog recovers the permeability to about two percent, while treating the last period alone as a fresh drawdown reports 119.41136566441537 mD against a planted 85, plus 40.483959605194556 percent, with a skin nearly double the truth and an r squared of 0.9998.

**Module 4.** Gas needs pseudo-pressure: between 2000 and 4000 psia the m(p) ratio is 3.30320493814433 where pressure squared would say 4, so the shortcut overstates the drive by about a fifth. The liquid machinery is reused through an adapter whose formation volume factor is a constant in the hundreds of thousands and is not a fluid property, and whose skin is an apparent skin containing a rate-dependent term. Two accepted deliverability methods on the same three points return absolute open flows about four percent apart, and the one with the far better r squared returns the larger.

**Module 5.** Production data measure the connected VOLUME where a transient measures flow capacity. Material-balance time makes a variable-rate history behave like a constant-rate one, and on the oil fixture the flowing material balance recovers the oil in place to a sixth of a percent and the productivity index to a fifth. Gas needs material-balance pseudo-time as well, solved by iterating the dynamic material balance, and on the gas fixture pseudo-time is 0.5080083613335826 of material-balance time by the end of the record. Transient linear flow recovers the product of half-length and root permeability exactly and cannot split it.

## The five failures, in one place

| what went wrong | effect on permeability | effect on skin |
|---|---|---|
| window included wellbore storage | factor of 3.7 low | sign inverted to stimulated |
| semilog line past a sealing fault | about half | sign inverted |
| fractured well read as radial | five times high | strongly negative |
| rate history ignored | 40 percent high | nearly doubled |
| extra parameter with nothing to constrain it | none | none, and a fault at 3000 ft |

Every row is correct data, correct arithmetic and a defensible-looking fit.

## Exercise

For each of the five rows, name the single check that would have caught it, and say at which point in a workflow that check belongs.
