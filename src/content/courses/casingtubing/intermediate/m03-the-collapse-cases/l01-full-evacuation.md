# Full evacuation

Nothing inside, mud outside, and the deepest point wins.

{{panel:ct-loadcase-explorer}}

## The story

The inside of the casing is empty and the outside is full of drilling mud.

That happens for real: a lost circulation zone below the shoe swallows the fluid, or a drillstem test drops the level, or a gas lift unloads the string. It is also the standard pessimistic assumption when nobody can prove the level will not fall.

## The columns

    inside(z)  = 0
    outside(z) = mud gradient x z

With mud at 1440 kg/m3 the outside gradient is 14121.576 Pa per metre and the inside is nothing at all, so the collapse differential is the mud hydrostatic itself.

At the shoe that is 35415778.63557866 Pa.

## Where it governs

At the deepest point of every section, because the differential grows monotonically with depth and never turns round.

| section | governing depth (m) | collapse SF | regime |
|---|---|---|---|
| 1 | 1454.59342559458 | 1.7576249995635107 | plastic |
| 2 | 2507.919699301 | 1.2882443095792595 | plastic |

## The design factor here is 1.0

Not 1.1, and not 1.25. The published design factor set uses 1.0 for collapse, which means the acceptance criterion is that the rating merely exceeds the load.

That is a deliberate choice with a real argument behind it. The collapse RATING is already a published minimum from a test population, not a best estimate, so it carries its own conservatism, and stacking a design factor on top of it double-counts.

It also means there is no margin. A collapse safety factor of 1.05 passes, and it passes with five percent between the design and a flattened casing.

## The lowest number in the suite

Section 2 on this case gives 1.2882443095792595, and that is the smallest collapse safety factor anywhere in the seven cases on this string.

It is also comfortably above 1.0, which is why the published string passes. It would not take much to change that, and the capstone string is a demonstration of exactly how little.

## Exercise

Compute the collapse differential at the shoe from the mud gradient and the shoe depth.

Then divide the section 2 collapse rating into it. You will need the derated rating, and the next-but-one lesson explains why.
