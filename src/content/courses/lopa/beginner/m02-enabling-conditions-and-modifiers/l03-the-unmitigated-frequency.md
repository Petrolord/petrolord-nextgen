# The unmitigated frequency

{{panel:lp-worksheet}}

The unmitigated frequency is how often the consequence is expected before any independent protection layer is given credit. It is the initiating event frequency multiplied by the product of the enabling conditions and the product of the conditional modifiers. On the ORONI row it reads 0.013500000000 per year, and every figure after it in the chain is built on it.

## The three parts of the product

| quantity | engine key | value |
| --- | --- | --- |
| product of the enabling conditions | `enablingProduct` | 0.300000000000 |
| product of the conditional modifiers | `modifierProduct` | 0.100000000000 |
| unmitigated frequency, per year | `unmitigatedFrequencyPerYr` | 0.013500000000 |

The initiating frequency of 0.45 per year is carried by 0.300000000000 and then by 0.100000000000. The engine returns the two products separately as well as the frequency, so a worksheet can show its working and a reviewer can check one factor at a time without recomputing the row.

## What the word unmitigated is doing

It means unmitigated by protection layers. The enabling conditions and the conditional modifiers have already been applied, and they are not layers. Nothing about the separator being on the high pressure manifold protects anybody, and nothing about the chance of ignition is a safeguard somebody maintains. Those factors describe the scenario. The layers come next, and they are the only things on the row that anyone tests, proof checks or is accountable for keeping in service.

Reading the engine's method string from left to right makes the order plain, verbatim: "CCPS (2001) Layer of Protection Analysis: f = IEF x prod(enabling) x prod(conditional modifiers) x prod(PFD of credited IPLs); RRF = f / TMEL; required PFDavg = TMEL / f; SIL band low demand per IEC 61511-1".

The unmitigated frequency is everything up to the last product in that expression.

## Where it is used, and where it is not

The unmitigated frequency is a reporting figure and a review figure. The comparison with the tolerable frequency is made on the mitigated frequency, after credited layers, which for ORONI is 0.000013500000 per year. The gap between 0.013500000000 and 0.000013500000 is exactly the credited layers, and seeing both numbers side by side is how a reviewer judges whether the plant is leaning on its layers harder than it realised.

A row whose unmitigated frequency is already below its tolerable frequency needs no layers and no SIF. A row whose unmitigated frequency is far above it is relying on its layers for everything, and each of those layers then has to survive the independence test in the next module.

## Exercise

Take the initiating frequency of 0.45 per year and multiply it by the enabling product of 0.300000000000 and the modifier product of 0.100000000000. Confirm you reach 0.013500000000 per year. Then divide the unmitigated frequency by the mitigated frequency of 0.000013500000 per year, and write one sentence saying what that ratio is made of and why it is not the required risk reduction factor.
