# A sealed volume that heats up

An annulus nobody has opened can still be standing at pressure by morning, and there are only two ways that happens.

{{panel:wi-annulus-explorer}}

## A liquid with nowhere to go

An annulus is a closed volume of liquid between two steel walls. Close the valve and the volume is fixed.

Start the well up and the produced fluid warms the completion, so the trapped liquid tries to expand. A liquid is very nearly incompressible, which is the whole point: a tiny frustrated expansion turns into a large pressure rise, because there is almost no compliance in the volume to absorb it.

This is thermal pressure. Its signature is that it follows the production rate, and that once you bleed it off it does not come straight back while the well stays at the same temperature.

## Communication

The other cause is a leak. A tubing connection, a packer, a casing connection, a cement column: any of them can let a pressured fluid into the annulus from somewhere it was meant to stay out of.

The signature here is different. Bleed the annulus down and the pressure rebuilds, because the source is still connected. That returning pressure is what the industry calls sustained casing pressure, and it is a barrier finding, not a housekeeping item.

## What this engine says about the two

Nothing. It does not know which one you have.

The annulus half of this engine takes a fluid density and a list of bounding elements, and returns how much surface pressure those elements will take. Cause, rate and time are outside it. Both a thermal build and a leak are judged against the same limit, and only the first of them is normally acceptable to live with.

## The fluid in the annulus is part of the answer

The published case carries an annulus fluid at 1200 kg/m3. That column is not neutral. It already stands on every element below it, and heavier annulus fluid leaves less room for pressure at surface.

On the published limiting element the sweep is blunt:

| annulus fluid, kg/m3 | allowable surface pressure, Pa |
|---|---|
| 1030 | 24000000 |
| 1200 | 20585228.21103133 |
| 1600 | 12550471.060516804 |
| 2000 | 4515713.910002284 |

Choosing a packer fluid is therefore choosing part of your annulus pressure limit, before a single degree of heating happens.

## Exercise

In the panel, set the annulus fluid to 1030 kg/m3 and then to 2000 kg/m3, and read the allowable at each.

Say which of the two causes above the engine would have to be told about, rather than being able to infer it, and what observation you would need to tell them apart.
