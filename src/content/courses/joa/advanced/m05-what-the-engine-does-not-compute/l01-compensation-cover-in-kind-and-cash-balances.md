# Compensation, cover in kind and cash balances

{{panel:joa-agreement-calculator}}

This module reads the provisions the engine does not compute, where each comes from, and what the engine does in their place. None is graded. The first three sit around a default and the operator's cash.

## The compensation on an assignment

When a default runs long enough, the Norwegian agreement lets the other parties demand an assignment of the defaulter's interest:

> "If a Party's default remains in effect for more than three (3) months after the Operator has informed the management committee" (Norway JOA Art. 9.3)

and sets a ceiling on what the defaulter is paid for it:

> "The compensation shall be agreed between the Parties, but shall not exceed the book value of the Party's share of the investment" (Norway JOA Art. 9.3)

No stated rule produces an agreed sum, so the engine does not compute it. It reports the forfeiture as available and the interests that would follow, pro rata to the participating interests of the others, as Art. 9.4 apportions an assigned interest. On the Ekene default left open past its trigger, the interests if PB's assignment is demanded are EKO 47.058824, PA 29.411765 and NOC 23.529412 (engine), and the reason ends:

> if the assignment of PB is demanded, the interest is apportioned pro rata: EKO 47.05882352941177%, PA 29.41176470588235%, NOC 23.529411764705884%; the compensation (at most the book value less unpaid contributions) is not computed

The Kenya model takes another path: a forfeited share vests in the other parties "without payment of compensation" (Kenya Model PSC 2015, Participation Agreement Art. 6.10). Under either text the interests after the forfeiture are the engine's figure; the money that changes hands is outside it.

## Cover by taking the defaulter's petroleum

The Norwegian Art. 9.1 also contemplates the non-defaulting parties covering a default by acquiring the defaulter's share of petroleum. The engine covers in cash only, pro rata by paying interest (the cover reading of this tier), and says in its basis:

> the cover by acquiring the defaulting party's share of petroleum, and the compensation on an assignment, are reported only

## Interest on cash balances

The Norwegian Accounting Agreement Art. 1.2.3 deals with interest on cash the operator holds for the joint account. The engine's cash call ledger tracks each party's balance with the operator month by month and computes no interest on it. A contract that pays or charges on those balances would need its own calculation beside the ledger.

## What this means for a report

A partner report on a triggered forfeiture quotes the interests after it and says in words that any compensation is agreed between the parties and is outside the figures.

## Exercise

Open the agreement calculator on the view "A default and forfeiture" and use the start "The same default left open". Read the forfeiture column, the table of interests after the forfeiture and the reason that names the compensation. Check each interest after the forfeiture against the participating interests of EKO, PA and NOC among themselves. Then change `asOf` in the box to 2027-06-10, the trigger date, and read whether the forfeiture still applies. Write two sentences a partner could rely on: what the engine gives for the forfeiture, and what it leaves to the parties.
