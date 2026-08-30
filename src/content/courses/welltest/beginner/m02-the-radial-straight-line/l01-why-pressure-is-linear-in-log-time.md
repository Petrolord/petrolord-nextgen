# Why pressure is linear in log time

The one result the whole of classical well test analysis stands on.

## The problem being solved

Take a well of vanishing radius in an infinite, uniform, horizontal layer of rock filled with a slightly compressible fluid. Start producing it at a constant rate at time zero. What does the pressure at the well do?

The diffusivity equation governs it, and the answer is an exponential integral, which for practical times is very well approximated by a logarithm. The result, in oilfield units, is that the pressure at the well falls linearly with the logarithm of time:

    p(t) = p_i - m log10(t) - constant

with a slope m that depends only on the rate, the fluid, and the rock:

    m = 162.6 q B mu / (k h)      psi per log10 cycle

That is the equation the Associate tier is built on. Everything else in this module is a consequence of it.

## Why a logarithm

The physical picture is worth having, because it explains both the shape and its limits.

When a well starts producing, the pressure disturbance spreads outward. At any moment there is a region around the well that knows the well is producing and a region beyond it that does not. That region grows, and as it grows, the same volumetric rate is being drawn from an ever larger cylinder of rock.

Each time the disturbed radius doubles, the area available to feed the well roughly doubles, and the additional pressure drop needed to keep the rate constant is roughly the same increment as the last doubling. Equal increments of pressure for equal ratios of radius, and radius grows as the square root of time, so equal increments of pressure for equal ratios of time. That is a logarithm.

This is called radial flow, or infinite-acting radial flow, and the straight line it produces on a semilog plot is called the semilog straight line.

## The three conditions

The result holds only while three things are true, and each of them fails somewhere in this course.

**The flow into the well is coming from the reservoir**, not out of the wellbore's own volume. Early in any test it is not, and the pressure is doing something else entirely. That is wellbore storage and it owns module 5.

**The disturbance has not reached anything.** Once the growing region runs into a fault, a contact, another well or the edge of the compartment, the geometry stops being radial and the line stops being straight. That is the Professional tier's module 3.

**The well is a line source in a uniform layer.** A fracture, a horizontal lateral, or a reservoir with two porosities gives a different early shape. Those are the Professional tier's modules 4 and 5.

The stretch in the middle, after storage has died and before anything has been reached, is where the straight line lives. On the buildup in this course it is a bit under a decade wide, and finding it is the skill this tier teaches.

## What the slope contains and what it does not

Read the slope equation again and notice what is in it. Rate, formation volume factor, viscosity, permeability, thickness. That is all.

Porosity is not in it. Compressibility is not in it. Skin is not in it. Wellbore radius is not in it.

The slope of the semilog line is a statement about flow capacity and nothing else. Everything else the test reports comes from where the line sits, not from how steep it is, and that split matters: the position of the line is far more sensitive to the choice of window than its steepness is.

## The misconception to avoid

"Pressure falls logarithmically forever." It does not. The logarithmic fall is the signature of a disturbance expanding freely into rock it has not reached yet, and no reservoir is infinite. Every test in this course that ran long enough shows the line bending, and what it bends into is the interesting part.

## Exercise

The slope equation says m is proportional to the rate and inversely proportional to the permeability.

Two wells in the same reservoir are tested. Well A produces 450 stb/d and shows a semilog slope of 22 psi per cycle. Well B produces 900 stb/d and shows 44 psi per cycle.

State what you can conclude about the two permeabilities, and then state what you would need to check before concluding it.
