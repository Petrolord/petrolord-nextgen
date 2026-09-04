# Onward

Everything this tier can measure sits still. A bore, a wall, a rating, a fitting count, a node kind, an index and one well against one boundary are all quantities a gathering system has before anything is solved together.

## What it earns

A line becomes a rating once a design factor is supplied, and a fitting list becomes a length once a bore and a friction factor are. A drawing becomes a network once every well can reach a pressure somebody gave, and eleven distinct malformed drawings come back refused with a reason rather than repaired.

And one well against one boundary is a real answer. Alone on its flowline against 265 psia, AGBADA-2 lands at 892.889543025 psia making 6890.874160167 lb/d, and neither number was typed in.

## Where it hands over

At the second well. On the published `wells_fight` ladder, W-0 makes 3522.516744485 lb/d alone on its header and 3137.891322295 lb/d sharing it with two others, a loss of 384.625422 lb/d, 10.919052 percent of itself, while the header rises from 253.813945 psia to 670.128002 psia across the ladder, a rise of 416.314057 psi. Nothing about W-0 changed. Both figures come from the independent oracle, and the engine's own solve of the three well case lands 9.3905e-10 lb/d away on that rate.

A rate like that is not reachable from any single-well method, because a single-well method is run against a wellhead pressure somebody supplied.

## What these two modules never had

The pipe hydraulics are a callback the consumer supplies, and so is the well inflow, so neither is in here. There is no temperature anywhere and so no thermal coupling. No slugging, no holdup and no transient, because every equation is steady state. No compressibility along a branch, since mass in equals mass out by construction. No pump, compressor or choke, because those are not node kinds. And the pipe wall, the burial and the insulation belong to other modules.

## The question worth carrying

On the teaching network the solve reports `converged: true` with a residual of 1.546141e-11 lb/d, and `checkConservation` on that same answer reports a gap of 345.000000000 lb/d, 2.593852900 percent of what the engine says was produced. The check sits in the same file, and the solve never calls it.

So ask of every returned number which function produced it, what unit it is in, whether that function had a way to refuse, and what checked it that was not the iteration that made it.

## Exercise

Write down the three things a solo well answer establishes and the three it cannot.

Then say why a converged flag and a conservation gap can both be true of the same answer.
