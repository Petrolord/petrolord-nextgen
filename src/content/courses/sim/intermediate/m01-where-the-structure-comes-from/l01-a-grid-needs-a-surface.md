# A grid needs a surface

The Associate tier read TOPS as 900 numbers. This tier asks where 900 numbers came from when six were measured, and the answer sets up everything else in the module.

## The arithmetic of the problem

Ekene has six wells. Each found the top of the sand at one depth:

| well | map position (m) | TOP_SAND (m) |
|---|---|---|
| Ekene-1 | 1000, 1000 | 1548 |
| Ekene-2 | 2200, 1150 | 1565 |
| Ekene-3 | 1400, 2300 | 1541 |
| Ekene-4 | 2600, 2500 | 1590 |
| Ekene-5 | 600, 1900 | 1552 |
| Ekene-6 | 1900, 1800 | 1546 |

The grid needs a depth at 900 cell centres. So 894 of the deck's structural values are interpolated, and the ratio of derived to measured is 150 to 1.

That is not unusual and it is not a defect. It is the normal condition of every reservoir model ever built, and the point of saying it out loud is that a model's structure is a hypothesis with a small number of anchors.

## What an interpolator has to decide

Three things, and none of them is determined by the data.

**How far influence reaches.** A well 200 m away should say more about a cell than a well 2 km away. How much more is a choice.

**What happens far from any well.** At a cell 1500 m from the nearest control point, the interpolator has to fall back on something. That something is an assumption about the field as a whole.

**Whether the surface passes through the data.** Some methods honour the wells exactly and some smooth through them. Both are defensible and they produce visibly different maps.

## The method this deck uses

Simple kriging, from the central earth-modelling engine, with a spherical variogram model. Three parameters:

    range   1200 m
    sill    400
    nugget  0

and a regional mean, which is the value the surface reverts to far from any well.

The next lesson takes each of those apart. What matters now is that FOUR numbers, none of them measured, decide the shape of 894 depths.

## Why this matters for a deck

Because everything downstream inherits it. The oil-water contact cuts the surface, so the surface decides which cells hold oil. The crest decides the maximum column. The mean decides the equilibration datum. A different interpolation is a different volume, a different oil area, and a different forecast, on the same six measurements.

That is why a deck should carry the provenance of its structure in a comment and why a study should be able to answer "what surface is this and who made it" in one sentence.

## The alternative nobody should choose

A constant. Set every column top to the average of the six wells and the grid is flat, the contact either includes everything or nothing, and the model has no structure at all.

It sounds absurd and it happens, usually as a placeholder that nobody replaced. The tell is a TOPS block that compresses to a single repeat count, which the Associate tier taught you to spot.

## The misconception to avoid

"The surface came from the seismic, so it is data." A seismic surface is an interpretation in time, converted to depth through a velocity model, and tied to the wells. Every one of those steps is a model. Seismic gives you shape between wells, which is enormously valuable and is not the same as measurement.

## Exercise

First, compute how many of the deck's 900 column depths lie within 200 m of a well, taking each well as controlling the cells whose centres fall inside that radius. State what fraction of the surface that is.

Second, name the three decisions any interpolator must make, and for each say what a wrong choice would do to the deck's oil volume.
