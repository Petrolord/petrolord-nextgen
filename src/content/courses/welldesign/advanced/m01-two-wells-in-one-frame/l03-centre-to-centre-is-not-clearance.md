# Centre to centre is not clearance

Four things between two centrelines.

## The chain

Start with the distance between the two computed centrelines at the closest approach. Then subtract, in turn:

**The reference well's hole radius.** The reference wellbore is a cylinder, not a line.

**The offset well's hole radius.** So is the offset.

**A tool projection allowance.** The bottom hole assembly extends past the last survey station, and the drill string can push out of the hole's centre. The standard uses a fixed allowance for this.

What is left is the separation between the two wellbore SURFACES, with an allowance, and it is that quantity the uncertainty is compared against.

## The numbers in the standard example

The reference hole radius is 0.4572 m, which is a 36 inch diameter. The offset is 0.3048 m, a 24 inch. The tool projection allowance is 0.3 m.

Those three sum to 1.062 m of the centre-to-centre distance that is not available as clearance, before any uncertainty is considered.

For two wells a few metres apart near surface, over a metre of the gap is spoken for by geometry alone.

## Why the radii are inputs rather than constants

Because they change down the well. A 36 inch conductor, a 26 inch surface hole, a 17.5 inch intermediate, a 12.25 inch production hole: the radius at the depth of closest approach is what matters, and it is usually the drilled hole rather than the casing.

Washout makes it worse. A hole that has enlarged to 1.3 times gauge has 30 percent more radius than the bit size, and in a shallow unconsolidated section that is normal.

The engine takes a radius per well as a scalar, which is the standard's simplification. Where the closest approach is in a section much larger than the nominal, that scalar has to be chosen accordingly.

## Why an allowance for tool projection

The survey is at the sensor, which is behind the bit. The assembly ahead of it is stiff and can lie against the low side or be pushed out by a bend.

So the actual metal is not exactly on the computed centreline, by an amount that depends on the assembly and the hole. The standard's allowance is a single number covering it.

It is small, 0.3 m in the example, and it matters because everything else in this calculation is also small.

## What is NOT subtracted

The uncertainty. That is the next module, and it enters as a divisor rather than a subtraction, which is what makes the result a dimensionless factor rather than a distance.

Keeping them separate matters: the geometric terms are known and the uncertainty terms are modelled, and confusing the two produces a number that looks like a measured clearance and is not.

## What the engine reports

Both. The centre-to-centre distance and the derived clearance quantities are all in the result, so a report can state the geometry and the statistics separately.

That is worth doing. "The wells are 8 m apart centre to centre, of which 1.06 m is hole and allowance, against a combined uncertainty of 6 m at k 3.5" is a sentence a reader can check. "The separation factor is 1.15" is not.

## The misconception to avoid

"Centre-to-centre distance is the clearance." It is the starting point. On the standard example, over a metre of it is hole radius and tool allowance before uncertainty is considered at all, and near surface where the wells are metres apart that is a large fraction of everything available.

## Exercise

Two wells are 9 m apart centre to centre. The reference is a 17.5 inch hole and the offset a 12.25 inch hole, with a 0.3 m tool projection allowance.

Compute the surface-to-surface separation after the allowance. Then recompute it assuming both holes have washed out to 1.25 times gauge, and state the difference as a percentage of the original.
