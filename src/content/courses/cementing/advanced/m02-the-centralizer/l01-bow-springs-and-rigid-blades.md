# Bow springs and rigid blades

Two devices, two entirely different calculations.

{{panel:cm-standoff-explorer}}

## The bow spring

A set of steel bows, larger than the hole in their free state, that compress as the casing is run and push outward against the wall.

It is a SPRING. The standoff it achieves depends on the load applied to it, so it depends on the weight of the casing, the spacing between centralizers and the hole angle.

It can be pushed to zero standoff by a large enough load. It also passes through restrictions, because it compresses.

## The rigid centralizer

A solid body machined or cast to a fixed outside diameter, larger than the casing and smaller than the hole.

It is a SPACER. The standoff it achieves is a ratio of diameters and nothing else:

    standoff = (blade OD - casing OD) / (bore - casing OD)

No load, no spacing, no inclination. It cannot be pushed further in, and it cannot pass a restriction smaller than its blade.

## The engine's two branches

    if (type === 'rigid') {
      const blade = bladeOdM ?? r.boreIdEffM - 0.01;
      atCent = clamp((blade - casing OD) / (bore - casing OD), 0, 1);
    } else {
      const k = restoringForce / ((1 - standoffAtRestoringForce) x clearance);
      const W = wBuoy x spacing x sin(inclination);
      atCent = (clearance - min(clearance, W / k)) / clearance;
    }

Two lines against four, and the rigid one has no physics in it at all.

## The default blade

    bladeOdM ?? r.boreIdEffM - 0.01

If no blade diameter is given, the engine assumes ten millimetres under the bore. That is a generous assumption and it is silent.

On this well's open hole that default gives a standoff at the centralizer of about 74 percent before any sag. A real rigid centralizer for an 8-1/2 inch hole would typically be smaller than that.

## The ceiling a rigid centralizer cannot pass

Its blade ratio. If the blade is 0.206 m in a 0.2159 m hole around 0.1778 m casing:

    (0.206 - 0.1778) / (0.2159 - 0.1778) = 0.7401574803149601

That is the BEST it can do, at the centralizer, with no sag and no load. Everything else only makes it worse.

A bow spring under light load reaches 1. A rigid centralizer never does.

## Which to use

Rigid centralizers in cased hole and through restrictions, where a known blade ratio is worth more than a spring that might be crushed. Bow springs in open hole, where the hole is bigger than nominal and a spring keeps pushing.

Many programmes alternate them.

## Exercise

Compute the blade ratio for a 0.213 m rigid centralizer in this well's cased section, whose bore is 0.2204974 m.

Then compute the same blade in the open hole at 0.2159 m, and say why it would not go in.
