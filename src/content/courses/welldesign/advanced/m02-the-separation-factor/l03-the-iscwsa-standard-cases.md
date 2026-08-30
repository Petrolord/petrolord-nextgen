# The ISCWSA standard cases

One reference well, eleven offsets, and published answers for all of them.

{{panel:wd-clearance-explorer}}

## What the set is

A reference well of a hundred stations to 2940 m measured depth, and eleven offset wells arranged around it at a range of geometries: some parallel, some crossing, some close at surface and diverging, one with a shared kickoff.

Every well is given with its survey AND its positions in a single shared frame, its own magnetic header, and published per-station separation factors.

The parameters are fixed: pedal-curve method, confidence factor 3.5, surface position sigma 0.5 m, tool projection allowance 0.3 m, reference hole radius 0.4572 m, offset hole radius 0.3048 m.

## Why a set rather than one case

Because a clearance implementation can be right in one geometry and wrong in another.

Parallel wells exercise the along-hole terms. Crossing wells exercise the closest-approach solver. Wells that are close at surface exercise the surface position term. The kicked-off case exercises the shared-uncertainty logic. Eleven cases cover the space.

## What this implementation gets

Every one of the eleven minimum separation factors is reproduced.

Ten of them agree with the oracle to between one part in a hundred million and three parts in ten thousand billion at every station. The eleventh, the kicked-off case, agrees exactly on its minimum and differs by up to 0.7 percent at far-field stations where the factor is above twenty. That case has its own lesson in module 5.

The panel shows the factor against measured depth for whichever offset is selected, with the two thresholds marked.

## Reading the ladder

Step through the offsets in the panel and watch the shape of the curve.

**A parallel well** gives a factor that is roughly constant over the parallel section: the distance is constant and the uncertainty grows, so the factor decays slowly.

**A crossing well** gives a sharp minimum at the crossing and large values either side. That is the classic anti-collision picture and it is the easiest to interpret.

**A well close at surface and diverging** gives a minimum at the top, where the wells are metres apart and the surface position term dominates.

The shape tells you what kind of problem it is, and the shape is why the whole ladder is plotted rather than the minimum alone.

## The classification

The engine classifies against two thresholds: below 1 is no-go, between 1 and 1.5 is review, above 1.5 is clear.

On this set, two are clear, four are review and five are no-go. The five include one at about 0.46, one at about 0.40, one at about 0.23, one very near zero, and one that is negative.

Those are deliberately hard cases. A real field would not drill any of them as planned.

## What the published numbers are worth

They are the agreement. Two implementations that both reproduce these eleven are computing the same thing, and a scan run by one operator can be checked by another.

Without that agreement, a disputed clearance between two operators becomes an argument about software, and there is no way to settle it.

## The misconception to avoid

"The standard cases are test data." They are the industry's agreed definition of what the calculation means, expressed as numbers rather than as prose. Reproducing them is not a quality check on the code; it is the evidence that the code implements the agreed method rather than a plausible variant of it.

## Exercise

Open the panel and step through all eleven offsets, recording each minimum separation factor and its classification.

Then sort them into the three shapes described above, and say for each shape which term in the separation factor is doing the most work.
