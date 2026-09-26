# Seeded sampling of days and daily cost

{{panel:pr-contract-calculator}}

Two things about the Ekene job are uncertain: how many days it takes, and what each day costs the contractor. The engine samples both, many times, and reads every figure in this module from the samples. This lesson shows how the sampling is done, and why a stated seed and a stated iteration count name the result exactly.

## Two draws per iteration

The daily cost is triangular in the fixture, with a minimum of 38000, a most likely value of 42000 and a maximum of 55000. The NPT fraction is triangular too, as the last lesson showed. The engine states its own sampling in its basis, verbatim:

> 20000 iterations, one mulberry32(20270211) stream; per iteration a uniform for the NPT fraction (days = wellCost evaluateProgram productive days x (1 + NPT fraction)) then one for the daily cost; triangular inverse CDF (lib/stats triInvCDF)

Each iteration takes two uniform numbers from one stream, in a fixed order: the first becomes an NPT fraction, the second a daily cost, each through the inverse of its triangle's distribution. The generator is `mulberry32` from the platform's `lib/stats`, and the inverse is `triInvCDF` from the same library. The tender engine carries no sampling code of its own; it imports the platform's canonical Monte Carlo pieces.

## What the samples look like

Over 20000 iterations on seed 20270211, the engine returns for the days and the contractor cost:

| figure | mean | P90 (low) | P50 | P10 (high) | min | max |
| --- | --- | --- | --- | --- | --- | --- |
| days | 15.277257 | 13.557943 | 15.053348 | 17.399290 | 12.663205 | 19.243864 |
| contractor cost | 827170.582636 | 723013.750014 | 817988.243265 | 945032.177102 | 633271.750221 | 1162952.266817 |

The P labels follow the platform's exceedance convention: P90 is the figure with a 90 percent probability of being met or exceeded, so it is the low figure and P10 the high one. The next module takes that reversal apart. Here, notice only that the mean days sit above the planned 13.865486, because the NPT triangle's long tail pulls the mean upward.

## The seed names the result

A random draw that cannot be repeated cannot be graded or audited. The engine has no default seed and refuses a call without one:

> seed must be a whole number from 0 to 4294967295; there is no default, so every run can be reproduced

It refuses a missing iteration count in the same way:

> iterations must be a whole number from 1 to 200000

With both stated, the result is fixed. At 200 iterations on seed 20270211 the day rate's mean company cost is 931498.363877, and a second run with the same inputs returns the same figure and the same object in every field. On seed 20270212 the same 200 iterations give 915967.840404. Every Monte Carlo figure in this course is therefore quoted with its seed and its iteration count, and a figure quoted without them names nothing.

## Exercise

Open the contract calculator on the view "Contract types on one job". Set `iterations` to 200 and leave the seed at 20270211, and read the day rate's mean cost. Run it again and confirm it does not move. Change the seed to 20270212 and compare. Then delete the `seed` line and read the refusal, restore it, delete `iterations` and read that refusal. Finally set 20000 iterations on seed 20270211 and check the reading of the sampling basis the panel prints against the quotation above.
