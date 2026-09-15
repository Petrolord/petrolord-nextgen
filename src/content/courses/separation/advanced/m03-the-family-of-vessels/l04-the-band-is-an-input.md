# The band is an input

The slenderness band is typed in by whoever ran the sweep. It decides which rows are inRange and it never decides whether a vessel works, which is why widening it does not conjure a vessel out of a failing family.

{{panel:fc-slug-explorer}}

## Widening it, and watching nothing move

ABANA-2 in a band of 3.000000 to 5.000000 prefers 7.000000 ft. Widen the band to 3.000000 to 7.000000 and one row changes status:

| diameter ft | L/D | in band at 3 to 5 | in band at 3 to 7 | feasible | reasons at 3 to 7 |
| --- | --- | --- | --- | --- | --- |
| 5.000000 | 11.914516 | false | false | false | gas-capacity, ld-out-of-band |
| 6.000000 | 6.894974 | false | true | false | gas-capacity |
| 7.000000 | 4.342025 | true | true | true | none |
| 8.000000 | 2.908817 | false | false | true | ld-out-of-band |

The 6.000000 ft row comes into the band and stays infeasible on gas capacity, so its reason list loses `ld-out-of-band` and keeps `gas-capacity`. Preferred stays 7.000000 ft with status selected.

That is the test the repair was built to pass. A rule that took the first row inside the band would have moved its answer from 7.000000 ft to 6.000000 ft, on a vessel that cannot carry its gas, because somebody widened a preference.

## Narrowing it, and watching the answer vanish

The same lever runs the other way. AGBAMI at 500.000000 micron in a band of 3.000000 to 5.000000 prefers 7.000000 ft. Narrow the band to 4.000000 to 5.000000 and every row is feasible, every row is out of band, preferred is null and the status is none-in-band. No vessel got worse. The band stopped admitting any of them.

## What the band cannot reach

The band touches `inRange` and it touches `reasons`. It never touches a length, a slenderness, a gas margin or a droplet verdict, because those come from the stream and the drum. So a band change can move a preference between qualifying vessels and it can remove a preference altogether, and it can never make an infeasible vessel feasible.

A band that runs backwards is refused outright: SeparatorInputError on `ldMax`, "ldMax must be a number no smaller than ldMin (got 3)".

## The mistake

The mistake is widening the band until an answer appears. The answer that appears is a vessel that was always there, and if the sweep was returning none-feasible then widening changes nothing at all, because none of the rows was ever excluded by shape.

The second mistake is quoting a preferred diameter without its band. The band is part of the question, so 7.000000 ft in a band of 3.000000 to 5.000000 and a null in a band of 4.000000 to 5.000000 are two honest answers about the same family, and a report that gives one of them without saying which band it asked has left out half the input.

## Exercise

Explain what changes and what stays the same when the ABANA-2 band widens from 3.000000 to 5.000000 out to 3.000000 to 7.000000, naming the row that moves and the flag that moves with it. Then say why a band change can never turn an infeasible row feasible, and give the engine's refusal for a band that runs backwards.
