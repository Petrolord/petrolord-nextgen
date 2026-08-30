# And what it does not

The gap between a verified calculation and a real well.

## The distinction

**Verification** asks whether the code computes the specified method correctly. That is what the oracle comparison establishes, at better than one part in a million.

**Validation** asks whether the specified method describes a real well. That is answered by field measurement, over years, and this course has none of it.

## What field validation of drilling hydraulics looks like

A pressure-while-drilling tool measures the annulus pressure downhole while circulating, and the measured equivalent circulating density is compared against the computed one.

Published comparisons of that kind typically find agreement within five to fifteen percent of the circulating uplift, which is far worse than 1e-6 and is the number that actually matters.

## Where the difference comes from

**Cuttings in the annulus**, which the pressure calculation omits and which this tier showed is worth 10 to 20 kg/m3.

**Eccentricity**, which lowers the real annulus loss below the concentric calculation.

**Pipe rotation**, which changes it in either direction.

**Temperature**, which thins the mud downhole and lowers the loss.

**The rheology model itself**, which is a three-parameter fit to four readings taken at surface temperature.

## Which way each one goes

Cuttings raise the real pressure. Eccentricity lowers it. Temperature lowers it. Rotation does either.

So the errors do not all point one way, which is why the field comparisons come out within tens of percent rather than being systematically wrong by a factor.

## What that means for how the numbers are used

**Comparatively**, with confidence: this flow rate against that one, this mud against that one, this hole size against that one. The differences are much better determined than the absolute values.

**Absolutely**, with a margin: a computed equivalent circulating density within 10 kg/m3 of a fracture gradient is not a safe answer, because the model's own uncertainty is that size.

**Against a downhole measurement** where one exists, which converts the model from a prediction into an interpolation between measurements.

## The habit

Report a computed equivalent circulating density with the statement that it excludes cuttings, assumes concentric geometry, assumes no rotation and assumes surface-temperature rheology.

Four sentences, and they are the difference between a number and a number somebody can use.

## Exercise

Estimate the total uncertainty in a computed equivalent circulating density by combining a cuttings contribution of plus 15 kg/m3, an eccentricity effect of minus 10 percent of the uplift, and a temperature effect of minus 5 percent.

Compare the result against the uplift itself, and say what fraction of the answer the model's own uncertainty represents.
