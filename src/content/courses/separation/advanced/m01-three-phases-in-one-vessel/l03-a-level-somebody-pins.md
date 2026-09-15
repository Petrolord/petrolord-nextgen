# A level somebody pins

An interface controller holds the water band where the operator sets it, so the engine accepts a pinned water share and sizes around it. On AGBAMI a pinned share of 0.300000 drops the interface to 2.074313 ft and breaks the two phases apart.

{{panel:fc-slug-explorer}}

## What the pin changes

AGBAMI left to itself splits the liquid area 0.516129 to the water and places the interface at 3.049149 ft. Pin the water share at 0.300000 and the engine no longer derives the split from the retentions. It takes the share as given, inverts the smaller water area to an interface of 2.074313 ft, and grows the oil layer to 2.925687 ft.

The layers still add to the liquid level of 5.000000 ft. Everything downstream of the layers moves.

## Two phases that now want different vessels

With the areas pinned and the retention times unchanged, each phase asks for its own length: the oil needs 8.510368 ft and the water needs 21.181362 ft. The vessel has one length, so the requirement is the larger of the two, 21.181362 ft, and `retentionPhase` names the water.

| split | interface ft | oil layer ft | oil length ft | water length ft | requirement ft | retentionPhase |
| --- | --- | --- | --- | --- | --- | --- |
| proportional | 3.049149 | 1.950851 | none | none | 12.311666 | null |
| pinned at 0.300000 | 2.074313 | 2.925687 | 8.510368 | 21.181362 | 21.181362 | water |

## The price of the pin

The proportional vessel is 12.311666 ft long and the pinned one is 21.181362 ft. Squeezing the water into 0.300000 of the liquid area did not make the vessel smaller. It starved the phase with the longest retention time of cross-section, and the vessel had to grow lengthways to give that phase its 8.000000 minutes back.

That is the honest reading of a pinned interface. It is a decision about where the controller sits, and the engine prices it rather than arguing with it.

## Pins the engine will not take

A share of exactly zero or exactly one is refused: SeparatorInputError on `waterFracOfLiquid`, "waterFracOfLiquid must lie strictly between 0 and 1 when it is given (got 0)". There is no clamping to a small positive number and no fallback to the proportional split, because a vessel with no water band is a two-phase vessel and should be sized as one.

The published cases show the same behaviour at ordinary pins. A share of 0.400000 puts the interface at 2.540691 ft with a retention length of 4.964382 ft and `retentionPhase` null. A share of 0.250000 puts it at 1.826477 ft, needs 7.943011 ft, and names the water.

## The mistake

The mistake is pinning a share to make a number look better. A reviewer who wants a shorter drum lowers the interface, sees the water band shrink, and expects the length to fall with it. The water still has to sit for 8.000000 minutes, so the length rose from 12.311666 ft to 21.181362 ft instead.

The second mistake is pinning a share the plant cannot hold. The pin is an instruction to the interface controller, and a share the level instrument cannot resolve is a number on a datasheet rather than a vessel.

## Exercise

State what a pinned water share of 0.300000 does to the AGBAMI interface and to both layers, and give the two retention lengths it produces. Then say which phase sets the requirement and why, and explain why the pinned vessel is longer than the proportional one even though the water band is thinner.
