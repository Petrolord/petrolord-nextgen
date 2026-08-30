# What this course will not certify

Five things taught here and graded nowhere.

## Why state it

Because teaching a topic implies it is worth learning and GRADING one implies the learner can produce the answer and that the answer is worth producing. Those are different claims and this series keeps them apart.

The go-live migration for this course asserts the separation: it refuses to run if any graded field key names one of the five below.

## Inelastic and anisotropic rock behaviour

The model is linear elastic and isotropic. Real rock near a hole wall softens and dilates as it approaches failure, which is why a breakout stabilises at a finite width instead of running away. Shale is strongly anisotropic, and the error on a deviated well through shale is comparable with the whole window width.

## Time-dependent effects

No clock. Pore pressure diffusion into the near-wall rock, creep in salt and plastic shale, and accumulating damage under sustained load all make a hole worse the longer it is open.

Open hole time is the strongest single predictor of trouble in a shale section, and this model cannot represent it.

## Chemical effects

One strength number and no notion of what the mud is made of. Water activity, clay swelling and ion exchange are all first-order controls on shale stability, and choosing an oil-based mud for a reactive shale is a chemical solution to a problem this model sees as purely mechanical.

## Thermal stress

Isothermal. Cooling the wall reduces the hoop stress by several megapascals in a deep hot well, which helps against collapse and hurts against fracture. It is why injection fracture gradients fall over the life of a waterflood, and why losses can start after hours of trouble-free circulation.

## Natural fractures and bedding

A continuum. A hole intersecting a natural fracture does not have to split intact rock to lose returns: it only has to open a plane that already exists, at roughly the normal stress across it, which can be far below the computed initiation pressure.

## What IS certified

The 1D mechanical earth model: k0, the frictional limit ratio, the two horizontal stresses from the uniaxial poroelastic estimate with a tectonic strain term and a Biot coefficient, clamped to the Andersonian bounds, and rock strength from two published sonic correlations.

Full-tensor Kirsch wellbore stability at a point: the rotation into the borehole frame, the wall stresses round the circumference, Mohr-Coulomb collapse at zero breakout width and tensile fracture initiation, both by deterministic bisection.

And the mud window walked along a whole trajectory, with the tightest point, both lower-bound candidates and the closure test.

That is the industry-standard 1D workflow, it is what a mud programme and a trajectory decision actually use, and stating its edges is what makes it usable by somebody who was not in the room.

## Exercise

For each of the five, name a well or a field where it would be the thing that decided the outcome.

Then say which one you would implement first, and what data it would need that a normal well already has.
