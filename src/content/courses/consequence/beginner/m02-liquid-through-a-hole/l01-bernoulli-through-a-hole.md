# Bernoulli through a hole

{{panel:cq-release}}

A liquid below its boiling point that leaves a hole stays liquid. Its flow is set by one balance: the pressure pushing on the liquid at the hole, less the pressure of the air outside, turns into the kinetic energy of the jet. That is Bernoulli's equation, and the engine applies it with one correction for the real hole. This module works one line through it from end to end.

## The model, in the engine's words

The basis block of `liquidOrificeDischarge` reads, verbatim: "Bernoulli liquid outflow through a hole, qS = Cd Ah sqrt(2 (P - Pa) rhoL), P = rhoL g hL + PaL".

Read it piece by piece. qS is the mass rate in kg/s. Cd is the discharge coefficient, the fraction of the ideal flow a real hole delivers. Ah is the hole area. rhoL is the liquid density. P is the absolute pressure at the hole, and Pa is the ambient pressure outside. The second half says where P comes from: the static head of liquid above the hole, rhoL g hL, plus the pressure above the liquid, PaL. The mass rate depends only on the driving pressure, P minus ambient.

## The AMENAM crude line

AMENAM is a crude run-down line, a stated teaching input. Its discharge coefficient is 0.62, its hole diameter 0.05 m, its density 850 kg/m3, its head 6 m and its pressure above the liquid 200000 Pa absolute. The engine returns:

| quantity | engine key | value |
| --- | --- | --- |
| hole area, m2 | `holeAreaM2` | 0.001963495408 |
| pressure at the hole, Pa | `pressureAtHolePa` | 250013.915000 |
| driving pressure, Pa | `drivingPressurePa` | 148688.915000 |
| mass rate, kg/s | `massRateKgS` | 19.354651 |
| jet velocity, m/s | `jetVelocityMS` | 18.704445 |

## Reading the chain

The engine works in the order the equation is written. It first turns the diameter into an area, and hole areas print to twelve decimals because a small hole has a small area. It then builds the pressure at the hole from the head and the pressure above the liquid, which gives 250013.915000 Pa absolute. Subtracting ambient leaves the driving pressure of 148688.915000 Pa. That driving pressure, the density, the area and the coefficient together give 19.354651 kg/s.

The jet velocity is reported beside the mass rate. It is the speed of the liquid leaving the hole, and it is the figure a later study would use to ask how far a jet throws.

## What the equation assumes

Bernoulli through a hole assumes a liquid that stays liquid all the way out. A liquefied gas held above its boiling point would flash in the hole and flow as two phases, and this engine carries no two phase discharge. It also assumes the conditions hold steady while the rate is computed. A falling liquid level lowers the head and the rate with it, so a figure like 19.354651 kg/s is the rate for the stated level at one instant.

## Exercise

Open the outflow view with the AMENAM defaults and confirm the driving pressure and mass rate in the table. Then subtract 101325 Pa from the pressure at the hole in the table and check that you recover the driving pressure. Finally, raise the liquid density on the panel and write one sentence on why a denser liquid raises the pressure at the hole and the mass rate together.
