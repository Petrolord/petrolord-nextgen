# Carriers pro rata and in stated shares

{{panel:joa-account-calculator}}

A carry says who is carried and for how much. It must also say who carries, and in what shares. There are two ways to say it, and the engine accepts exactly those two: the carriers share the carry pro rata, or they share it in shares the agreement states. There is no third way and no default.

## The two rules

The engine's basis states both:

> carriers 'pro-rata' share a carry in proportion to their participating interests among the parties no carry names as carried; stated shares must sum to 100

**Pro rata** means each carrier takes a part of the carry in proportion to its participating interest, counted only among the parties that are not themselves carried. On the Ekene carry, EKO, PA and PB are the carriers, and they take NOC's twenty points as 10.000000, 6.250000 and 3.750000.

**Stated shares** means the agreement names the carriers and gives each a percentage of the carry. Those percentages must sum to 100. A party the stated shares leave out carries nothing, whatever its participating interest.

## A half carry in stated shares

The worked case `int-half-carry-stated` uses the Ekene parties with a different carry. NOC is carried for 50.000000 percent of its cost share, and the carriers are EKO and PA in stated shares of 75.000000 and 25.000000. PB is not a carrier. The engine's reason:

> NOC: 50% of its 20% cost share is carried (10 points), paid by EKO 7.5, PA 2.5 (in the stated shares); its share of production stays 20%

| party | beneficial interest | paying interest | carried percent | carry points it pays |
| --- | --- | --- | --- | --- |
| EKO | 40.000000 | 47.500000 | 0.000000 | NOC 7.500000 |
| PA | 25.000000 | 27.500000 | 0.000000 | NOC 2.500000 |
| PB | 15.000000 | 15.000000 | 0.000000 | none |
| NOC | 20.000000 | 10.000000 | 50.000000 | none |

Half of NOC's twenty points is ten points of cost. EKO takes 75 percent of the ten and PA 25 percent. NOC still pays the other half of its share itself, so its paying interest is 10.000000, and PB pays exactly its participating interest of 15.000000.

## What the engine refuses

A carry with no carriers' rule is refused by name. The engine will not choose pro rata for you:

> carries[0].carriers must be "pro-rata" or an object of carrier shares in per cent (no default); got nothing

Stated shares that do not make up the whole carry are refused, with the sum printed:

> carries[0].carriers must sum to 100; got a sum of 90

The same small tolerance on arithmetic noise applies here as to the participating interests, 1e-9.

## Which rule an agreement uses

The engine does not guess which rule applies. The agreement states it, and so must your box. In the worked case PB stays out of the carry, which only stated shares can express: under pro rata every party that is not carried is a carrier.

## Exercise

Open the account calculator, the course's own calculator panel, and choose "Participating, paying and beneficial interests". Choose the start "A half carry in stated shares" and run it. Change the stated shares so that EKO carries 60 and PA 30, and read the refusal. Now add PB with a share of 10 so the shares make up the whole, run it, and write down each carrier's carry points. Finally, delete the `carriers` key altogether and read the refusal.
