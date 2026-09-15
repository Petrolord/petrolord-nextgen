# Souders-Brown

The terminal velocity is K times the square root of the density difference over the gas density. On ABANA-1 that is 1.458422 ft/s, and it is the velocity the gas must stay below for a drop to fall out of it.

{{panel:fc-separator-explorer}}

## The three streams

| stream | K | liquid lb/ft3 | gas lb/ft3 | terminal ft/s |
| --- | --- | --- | --- | --- |
| ABANA-1 vertical mesh | 0.300000 | 55.171463 | 2.239712 | 1.458422 |
| ABANA-2 horizontal mesh | 0.400000 | 55.919504 | 2.239712 | 1.958255 |
| AGBAMI horizontal vane | 0.525000 | 59.632353 | 1.276898 | 3.549130 |

Three inputs and nothing else: the hardware through K, and the two fluids through the densities. No droplet size appears, no viscosity, no vessel dimension and no rate.

## What the square root does

The density difference sits over the gas density under a square root, so the expression is dominated by how much lighter the gas is than the liquid. Halving the gas density does not halve the velocity, it raises it by about four tenths in proportion, which is why AGBAMI at 1.276898 lb/ft3 of gas settles so much faster than ABANA at 2.239712.

The square root also means the velocity is forgiving of small errors in the liquid density and unforgiving of errors in the gas density, because the gas density appears twice, once in the difference and once underneath it.

## Where K comes from and what it carries

K is the only term that is not a fluid property. It is an allowable velocity coefficient read from a table of six rows and then derated for pressure, and the derating is recorded as a customary rule of thumb whose published form has not been checked against a source. The velocities above therefore carry that provenance gap with them: 0.300000 on ABANA-1 is a derated 0.350000, and 0.525000 on AGBAMI is a derated 0.550000.

The fluid half of the expression is ordinary physics. The hardware half is a table. Knowing which is which is most of the skill in reading one of these numbers.

## What a terminal velocity is for

It is a limit on the gas, and it becomes a vessel dimension the moment it is divided into a rate. On ABANA-1 the gas arrives at 4.825708 ft3/s and settles at 1.458422 ft/s, which needs an area of 3.308855 ft2. Every vertical vessel in this method is sized by that one division.

The same velocity answers the reverse question just as well. Given a diameter somebody has already chosen, the gas velocity at that diameter is the rate over the area, and comparing it against 1.458422 ft/s says whether the vessel can carry its gas.

## The mistake

Reading a Souders-Brown velocity as the speed at which drops actually fall. It is a design allowable built to be compared with a gas velocity, and its K was fitted to observed carryover behaviour rather than derived from a drop balance. A real drop of a stated diameter falling through a stated viscosity is a different calculation entirely.

## Exercise

Give the terminal velocity for each of the three streams and name the three inputs it took. Then say why AGBAMI settles fastest, which of its two density terms did most of that work, and which part of the expression carries a provenance gap.
