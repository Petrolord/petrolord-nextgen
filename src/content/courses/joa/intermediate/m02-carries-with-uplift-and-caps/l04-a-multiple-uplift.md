# A multiple uplift

{{panel:joa-recovery-calculator}}

A contract can compensate carriers with a fixed multiple of the carried cost in place of a rate on the balance. A multiple of 150 percent means the carriers recover the cost and half again, however long the recovery takes. The engine takes the multiple as a stated input with no default, and adds the extra part in the year each cost is carried.

## The Ekene carry with a multiple

The golden input states a multiple of 150 percent, recovery from 50.000000 percent of NOC's share, and basis contract. The engine's reasons for the first two years:

> 2027: the 150% multiple on the carried cost of 16400000 adds 8200000

> 2028: the 150% multiple on the carried cost of 12000000 adds 6000000

| year | opening | uplift | carried cost | due | recovered | closing |
| --- | --- | --- | --- | --- | --- | --- |
| 2027 | 0.000000 | 8200000.000000 | 16400000.000000 | 24600000.000000 | 0.000000 | 24600000.000000 |
| 2028 | 24600000.000000 | 6000000.000000 | 12000000.000000 | 42600000.000000 | 0.000000 | 42600000.000000 |
| 2029 | 42600000.000000 | 0.000000 | 0.000000 | 42600000.000000 | 0.000000 | 42600000.000000 |
| 2033 | 11400000.000000 | 0.000000 | 0.000000 | 11400000.000000 | 9400000.000000 | 2000000.000000 |
| 2034 | 2000000.000000 | 0.000000 | 0.000000 | 2000000.000000 | 2000000.000000 | 0.000000 |

The extra part is added in the year the cost is carried, before NOC has any entitlement, so the balance due jumps at once and then waits. After 2028 the balance earns nothing more: the multiple has fixed the amount due at 42600000.000000, and the ledger only pays it down from half of NOC's share each year. It is recovered in 2034, with NOC keeping 15200000.000000 of its share of 17200000.000000 that year. Everything recovered, the multiple's extra part included, goes to EKO, PA and PB in their carry shares.

## Multiple and compound side by side

| terms | uplift total | recovered | recovered in | NOC NPV at 0.100000 to 2027 |
| --- | --- | --- | --- | --- |
| compound 8.000000 percent a year | 10067760.617882 | 38467760.617882 | 2033 | 49870804.456959 |
| multiple 150 percent | 14200000.000000 | 42600000.000000 | 2034 | 47640894.676658 |

On this carry the multiple costs NOC more than the compound rate: its uplift is larger and it is recovered a year later. That ordering belongs to these terms. A compound uplift grows with every year the balance stays open, so a slower recovery can make it the larger of the two; a multiple is the same whatever the timing.

## What the engine refuses

A multiple below 100 percent would recover less than the cost, and the engine refuses it:

> uplift.multiplePct must be a number at or above 100 (100 recovers the cost alone); got 90

Each uplift type reads only its own term. A rate stated beside an uplift of type "none" is refused, so that a term the contract did not intend never enters the arithmetic:

> uplift.ratePctPerYear must be left out when type is "none"; got 5

## Exercise

Work in the course's own recovery calculator, view "A carry and its recovery".

1. Start from "The Ekene carry, multiple uplift". Check the 2027 and 2028 rows and the tiles "Uplift" and "Recovered in year" against the tables above.
2. Read NOC's NPV and compare it with the compound carry's.
3. With the control "Uplift multiple, percent (stated)", set 100. Read the tiles again and say what the carriers now recover.
4. Set the multiple to 90 and read the refusal.
5. In the box, replace the whole `uplift` object with `{ "type": "none", "ratePctPerYear": 5 }` and read the refusal.
