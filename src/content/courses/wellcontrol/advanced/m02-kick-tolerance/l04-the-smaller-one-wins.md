# The smaller one wins

Two cases, one answer, and why the choice is not arbitrary.

{{panel:wc-tolerance-explorer}}

## The rule

    kick tolerance = min(shut-in case, circulated case)

Both have to be survivable. If either fails, the well cannot handle that influx.

## The two wells

| well | shut in | circulated | tolerance | which binds |
|---|---|---|---|---|
| slant | 2.783680488747303 | 3.133289667323 | 2.783680489 m3 | shut in |
| horizontal | 3.274027579221525 | 1.078825341807 | 1.078825342 m3 | circulated |

Opposite answers on the same mud, the same fracture gradient and the same kick intensity.

## Why the slant well is limited shut in

Because its shoe is 1225.671108990 m of true vertical depth above its bit. The mud column between them is large, so the pressure at the shoe with the hole full of mud is already well below the fracture pressure, and there is not a great deal of headroom.

But once the influx starts to rise, the pressure at the shoe falls with it, so the circulated case is more forgiving than the shut-in one.

## Why the horizontal well is limited circulated

Because its shoe is only 42.515647195 m of true vertical depth above its bit. Shut in there is enormous headroom, because the shoe is barely below the bit.

But the influx has almost nowhere to go: 42.5 m of rise and its top is at the shoe, and at that point the shoe is at nearly the formation pressure with a light column above it.

## The general statement

**A deep shoe relative to the bit** gives a small headroom and a forgiving circulation. Shut in binds.

**A shallow shoe relative to the bit**, which is what a long horizontal section produces, gives a large headroom and a punishing circulation. The circulated case binds.

## Why both cases exist

Because a well control event goes through both states: shut in first, then circulated.

Checking only one of them checks half the operation, and which half was checked would depend on which well you happened to be on.

## The consequence for long laterals

A horizontal well's kick tolerance is small and it is set by geometry rather than by mud weight.

Raising the mud weight barely helps: it reduces the headroom on one case and does nothing about the gap on the other. That is a real and uncomfortable finding about extended reach wells.

## Exercise

For each well, compute the ratio of the larger case to the smaller one.

Then say what would have to change about the horizontal well for its shut-in case to become the binding one.
