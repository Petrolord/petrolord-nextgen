# A reorder point for a service level

{{panel:materials-spares-calculator}}

The lead-time risk view answers two questions. Given a stated reorder point, how often does a cycle run short? And given a stated cycle service level, what reorder point would meet it? This lesson reads the second answer, how the engine finds it among the draws, and why it is an estimate.

## The sorted draw

When a cycle service level is stated, the engine sorts the sampled lead-time demands and returns the smallest one that at least that share of draws does not exceed. It states the index it reads, verbatim for a level of 0.95:

> reorderPointForService is the sorted lead-time demand at index ceil(0.95 x n) - 1

With 20000 draws that is one sorted demand; the reorder point at it is stocked against 95 percent of the draws. The level is a cycle service level: the share of cycles with no stockout.

## The mechanical seal

On seed 20270301 and 20000 draws, the reorder point for a cycle service level of 0.95 is estimated at 3.062282 seals. The register states a reorder point of 3, whose sampled cycle service level is 0.941400 on the same seed and draws. The stated 3 falls just short of the target; a reorder point of 3.062282 meets it on this sample. Both figures are sampled and neither is graded.

| figure | seed 20270301, 20000 draws |
| --- | --- |
| stated reorder point | 3 |
| its cycle service level (sampled) | 0.941400 |
| reorder point for 0.95 (sampled) | 3.062282 |

A seal is a whole unit, and the engine returns the sorted draw as it is. Rounding it to a whole seal is the planner's stated choice, and so is the policy that follows.

## A stated reading, with its alternative

Reading the draw at ceil(level times draws) less one is the engine's stated choice. The alternative reads one sorted draw higher. The two differ by one draw in 20000, which is well inside the noise of any one seed; the course states the reading so a learner can reproduce the figure exactly.

## No cycle service level stated

The cycle service level is the one optional input of this view. Left out, the engine returns no reorder point for a cycle service level, and its service line says so: no serviceLevel stated. The stockout count on the stated reorder point is unchanged.

## A level of one

A cycle service level of 1 would need a reorder point above every possible draw. The engine refuses it, verbatim:

> serviceLevel must be a number strictly between 0 and 1; got 1

## Exercise

Open the spares calculator on the view "Lead-time risk by Monte Carlo (ungraded)" and start from "The mechanical seal on the Ekene register". Read the "Reorder point for the service level (sampled)" tile and the "Cycle service level (sampled)" tile, and write each with its seed and draws. Clear "Service level for a reorder point (optional)" so it reads not stated; check that the tile goes empty, the stockout count stays at 1172, and the service line changes. Set it to 1 and read the refusal. Restore 0.95.
