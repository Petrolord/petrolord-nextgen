# Paying interest under a carry

{{panel:joa-account-calculator}}

The paying interest is a party's share of every cost of the joint account. Without a carry it equals the participating interest. Under a carry it moves: the carried party pays less, and each carrier pays more by its share of the carry. This lesson works the Ekene carry and the refusals that guard it.

## The rule

The engine's basis states it in one line:

> beneficial interest = participating interest (the share of production); paying interest = participating interest - the carried part of a carried party's share + the carriers' shares of every carry

Two quantities go into the paying interest:

* **the carried part**, for the carried party: its participating interest times the carried percentage;
* **the carry points**, for each carrier: its share of the carried part, by the carriers' rule.

## The Ekene carry, point by point

NOC holds a participating interest of 20.000000 and is carried for 100.000000 percent of it. The carried part is twenty points of cost. The carriers share it pro rata to their participating interests: EKO 40, PA 25 and PB 15 out of the 80 points the carriers hold between them.

| party | participating interest | carry points it pays | paying interest |
| --- | --- | --- | --- |
| EKO | 40.000000 | 10.000000 | 50.000000 |
| PA | 25.000000 | 6.250000 | 31.250000 |
| PB | 15.000000 | 3.750000 | 18.750000 |
| NOC | 20.000000 | none | 0.000000 |

Each carrier's paying interest is its participating interest plus its carry points: EKO pays 40 plus 10, which is 50.000000. NOC's paying interest is its participating interest less the carried part: 20 less 20, which is 0.000000. The paying interests still sum to the whole, because every point taken off NOC lands on a carrier.

## A partial carry

A carry need not be total. The field `carriedPct` states the percentage of the carried party's cost share that is carried. At 100 the carried party pays nothing; at a lower figure it pays the rest of its share itself.

## What the engine refuses

A carry of nothing is no carry, and the engine refuses it:

> carries[0].carriedPct must be a number above 0 and at most 100; got 0

A carry must leave at least one party paying, or no one would pay the cost:

> carries must be leaving at least one party that is not carried; got ["A","B"]

And a carried party cannot also carry another. In a case with two carries, naming NOC as a carrier of the second is refused:

> carries[1].carriers.NOC is a carried party and cannot carry another

The carried party must also be a party. A carry naming an unknown id is refused, and the message lists the ids the engine knows:

> carries[0].carried must be the id of a party (EKO, PA, PB, NOC); got "XYZ"

## The paying interest in a cash call

Every cash call is split on the paying interests, so NOC's row in the cash calls view is 0.000000 in every month of 2027. Its share of each call sits inside the carriers' calls.

## Exercise

Open the account calculator, the course's own calculator panel, and choose "Participating, paying and beneficial interests". Start from the Ekene joint venture. Set the carry's `carriedPct` to 50 and run it; work out by hand what each carrier's carry points should be, and check them against the "carry points it pays" column. Then set `carriedPct` to 0 and read the refusal. Finally, change `carried` from "NOC" to "XYZ" and write down the ids the refusal lists.
