# Past-cost reimbursement

{{panel:farmout-earning-calculator}}

By the time a farmor looks for a partner it has often spent money on the licence already: seismic, studies, perhaps an earlier well. A farminee may pay back a share of those sunk costs in cash. This course calls that payment the past-cost reimbursement, and it reads two stated terms to compute it.

## What the texts say

HMRC's Oil Taxation Manual describes the payment on page OT30021 (updated 2 February 2021):

> "The Farmer in may also pay a cash reimbursement to the farmer out for sunk costs relating to the proportionate interest acquired," (HMRC Oil Taxation Manual OT30021)

And on page OT30081 (updated 1 May 2019) it says how to treat it:

> "The reimbursement should therefore be treated as cash consideration for the licence interest acquired." (HMRC Oil Taxation Manual OT30081)

The course takes the manual's description of the payment. It applies none of the manual's United Kingdom tax treatment.

## Two stated terms

The engine reads the past costs as an object with two terms: the amount of past costs, and the share of them the farminee reimburses. Both are required, and a deal without a reimbursement states both as 0. The refusal says so:

> pastCosts must be an object { amount, reimbursedPct } (both 0 when the deal has no reimbursement; no default); got nothing

The reimbursement is the stated share of the stated amount.

| worked case | past costs (stated) | reimbursed percent (stated) | reimbursement (engine) |
| --- | --- | --- | --- |
| earn-ekene-single | 12000000.000000 | 30.000000 | 3600000.000000 |
| earn-bonus-and-reimbursement | 9000000.000000 | 30.000000 | 2700000.000000 |
| earn-heads-up | 0.000000 | 0.000000 | 0.000000 |

On the Ekene Deep deal, EKO's past costs are 12000000.000000 and FIN reimburses 30.000000 percent of them, the same as the participating interest it earns: a reimbursement of 3600000.000000. The engine's consideration line shows the working:

> consideration to EKO: carry 4400000 + cash bonus 2000000 + past-cost reimbursement 3600000 (30% of 12000000) = 10000000

## The share reimbursed is a term

On both worked cases above the share reimbursed equals the participating interest earned, which matches the manual's "proportionate interest acquired". The engine does not tie the two together. The reimbursed percent is its own stated term, and the engine computes whatever share the deal states.

## What the reimbursement changes

Like the cash bonus, the reimbursement leaves the split of the well alone: FIN pays the same share of the gross cost with or without it. It is added to the farmor's consideration and to the farminee's outlay.

## Exercise

Open the earning calculator, the course's own calculator panel, in the view "The earning obligation, the promote and the consideration", and start from "A cash bonus and a reimbursement". Read the "Past-cost reimbursement" tile and check it against the table above. Then use the "Past costs reimbursed, percent (stated)" control to set 0 and run it: read which tiles change. Restore 30, set the "Past costs (stated, 0 for none)" control to "not stated", and read the refusal and the field it names.
