# Aromatics arrive in the glycol

A glycol contactor is bought to absorb water. It also absorbs aromatics, because they are soluble in glycol and they are in the gas. Nobody buys that and nobody sells it, and it leaves the plant through the still overhead.

{{panel:fc-water-explorer}}

## The route round the loop

Benzene, toluene, ethylbenzene and the xylenes dissolve into the lean glycol in the contactor along with the water. The rich glycol carries them round the loop to the regenerator. In the still the glycol is boiled to drive the water off, the aromatics go with it, and they leave in the overhead vapour.

Nothing about that route is optional. It is a consequence of using a solvent that the aromatics are soluble in, on a gas that contains them.

## What the engine computes, and what it takes

The absorbed fraction is an operating value the engine takes as an input. It is a chart or a field figure, and this module does not derive it from anything. Once it has been supplied, the arithmetic from it is a mole balance and nothing else.

On OBIAFU at 180.000000 ppmv in the inlet gas and an absorbed fraction of 0.150000, the engine returns 405.8358 lb a day to the still overhead and 74.065024 short tons a year.

That is the whole calculation. There is no chemistry in it, no partition coefficient, no temperature dependence and no equilibrium. One concentration, one fraction, one rate and a molecular weight.

## Why it belongs in the Expert tier

Two reasons, and neither is difficulty.

The first is that this is the figure a dehydration unit produces which nobody asked it to produce. Every other number in this course answers a question somebody posed. This one answers a question a permit writer poses later, and a designer who has never seen it computed will not have it when it is asked for.

The second is that it is the clearest case in the module of the doctrine the whole engine is written against. The absorbed fraction is a design or operating choice, so it is an input with its customary value visible on the page. The mole balance is computable from first principles, so it is computed. A reader can see exactly which half is theirs.

## What to carry forward

Treat the pounds a day and the short tons a year as the output of a balance whose most important term was typed in by somebody. Change the fraction and both move. The next two lessons measure exactly how much.

## Exercise

Describe the route an aromatic takes from the inlet gas to the still overhead, naming each piece of equipment it passes through. Record the inlet concentration, the absorbed fraction, the pounds a day and the short tons a year for OBIAFU. Then say which of those four the engine computed and which one it was given.
