# The break-even promote

{{panel:farmout-deal-calculator}}

On the Ekene Deep terms FIN declines: paying 40.000000 percent of the well for 30.000000 percent, its EMV is -1806224.721864. The natural next question is what share FIN could pay and still break even. The engine answers it exactly, and calls the answer the break-even promote: the share of the well at which the farminee's EMV is 0, with every other term held as stated.

## The rule

The engine states how it solves:

> the largest share of the well cost the farminee can pay with its EMV at or above 0: exact, EMV being linear in the share between the breakpoints (the earned interest, the farmor's interest, and each outcome's carry reaching a carry-amount cap)

The farminee's EMV falls in a straight line as its share paid rises, because each extra point of share adds the same amount of well cost in each outcome. The engine rolls the EMV back at each breakpoint and interpolates on the segment that crosses 0. No search and no tolerance are involved.

## The Ekene Deep break-even promote

| share paid | FIN's EMV |
| --- | --- |
| 30.000000 (its earned interest, no promote) | 2293775.278136 |
| 70.000000 (the farmor's whole interest) | -14106224.721864 |

Between those two breakpoints the EMV crosses 0 at 35.594574 percent: a promote of 5.594574 points and a promote ratio of 1.186486. The engine's reason:

> break-even promote: FIN's EMV is 0 when it pays 35.594574% of the well for 30% (a promote of 5.594574 points)

The deal asks 40.000000 percent, above the break-even share, so FIN declines. A deal at or below 35.594574 percent, with every other term the same, would leave FIN's EMV at or above 0.

## Other terms, other break-evens

The break-even promote belongs to the terms it was solved on:

| deal | break-even share paid | promote points | promote ratio |
| --- | --- | --- | --- |
| the Ekene Deep deal | 35.594574 | 5.594574 | 1.186486 |
| a carry-amount cap of 3000000.000000 | 35.527169 | 5.527169 | 1.184239 |
| cash bonus 0 and no reimbursement | 40.472623 | 10.472623 | 1.349087 |

Without the cash, FIN could pay 40.472623 percent and break even, which is above the 40.000000 the deal asks; that is why FIN farms in on those terms.

## At the break-even exactly

The course states a small deal where the share asked equals the break-even share: a 100 percent farmor, the farminee paying 50.000000 percent to earn 40.000000. The farminee's EMV is 0.000000, and the engine reports a tie between farm in and decline. The farmor's drill-alone and farm-out actions tie as well. Half a point more, 50.500000 percent, and the farminee declines. A tie is reported with both actions named; the engine picks neither.

## Exercise

Work in the course's own deal calculator.

1. Open the view "The value of the deal to each side" and start from "The Ekene Deep deal, cash flows stated". Read the break-even tiles and the breakpoints table.
2. With the control "Share of the well the farminee pays, percent (stated)", set the share to 35. Read FIN's EMV and best action, and compare them with the deal's 40.000000 percent. Say which side of the break-even share each sits on.
3. Start from "A promote at the break-even exactly" and read both best-action tiles.
