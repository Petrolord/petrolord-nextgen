# What actually varies

Almost every input to a well cost model is uncertain, and only some of them are inputs a planner can honestly put a range on.

{{panel:wc-risk-explorer}}

## Three families

Rates set how long the physical work takes. Rate of penetration on a drill activity, trip speed, casing running speed. They are the inputs that turn metres into hours.

Durations are stated directly. The flat activities carry an hours figure with no rate behind it, so their uncertainty is a range on the hours themselves. On the golden programme the rig move and spud is 24 productive hours and the completion and handover is 60.

Unit costs are prices. A day rate, a per metre rate, the value of a lump. They are uncertain for commercial reasons rather than physical ones.

## Which of them you can actually estimate

A range is only honest if you can defend both endpoints from something.

Rate of penetration you can defend, because offset wells in the same formations give you a spread of achieved rates section by section. Flat durations you can defend from your own recent operations. A contracted day rate you can defend within the terms of the contract, and a lump for a service still out to tender you can defend from quotes.

What you cannot defend is a range invented to make the answer look uncertain enough. If you cannot say where a number came from, leave it deterministic and say so.

## What the published case chooses

The golden risk case runs 2,000 iterations at seed 42 and varies exactly four things.

| Target | Field | Min | Mode | Max |
|---|---|---|---|---|
| a4, intermediate hole | ropMPerHr | 10 | 15 | 22 |
| a7, production hole | ropMPerHr | 6 | 10 | 14 |
| c1, rig dayrate | rate | 85,000 | 100,000 | 130,000 |
| c8, completion services | value | 350,000 | 500,000 | 800,000 |

Two rates, one price, one lump. That is a deliberately small set, and each of the four is a number somebody could be asked to justify.

## What it deliberately holds fixed

The non-productive fraction of 0.125 and the contingency fraction of 0.1 do not vary. Both are already provisions for things going wrong. Sampling a rate of penetration and then also sampling the allowance for trouble counts the same worry twice, and the second count is invisible in the output.

It matters because time is where the money is. On the golden estimate 2,880,000 USD of the 5,380,000 USD base is per day exposed, and one extra day costs 160,000 USD.

## Exercise

For each of the four uncertainties above, write one sentence naming the evidence you would use to defend its minimum and its maximum.

Then pick one input the case holds fixed and argue either for or against varying it.
