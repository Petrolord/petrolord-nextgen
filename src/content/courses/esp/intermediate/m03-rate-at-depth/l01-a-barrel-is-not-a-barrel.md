# A barrel is not a barrel

A well is reported in barrels that have been to the surface, cooled down and given up their gas. The pump never sees one of those.

{{panel:pd-lift-explorer}}

## The same well, twice

Two rates for every phase: what the tank measures in stb/d and what occupies space at the intake in bbl/d.

| Case | Oil, stb/d | Oil, bbl/d | Water, stb/d | Water, bbl/d | Liquid, bbl/d |
| --- | --- | --- | --- | --- | --- |
| gassyOffshore, published | 1200.0 | 1440.000000 | 1200.000000 | 1224.000000 | 2664.000000 |
| highWaterCut, published | 400.0 | 448.000000 | 3600.000000 | 3636.000000 | 4084.000000 |
| QUA-IBOE-4, teaching | 1400.0 | 1750.000000 | 753.846154 | 776.461538 | 2526.461538 |

The water rate is not an input on any of these. It follows from the oil rate and the water cut, which is why the published golden design highWaterCut carries 3600.000000 stb/d of water off 400.0 stb/d of oil at a cut of 0.9000.

## The multiplier is a property of the fluid

Comparing the liquid at depth against the liquid at the tank gives 1.11000000 on gassyOffshore, 1.02100000 on the published golden design highWaterCut and 1.17300000 on the teaching well QUA-IBOE-4, which is not a published case.

Nothing about those three is close enough to the others to be worth a rule of thumb. A wet well barely swells, because water hardly expands. An oily well with gas coming out of it swells hard. The multiple has to be computed for the well in hand.

## Gas is the third stream

Free gas at depth is added to the liquid: 288.000000 bbl/d on gassyOffshore, 14.400000 bbl/d on highWaterCut and 882.000000 bbl/d on QUA-IBOE-4. That takes the total stream at depth to 2952.000000, 4098.400000 and 3408.461538 bbl/d.

## The mistake

Sizing a pump on the tank liquid rate. It is not a small conservatism, it is a rate the pump never handles, and it lands you at a different place on the stage curve with a different head per stage and a different efficiency. On gassyOffshore it understates the duty by the whole of that 1.11000000, and no warning exists for it, because the module was handed a rate and used it.

## What it refuses

It converts one way only. There is no path back from an in situ rate to a tank rate, and no surface facility model on the far side of the pump. It also refuses to derive the volume factors: they arrive as inputs at intake conditions. The water cut is clamped into a valid fraction rather than rejected, so a cut given as a percentage rather than a fraction becomes a clamp and not an error.

## Exercise

Compute the liquid rate at depth for all three cases from the tank rates and the volume factors, then read the same three in the panel.

Then form each multiplier against the tank liquid rate and say which of the three inputs moves it most.
