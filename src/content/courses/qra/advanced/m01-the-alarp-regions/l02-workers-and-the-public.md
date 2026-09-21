# Workers and the public

{{panel:qr-alarp}}

R2P2 sets different upper limits for the people who work at an installation and for the public who live around it. The engine carries both as presets, `r2p2-workers` and `r2p2-public`, and a stated individual risk can be banded against either. The choice of preset is the analyst's, and it follows from who carries the individual risk. This lesson puts the same stated values through both presets and reads where the answers part.

## Two presets, one lower limit

| preset | unacceptable above, per year | broadly acceptable at or below, per year |
| --- | --- | --- |
| r2p2-workers | 1e-3 | 1e-6 |
| r2p2-public | 1e-4 | 1e-6 |

The upper limit for the public is lower than the upper limit for workers. The lower limit is the same for both, 1e-6 per year. Workers take on an individual risk as part of their employment, with training, supervision and a choice about the job. The public near a site has made no such choice, so R2P2 draws its upper line lower for them.

## The same individual risk, two bands

| individual risk per year, stated | workers band | public band | public boundary |
| --- | --- | --- | --- |
| 2e-3 | UNACCEPTABLE | UNACCEPTABLE | null |
| 5e-4 | TOLERABLE | UNACCEPTABLE | null |
| 1e-4 | TOLERABLE | TOLERABLE | unacceptable |
| 2e-5 | TOLERABLE | TOLERABLE | null |
| 5e-7 | BROADLY_ACCEPTABLE | BROADLY_ACCEPTABLE | null |

Look at 5e-4 per year. For a worker it is TOLERABLE and an ALARP demonstration is required. For a member of the public at the fence it is UNACCEPTABLE, and no demonstration can rescue it. The number is identical; the person carrying it differs, and so does the verdict. An individual risk is therefore always reported with the population it belongs to.

Look also at 1e-4 per year against the public preset. It sits exactly on the public upper limit, and the engine reports TOLERABLE with boundary `unacceptable`. The next lesson explains why a value exactly on a limit lands in the lower band.

## Naming a preset

A preset is looked up only among the names the engine itself defines. A misspelt name is refused, and so is a name that every JavaScript object carries, such as `constructor`:

> thresholds: unknown preset 'constructor'; one of r2p2-workers, r2p2-public, or give { unacceptableAbovePerYr, broadlyAcceptableAtOrBelowPerYr }

The refusal lists the two presets and the shape of your own limits. A duty holder with its own criteria gives both limits explicitly, and the basis then records what was supplied.

## Choosing the preset for a person

An individual risk per annum belongs to one person, so the preset follows that person. The operator on a process deck is a worker. A resident in a house by the road is public. A visitor or a contractor needs a decision written down, because the preset decides whether 5e-4 per year is a tolerable individual risk to be reduced or an unacceptable one to be removed. Write the choice and its reason beside the band so a reviewer can check both.

## Exercise

A stated individual risk of 5e-4 per year is carried by two people: a worker on the deck and a member of the public in a house near the fence. Using the second table, write down each person's band and whether an ALARP demonstration is required for each. Then write one sentence explaining to a site manager why the same number gives two different answers.
