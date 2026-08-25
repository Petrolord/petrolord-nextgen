# What this tier adds

The Associate tier computed ingredients. A brine at 1017.8249875 kg/m3 and 2.6978112899395996 GPa, a gas at 172.66679461728904 kg/m3 and 55.71865290286663 MPa, a live oil, a mineral frame at 30.87940062475596 GPa, and a Wood mixture of brine and gas. Every one of those is a property of a substance.

None of them is a rock. A rock is a frame of grains with pore space between them, and the properties of the rock are not the properties of either the grains or the fluid. This tier is where the ingredients go into a rock.

## The equation that does it

Gassmann's relation connects the bulk modulus of a rock saturated with one fluid to the same rock saturated with another, through the rock's own dry frame. It is the single most used equation in quantitative seismic interpretation, and it is used in both directions.

Backwards, it strips the fluid out of a measurement and leaves the frame. Forwards, it puts a different fluid in and predicts what the logs would have read.

That two-direction structure is the tier. Everything else follows from it.

## What the input is

Not a mineral recipe this time, but a real logged point. The Ekene sand reads a compressional velocity of 3200 m/s, a shear velocity of 1800 m/s and a bulk density of 2250 kg/m3, at a porosity of 0.25 with a mixed mineral bulk modulus of 37 GPa.

That rock is brine saturated, because that is the state it was logged in. The well found water at that depth, or the tool was reading rock below the contact, and either way the fluid in the pores while the log was recorded is brine.

The question the tier answers is: what would that same rock have read if the pores had held gas instead?

## Why anybody asks

Because the answer is a prediction that can be tested against seismic before a well is drilled.

A seismic survey over an undrilled prospect records amplitudes. Those amplitudes depend on the contrast in velocity and density across the top of the reservoir. If you know what the reservoir rock looks like when it is wet, and you can predict what it would look like when it is charged, you can say what the seismic ought to show in each case, and then look.

That chain is what the Expert tier completes. This tier builds the middle link, which is the rock.

## What stays and what changes

The conditions stay. The same 60 degC, 25 MPa, 35,000 ppm brine, 0.6 gravity gas and 35 API oil at a gas to oil ratio of 50, so the fluid properties from the tier below are used exactly as computed there. That is the payoff for the conditions discipline of module five below: a substitution is only as good as the fluid modulus it is handed.

The mineral frame stays available but stops being the answer. Module two is largely about why the 30.87940062475596 GPa you computed for the mineral mixture is not what goes into the substitution.

The porosity is new, and it matters more than anything else in the tier.

## What you will be able to do

Take a logged point and recover the rock's dry frame from it. Substitute any fluid you like into that frame and predict the velocity and density that would be logged. Estimate a shear velocity where the tool never recorded one. And, most usefully, say which of the assumptions underneath those answers actually moves them.

Four results will occupy the tier and it is worth naming them now.

The shear modulus does not respond to fluid at all, which is the hinge the whole method turns on, and it has a consequence people find backwards: substituting gas into a brine sand makes the shear velocity go up.

The dry frame is very much softer than the mineral frame, and confusing the two is the most common way to get a substitution badly wrong.

The porosity you assume is worth several times more than the mineral modulus you assume, so the effort belongs on the porosity.

And the gas effect saturates almost immediately. The first one percent of gas does about a third of the total velocity drop, and the first five percent does over three quarters, which is why seismic amplitude cannot tell you how much gas is there.

## Worked example

One arithmetic result is worth having in hand before the tier starts, because it is exact.

The shear modulus of a rock is its density times the square of its shear velocity:

$$\mu = \rho v_s^2 = 2250 \times 1800^2 = 7.29 \times 10^9 \ \mathrm{Pa}$$

and the saturated bulk modulus follows from the compressional velocity:

$$K_{sat} = \rho v_p^2 - \tfrac{4}{3}\mu = 2250 \times 3200^2 - \tfrac{4}{3}(7.29 \times 10^9) = 23.04 \times 10^9 - 9.72 \times 10^9 = 13.32 \times 10^9 \ \mathrm{Pa}$$

Both are exact. 7.29 GPa and 13.32 GPa are not rounded values, they are what the arithmetic gives, which is why the capstone grades them to 0.01 GPa and expects you to be able to reach them with a calculator.

## Exercise

Before reading on, predict what happens to the shear velocity of this sand when its brine is replaced by gas: does it rise, fall, or stay the same? Give a reason.

Self check: it rises, from 1800 m/s to about 1891 m/s. Fluids carry no shear stiffness, so the shear modulus of 7.29 GPa is unchanged by the substitution, while the bulk density falls because gas is far lighter than brine. Since $v_s = \sqrt{\mu / \rho}$ with a fixed numerator and a smaller denominator, the shear velocity must increase.
