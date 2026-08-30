# The S profile

Build, hold, drop, and a circle-tangent construction with two circles.

{{panel:wd-survey-explorer}}

## The shape

Vertical to a kickoff, build to a hold inclination, hold in a tangent, then drop back to a final inclination at the target.

The final inclination is usually zero, which makes it a full S, or a few degrees, which makes it a modified S.

## Why anyone drills one

**To enter the target vertically.** A reservoir to be completed with a vertical tubing string, or a target where the pay is thin and the well must cross it at right angles.

**To get out from under an obstruction and back.** A surface location offset from the target for reasons of geography, with a target that must be entered from directly above.

**To limit the inclination at total depth.** Logging tools and some completions are easier to convey in a hole that has dropped back.

## The construction

Two arcs and a straight line between them.

The build arc has a radius set by the build rate and starts tangent to vertical at the kickoff. The drop arc has a radius set by the drop rate and ends tangent to the final inclination at the target. The hold is the common tangent line between the two circles.

The solve is therefore: place both circle centres, find the length and direction of their common external tangent, and read off the hold inclination as the direction of that tangent.

    hold length = sqrt( centre separation^2 - (R1 + R2)^2 )

which is the standard external tangent length between two circles.

## When it fails

The formula under the square root goes negative when the two circles OVERLAP, that is, when the centre separation is less than the sum of the radii.

Physically that means the build and the drop cannot both fit between the kickoff and the target: the well would have to start dropping before it finished building. The engine returns a feasibility flag and a message saying to raise the rates, deepen the target or reduce the displacement.

There is a second failure: a geometrically valid tangent whose inclination is BELOW the required final inclination, which would mean dropping to a steeper angle than the hold. The solver rejects that too.

## The published cases

The panel runs three published S-profile designs. Each specifies a kickoff length, a build rate, a drop rate, a final inclination and a displacement target, and publishes the hold inclination, build length, hold length and drop length that solve it.

The solver reproduces all three to about five parts in a hundred billion. Switch between them in the panel and read the solver column against the published one.

## What it costs

An S profile has roughly twice the total angle change of a build-and-hold to the same target, because everything built has to be dropped.

That shows up as more dogleg, more torque and drag, more casing wear at the two curved sections, and a drop section that is the hardest place in the well to clean cuttings out of. The hydraulics course returns to that.

## The misconception to avoid

"The drop section is just a build in reverse." The mechanics are not symmetric. Gravity helps the assembly drop and resists a build, so drop rates are easier to achieve than build rates but harder to control, and the drop section usually sits at the highest inclination in the well where hole cleaning is worst.

## Exercise

Open the panel and step through all three S-profile cases, recording the hold inclination and the three lengths for each.

Then, for the first case, compute the total angle change through the whole well, build plus drop, and compare it against the angle change of a build-and-hold that reached the same displacement.
