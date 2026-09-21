# The group equivalent down time

{{panel:lp-sif-builder}}

A redundant subsystem fails only when enough channels are down at the same time. The channel equivalent down time describes one channel on its own. To describe the overlap the engine carries a second quantity, tGE, the group equivalent down time, and for the one out of three architecture a third, tG2E. They exist because the second failure of a group does not wait as long as the first one did.

## Why the second failure waits less

The first failure in a group can arrive at any point in the proof test interval and waits on average half of it. Once it has arrived, the group is exposed only until the next test, and a second failure that lands in that shortened window is what actually fails the pair. Averaging over both arrival times replaces the half interval with a third of it. For a one out of three the argument runs twice: the second failure uses a third of the interval and the group a quarter.

## The values on one channel

The EKULAMA channel with diagnostics, the same stated inputs throughout, run in every architecture.

| architecture | tCE hours | tGE hours | tG2E hours | independent term |
| --- | --- | --- | --- | --- |
| 1oo1 | 1322.000000 | null | null | 0.005288000000 |
| 1oo2 | 1322.000000 | 884.000000 | null | 0.000035259176 |
| 2oo2 | 1322.000000 | null | null | 0.010576000000 |
| 2oo3 | 1322.000000 | 884.000000 | null | 0.000105777528 |
| 1oo3 | 1322.000000 | 665.000000 | 884.000000 | 0.000000273209 |

The two architectures that need one overlap, the one out of two and the two out of three, both carry a group equivalent down time of 884.000000 hours against a channel figure of 1322.000000. The one out of three needs two overlaps, so it carries 884.000000 hours for the second failure and 665.000000 hours for the group.

## Where the times enter the formula

The engine prints the equation it used with every call. For a one out of two it reads as follows.

> PFD = 2((1-bD) lDD + (1-b) lDU)^2 tCE tGE + bD lDD MTTR + b lDU (T1/2 + MRT)

The first term is the independent one: the independent dangerous rate is squared and the two equivalent down times multiply it, which is what makes that term small. The other two terms are common cause, and neither carries an equivalent down time, because a common cause failure takes the whole group at once.

## What this buys and what it does not

Look at the independent terms in the table. The one out of two reaches 0.000035259176 and the one out of three reaches 0.000000273209, more than a hundred times smaller again. Redundancy is very effective against independent failure. The common cause terms sit outside this product, and the next module is about what they do to these totals.

## The null entries are real information

The table prints null wherever a quantity does not enter the equation the engine used. A one out of one has no group to overlap, and a two out of two fails on the first dangerous failure of either channel. Reading the nulls shows which equation a call ran.

## Exercise

Take the two out of three independent term of 0.000105777528 and the one out of two independent term of 0.000035259176 on the same channel. Compute the ratio of the first to the second to six decimals, then explain the result using the coefficients in the two printed formulas.
