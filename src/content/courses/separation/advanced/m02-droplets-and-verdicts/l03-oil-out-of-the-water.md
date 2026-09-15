# Oil out of the water

An oil drop caught in the water has to rise across the whole water layer before the water leaves the vessel. On AGBAMI a 200.000000 micron oil drop rises at 0.014000 ft/s and needs 217.8010 s against 480.0000 s of water residence.

{{panel:fc-slug-explorer}}

## The mirror of the other check

The water check runs downward through the oil layer and the oil check runs upward through the water layer. Everything about the second check is its own: its own droplet size, its own density difference, its own viscosity and its own layer.

| check | direction | layer ft | velocity ft per s | crossing s | residence s | verdict |
| --- | --- | --- | --- | --- | --- | --- |
| water out of the oil | down | 1.950851 | 0.017500 | 111.4796 | 300.0000 | false |
| oil out of the water | up | 3.049149 | 0.014000 | 217.8010 | 480.0000 | false |

`oilCarryunder` false says the oil drop got out in time. The water leaves at the bottom, so a drop that has not risen far enough leaves with it.

## The layer that was not there

This is the check the interface repair was made for. Before FC1-0 the layer thickness came from dividing the water area by the gas-liquid chord, which on AGBAMI gave a water layer of 2.026834 ft against the exact 3.049149 ft.

A rising drop was therefore asked to cross a layer far thinner than the one the vessel holds. It crossed in less time, the comparison against the water residence looked comfortable, and the carryunder check passed on a vessel that should not have passed it. The arithmetic was honest and the geometry it was fed was not. The direction never varies, so the verdict always failed in the permissive direction.

## A low level makes it harder

Drop the liquid level and both layers thin, but the water band is the one the rising drop crosses. The published case lowLevelSmallOilDropCarryunder runs at a level of 0.300000 with a water share of 0.285714, a water layer of 1.249328 ft under 1.750672 ft of oil. The retired chord rule gave 0.617770 ft for that same layer, less than half the real figure.

## What the check needs by name

The oil droplet size is required and is refused if missing: SeparatorInputError on `oilDropletMicron`, "oilDropletMicron is required: the size in microns of the oil drops to remove from the water (got undefined)". The retired single `dropletMicron` argument is refused too, with a message naming both replacements.

## The mistake

The mistake is sizing for the oil specification and assuming the water follows. The two checks use different layers, and the layers move in opposite directions when the interface moves. Lowering the interface to cure a water carryover thickens the water layer and makes carryunder harder, so a vessel can be walked from one failing verdict straight into the other.

The second mistake is trusting an old carryunder result. A verdict computed against the chord rule is not a weaker version of the right answer. It answers a different question, about a vessel whose water band was never that thin.

## Exercise

Give the layer, velocity, crossing time and residence for the oil carryunder check on AGBAMI, and state the verdict. Then explain what the retired chord rule did to that layer, why the error always ran in the permissive direction, and what happens to both verdicts when the interface is lowered.
