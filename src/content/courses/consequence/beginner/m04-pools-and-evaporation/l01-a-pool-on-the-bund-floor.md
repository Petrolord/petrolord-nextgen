# A pool on the bund floor

{{panel:cq-release}}

A liquid that leaves a hole lands somewhere. On a well designed plant it lands inside a bund, a walled area around a tank or a group of vessels, built to hold a spill. The pool that forms is the next link in the consequence chain. Its area sets how fast it evaporates, and its diameter sets how large a fire on it would be. This module shows how the engine turns a spilled volume into a pool, and where it declines to.

## The bund model

The engine's rule for a bund is short. The basis reads, verbatim: "pool covers the bund floor; D = sqrt(4 A / pi)".

The spill spreads to cover the whole floor, so the pool area is the bund area. The depth is the volume divided by that area. The equivalent diameter is the diameter of a circle with the same area, because later models, the evaporation correlation among them, are written for a circular pool. A rectangular bund therefore becomes a circle of equal area for everything downstream.

## A worked bund

A spill of 30 m3, a stated teaching input, into a bund with a floor of 400 m2 and a wall of 0.5 m. The engine returns:

| quantity | engine key | value |
| --- | --- | --- |
| containment | `containment` | CONFINED |
| area m2 | `areaM2` | 400.000000 |
| depth m | `depthM` | 0.075000 |
| equivalent diameter m | `equivalentDiameterM` | 22.567583 |

The containment flag reads CONFINED: the bund holds the spill. The depth of 0.075000 m sits well below the 0.5 m wall. The equivalent diameter of 22.567583 m is the circle whose area is the 400 m2 floor.

## What the bund model assumes

The model assumes the liquid reaches every corner of the floor. For a spill large enough to cover the floor, that is the sensible assumption: the bund was built to collect liquid across its whole area. It also assumes the floor is level and the pool has one depth everywhere.

It follows that the pool area does not depend on the spill volume, as long as the bund holds it. A larger spill makes a deeper pool on the same floor. That matters for what comes next. An evaporation rate or a fire size read from this pool depends on the bund, and the volume only needs to be checked against the wall.

## Two inputs, two checks

The engine asks for the bund floor area and the wall height together. The floor sets the area and the diameter. The wall is the check: the depth must stay at or below it, or the bund does not confine the spill. The third lesson of this module reads what happens when it does not.

Both are measured quantities on a real plant, taken from the layout drawings. Neither is an analyst's judgement, which is one reason the bund model is the preferred route whenever a bund exists.

## Exercise

Open the view for a spill, its pool and its evaporation, and run the default spill of 30 m3 into the 400 m2 bund. Confirm the depth and the equivalent diameter against the table. Then double the spill volume, keep the bund, and read the pool area, the depth and the diameter again. Write one sentence on which of the three changed and why the other two did not.
