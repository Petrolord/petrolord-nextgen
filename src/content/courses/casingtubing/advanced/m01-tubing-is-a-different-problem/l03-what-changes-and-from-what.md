# What changes, and from what

The initial condition is the packer setting, and the answer is only as good as it.

{{panel:ct-tubing-explorer}}

## The baseline

Every force in this tier is measured from the moment the packer was SET.

At that moment the tubing was full of whatever fluid was in it, the annulus was full of packer fluid, and the whole string was at whatever temperature the well had after circulating. Zero force from all three mechanisms, by definition.

## The three published operating cases

| case | bore change (Pa) | annulus change (Pa) | temperature change (deg C) |
|---|---|---|---|
| production heating | 10000000 | 0 | 45 |
| injection cooling | 20000000 | 0 | -30 |
| stimulation | 45000000 | 5000000 | -50 |

## Reading them as stories

**Production heating.** The well is opened up. Bore pressure rises by 10 MPa as flowing tubing head pressure builds, and hot reservoir fluid warms the string by 45 degrees on average.

**Injection cooling.** Cold water is pumped down. Bore pressure rises by 20 MPa, more than production because injection needs pump pressure, and the string COOLS by 30 degrees because the injected water is cold.

**Stimulation.** The severe one. 45 MPa on the bore, 5 MPa held on the annulus to balance it, and 50 degrees of cooling from the treatment fluid.

## The mean temperature

The engine takes a MEAN change over the string, not a bottomhole one.

    dT = deltaOpC, when given
    dT = temperature gradient x length / 2, otherwise

That second form is the planning default: a linear profile change from zero at surface to the full change at the bottom has a mean of half the full change.

Which is a real approximation. A producing well does not warm linearly, and a real thermal simulation gives a profile with more of the change in the lower half of the string.

## Why the mean is the right thing to take

Because the total length change is the integral of the local strain along the string, and the integral of a linear profile is the length times its mean. So for the LENGTH the mean is exact, given the linear profile assumption.

For the FORCE at the packer it is also the right quantity, for the same reason: the force is what is needed to prevent the total length change.

## The thing that most often goes wrong

The baseline. A packer set with the string in tension, or set after circulating cold, or set with the annulus already pressured, has a different zero from the one assumed.

None of the three cases above is wrong about the delta. They can all be wrong together about what the delta is measured from.

## Exercise

For the production heating case, work out what the mean temperature change would be if the engine used the gradient form with a gradient of 0.03 degrees per metre over 2500 m.

Then say how that compares with the 45 degrees the case actually specifies.
