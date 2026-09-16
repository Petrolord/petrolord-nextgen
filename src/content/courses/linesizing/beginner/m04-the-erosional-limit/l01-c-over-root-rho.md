# C over root rho

The API RP 14E erosional velocity is a c factor divided by the square root of the fluid density. At the OGBIA crude density of 54.500000 lb/ft3 and a c factor of 100.000000, that is 13.545709 ft/s.

{{panel:fc-liquid-explorer}}

## Two inputs and nothing else

The expression takes the c factor and the density. No bore appears in it, no length, no roughness, no viscosity and no rate. Whatever else a line is, its erosional velocity is settled once those two numbers are known.

That is why the limit can be quoted before a bore has been chosen. It is a ceiling on the fluid at its density, and the sizing question then becomes which bores keep the line underneath it.

## Density is the whole of the limit

| mixture density lb/ft3 | at c 100 | at c 125 | at c 175 |
| --- | --- | --- | --- |
| 5.000000 | 44.721360 | 55.901699 | 78.262379 |
| 20.000000 | 22.360680 | 27.950850 | 39.131190 |
| 45.000000 | 14.907120 | 18.633900 | 26.087460 |
| 62.400000 | 12.659242 | 15.824053 | 22.153674 |

A light gas is allowed to run several times faster than a dense liquid, which is why the limit bites hardest on wet gas and hardly at all on crude. Read down any column and the allowance falls as the fluid gets heavier.

## The square root is what softens it

Because the density sits under a root, the allowance moves more slowly than the density does. Going from the lightest row of the table to the heaviest is a large change in the fluid and a much smaller change in the ceiling, which is the shape the root imposes.

## What the limit is protecting

The concern is the pipe wall rather than the pressure budget. A fluid moving fast enough carries its own solids and its own droplets into the wall and into the bends, and the material is removed over years rather than in a single event. Nothing in a pressure drop describes that, so this is a separate check with its own equation.

## The c factor scales the answer directly

The c factor multiplies the whole expression, so reading across any row of the table is reading the c factor alone. At 5.000000 lb/ft3 the allowance runs 44.721360, 55.901699 and 78.262379 ft/s across the three columns.

Down a column the density is doing the work and across a row the service is. Those are two different kinds of judgement, and the table keeps them separate.

## The mistake

Quoting an erosional velocity without the density it was computed at. The figure of 13.545709 ft/s belongs to a crude at 54.500000 lb/ft3, and the same c factor against a 20.000000 lb/ft3 mixture allows 22.360680 ft/s. The number means nothing on its own.

## Exercise

Give the two inputs the erosional velocity takes and name four quantities it does not take. Then give the allowance at c 100 for a fluid at 5.000000 lb/ft3 and for one at 62.400000 lb/ft3, and say which way the square root moves the answer.
