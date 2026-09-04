# Lump

A fixed number that does not care how long the well takes or how deep it goes, but does care when it lands.

{{panel:wc-afe-explorer}}

## The arithmetic

A lump line carries a value, not a rate, and its amount is that value. Nothing multiplies it. The engine reads `value` and returns it unchanged.

The golden carries five lump lines, and together they are 2,050,000 USD, or 38.10 percent of the base.

| Line | Value USD | Lands at |
| --- | --- | --- |
| Casing and accessories | 800,000 | a9 |
| Completion services | 500,000 | a10 |
| Cementing services | 300,000 | a6 |
| Wellhead | 250,000 | a3 |
| Wireline logging | 200,000 | a8 |

## The link that does not change the money

Four of those five name an activity in `atActivityId`. That link has no effect whatsoever on the AFE total. Move the wellhead from a3 to a9 and the base stays at 5,380,000 USD.

What the link changes is the cost-time curve. A lump line appears there as a vertical step at the end time of the activity it names, so the placement decides when the money is committed even though it does not decide how much. A lump line with no link steps in at spud, at time zero.

That distinction is worth holding onto. Amount and timing are separate facts, and only one of them reaches the total.

## Reading a step on the curve

The golden's curve reaches 2,260,000 USD at 211.5 hours, immediately after activity a6, the 13-3/8 inch casing. The 300,000 USD cementing line steps in at exactly that point, so the curve jumps rather than slopes there.

Steps like that are where an AFE becomes a cash flow. If you need to know how much of the authority is spent by the halfway mark, the steps are what you count.

## What belongs here

Anything bought as a job or as a delivered item at an agreed price. Casing and accessories, the wellhead, a cementing job, a logging run, a completion, a mobilisation.

The test is whether an overrun is the vendor's problem or yours. If the price is agreed regardless of how long the job takes, the line is lump.

## Exercise

Re-link one lump line to a much later activity in the panel and confirm the AFE total is unchanged.

Then read the cost-time curve before and after, and describe in one sentence what did change.
