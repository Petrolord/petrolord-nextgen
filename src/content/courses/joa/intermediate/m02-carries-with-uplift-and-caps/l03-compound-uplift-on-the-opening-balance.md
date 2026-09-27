# Compound uplift on the opening balance

{{panel:joa-recovery-calculator}}

A carrier that pays another party's cost waits years to be repaid, and a contract may compensate it with an uplift on the unrecovered balance. A compound uplift is a stated percentage a year on the balance that opens the year. Where the year's new cost and the year's recovery sit relative to that uplift is a question of timing, and the engine states its answer.

## The rule and its timing

The engine's basis on the Ekene carry, verbatim:

> 8% a year on the opening balance, compounded yearly; a year's new cost earns none in its own year

> the uplift accrues on the opening balance; the year's carried cost is added; recovery comes from the same year's entitlement at the year end

The rate is the fixture's stated term. The engine holds no uplift rate, and a contract that states none is refused, as the first lesson of this module showed.

## The Ekene carry, year by year

The golden input states a compound uplift of 8.000000 percent a year, recovery from 50.000000 percent of NOC's share, and basis contract:

| year | opening | uplift | carried cost | due | recovered | closing |
| --- | --- | --- | --- | --- | --- | --- |
| 2027 | 0.000000 | 0.000000 | 16400000.000000 | 16400000.000000 | 0.000000 | 16400000.000000 |
| 2028 | 16400000.000000 | 1312000.000000 | 12000000.000000 | 29712000.000000 | 0.000000 | 29712000.000000 |
| 2029 | 29712000.000000 | 2376960.000000 | 0.000000 | 32088960.000000 | 0.000000 | 32088960.000000 |
| 2030 | 32088960.000000 | 2567116.800000 | 0.000000 | 34656076.800000 | 9600000.000000 | 25056076.800000 |
| 2031 | 25056076.800000 | 2004486.144000 | 0.000000 | 27060562.944000 | 11200000.000000 | 15860562.944000 |
| 2032 | 15860562.944000 | 1268845.035520 | 0.000000 | 17129407.979520 | 10400000.000000 | 6729407.979520 |
| 2033 | 6729407.979520 | 538352.638362 | 0.000000 | 7267760.617882 | 7267760.617882 | 0.000000 |

In 2028 the uplift of 1312000.000000 is charged on the opening balance of 16400000.000000 alone: the 12000000.000000 carried in 2028 earns nothing until it opens 2029. In 2033 the balance due, 7267760.617882, is less than the 9400000.000000 available, and the engine says so in its own words:

> 2033: the balance 7267760.62 is recovered with 7267760.62 of the 9400000 available; the carried party receives 11532239.38 of its share 18800000

The reason rounds to the cent for reading. The field you reason with is 7267760.617882. Over the life of the carry the uplift totals 10067760.617882, and the carriers recover 38467760.617882 on a carried cost of 28400000.000000.

## Cost while recovering

A carry can still be adding cost while it is being recovered. On a small golden ledger with a compound uplift of 25 percent and recovery from the whole share, 2028 opens at 100.000000, adds an uplift of 25.000000 and a new carried cost of 100.000000, recovers 50.000000 and closes at 175.000000:

> 2028: 50 recovered of 225 due; 175 carried to 2029

## What the uplift is worth to each party

The uplift moves value from the carried party to its carriers, and the NPV of each party shows how much. At a discount rate of 0.100000 to a base year of 2027, NOC's NPV is 49870804.456959 under the compound carry and 54584252.437515 on the carry under PIA s.85(4), which recovers the cost alone from the whole share. Each figure depends on the rate and base year stated; how discounting works is the cash flow course's subject.

## Exercise

Work in the course's own recovery calculator, view "A carry and its recovery", starting from "The Ekene carry, compound uplift".

1. Check the 2028 row: the uplift on the opening balance, and the year's carried cost with no uplift of its own.
2. Read the 2033 row and its reason, and find the field that the reason rounds.
3. With the control "Uplift, percent a year (stated)", set 12. Read the tiles "Uplift" and "Recovered in year", and NOC's NPV. Then set 4 and read them again. Write one sentence on what the rate does to the payout year and to NOC.
