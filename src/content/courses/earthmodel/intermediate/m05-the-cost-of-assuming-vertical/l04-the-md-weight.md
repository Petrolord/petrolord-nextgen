# The MD weight

The control point convention has a second half: the weight. Each well's zone value carries a weight equal to the zone interval's measured depth length, and this lesson examines what that choice quietly does when one well in the set is deviated.

## The weights on the golden model

Zone A weights: W1 35, W2 120, W3 45, W4 46. W2's weight is 2.6 to 3.4 times everyone else's. In any weighted statistic downstream, W2 speaks with the loudest voice in the zone by a wide margin: of the total weight of 246, W2 holds 48.8 percent, W1 14.2, W3 18.3, W4 18.7.

## What the weight is trying to measure

The intent of interval-length weighting is reasonable: a well that crossed more of the zone sampled more of it, and its average property value deserves more trust. For vertical wells, MD length IS rock thickness, and the weight does what it intends: W4's 46 m of zone A against W1's 35 m is a real difference in sampled rock.

For W2 the two quantities part company. Its 120 m of measured depth crosses only 84.8528137423857 m of vertical rock, the factor being $\cos 45^\circ$. Measured against rock sampled, W2 deserves a weight of about 85, not 120: the MD convention overweights it by $1/\cos I$, about 41 percent. The deviated well gets extra votes for the sideways part of its journey, which sampled the same stratigraphic level repeatedly rather than more of the zone.

Is the overweight WRONG? Defensible answers exist on both sides. The hole did log 120 m of the formation, and log statistics computed over that interval average 120 m of measurements; weighting by measurement count is a legitimate convention too. What matters at this tier is to SEE that MD weighting and thickness weighting diverge exactly when deviation appears, know the factor, and know which one your engine uses. This engine uses MD, documented, and the Expert tier's graded value of 0.28631191845445614 for a block's weighted porosity is computed with the 120.

## Sensitivity, quantified

How much does the choice move the answer? The zone A weighted mean porosity over all four wells with MD weights is 0.2903935560727246 (the fixture's stored constant). Recompute with W2's weight cut to its TVD thickness of 84.8528137423857 and the mean becomes 0.2898648855680765: a shift of 0.0005286705046481099, about half a porosity unit in the third decimal, because W2's value of 0.2935651232824187 sits near the middle of the four values. The lesson generalises: weighting conventions matter most when the heavily weighted well is also an OUTLIER in value. Here it is not, and the convention is cheap; a field where the deviated well is also the anomalous one is where the convention becomes a fight worth having.

## The weight survives the vertical assumption

Note from last lesson's panel experiment: assuming W2 vertical moves its control point 211 m but leaves the weight at 120, because MD length is measured along the hole regardless of assumed shape. So the two conventions fail independently: bad trajectory corrupts the LOCATION but not the WEIGHT; the MD-versus-thickness question biases the WEIGHT but not the location. A full accounting of a deviated well's influence on a property model has to check both, separately.

## Worked example

Compute W2's zone B weight and its thickness-based alternative. MD interval: 1700 to 1760, weight 60. Vertical rock crossed: $60 \cos 45^\circ = 42.42640687119297$ m, agreeing with the trajectory-derived thickness from module two to the last digit because the whole interval lies in the hold. So the MD convention overweights zone B by the same 41 percent factor, as it must: the overweight factor depends only on the hold angle, not on the zone. Any zone crossed in the hold inherits the identical $1/\cos 45^\circ$.

## Exercise

A five-well set has zone weights 30, 30, 30, 30 and 150, the last from a highly deviated well crossing the zone at 60 degrees inclination. Compute the deviated well's share of total weight under the MD convention, then under thickness weighting (thickness equals MD times cosine of inclination), and state in one sentence the condition under which the difference between the two shares would materially move the zone's weighted mean.
