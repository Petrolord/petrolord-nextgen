# Slip velocity

How fast a cutting falls through mud that is not moving.

{{panel:hy-cleaning-explorer}}

## The problem

A rock chip is denser than the mud around it, so it sinks. In a stationary annulus it falls at a terminal velocity where its weight is balanced by the drag on it.

That terminal velocity is the slip velocity, and it is subtracted from the mud's speed to give the cutting's actual speed.

## The balance

    weight less buoyancy = drag

    (pi/6) d^3 (rho_s - rho_f) g = Cd (pi/8) d^2 rho_f v^2

which rearranges to

    v = sqrt( 4 g d (rho_s - rho_f) / (3 Cd rho_f) )

with Cd the drag coefficient of the particle.

## The circularity

Cd depends on the particle Reynolds number, which depends on the velocity, which is what is being solved for.

The engine uses the Schiller-Naumann correlation for Cd and iterates. That correlation is standard, published, and valid from creeping flow up to a Reynolds number of a few hundred, which covers a drilling cutting comfortably.

## The inputs

Cuttings at 2600 kg/m3, 6 mm across, which are the engine's defaults and are representative of a roller cone bit in a medium formation.

The mud's density and its APPARENT VISCOSITY at the local shear rate, which is where the rheology enters.

## The numbers

Horizontal well, kcl_polymer, at 0.025 m3/s:

| interval | apparent viscosity | slip velocity |
|---|---|---|
| 0 to 1200 m | 0.05654031857923825 Pa.s | 0.1680389124937946 m/s |
| 1200 to 2500 m | 0.05426099686104891 Pa.s | 0.17100372474974107 m/s |
| 2650 to 2800 m | 0.037066378083901064 Pa.s | 0.19859618300833365 m/s |

## Read the two columns together

The apparent viscosity FALLS from top to bottom, because the annulus gets tighter, the shear rate goes up and the mud thins.

And the slip velocity RISES, because a thinner mud offers less resistance to a falling chip.

So the tight annulus at the bottom, which has the highest mud velocity, also has the highest slip. The two partly offset.

## Why the mud is designed to be shear thinning

Because the annulus is where you want it thick, and the pipe is where you want it thin. A shear-thinning mud gives you both.

The catch is that the annulus is not uniformly slow. In the tight sections it is sheared harder and therefore thinner, which is the opposite of what carrying cuttings wants.

## What is not in the slip

Particle shape. Particle interaction at high concentration. The wall. Inclination, which is the big one and has its own module.

## Exercise

Compute the slip velocity for a 6 mm cutting at 2600 kg/m3 in a mud of 1440 kg/m3 with an apparent viscosity of 0.05 Pa.s, assuming a drag coefficient of 1.

Then compare against the tabulated values, and say whether the assumed drag coefficient was too high or too low.
