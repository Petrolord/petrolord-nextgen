# Fittings as a resistance sum

An isometric's valves and bends are collapsed into one number, a resistance sum in velocity heads. The OGBIA list comes to 4.500000, and it costs 0.133351 psi.

{{panel:fc-liquid-explorer}}

## The list and what it adds to

| fitting | count | K each | K total |
| --- | --- | --- | --- |
| elbow90LR | 4 | 0.300000 | 1.200000 |
| gateValve | 2 | 0.150000 | 0.300000 |
| swingCheck | 1 | 2.000000 | 2.000000 |
| suddenExit | 1 | 1.000000 | 1.000000 |

The single swing check contributes 2.000000 velocity heads, more than the four elbows' 1.200000. A check valve holds a disc in the path of the flow, and the flow has to push past it every second of the line's life.

## The same fittings, two very different shares

On the full 26400.000000 ft line those fittings cost 0.133351 psi against 25.660631 psi of pipe friction, a share of 0.005170 of the total.

On a 300.000000 ft manifold run carrying the same duty and the same fittings, the pipe costs 0.291598 psi and the fittings cost 0.133351 psi, a share of 0.313805. The fittings did not change; the pipe did.

## What that pair of shares is for

It settles when fittings are worth counting. On a long transmission line the resistance sum is a rounding correction, and an engineer who leaves it out has not made a material error. On a station or a manifold the same list is a large fraction of the answer, and leaving it out understates the loss substantially.

The rule that follows is about the length rather than about the fittings. Ask what the pipe itself is spending before deciding whether the isometric matters.

## Where the sum comes from

The engine takes the resistance sum as an input. Building it from a fitting list is the schedule's work, and a caller is free to hand over a number from any source, including a resistance sum of zero for a line with no fittings at all.

So the provenance of that 4.500000 sits outside the pressure drop calculation. It is a reading of a drawing, and it is as good as the drawing.

## A sum of zero is a legal answer

A line with no fittings has a resistance sum of 0.000000, and the engine takes it without complaint. The published liquid cases carry resistance sums of 0.000000, 4.500000 and 2.000000, and the ones at zero return a fittings loss of 0.000000 psi.

So the term is always present in the return. On a bare pipe it is present as a zero rather than as an absence.

## The mistake

Carrying a resistance sum between lines of different length. The count of velocity heads travels with the isometric and the pressure it costs does not, because the velocity head belongs to the bore and the duty of the line it is placed in.

## Exercise

Give the OGBIA resistance sum and the single fitting that contributes most of it. Then give the fittings share of the total on the full line and on the 300.000000 ft run, and say which of the two numbers moved between them.
