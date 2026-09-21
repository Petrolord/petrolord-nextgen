# The largest reasonably practicable cost

{{panel:qr-alarp}}

The ratio says how far a measure sits from the edge. The largest reasonably practicable cost says where the edge is, in money: DF times the present value of the benefit. It is the most a duty holder could spend on the measure and still be bound to adopt it. The engine returns it beside every verdict, and for an engineering team it is often the most useful number in the result.

## For the firewall

| DF | present value of the benefit | largest reasonably practicable cost | present value of the cost | verdict |
| --- | --- | --- | --- | --- |
| 3 | 40000.00 | 120000.00 | 350000.00 | GROSSLY_DISPROPORTIONATE |
| 10 | 40000.00 | 400000.00 | 350000.00 | NOT_GROSSLY_DISPROPORTIONATE |

Undiscounted, at DF 3, the EDIKAN firewall could cost up to 120000.00 and remain reasonably practicable. Its present value of the cost is 350000.00, so it is grossly disproportionate. At DF 10 the limit rises to 400000.00, above the cost, and the verdict turns.

## Reading the limit

The limit reads naturally to an engineer. A cost to benefit ratio of 8.750000 is abstract. A limit of 120000.00 against a cost of 350000.00 shows how far the design is from reasonably practicable, and it invites the obvious question: is there a cheaper way to prevent the same fatalities? A measure redesigned to cost no more than the limit, preventing the same deltaPLL over the same life, would pass at the same DF.

The limit also shows where the cost sits. Most of the firewall's cost is its capital of 250000 at year 0, and the annual cost of 5000 is the smaller part. A redesign that aims at the limit aims first at the capital, since that is where most of the money sits.

## The limit from the published example

The checklist example is the published check on this figure. Its total benefit is 9283.50 undiscounted, its DF 10, and the engine's largest reasonable cost is 92835.00. The checklist prints 93000, its own rounding, and a cost of exactly 93000 is GROSSLY_DISPROPORTIONATE by 165.00. The limit is therefore always carried from the engine's computation, and the print is quoted only as a check.

## The limit moves with the benefit

The limit is DF times the present value of the benefit, so everything that moves the benefit moves the limit: the VPF, the injury values, the life, the benefit rate and the growth rate. Under the checklist limits the firewall's benefit falls to 34337.28, and the limit at DF 3 falls with it. A note that quotes a limit states the convention, the VPF and its year, and the DF it was computed under, or the figure means nothing to the reader.

## Exercise

Take the firewall at DF 3: a present value of the benefit of 40000.00. Multiply by the DF and check the limit of 120000.00. Then compare it with the present value of the cost, 350000.00, and write one sentence to the project team stating the most the firewall could cost at this DF and still be reasonably practicable, with the convention it assumes.
