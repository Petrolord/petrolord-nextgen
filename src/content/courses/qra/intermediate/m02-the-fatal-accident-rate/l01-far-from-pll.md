# FAR from PLL

{{panel:qr-societal}}

The PLL counts expected deaths per year for a whole population, so it grows with the size of that population. A crew of sixty and a crew of six hundred doing the same work in the same places would show very different PLL figures and the same underlying hazard. The fatal accident rate removes that dependence by dividing the expected deaths by the hours people are exposed to them. It is the measure offshore operators have used for decades to compare installations and work groups.

## The definition

The fatal accident rate, FAR, is the number of fatalities per 100,000,000 exposed hours. The engine's model string, verbatim:

> FAR = PLL x 100,000,000 / exposed hours per year

A hundred million hours is roughly the working lifetimes of a thousand people, which is why the base was chosen: it turns the very small rates of an industrial workplace into numbers a person can read and compare. FAR is always quoted per 100,000,000 exposed hours in this course, and never on any other base.

## The JISIKE crew

The crew PLL built in the potential loss of life module is 0.002420000000 fatalities per year. The crew is 60 people, each exposed 2000 hours a year, both stated, so the exposed hours per year are 120000, derived.

| quantity | value |
| --- | --- |
| PLL, fatalities per year | 0.002420000000 |
| people, stated | 60 |
| hours each per year, stated | 2000 |
| exposed hours per year, derived | 120000 |
| FAR per 100,000,000 exposed hours | 2.016667 |

The engine returns a FAR of 2.016667. In words: if this crew's exposure were accumulated to a hundred million hours, about two deaths would be expected along the way.

## Why the two inputs are separate

The engine takes the PLL and the exposed hours as two inputs. It does not reach back into the scenarios to count heads. That keeps the FAR honest about what it divides: the analyst decides whose hours belong in the denominator and states them. The PLL must be computed over the same people whose hours are counted, and the engine cannot check that. A PLL built for the whole site divided by the hours of one work group would produce a number with no meaning, and it would look exactly like any other FAR on the page.

## Where the base comes from

The base is imported from the safety statistics engine, and the basis names it, verbatim:

> engines/hse/safetyStats.js RATE_BASES.FAR_100M (IOGP: fatalities per 100,000,000 hours)

This course does not define its own hundred million. It uses the one the safety statistics course already uses, which is a declared choice the third lesson of this module returns to in detail.

## Exercise

Using the PLL of 0.002420000000 fatalities per year and the 120000 exposed hours per year, carry out the division and the multiplication by 100,000,000 by hand, and confirm the engine's FAR of 2.016667. Then say what the FAR would be if the same PLL were spread over twice the exposed hours.
