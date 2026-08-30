# Closed forms you can check

Six lines of arithmetic that settle the whole calculation.

{{panel:wc-volume-explorer}}

## One: strokes to the bit

    40 m3 / 0.01 m3 per stroke = 4000 strokes

A division. If an implementation gives anything else, its volume or its pump output is wrong.

## Two: bottoms up

    120 / 0.01 = 12000 strokes

Same check on the annulus side.

## Three: the influx height

    4 m3 / 0.02 m2 = 200 m

A volume over an area. This is the assumption that makes the influx density computable, and it is a single division.

## Four: the initial circulating pressure

    5000000 + 3000000 = 8000000 Pa

An addition. The ICP is the slow circulating rate pressure plus the shut-in drill pipe pressure, exactly, with no scaling anywhere.

## Five: MAASP

    (1700 - 1200) x 9.80665 x 2000 = 9806650 Pa

The fracture gradient less the mud weight, as a density difference, over the shoe's true vertical depth.

## Six: the kick tolerance's shut-in case

    headroom = 8041453 Pa
    density difference x g = (1200 - 240) x 9.80665 = 9414.384 Pa per metre
    maximum height = 8041453 / 9414.384 = 854.1666666666666 m
    volume = 854.1666666666666 x 0.02 = 17.083333333 m3

Four lines, and the published kick tolerance is 17.083333333333332 m3.

That last one is the most valuable of the six, because kick tolerance is the most involved calculation in the course and it comes out to a repeating decimal on these inputs.

## What the six establish

That the volumes, the strokes, the influx height, the two circulating pressure endpoints, the MAASP and the kick tolerance are all being computed as specified.

Six lines of arithmetic against a calculation with several dozen steps in it.

## What they do NOT establish

That the SPECIFICATION is right. The single-bubble assumption, the isothermal expansion, the vertical hydrostatics and the surface BOP are all shared between the hand example and the implementations.

That is the same verification-and-validation distinction every course in this series draws, and here it is drawn against a hand calculation rather than against a second program.

## Exercise

Work the kick tolerance's four lines yourself and reproduce 17.083333333333332 m3.

Then compute the other case, the bubble circulated to the shoe, and say why it is larger and which of the two the engine reports.
