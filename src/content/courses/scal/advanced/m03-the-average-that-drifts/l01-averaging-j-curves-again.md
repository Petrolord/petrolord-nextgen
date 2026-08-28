# Averaging J curves, again

You met `averageJCurves` in the Professional tier as a convenience: several plugs go in, one reservoir candidate comes out. This module reads the same routine adversarially. The question is no longer what the average does for you but what it does to the numbers on the way through, and the answer is one of the sharpest lessons this course has to offer: three of the routine's four moves are exact, and the fourth is not.

Recall the four moves. First, every sample's J rows are normalized onto the reduced saturation axis, $S_w^* = (S_w - S_{wirr})/(1 - S_{wirr})$, with a shared irreducible saturation when you supply one. Second, each normalized sample is resampled onto a common $S_w^*$ grid, 41 points spanning the overlap of all the samples, through the tabulated evaluator. Third, the grid values are combined with a geometric mean, because J is log-distributed, and a min to max band is kept beside the mean. Fourth, a power law is refit to the mean curve, and that fit is offered as the reservoir jSpec candidate.

Normalization is arithmetic on exact inputs. The geometric mean is arithmetic on whatever the grid holds. The refit is a least squares problem solved to machine convergence. None of those three moves invents anything. The resample is different in kind: between the grid points where a sample was actually measured, the evaluator has to make values up, and the way it makes them up has a shape of its own.

## The benchmark: what exact looks like

Before measuring what the resample costs, establish the exact baseline. Take one Ekene plug, say EK3-P, compute its J table from the committed lab rows, and hand the raw points straight to `fitJPowerLaw` with the true irreducible saturation given:

$$S_{wirr} = 0.25$$

The fit returns $a = 0.25$, $b = 1$, with $r^2_{\log} = 1$. Not approximately: the fitted parameters reproduce the designed field curve to machine precision, because the fixture's lab tables were generated from that curve through the engine's own scaling and the collapse back is exact. The direct route, raw points to fit, loses nothing.

Hold onto that. Every number in this module is measured against a case where the truth is planted and perfectly recoverable. If a pipeline drifts here, on noise-free data that a direct fit nails exactly, the drift belongs to the pipeline. In the field you will never have this luxury, which is exactly why the fixture arranges it: it is the only way to see the machinery's own fingerprint separated from the data's.

## Where the resample has to guess

The lab grid runs from $S_w$ 0.30 to 1.00 in steps of 0.05, which on the reduced axis with $S_{wirr} = 0.25$ puts the first two nodes at $S_w^* = 0.06666666666666665$ and $S_w^* = 0.1333333333333333$. The common grid that `averageJCurves` builds has 41 points across that span, and most of those 41 points do not land on the 15 measured nodes. At every off-node point the tabulated evaluator interpolates: linearly in $\log J$ against $S_w^*$.

At the nodes themselves the evaluator returns the measured values untouched. So the question of what averaging costs collapses to a narrower one: what does log-linear interpolation return between nodes, and how far is that from the designed curve? The next lesson measures it exactly, and the answer is not symmetric noise. It has a sign, it has a shape, and it concentrates where the curve bends hardest.

## The misconception to avoid

The misconception is that averaging more data always improves an estimate. Averaging suppresses independent noise, and when plugs disagree because of measurement scatter, the geometric mean genuinely earns its keep. But the Ekene plugs carry no noise at all, and the average still comes back different from the truth, because the cost of the resample is not noise. It is bias, and bias does not average away. More plugs on the same grid would reproduce the same bias exactly. When someone tells you a number is trustworthy because it came from an average of many samples, the right follow-up question is what the pipeline did to each sample before the averaging step.

## Exercise

First, list the four moves of `averageJCurves` in order and state for each one whether it can alter the information content of exact input data, with one sentence of justification per move.

Second, the direct fit on EK3-P above used $S_{wirr} = 0.25$ as a given. Explain what would change, and what would not, if the fit were run without supplying it, using what the Professional tier taught about the data-minimum heuristic. State specifically whether the failure mode you describe is noise or bias.
