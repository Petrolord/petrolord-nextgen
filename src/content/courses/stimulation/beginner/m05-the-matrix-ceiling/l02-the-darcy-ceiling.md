# The Darcy ceiling

The maximum matrix rate is not a pump rating and not a rule of thumb. It is Darcy's law run backwards.

{{panel:st-acid-explorer}}

## Steady radial flow, in reverse

Production engineering has a standard expression for steady radial inflow into a well. The engine uses the same expression for outflow, with the pressures the other way round:

    q = 2 pi k h (pFrac - pRes) / (mu (ln(re/rw) + s))

Read it as a driving force over a resistance. The numerator is the pressure margin the job is allowed, multiplied by how much rock is open to it. The denominator is everything that resists: the fluid, the geometry of radial flow, and the skin.

Set the bottomhole pressure at the fracturing pressure and the equation returns the largest rate a matrix job can ever accept. Pump faster than that and the bottomhole pressure has to rise above the fracturing pressure, which is the previous lesson's line in the sand.

## The published ceiling

The published case runs the ceiling on the acid interval, not on the fracture interval.

| input | value |
| --- | --- |
| permeability | 1 mD |
| interval thickness | 100 m |
| fracturing pressure | 38131950.890444934 Pa |
| reservoir pressure | 23730685.440133728 Pa |
| drainage radius | 300 m |
| wellbore radius | 0.108 m |
| skin | 8.481054145 |

The result is 0.000544181 m3/s.

Note the last input carefully. The published ceiling is quoted at the skin the well has BEFORE any acid, which is the Hawkins skin of the damage at a permeability ratio of 5 and a damaged radius of 0.9 m. That choice is deliberate, and the last lesson of this module is about what it costs.

## What kind of number this is

It is a ceiling, not a schedule. Nothing says you should pump at it, and most jobs deliberately do not, because diversion works better below the limit and because a safety margin on a computed pressure is cheap.

It is also steady state. It ignores the transient at the start of injection, when the near wellbore has not yet come to a settled pressure profile and the well will briefly take more. And it assumes the whole interval accepts fluid uniformly, which no real interval does. Every card that prints this number prints screening grade alongside it, and that is the honest label.

## Exercise

Write the rate equation from memory and label each term as either a driving force or a resistance.

Using the panel, hold everything fixed and halve the drainage radius. Explain why the ceiling barely moves.

Then say why a computed ceiling of 0.000544181 m3/s would still be a poor rate to actually pump at.
