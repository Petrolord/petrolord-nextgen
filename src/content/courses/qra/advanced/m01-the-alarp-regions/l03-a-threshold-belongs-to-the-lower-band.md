# A threshold belongs to the lower band

{{panel:qr-alarp}}

Every limit in this tier is a single number, and a stated or computed value can land exactly on one. The engine then has to put it somewhere, and either side could be argued. The engine follows the OWNER'S DECISION: a value exactly at a threshold belongs to the LOWER band. This lesson shows where that decision reaches, what the published sources say about it, and what the other convention would change.

## Where the decision reaches

| value, stated | preset | engine band | boundary |
| --- | --- | --- | --- |
| 1e-3 | r2p2-workers | TOLERABLE | unacceptable |
| 1e-4 | r2p2-public | TOLERABLE | unacceptable |
| 1e-6 | r2p2-workers | BROADLY_ACCEPTABLE | broadly-acceptable |

The same rule runs through every threshold the engine has. An individual risk exactly at 1e-3 per year is TOLERABLE for workers. Exactly at 1e-6 it is BROADLY_ACCEPTABLE. A cost exactly DF times the benefit is NOT_GROSSLY_DISPROPORTIONATE, which the gross disproportion module returns to. A societal curve exactly on a criterion line TOUCHES it. One rule covers all four places.

## What the sources say

Every source the engine read words its threshold this way. R2P2 paragraph 136 says "more than". Bevi says "ten hoogste", which means at most. The HSE checklist says costs over benefits "greater than" the DF. Each wording puts a value equal to the limit on the lower side, and the engine agrees with them.

One source reads the other way at equality. The Purple Book Figure 6.8 caption prints its line as "F < 1e-3 N^-2", under which a value exactly on the line fails. R2P2's bias to safety could also argue for the other convention: when in doubt, treat the boundary case as the worse one. The engine records its choice openly as a decision taken by the owner, so a reviewer who prefers the other convention can see exactly where it would matter.

## What the other convention would change

Only values exactly on a limit move. Under the other convention an individual risk exactly at 1e-3 per year would be UNACCEPTABLE for workers, and one exactly at 1e-6 would be TOLERABLE and would need a demonstration. A cost exactly DF times the benefit would be grossly disproportionate, and the measure could be rejected on cost. Every value strictly inside a region keeps its band under either convention.

That is why the result always names the boundary it touched. When the boundary field is filled, the verdict is one that turns on the convention, and the ALARP note should say so in plain words. When it is null, the convention made no difference to that result, and the note can say that too.

## Limits in the wrong order

The decision needs two limits that make sense together. A caller who gives a lower limit at or above the upper limit is refused, and the refusal names the lower limit as the offending field:

> thresholds.broadlyAcceptableAtOrBelowPerYr: must lie below unacceptableAbovePerYr

## Exercise

Take the three rows of the table. For each, write the band the engine returned, then write the band it would take under the other convention, where a value on a limit belongs to the upper band. Mark which rows would change whether an ALARP demonstration is required. Then write one sentence for an ALARP note that states the convention used and names the boundary the 1e-3 row touched.
