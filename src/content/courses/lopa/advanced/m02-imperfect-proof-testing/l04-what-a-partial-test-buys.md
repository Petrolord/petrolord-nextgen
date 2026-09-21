# What a partial test buys

{{panel:lp-proof-test}}

The usual reason a site accepts imperfect coverage is that the perfect test is expensive. A full functional test of a shutdown valve wants a shutdown; a partial stroke test wants a few seconds and a signal. So the real scheme on most plants is a partial test at a short interval with a full test at the overhaul, and the question is what that scheme is worth. The engine answers it as a coverage split. The covered part of the failures sees the short interval. The uncovered part sees the overhaul. The engine models exactly that split and nothing more elaborate.

## What the split costs at one interval

OBAGI on a one year test, with the coverage swept and everything else held.

| proof test coverage, stated | tCE hours | PFDavg | RRF | SIL |
| --- | --- | --- | --- | --- |
| 1 | 4404.000000 | 0.003963600000 | 252.295893 | 2 |
| 0.9 | 8346.000000 | 0.007511400000 | 133.130974 | 2 |
| 0.8 | 12288.000000 | 0.011059200000 | 90.422454 | 1 |
| 0.7 | 16230.000000 | 0.014607000000 | 68.460327 | 1 |

Between coverage 1 and coverage 0.7 the achieved risk reduction factor falls from 252.295893 to 68.460327 and the band drops from SIL 2 to SIL 1. That is the honest price of a test that reaches seven failures in ten.

## What it costs in interval

The same subsystem, now read as the longest interval that still meets a target of 0.02.

| coverage, stated | longest T1 hours at the target | longest T1 years |
| --- | --- | --- |
| 1 | 44396.444444 | 5.068087 |
| 0.9 | 39596.049383 | 4.520097 |
| 0.8 | 33595.555556 | 3.835109 |
| 0.7 | 25880.634921 | 2.954410 |

Read this way the loss is smaller than the first table suggests. A coverage of 0.9 still supports 4.520097 years against 5.068087 years for a perfect test. A coverage of 0.7 costs about two years of interval. So a partial test buys a schedule that a full test could not have bought at all, because the full test is unavailable between turnarounds.

## Why the two tables disagree about the damage

The two readings are not in conflict. They are answers to two different questions. The first table holds the interval at one year and asks what the PFDavg becomes, so the whole loss lands in the answer. The second table lets the interval move and asks how far it can move before a fixed target is reached, so part of the loss is absorbed by testing more often. A site that cannot change its test frequency sees the first table. A site that can sees the second. Both belong in a verification note, because the target is what decides which one governs the decision.

## What the engine does not model

It does not model two separate test tasks at two separate intervals with two separate coverages, and it does not model a test whose coverage improves with practice. One coverage, one interval, one lifetime. A scheme more elaborate than that has to be reduced to those three numbers before the engine sees it, and the reduction is the analyst's argument to make and to record. The figures above are engine returns on stated illustrative rates, and none of them is a recommendation about a real valve.

## Exercise

Take the coverage 0.9 row from each table: a PFDavg of 0.007511400000 on a one year test, and a longest interval of 4.520097 years against a target of 0.02. Work out how much of the target the one year test is using. Then write two sentences for a verification note saying what a partial stroke scheme at that coverage buys the site and which single input you would want evidence for before signing it.
