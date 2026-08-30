# Uncertainty in a target

Two ellipses, and whether the well got there.

## The question

A target is a position with a tolerance: hit within fifty metres of this point at this true vertical depth. The well arrives with a computed position and an uncertainty ellipse.

Did it hit?

## The naive answer

Compare the computed position against the target centre. If it is inside the tolerance radius, the well hit.

That ignores the uncertainty entirely, and on the validation well the lateral uncertainty at total depth is comparable to a typical target radius. So the naive answer is a coin toss dressed as a fact.

## The better answer

The relevant question is the probability that the TRUE position is inside the target, given the computed position and the covariance.

That is an integral of the distribution over the target region, and it has no closed form for a general target shape. In practice people approximate: compare the target radius against the ellipse semi-axes in the target's direction, or Monte Carlo the distribution.

## The planning consequence

If the uncertainty is comparable to the target, the well cannot be shown to have hit whatever it does.

That is not a reason to give up; it is a reason to reduce the uncertainty BEFORE drilling. The mitigations in the previous module are planning decisions, and the target size is set by geology rather than by preference.

The design question is therefore: is the expected uncertainty at the target small enough that hitting the target can be demonstrated? If not, the survey programme has to change.

## The ellipse is not centred on the target

Worth stating explicitly, because plots make it easy to forget.

The ellipse is centred on the COMPUTED position, which may be anywhere relative to the target. The target has its own tolerance, centred on the target. Two different regions, for two different reasons.

The overlap of the two is what a hit means, and if the computed position is on the edge of the target with a large ellipse, the well is as likely outside as in.

## Target uncertainty

There is a third uncertainty that this model says nothing about: where the TARGET is.

A target is picked from seismic, depth-converted with a velocity model, and tied to wells whose own positions carry survey uncertainty. Its position uncertainty is frequently larger than the well's.

A hit calculation that treats the target as exact and the well as uncertain has the smaller uncertainty on the wrong object.

## What to report

Computed position, its covariance and the k it is quoted at, the target centre and its tolerance, and the separation between the two expressed in units of the combined uncertainty.

That last one is a separation factor, exactly analogous to the anti-collision statistic in the Expert tier, and it is the number that answers the question.

## The misconception to avoid

"The well hit the target because the computed position is inside it." The computed position is a point estimate. Whether the well hit is a probability, and the probability depends on an ellipse that on a long horizontal well is comparable in size to the target. Reporting a hit without the uncertainty is reporting the estimate as though it were the measurement.

## Exercise

A target is a circle of 50 m radius. A well arrives with its computed position 30 m from the target centre, and a lateral uncertainty of 40 m at one sigma in the direction of the offset.

Argue qualitatively whether this should be reported as a hit, and state what you would need to compute a probability.
