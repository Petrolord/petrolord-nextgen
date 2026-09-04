# Onward

One station gives a verdict. A well is a string of stations, and the Professional tier reads all of them.

## The traverse is handed in, not solved

A loading profile takes a list of stations, each with its own pressure, temperature, z and inside diameter, and returns a ratio at every one. It does not solve multiphase flow and it does not invent a gradient. The pressures come from somewhere else, and the answer is only as good as they are.

An empty traverse is refused rather than treated as a passing well, and an unknown correlation is refused rather than quietly treated as turner. Those two refusals are the only defences the function has.

## The remedy is the area

The tubing enters through one number, so changing it is the one lever that moves a critical rate without touching the gas. Doubling the inside diameter from 2.441 in to 4.882 in multiplies the flow area by 4.0000000000; going the other way, 3.548 in carries 0.0686585475 ft2 against 0.0141377124 ft2 at 1.610 in.

Sizing a velocity string is a search across candidates for the one that clears a ratio of one. The function has no opinion about which station its pressure, temperature and z came from.

## The plunger is a static balance

The published case is 6000.0 ft of 2.441 in tubing, a 200.0 ft slug at 1.020 SG, 120.0 psia line, 600.0 psia casing, a 6.0 lb plunger, gas gravity 0.65 at 580.0 degR and z 0.90.

| Term | Value, psi |
| --- | --- |
| line pressure | 120.0000000000 |
| slug hydrostatic | 88.3320000000 |
| gas column | 16.2440440692 |
| plunger weight | 1.2821115429 |
| friction | 0.0000000000 |

Those five sum to a required lift pressure of 225.8581556122 psia. Friction is an input, measured rather than modelled, and it is zero here because nobody supplied one.

Nothing in that balance moves. No velocity, no gas slippage past the plunger, no fallback of the slug during the rise. The rise and fall speeds, the afterflow and the shut-in are operating inputs with typical bands, not results.

## What you take with you

The station discipline. Four numbers make a density, two make a droplet, one makes an area, and a ratio settles it. Carry the station with every number you quote, because the next tier's whole subject is that the answer changes when the station does.

## Exercise

Write the five plunger terms in order of size and say which one a wrong slug length would move. Then say which term you could not check without going to the well.
