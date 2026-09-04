# A measured skin is a sum

The number a well test gives you and the number Hawkins computes are not the same number, and treating them as the same is the most common mistake in stimulation planning.

## What the test actually measures

A pressure transient test sees one thing: the extra pressure drop the well takes that a perfect open hole of the same radius would not have taken. It cannot see where that drop happened or what caused it, so everything near the wellbore that resists flow is folded into one value.

Several separate effects live inside that value. Formation damage, the ring Hawkins describes. Perforation geometry, because flow converging into a set of tunnels loses pressure that flow into an open hole does not. Partial penetration, when only part of the interval is open and the streamlines have to converge vertically. Well deviation, which works the other way and contributes a negative term. Scale or a plugged gravel pack in the completion itself. And turbulence, the rate dependent term, which grows with flow rate rather than staying put.

The measured skin is the sum of all of them.

## What Hawkins computes

One term. The damage ring, and nothing else. It knows the contrast and the damaged radius, and nothing about how the well was perforated or how fast it flows.

## The consequence for planning

Suppose a test returns 8.481054145 and you treat all of it as damage. Removing all of it means pushing the acid front to the damaged radius of 0.9 m, which takes 67.71725584279905 m3 in the published interval and drives the damage skin to exactly 0.

Now retest the well. If a good part of that 8.481054145 was perforation geometry and turbulence, the measured skin does not come back at 0. It comes back at whatever those other terms were worth, and the job looks like a failure even though the acid did precisely what the model said.

The error runs the other way too. Sizing from an inflated damage estimate buys acid you did not need, and volume grows with the square of the radius, so the waste is not small.

## The discipline

Before you size a treatment, split the measured skin. Estimate the perforation term from the completion record, and check whether the test ran fast enough for turbulence to matter. Only what is left over is the number Hawkins is entitled to.

## Exercise

List the components of a measured skin from memory, and mark which one Hawkins computes.

Say why a perfect acid job can leave a well with a positive measured skin.

Then explain which component changes when you change the production rate, and why that makes a single measured skin an unreliable design input.
