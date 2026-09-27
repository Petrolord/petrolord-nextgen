# Boundaries, rule by rule

{{panel:farmout-valuation-calculator}}

Every rule the engine applies has its own boundary, and no single rule covers them all. A cap reached exactly is its own state. A fee paid on the last day of a period is on one side of it. A break-even reached exactly is a tie. This lesson collects the boundaries the course has met across three tiers, each probed by a call on a golden input.

## The table

| rule | at the boundary (probed) | engine result |
| --- | --- | --- |
| gross-cost cap | a gross cost EQUAL to the cap (earn-cap-gross-exactly: 40000000.000000) | "exactly", excess 0.000000; the promote on all of it |
| carry-amount cap | a carry EQUAL to the cap (earn-cap-carry-exactly: 4000000.000000) | "exactly" |
| promote | a share paid EQUAL to the interest earned (earn-heads-up) | promote 0.000000 points, ratio 1.000000 |
| share paid | a share paid EQUAL to the farmor's interest (earn-full-carry) | accepted; the farmor pays 0.000000 |
| vesting "all-events" | one event short of all (earn-ekene-drill-to-earn) | vested 0.000000 |
| break-even promote | the share asked EQUAL to the break-even share (deal-promote-exactly-break-even) | farminee EMV 0.000000, a tie between farm in and decline |
| chance of success | stated as 0 (deal-ekene-dry-hole) | the farmor's best action "walk away" |
| chance of success | stated as 100 (deal-ekene-certain) | the farmor's best action "drill alone" |
| fee, day 90 | paid 90 days after the notification (fee-day-90) | "on-time" |
| fee, day 210 | the ninetieth surcharge day (fee-day-210) | 90 surcharge days, 3528.000000; the consent stands |
| fee, day 211 | one day more (fee-day-211) | "consent-deemed-withdrawn" |
| EVII against its cost | EVII EQUAL to the cost (info-uninformative) | "the information is worth exactly its cost" |
| price-to-value ratio | a value per percent at or below 0 (interest-negative-emv) | no ratio, and a reason says why |
| carry recovered exactly | available EQUAL to the balance (devcarry-recovered-exactly) | recovered that year; closing 0.000000 |
| a development carry | the farminee earning the farmor's whole interest | refused: the farmor keeps a carried interest |

## Reading the table

Three kinds of boundary appear. Some are states with a name of their own: "exactly" for a cap, "on-time" for a fee on day 90, "consent-deemed-withdrawn" on day 211. Some are ties, where two actions are worth the same and the engine names both: at the break-even promote the farminee's EMV is 0.000000 and farm in ties with decline. And some are reported in words beside a figure: an EVII equal to its cost, or a ratio the engine declines to print.

A boundary is inclusive on one side and exclusive on the other, and the side differs by rule. A gross cost equal to the cap applies the promote to all of it. A payment on day 90 is on time, and a payment on day 91 is in the grace days. The ninetieth surcharge day is charged, and the consent is deemed withdrawn from the day after. Each rule's side comes from its text or from a stated reading, and none can be inferred from another rule's.

## Results at the edge are results

A tie, a state named "exactly" and a reason saying information is worth exactly its cost are all results: the call succeeded. A refusal is different: the engine returns an error naming the field. The development carry that would earn the farmor's whole interest is a refusal, because the farmor must keep a carried interest for the carry to exist.

One step past an accepted edge is often a refusal. A share paid equal to the farmor's interest is accepted and the farmor pays 0.000000; a share above it is refused by name:

> events[0].farmineePaysPct must be at most 70, the farmor's interest before the deal (the farminee pays no other party's share); got 75

## Printed alike is not equal

Two figures that agree at six decimals are not keyed as equal unless the engine says so. The Penn State farm out EMV prints as 17500.000000 and passes its check within 0.000001; the course's check passes it within that tolerance and claims no equality.

## Exercise

Open the valuation calculator. On the view "The value of the deal to each side", start from "A promote at the break-even exactly" and read both sides' best actions. On the view "The value of information to one side", start from "An uninformative signal" and read the last reason. On the view "A price for a working interest", start from "A risked value below 0" and read why no ratio prints. On the view "The readings the engine states", read the tiles for day 90, day 91, day 210 and day 211. For each, name the rule and which side of its boundary the case sits on.
