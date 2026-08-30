# It always succeeds

The property that makes calibration useful and dangerous.

{{panel:td-friction-explorer}}

## The claim

For any hookload between the value at the lower bracket and the value at the upper one, the bisection returns a friction factor. It never fails, never warns, and never says the target was implausible.

On the build-and-hold well, pick-up hookloads from 906096.6898234246 N at 0.15 to 1180875.3171955291 N at 0.50 are all reachable, and so is everything between.

## Why that is useful

Because the alternative is worse. A calibration that failed half the time would be abandoned, and the factor would go back to being a book value that describes no well in particular.

A procedure that always returns something means the calibration gets done, and a calibrated model tracks the well.

## Why that is dangerous

Because the returned number carries no information about whether the model was right.

Suppose the survey has a section missing, so the model thinks the well is less deviated than it is. The modelled friction is too low, so the fitted factor comes out too high. It reproduces the hookload exactly, and it is wrong.

Suppose the tool joint diameter was left blank. The torque is a quarter low and the hookload is barely affected, so a hookload-based fit does not notice, and the torque prediction that follows is a quarter low.

Suppose the mud weight in the model is 1440 and the actual mud is 1500. The buoyed weight is too high, so the modelled hookload is too high, so the fitted factor comes out too LOW to compensate.

In all three the fit succeeded and the model is wrong in a way the fit hid.

## The test that does catch it

Fit on one observation and PREDICT another.

Fit the factor to a pick-up hookload, then predict the slack-off hookload and compare against what the rig read. If the model is right, both match. If the factor absorbed something that is not friction, they will not, because the thing it absorbed does not act symmetrically.

That is a genuine test and it costs nothing. Most calibration procedures skip it.

## The stronger test

Fit on hookload and predict TORQUE.

Hookload depends on friction times side force through the axial cosine; torque depends on the same product through the tangential cosine and the tool joint radius. A factor that absorbed a geometry error will usually not reproduce both.

The panel does this: fit a factor to an observed hookload and it shows you the torque that factor then implies, next to the torque the book value implies.

## Exercise

Fit a factor on the build-and-hold well to a pick-up hookload of 1100000 N, and read the torque it implies.

Then compare against the torque at the book factor of 0.35, express the difference as a percentage, and say what you would conclude if the rig's measured off-bottom torque matched the book value rather than the fitted one.
