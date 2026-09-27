# The interests after the farm-in

{{panel:farmout-earning-calculator}}

Every farm-out ends in a new table of participating interests. The farminee joins the licence, the farmor's share shrinks, and the other parties keep what they had. That table is what the licence looks like for every later cost and every barrel, so it is the last thing to read in an earning result and the first thing a partner checks.

## The Ekene Deep licence, before and after

On the Ekene case the one event is completed under the "per-event" rule, so FIN's 30.000000 percent vests.

| party | participating interest before (stated) | participating interest after (engine) |
| --- | --- | --- |
| EKO | 70.000000 | 40.000000 |
| PA | 30.000000 | 30.000000 |
| FIN | 0.000000 | 30.000000 |

The farminee's participating interest comes out of the farmor's alone. EKO falls from 70.000000 to 40.000000 percent, FIN rises from 0.000000 to 30.000000, and PA keeps its 30.000000. The interests after still sum to 100.

## A licence with one holder

The worked case `earn-third-for-a-quarter` states a licence EKO holds whole.

| party | participating interest before (stated) | participating interest after (engine) |
| --- | --- | --- |
| EKO | 100.000000 | 75.000000 |
| FIN | 0.000000 | 25.000000 |

FIN earns 25.000000 percent, and EKO keeps 75.000000. The rule is the same with no other party: the participating interest earned moves from the farmor to the farminee.

## The interests after do not depend on the price

The worked case `earn-full-carry` has FIN pay the farmor's whole pre-deal share of the well, 70.000000 percent, for 30.000000 percent. The interests after are the same as on the Ekene case: EKO 40.000000, PA 30.000000 and FIN 30.000000. The promote, the carry and the cash decide what the participating interest costs. The participating interest earned decides the table.

## What the engine checks first

The table starts from the parties' stated participating interests, and the engine checks that they make up the whole:

> parties must have participatingPct summing to 100; got a sum of 90

And the participating interest earned can be no larger than the farmor holds:

> events[0].earnedPct must be at most 70, the farmor's interest 70 less 0 already earned; got 71

The message's count of what is already earned belongs to deals with more than one earning event, where each event earns on top of the last; the Professional tier works those.

## Why the table matters

After the farm-in, every joint cost is shared by the new participating interests. On the Ekene licence, EKO now pays 40.000000 percent of the next well and FIN 30.000000, unless a further deal says otherwise. Cost sharing under a joint operating agreement is the joint ventures course's subject.

## Exercise

Open the earning calculator, the course's own calculator panel, in the view "The earning obligation, the promote and the consideration", and start from "The Ekene Deep well, a gross-cost cap". Read the table of participating interests after the deal and check it against the first table above; add the three to check the sum. Then start from "A full carry" and from "A third for a quarter", and for each write down which party's participating interest fell, which rose, and which stayed where it was.
