# The capstone brief

{{panel:cq-fire}}

The Professional capstone asks the question this tier owns: what does a pool fire radiate. It gives you a pool fire of its own and asks you to work it through the solid flame chain. This lesson says what the capstone asks for in general terms and how to work it on the fire panel.

## What the capstone asks for

The capstone takes one pool fire through the chain this tier taught, one link at a time:

- the flame length, by Thomas with wind, with the scaled wind speed held at one below the characteristic wind speed;
- the flame tilt, from the Froude and Reynolds numbers at a stated air viscosity;
- the surface emissive power by the diameter method, Mudan's;
- the surface emissive power by the radiative fraction with soot, at a stated radiative fraction and soot fraction;
- the maximum view factor to a stated ground level target, from the flame length, the tilt and the distance from the axis;
- the heat flux at that target, with a STATED transmissivity.

Each rests on a published number or a second route.

## What it never asks for

Nothing single route is graded. The capstone never asks for a Burgess burning flux, a Thomas flame length in still air or a Bagster transmissivity. The transmissivity is stated, and you use the stated value exactly.

## How to work it on the panel

Type the capstone's pool into the heat flux view of the fire panel: the fuel, the pool diameter, the wind at 10 m, the air density and kinematic viscosity, the heat of combustion, the radiative and soot fractions, the target distance measured from the pool centre and the stated transmissivity. That view runs the whole chain with nothing rounded between the steps and prints the flame length, the tilt, both surface emissive powers, the Fmax and the heat flux. The flame view shares the same pool, so you can check the burning flux and the scaled wind speed there first. Read the Fmax from the heat flux view. A flame length and tilt carried by hand into the view factor view at six decimals can move the Fmax in its twelfth decimal.

## Precision

Enter every quantity at the precision the course prints: six decimals for lengths, tilts, surface emissive powers and heat fluxes, and twelve for view factors. Carry every digit from one step into the next and round nothing on the way.

## Checks before you submit

Check the scaled wind speed first: if the wind is below the characteristic wind speed, it must be one. Check that the target distance is from the pool centre and that the flame does not lean over the target; if the panel refuses with `tiltDeg`, recheck the distance and the tilt direction you entered. Check that the heat flux uses Fmax and the stated transmissivity.

## Exercise

Rehearse the capstone on ERHA before you open it. In the fire panel, run ERHA at a 4 m/s wind with the stated viscosity, radiative fraction, soot fraction and a transmissivity of 0.8, and write down the flame length, the tilt, both surface emissive powers, the Fmax at 40 m and the heat flux there. Check each against lessons of this tier, then note which of your six values used an input you stated yourself.
