# The rate is not a detail

EGINA's four wells cost 141050000 USD at 310000 USD a day and 113750000 USD at 250000 USD a day. Nothing about the wells changed between those two answers.

{{panel:ec-schedule-explorer}}

## Two rates, one campaign

| rig rate | campaign cost |
| --- | --- |
| 310000 USD a day | 141050000 USD |
| 250000 USD a day | 113750000 USD |

182 rig days either way. The depths, the trajectories, the complexities and the day counts are identical in both columns. The only thing that moved is a commercial term, and it moved the campaign total by a margin no engineering decision in the campaign could match.

## Where the rate comes from

The rate belongs to the plan. It is negotiated, it is dated, it depends on the rig market and the contract length, and it is not something a cost engine can know.

Before this course's repair the engine did not read it. Every well was priced at a hardcoded 250000 USD a day whatever the plan carried, so a plan that had entered 310000 got 113750000 back and no sign anywhere that its own number had been ignored. The repaired engine reads the plan's rate, which is why the same four wells now return 141050000 USD.

## A wrong rate is wrong in every row

A well cost is a day count priced by a rate and a service multiple, so an error in the rate lands in every well at once and in the same proportion. EG-01 at 47275000 USD and EG-04 at 26350000 USD both move together, and their ordering is undisturbed.

That is what makes it hard to catch. The campaign still ranks its wells correctly, the deepest is still the dearest, and every internal relationship in the table survives. Only the total is wrong, and totals are what get carried out of the wells section into the plan.

A refusal would be easier to live with. Elsewhere the studio refuses a negative capex and an unreadable one by name, and a refused plan gets fixed within the hour. A plan priced at somebody else's rate gets approved.

## The mistake

Treating the rig rate as a placeholder to be revisited later. A campaign priced at a stale rate is arithmetically perfect and commercially wrong, and it fails in silence: no refusal, no warning, just 113750000 USD standing where 141050000 USD is true.

The habit that catches it is to read the rate an answer was computed at before reading the answer. A well cost quoted without its day rate is not a cost, it is a day count wearing a currency symbol.

## Exercise

State the campaign cost at 310000 USD a day and at 250000 USD a day, and give the rig days in each case. Then say why an error in the rig rate leaves the ranking of the four wells unchanged, and explain what a reader should ask for before accepting a well cost.
