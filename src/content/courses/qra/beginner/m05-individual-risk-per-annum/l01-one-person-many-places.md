# One person, many places

{{panel:qr-event-tree}}

An LSIR belongs to a place. Individual risk per annum, IRPA, belongs to a person. It is the individual risk one person carries over a year: the sum over the places they occupy of the LSIR there times the fraction of the year they spend there, times a vulnerability factor the analyst may supply, which defaults to 1. The engine's model string, verbatim: "IRPA = sum LSIR_j x occupancy_j x v_j (v as supplied, default 1)".

## The EREMOR operator

The EREMOR operator divides the working year among the three places whose LSIRs you already know. The hours are stated.

| contribution per year | place | LSIR per year | hours a year, stated | occupancy fraction |
| --- | --- | --- | --- | --- |
| 0.000016912100 | process deck | 0.000148150000 | 1000 | 0.114155251142 |
| 0.000000597717 | control room | 0.000006545000 | 800 | 0.091324200913 |
| 0.000000031562 | accommodation | 0.000000108000 | 2560 | 0.292237442922 |

The operator's IRPA is 0.000017541379 per year, over a total occupancy of 0.497716894977 of the year. For the rest of the year the roster places the operator at none of EREMOR's three places, so no contribution is counted for those hours.

## Reading the contributions

The process deck dominates. The operator spends fewer hours there than in the accommodation, yet its contribution of 0.000016912100 per year is most of the IRPA, because the deck's LSIR is so much higher than the accommodation's. The accommodation, where the operator spends 2560 hours, adds only 0.000000031562 per year.

This is the practical value of IRPA. Two people who work at the same facility can carry very different individual risk depending on where their hours fall, and the contributions show exactly which place drives each person's figure. A reviewer asking whether a person's figure is reasonable reads the contributions first.

The contributions also show where a change of roster would count. Moving hours out of the process deck would lower the operator's IRPA far more than moving the same hours out of the accommodation, because each hour is weighted by the LSIR of the place it is spent in. The engine does not suggest such changes; it only makes their effect easy to read from one table.

## Place and person, side by side

| per year | what it is |
| --- | --- |
| 0.000148150000 | the process deck LSIR, someone there all year, outdoors and unprotected |
| 0.000154803000 | the three LSIRs summed with no occupancy, no one's individual risk |
| 0.000017541379 | the operator's IRPA, with each place weighted by the share of the year spent there |

The first figure describes a place. The second describes nothing real, because it puts one person in three places at once for the whole year. The third describes a person. Occupancy is what turns the first kind of number into the third, and it is why an IRPA can never exceed the largest LSIR a person visits.

## Where IRPA goes next

IRPA is where this tier's answer ends. The Expert tier later asks where a given individual risk falls against thresholds the analyst supplies, and the Professional tier asks how many people die at once. Both begin from figures like these, and this tier quotes neither of their answers.

## Exercise

Add the operator's three contributions and confirm that they reach the IRPA of 0.000017541379 per year. Then multiply the process deck LSIR, 0.000148150000 per year, by its occupancy fraction of 0.114155251142, and check that you reproduce the deck contribution of 0.000016912100.
