# Five items, honestly counted

A list, a count and no weighting.

{{panel:cm-standoff-explorer}}

## The five

**density-hierarchy.** Each pumped fluid at least as dense as the fluid ahead of it, over the chain of mud plus the pumped fluids, skipping the displacement.

**standoff.** Minimum standoff at or above the API 67 percent target.

**no-free-fall.** No free-fall period anywhere in the placement.

**float-holds.** The annulus is heavier than the inside at the end of the job, so the floats hold a forward U-tube rather than a reverse one.

**annular-velocity.** The slowest annular velocity is at least 0.3 m/s.

## The return

    { items: [{ id, ok, detail }, ...], passed, total }

A list, a count of the ones that hold, and a count of the ones there are. Five and five, or four and five.

Each item carries a DETAIL string with its own numbers in it:

    Minimum standoff 60% vs the API 67% target.
    Minimum annular velocity 1.48 m/s (target >= 0.3 m/s for mud removal).

## On this course's wells

**Slant well:** five of five.

**Horizontal well:** four of five, and the one that fails is `standoff`.

Same job, same fluids, same rate, same centralizer. The trajectory fails one item.

## The one that is conditional

    if (annulusRowsList && pumpRateM3s > 0) { ... }

The annular velocity item is only added if the annulus rows and a rate were supplied. So `total` can be 4 rather than 5, and a caller comparing `passed` against a hard-coded 5 would be wrong.

The engine's own test asserts `total >= 5` rather than `=== 5`, which is the right assertion for a list that can grow.

## What is not on the list

Whether the achieved top of cement matched the target. Whether the peak circulating density stayed under a fracture limit. Whether the volumes reconcile.

Those are all computed elsewhere and reported elsewhere, and the checklist does not gather them. It is a placement quality list, not a job summary.

## Why a list and not a score

The next lesson but one is entirely about that.

## Exercise

The horizontal well fails one of five items.

Say which of the other four would fail if the same job were pumped at 0.002 cubic metres a second, and which would fail if the lead slurry were 1400 kg/m3 instead of 1560.
