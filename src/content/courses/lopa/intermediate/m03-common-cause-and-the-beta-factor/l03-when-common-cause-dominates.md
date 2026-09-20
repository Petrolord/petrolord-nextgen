# When common cause dominates

{{panel:lp-sif-builder}}

Every redundant PFDavg is a race between two terms. The independent term is squared or cubed, so it shrinks fast as channels are added and grows fast as the proof test interval stretches. The common cause term is linear and single channel. Raise the beta factor from zero and at some point the second term passes the first. The engine reports which term is dominant with every call, and the point where the answer changes hands is the most useful thing a designer can know about a subsystem.

## The sweep

The EKULAMA channel with diagnostics as a one out of two and a two out of three, with the beta factor swept and betaD held at half of it, all stated.

| architecture | beta factor | betaD | independent term | common cause | PFDavg | dominant |
| --- | --- | --- | --- | --- | --- | --- |
| 1oo2 | 0 | 0 | 0.000037396736 | 0.000000000000 | 0.000037396736 | independent |
| 2oo3 | 0 | 0 | 0.000112190208 | 0.000000000000 | 0.000112190208 | independent |
| 1oo2 | 0.02 | 0.01 | 0.000036430741 | 0.000105536000 | 0.000141966741 | common cause |
| 2oo3 | 0.02 | 0.01 | 0.000109292223 | 0.000105536000 | 0.000214828223 | independent |
| 1oo2 | 0.05 | 0.025 | 0.000035005448 | 0.000263840000 | 0.000298845448 | common cause |
| 2oo3 | 0.05 | 0.025 | 0.000105016345 | 0.000263840000 | 0.000368856345 | common cause |
| 1oo2 | 0.1 | 0.05 | 0.000032693162 | 0.000527680000 | 0.000560373162 | common cause |
| 2oo3 | 0.1 | 0.05 | 0.000098079485 | 0.000527680000 | 0.000625759485 | common cause |
| 1oo2 | 0.2 | 0.1 | 0.000028305589 | 0.001055360000 | 0.001083665589 | common cause |
| 2oo3 | 0.2 | 0.1 | 0.000084916768 | 0.001055360000 | 0.001140276768 | common cause |

## Where each one turns

On this channel the one out of two turns common cause dominated at a beta factor of 0.02 and the two out of three at 0.05. The two out of three holds out longer for one reason only: its independent term carries a coefficient of six where the one out of two carries two, so it starts three times larger and has further to fall behind. Both architectures share exactly the same common cause term at every beta factor in the sweep, which is worth pausing on.

## What dominance means for a design

Once the common cause term dominates, a second or a third channel buys very little. Read the totals down the sweep. At a beta factor of 0.2 the one out of two returns 0.001083665589 and the two out of three returns 0.001140276768, two designs of quite different cost sitting within a few percent of each other. Past that point the money belongs somewhere else: diversity between channels, separation of cabling and process connections, different test procedures, or a shorter proof test interval on the undetected population.

## The linear term sets a floor

The common cause term is linear in the beta factor and linear in the proof test interval, and no voting arrangement in this engine removes it. It behaves as a floor beneath every redundant architecture on the same channel. A design that needs a PFDavg below that floor has to change the beta factor or the interval, and buying more identical hardware will not reach it.

## Why the independent term also falls

There is a second effect in the sweep that is easy to miss. As the beta factor rises the independent term falls, from 0.000037396736 to 0.000028305589 on the one out of two. That happens because common cause failures are removed from the rate that fails channels independently before the squaring, so raising the beta factor shifts failures from one term into the other. The total still climbs steeply, because the term they move into is linear and single channel while the term they leave is squared.

## Exercise

Take the one out of two at a beta factor of 0.02, where the total is 0.000141966741, and at 0.2, where it is 0.001083665589. Compute the ratio of the two totals, then compute the ratio of their common cause terms. Say what the difference between those two ratios tells you about the independent term across that range.
