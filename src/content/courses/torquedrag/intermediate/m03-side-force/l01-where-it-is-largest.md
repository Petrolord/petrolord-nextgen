# Where it is largest

The depth distribution, and why it is not where people expect.

{{panel:td-friction-explorer}}

## The maxima

| well | operation | worst side force |
|---|---|---|
| slant | trip out | 1123.526508230207 N/m |
| slant | trip in | 828.0432175391106 N/m |
| build and hold | trip out | 1474.036824527316 N/m |
| build and hold | trip in | 1167.5116395360324 N/m |
| horizontal | rotate on bottom | 1288.2065631957541 N/m |
| horizontal | slide drill | 1963.3954098133495 N/m |

Two things stand out. Tripping out always gives a larger maximum than tripping in on the same well, and the largest number in the table is a sliding operation.

## Why tripping out is worse

Because friction adds to tension going up. More tension means more side force in every curve, which means more friction, which means more tension above it.

Tripping in the feedback runs the other way and the maximum is lower. On the build-and-hold well the difference is 1474.036824527316 against 1167.5116395360324, a quarter more.

That is a positive feedback loop with a gain below one, so it converges rather than running away, and it is the reason the model has to be integrated rather than evaluated.

## Where in the well it sits

Not at total depth.

On a build-and-hold well the maximum is in the build section, and specifically near its TOP, where the curvature is present and the tension is highest. Below the build, in the hold, there is no curvature and the side force drops to the weight term. Above the build, in the vertical section, both terms are zero.

So the side-force profile is a hump, and the hump is where all the interesting things happen: the friction, the torque, and later the casing wear.

## The horizontal well is different

There the maximum rotating on bottom is 1288.2065631957541 N/m, which is exactly the drill collars' buoyed weight per metre.

No curvature contribution at all. In a horizontal lateral the side force IS the weight, and it is uniform along the whole lateral rather than concentrated in a hump.

That uniformity is why a lateral generates so much total drag from a modest per-metre force: 1600 m of it at 265 N/m for the drill pipe adds up.

## The sliding maximum

The largest number in the table, 1963.3954098133495 N/m on the horizontal well sliding, is not a weight term and not an ordinary curvature term.

It is a buckled string pressing outward. The engine is computing side force from a compression the string could not have carried, and the result is the model reporting on a state it does not describe. Read it as a flag, not a force.

## Exercise

Open the panel's side-force column for the build-and-hold well tripping out and tripping in.

Find the depth of the maximum in each case, compare against the survey's build section, and say why the two maxima are at nearly the same depth even though their magnitudes differ by a quarter.
