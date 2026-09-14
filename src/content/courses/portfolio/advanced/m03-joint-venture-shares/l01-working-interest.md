# Working interest

A working interest is a partner's percentage of the joint venture's costs. The AFE engine multiplies the cost it is handed by each partner's percent and gives the operator whatever is left.

{{panel:ec-governance-explorer}}

## OFON-1's partners

OFON-1 is a well AFE in USD with a window from 2027-02-01 to 2027-11-30 and a budget of 27050000 across five cost lines. Three partners hold working interests; the operator is not typed in as a partner.

| party | working interest percent | share |
| --- | --- | --- |
| Ofon Energy | 40.0000 | 10820000 |
| Enang Petroleum | 22.5000 | 6086250 |
| Mfem Resources | 12.5000 | 3381250 |
| operator | 25.0000 | 6762500 |

Each partner's share is the cost times its percent over 100. Ofon Energy: 27050000 x 40.0000 / 100 = 10820000. Enang Petroleum: 27050000 x 22.5000 / 100 = 6086250. Mfem Resources: 27050000 x 12.5000 / 100 = 3381250. The partners total 75.0000 percent, the operator carries 25.0000 percent or 6762500, and the four shares sum to 27050000. The engine returns partnerTotal 75.0000, valid true and no note.

## One percent, every dollar

The engine is handed one total and one list of interests. The same 40.0000 percent applies to the rig and drilling services line of 14200000, the casing line of 3900000 and the completion line of 5600000. There is no way to give a partner a larger share of the completion than of the drilling, and no line is split on its own. The cementing line CMT-03, with its entered forecast of 1400000, splits in the same proportions as every other: the split never looks at a forecast or a commitment, only the total it receives.

## What it refuses

The split has no carried interest, where one party pays another's share through a phase and recovers it later. It has no non-consent, where a partner declines an operation and pays nothing toward it. An interest does not change before and after payout. Nothing in the data forces the interests to add up either; each is typed in on its own, and the engine only flags a set that goes wrong.

## The mistake

The first mistake is reading a working interest on an AFE as a share of value. On the AFE it is a share of cost: Ofon Energy's 40.0000 percent means 40.0000 percent of every approved dollar.

The second is applying the interest to the wrong total. 10820000 is Ofon Energy's share of the budget, an authorisation. It is not what Ofon Energy owes today. Split across the actuals to date of 15090000 instead, the same interest bills Ofon Energy 6036000. The interest does not change between the two; only the total does.

## Exercise

Show Enang Petroleum's and Mfem Resources' shares of OFON-1's budget by hand, then give the operator's percent and share and check that the four shares sum to the budget. Finally, say which cost lines a partner's 40.0000 percent applies to.
