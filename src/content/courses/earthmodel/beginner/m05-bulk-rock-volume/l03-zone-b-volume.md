# Zone B volume

Zone A was the easy case. Its thickness is positive at every node of the frame, so there is only one node set to average over and only one sensible way to report it. Zone B is the case that teaches something, because zone B pinches out, and a zone that pinches out can be described honestly in two different ways that give two different headline thicknesses.

This lesson shows that the bulk rock volume is the same under both descriptions, and that this is exactly why the volume is the number worth handing on.

## Zone B by the closed form

Zone B has a mean thickness of 10.24 m over all 500 nodes of the frame. Run the same closed form as the last lesson:

10.24 x 500 x 2500 = 12,800,000 m3

That is the bulk rock volume of zone B, gross rock between TopB and BaseB, with the pinch-out included in it as zero thickness at the nodes where the zone has closed.

## The same volume from the other denominator

Module four established that zone B has positive thickness at only 320 of the 500 nodes. Over those 320 nodes alone its mean thickness is 16 m rather than 10.24 m.

Run the closed form again on that description, using the mean and the count that belong together:

16 x 320 x 2500 = 12,800,000 m3

The same volume, to the digit. Nothing has been approximated and nothing has been lost.

## Why the two agree

The reason is in the middle of the formula. The volume depends on the mean thickness and the node count only through their product, and that product is the sum of the thicknesses, which does not change when you change the denominator:

16 x 320 = 10.24 x 500 = 5120

Averaging over more nodes makes the mean smaller. It also makes the count larger, by exactly the factor that the mean shrank, because the extra nodes contributed nothing to the sum. The two moves cancel, and the volume never notices.

That cancellation is not a coincidence of this fixture. It happens whenever the nodes you add to the denominator carry zero thickness, which is precisely the situation a pinch-out creates.

## The volume does not care, the reader does

Put the two descriptions side by side and it is clear which part is robust and which part is fragile.

| description | mean thickness | nodes | bulk rock volume |
| --- | --- | --- | --- |
| over the whole frame | 10.24 m | 500 | 12,800,000 m3 |
| over the nodes with the zone | 16 m | 320 | 12,800,000 m3 |

The volume column is stable. The thickness column is not. Between the two rows the headline thickness changes by 56 percent, and neither row is wrong. They are answers to two different questions. The first asks how thick zone B is across the model. The second asks how thick zone B is where it exists.

A reader who is handed 16 m with no denominator attached will assume the whole model, and will carry a picture of zone B that is far too generous. A reader handed 10.24 m with no denominator will assume it applies where the zone exists, and will carry a picture that is too thin. Both readers will build on the number and neither will ask.

This is why the reporting rule from module four is not a stylistic preference. Every mean thickness travels with the node set it was averaged over, in the same sentence, every time. Write 10.24 m over all 500 nodes of the frame, or 16 m over the 320 nodes where zone B is present. Never write either figure alone.

## What to quote

In practice, quote both descriptions and the volume once.

The volume is the deliverable, because it is the quantity the two descriptions agree on and the quantity the next workflow consumes. The two means are context, because they tell the reader whether the zone is a thin sheet everywhere or a thicker body over part of the area, and those are different geological stories about the same 12,800,000 m3 of rock.

The clamp count belongs in the same sentence. The 180 nodes the clamp fixed on BaseB and the 180 nodes where zone B has zero thickness are the same 180 nodes, seen from two directions, and quoting them makes the pinch-out visible rather than buried inside a mean.

## Both zones together

The two zones of this model hold 57.8 x 10^6 m3 of gross rock between them, zone A's 45,000,000 m3 and zone B's 12,800,000 m3.

That total is the container this course was built to produce. Zone A dominates it, which is what a zone with a mean thickness of 36 m over 500 nodes will do beside a zone whose mean over the same 500 nodes is 10.24 m. Notice too that the total is a sum of two volumes and not a product of anything, so it does not inherit the denominator problem. Volumes add cleanly. Means do not.

## Exercise

Compute zone B's bulk rock volume twice, once from the frame-wide mean and once from the mean over the nodes where the zone exists, and confirm the two agree. Then answer in one sentence: what would have to be true of the 180 extra nodes for the two calculations to disagree?

As a self check: 10.24 x 500 x 2500 = 12,800,000 m3, and 16 x 320 x 2500 = 12,800,000 m3, because 16 x 320 = 10.24 x 500 = 5120 and the volume depends on the mean and the count only through their product. The two calculations would disagree if the 180 extra nodes carried anything other than zero thickness, because then adding them to the denominator would change the sum of the thicknesses as well as the count, and the two moves would no longer cancel. On this model those nodes are exactly where zone B has pinched out, so each contributes 0 m of thickness and the agreement is exact.
