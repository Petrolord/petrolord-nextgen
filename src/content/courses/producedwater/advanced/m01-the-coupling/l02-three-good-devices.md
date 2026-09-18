# Three good devices and one great one

Three devices that each remove most of the oil put in front of them do not add up to one device that removes almost all of it. The arithmetic a designer does in their head is compounding, and compounding is the wrong model.

{{panel:pw-train-explorer}}

## The compounding an engineer expects

Take the first stage of the five identical devices in the coupling sweep. It removes 65.398946 percent of the oil. Multiplying that removal five times over, which is what a fixed efficiency licenses you to do, predicts an outlet of 8.927280 ppm on the OGBOTOBO inlet.

The train says 250.692079 ppm.

## Where the compounding fails

Compounding assumes the thing being removed is homogeneous. Oil in water is a distribution, and a device is a cut size against it, so a fixed fraction of each SIZE survives rather than a fixed fraction of the whole.

The volume surviving in one size bin does compound, and that part of the arithmetic is exact. The removal over the whole distribution does not, because the weight in each bin shifts towards the fine end at every stage, and the fine end is where the grade efficiency is low.

## The real train, on real equipment

The OGBOTOBO train is four unlike stages, and it reaches 91.089356 percent overall with an outlet of 160.391597 ppm on an inlet of 1800 ppm. The stage removals are 3.237437, then 85.209861, then 27.278164, then 14.382082 percent.

| stage | cut micron | removal percent | outlet ppm |
| --- | --- | --- | --- |
| API 421 basin | 112.300216 | 3.237437 | 1741.726140 |
| Hydrocyclone bank | 4.246743 | 85.209861 | 257.603712 |
| Induced gas flotation | 7.446595 | 27.278164 | 187.334148 |
| Walnut shell filter | 9.930885 | 14.382082 | 160.391597 |

Read the outlet column rather than the removal column. The removal column is four numbers about four different waters. The outlet column follows one quantity through the plant.

## One great device is a different object

A sweep of cut sizes on the UZERE inlet, d50 26 micron at sigma 0.8, takes one device down to 2 micron. It removes 99.398720 percent there and leaves a surviving volume of 0.006012799541, with an outlet droplet median of 4.880416 micron. Those figures belong to that water: the OGBOTOBO inlet carries its oil at a different d50 and sigma, and the same device on it would report something else.

A single cut placed far below the population takes almost the whole distribution in one pass. Ordinary devices approach that only slowly, because each one works further down a tail the one before it already thinned, which is why the five identical stages above still leave 250.692079 ppm.

A train therefore buys you a SEQUENCE of cut sizes rather than a product of efficiencies.

## The design conversation this changes

The useful question is never whether a device is good. It is what that device is being asked to do at the point in the train where it sits. A device placed where the water is already fine is being asked for its worst performance, and the number it returns will say so.

Read a vendor claim the same way: a removal percentage belongs to a water, and without that water stated it cannot be carried to another plant.

## Exercise

Build the four stage OGBOTOBO train in the panel and write down the outlet after each stage. Compound the second stage removal four times over and compare that prediction with the train's own answer, then say which assumption the compounding makes that the engine does not.
