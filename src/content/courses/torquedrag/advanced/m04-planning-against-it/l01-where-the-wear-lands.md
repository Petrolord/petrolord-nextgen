# Where the wear lands

The depth distribution, and what sets it.

{{panel:td-buckling-explorer}}

## The shape

Wear follows side force, and side force in a cased section follows the geometry below the shoe.

On this course's case the profile is monotonic: zero at surface, rising steadily, worst at the shoe joint. That is because the casing is entirely in the vertical and upper build sections, and the side force ramps up as the build begins.

## The three places wear concentrates

**Just above the shoe**, where the hole below is starting to turn and the tension is still high. That is this course's case.

**At any dogleg inside the casing.** A kick-off inside a casing string, or a correction run made before the shoe was set, puts a curvature term in the middle of the casing and the wear spikes there.

**At the wellhead and just below it**, on wells with a surface dogleg or where the string is being pulled off vertical by the rig's position.

## Why a spike matters more than a broad loss

Because the casing has to be strong enough at its WEAKEST point, and a spike over one joint reduces the whole string's rating.

A uniform 10 percent loss over 1000 m and a 30 percent loss over 10 m are very different findings, and the second is worse even though it removed less metal.

## The interval matters

The engine walks the casing in 30 m intervals by default. A spike narrower than that gets averaged over an interval and understated.

That is a discretisation choice exactly analogous to the survey interval in the Well Design and Surveys course, and it has the same property: refining it cannot create information that was not in the side-force profile, and the side-force profile came from a survey with its own interval.

So a wear spike from a dogleg the survey did not resolve does not appear at any interval.

## What a caliper log shows instead

Scalloped wear at tool joint spacing, deeper wear where the string was left stationary and rotated, and asymmetry around the circumference where the string had a preferred side.

None of those is in this model, which computes a smooth axisymmetric groove. So a measured wear log and a computed wear profile agree in trend and disagree in detail, and the trend is what the model is for.

## The planning use

Knowing WHERE it lands tells you where to run a caliper if you are going to run one, and which joint to specify a heavier wall for if you are still designing the string.

Both of those are cheap actions taken on the strength of a shape rather than a magnitude, which is the right way to use a prediction whose magnitude is soft.

## Exercise

From the panel's wear view, identify the depth at which wall loss first exceeds 10 percent.

Then say how that depth would move if the casing shoe were set 300 m shallower, and whether the worst loss would rise or fall.
