# Operator overhead and its base

{{panel:joa-account-calculator}}

Some of what the operator spends on the joint venture cannot be booked line by line: head office management, research, corporate staff. Agreements let the operator recover that cost as an overhead, a charge to the joint account on a stated scale over a stated base. This module computes the charge. This lesson fixes the base.

## What the Norwegian accounting agreement says

The Norwegian accounting agreement (Attachment B, an unofficial English translation of the 2007 text, cited from its Wayback Machine capture of 26 May 2024) lets the operator charge its general research and development cost by rates on bands of annual cost:

> "may be charged to the Joint Account according to the following per cent rates and limits based on annual costs" (Norway Accounting Agreement Art. 2.2.2)

And its corporate management and staff cost at a flat rate:

> "may be charged to the Joint Account with 0.65 % of the annual costs for exploration, operation and development of the Joint operation" (Norway Accounting Agreement Art. 2.2.3)

In this course "overhead" means exactly that: the operator's charge on a stated scale over a stated base. The Norwegian bands, rates and the 0.65 % are the text's figures; the engine holds none, and every band and rate is an input you state.

## The base

The engine's basis states how the base is found:

> base = annual cost - stated exclusions; the scale is marginal: each band's per cent on the part of the base inside the band, abovePct on the part above the last band; a flat percentage is a scale with no bands

The base is computed for each cost category separately (exploration, operating, development, or whatever categories you state). Each category has its own cost, its own exclusions and its own scale.

One rule about the base is fixed by the Norwegian text and by the engine alike:

> "Cost charged to the Joint Account in accordance with this Article is not to be included in the basis of calculation." (Norway Accounting Agreement Art. 2.2.2)

> overhead charged under the scale is never part of its own base

## The Ekene 2031 base

The Ekene fixture states three categories for 2031:

| category | cost | excluded | base |
| --- | --- | --- | --- |
| exploration | 5000000.000000 | 0.000000 | 5000000.000000 |
| operating | 60000000.000000 | 2000000.000000 | 58000000.000000 |
| development | 150000000.000000 | 0.000000 | 150000000.000000 |

Only the operating category has an exclusion, so only its base differs from its cost.

## A scale for every category

The engine will not charge a category it has no scale for. Delete the operating scale and it refuses by name:

> scale.operating must be an object { bands, abovePct } (no default rate); got nothing

A scale for a category with no cost is refused as well:

> scale.drilling is not a cost category; the categories are operating

## Exercise

Open the account calculator, the course's own calculator panel, and choose "Operator overhead". Start from "The Ekene 2031 overhead" and run it. Check each category's base in the first table against cost less excluded. Then, in the box, change the `excluded` operating figure to 0 and run it; write down the new operating base. Restore it, delete the `operating` entry inside `scale`, and read the refusal.
