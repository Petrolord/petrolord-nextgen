# Water out of the oil

A water drop has to fall out of the oil layer before the oil leaves the vessel, and the check compares the time it needs against the time the oil actually stays. On AGBAMI at 500.000000 micron the drop needs 111.4796 s and the oil stays 300.0000 s.

{{panel:fc-slug-explorer}}

## The comparison

AGBAMI is sized at 12.311666 ft long, which gives the oil a residence of 300.0000 s. The oil layer is 1.950851 ft deep. A 500.000000 micron water drop falls at 0.017500 ft/s and needs 111.4796 s to cross that layer, so `waterCarryover` comes back false.

Three quantities decide it: how fast the drop falls, how far it has to fall, and how long the phase stays.

## Tighten the specification and nothing moves except the verdict

Ask for 150.000000 micron instead and the drum, the layers, the residence times and the lengths are all unchanged. The drop falls at 0.001575 ft/s and needs 1238.6620 s against 300.0000 s of residence, so `waterCarryover` becomes true.

| specification micron | velocity ft per s | crossing s | oil residence s | waterCarryover |
| --- | --- | --- | --- | --- |
| 500.000000 | 0.017500 | 111.4796 | 300.0000 | false |
| 150.000000 | 0.001575 | 1238.6620 | 300.0000 | true |

The engine says it in words: "A 150 micron water drop needs 1239 s to fall through the 1.95 ft oil layer and the oil stays 300 s: expect water carryover into the oil outlet, so raise the oil retention or lower the interface."

## The two repairs the message offers

Raising the oil retention makes the vessel longer, which buys residence time directly. Lowering the interface thins the oil layer, which shortens the crossing. Both are real levers, and a reader who knows only the first will build a longer drum where a lower interface would have done.

Neither lever touches the droplet size, because the droplet size is a product specification. It says how clean the oil has to be.

## Where the layer thickness comes from

The oil layer runs from the interface up to the liquid surface, and the interface is placed by inverting the water area exactly. AGBAMI holds 3.049149 ft of water under 1.950851 ft of oil. The published case thickOilWaterCarryover holds 0.769231 of its liquid area as water, leaving an oil layer of 0.911299 ft under 4.088701 ft of water.

A thin oil layer is quick to cross, so a high interface is easy on this check and hard on the other one. The two verdicts pull in opposite directions, which is why a vessel has to survive both.

## The mistake

The mistake is to treat a false verdict as a margin. `waterCarryover` false says the drop crossed in time at the size that was asked for, and it says nothing about a smaller drop. A report that gives the verdict without the droplet size has given a conclusion with its premise removed.

The second mistake is reading the specification as a measurement of the drops arriving. It is the size the vessel is asked to remove, so drops below it are expected to leave with the oil.

## Exercise

Write the three quantities that decide the water carryover verdict on AGBAMI at 500.000000 micron and give the verdict. Then say what changes and what does not when the specification is tightened to 150.000000 micron, and name the two repairs the engine's warning offers.
