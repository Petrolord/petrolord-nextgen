# Reading the IOGP published rates

{{panel:ss-rates-explorer}}

IOGP's published figures for 2024 give 3071 recordable cases in 3795000000 hours. Through the engine on the 1,000,000 hour base that is 0.809223, and IOGP prints 0.81. Its published 2024 FAR rests on 32 fatalities in 4158877000 hours: the engine gives 0.769438 and IOGP prints 0.77. For 2023, 27 fatalities in 3291382000 hours give 0.820324 against a printed 0.82.

| IOGP figure | count | hours | base | engine | published |
| --- | --- | --- | --- | --- | --- |
| TRIR 2024 | 3071 | 3795000000 | 1000000 | 0.809223 | 0.81 |
| FAR 2024 | 32 | 4158877000 | 100000000 | 0.769438 | 0.77 |
| FAR 2023 | 27 | 3291382000 | 100000000 | 0.820324 | 0.82 |

## Where these figures come from

The engine carries no benchmark rates. The IOGP counts and hours above come from the vendored golden, where they sit as published inputs, and the engine recomputes each rate from them. Every row matches the golden with a relative difference of 0, and every row rounds to the figure IOGP printed. That is the engine reproducing a published calculation, and it is the reason these rows can be trusted as a reference.

## How precise a published figure is

The IOGP report prints the TRIR hours to the nearest million. The engine's 0.809223 therefore anchors two things: that the formula is right, and that it reproduces the printed 0.81. It anchors nothing finer. The trailing decimals of 0.809223 rest on an hours figure that was already rounded before it reached the engine, and a benchmark comparison that leans on the fourth decimal is leaning on the rounding.

So quote the IOGP TRIR as IOGP's published figure, 0.81 per 1,000,000 hours, and use the engine's 0.809223 when the arithmetic needs a figure to carry through. Say which is which.

## Two counts behind the FAR

The FAR counts fatalities, and a fatality count is different from a fatal incident count. In 2024 IOGP recorded 32 fatalities in 21 fatal incidents. On the same 4158877000 hours the first gives the observed FAR of 0.769438 and the second gives 0.504944 fatal incidents per 100,000,000 hours. An incident that kills several people moves the FAR by several and the incident rate by one. A benchmark comparison has to say which of the two it is using.

FAR here is an observed rate, counted after the fact. A planned course in the academy will teach a predicted FAR from a risk assessment, and the two must not be set beside each other as if they measured the same thing.

## What a published rate is for

A published industry rate is a reference line. It tells a company where the reporting membership as a whole sat in a year, on IOGP's definitions and IOGP's base. The next lessons in this module test what happens when a single site is set against it: first the base and the definition, then the statistics of comparing one workforce with many.

## Exercise

Divide 3071 by 3795000000 and multiply by 1,000,000 to confirm the engine's 0.809223. Then add half a million hours to the IOGP total, the most the printed rounding could hide, and recompute. Record which decimal of the rate moved, and write one sentence on how many decimals of the IOGP TRIR a benchmark comparison can honestly quote.
