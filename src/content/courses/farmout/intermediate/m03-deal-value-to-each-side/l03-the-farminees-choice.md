# The farminee's choice

{{panel:farmout-deal-calculator}}

The farminee has two actions: farm in on the stated terms or decline. Declining is worth 0. Farming in is worth its EMV: the chance-weighted success and dry-hole payoffs of the participating interest it would earn, less its share of each well. This lesson reads FIN's choice on the Ekene Deep deal and then under the other terms the course states.

## FIN's position

FIN pays 40.000000 percent of the well for 30.000000 percent of the licence, at a chance of success of 25.000000 percent:

| action | participating interest | success | dry hole | EMV |
| --- | --- | --- | --- | --- |
| farm in | 30.000000 | 57575101.112542 | -21600000.000000 | -1806224.721864 |
| decline | 0.000000 | 0.000000 | 0.000000 | 0.000000 |

The engine's reason:

> FIN (30% for 40% of the well): success 57575101.11, dry hole -21600000, EMV -1806224.72

The dry-hole payoff is FIN's 16000000.000000 share of the well plus the cash bonus and the reimbursement it pays EKO. On a success it receives 30.000000 percent of the success-case value and pays 18200000.000000 of the well and the same cash. At the stated chance the EMV is below 0, so FIN declines, while EKO's best action is to farm out.

## The same prospect under other terms

The course states the Ekene Deep deal with one term changed at a time:

| term changed | farminee EMV | farminee best action |
| --- | --- | --- |
| none (the Ekene Deep deal) | -1806224.721864 | decline |
| cap "none" | -1856224.721864 | decline |
| overrun rule "farmor-side" | -1656224.721864 | decline |
| cap "carry-amount" of 3000000.000000 | -706224.721864 | decline |
| cash bonus 0 and no reimbursement | 193775.278136 | farm in |

Each change moves FIN's EMV through its payoffs. Removing the cap makes FIN pay its promoted share of the whole success well. The farmor-side rule takes FIN's share of the excess off it. A carry cap stops the carry at a smaller figure. Dropping the cash leaves FIN with a positive EMV, and it farms in.

Every row is a figure of its own terms. A lesson or a report quotes FIN's EMV with its chance, payoffs and terms, and never carries a figure from one row to another.

## A share paid below the interest earned

A deal where the farminee pays less than the participating interest it earns has a negative promote, which the engine refuses:

> deal.farmineePaysPct must be at or above 30, the interest the farminee holds after the event (a promote of 0 or more); got 20

The engine also reads no key it does not know. A deal box that states a promote directly is refused, because the promote is computed from the share paid and the interest earned:

> deal.promotePct is not an accepted key; the accepted keys of deal are farmineePaysPct, earnedPct, cap, cashBonus, pastCosts, assignorFees

## Where the question goes next

A farminee that declines at 40.000000 percent may accept at a smaller share. The next module solves for the share at which FIN's EMV is exactly 0, the break-even promote.

## Exercise

Work in the course's own deal calculator.

1. Open the view "The value of the deal to each side" and start from "The Ekene Deep deal, cash flows stated". Find FIN's farm-in row and the farminee's best-action tile.
2. Start from "No bonus and no reimbursement" and read FIN's EMV and best action. Then start from "A carry-amount cap" and compare.
3. Back on the Ekene Deep deal, lower "Share of the well the farminee pays, percent (stated)" to 35 and read FIN's EMV. Then set it to 20 and read the refusal.
