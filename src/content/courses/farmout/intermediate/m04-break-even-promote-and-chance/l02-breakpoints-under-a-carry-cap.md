# Breakpoints under a carry cap

{{panel:farmout-deal-calculator}}

Without a carry cap, the farminee's EMV is one straight line from its earned interest to the farmor's whole interest, and the break-even promote is where that line crosses 0. A carry-amount cap bends the line. Once the carry reaches the cap the farminee pays no more of the farmor's share, so a higher share paid costs it nothing more and its EMV stops falling. The engine calls the bends breakpoints.

## Where the line bends

A success well and a dry hole can cost different amounts, so their carries can reach the same cap at different shares, and each is a breakpoint of its own.

The rule, from the engine's basis:

> the largest share of the well cost the farminee can pay with its EMV at or above 0: exact, EMV being linear in the share between the breakpoints (the earned interest, the farmor's interest, and each outcome's carry reaching a carry-amount cap)

## A small case with one bend

The course states a small deal: a farmor holding 100 percent, the farminee paying 50.000000 percent to earn 40.000000, under a carry-amount cap. Its well costs the same in both outcomes, so there is a single cap breakpoint.

| share paid | farminee EMV |
| --- | --- |
| 40.000000 | 160000.000000 |
| 52.500000 | -40000.000000 |
| 100.000000 | -40000.000000 |

The EMV falls from 160000.000000 to -40000.000000 as the carry grows to the cap at 52.500000, and then stays flat to the farmor's whole share. The crossing lies on the first segment, and the engine solves it exactly:

> break-even promote: N's EMV is 0 when it pays 50% of the well for 40% (a promote of 10 points)

## The Ekene Deep deal with a carry cap

The course also states the Ekene Deep deal with a carry-amount cap of 3000000.000000 in place of the gross-cost cap. Now the two outcomes bend at different shares:

| share paid | FIN's EMV |
| --- | --- |
| 30.000000 | 2293775.278136 |
| 36.521739 | -412746.460995 |
| 37.500000 | -706224.721864 |
| 70.000000 | -706224.721864 |

At 36.521739 percent the success well's carry reaches 3000000.000000; at 37.500000 the dry hole's carry does. Past both, FIN's EMV is flat at -706224.721864. The crossing lies on the first segment, at 35.527169 percent: a promote of 5.527169 points and a ratio of 1.184239.

The flat stretch explains the row in the last module where the carry cap raised FIN's EMV to -706224.721864 at the asked 40.000000 percent. The engine finds the crossing on the one segment whose two ends lie on either side of 0.

## A flat line that stays above 0

When the cap holds the EMV above 0 all the way to the farmor's whole share, the line never crosses. The course states such a case, with breakpoints at 40.000000, 41.250000 and 100.000000, and the engine reports no break-even:

> break-even promote: none up to the farmor's whole 100% share; paying it, N's EMV is 140000, above 0

## Exercise

Work in the course's own deal calculator.

1. Open the view "The value of the deal to each side" and start from "Breakpoints under a carry cap". Read the breakpoints table and the break-even tiles.
2. Start from "A carry-amount cap" and read its four breakpoints. Name the outcome whose carry reaches the cap at each of the two middle shares.
3. On the same start, change "the deal: cap amount (stated)" to 1000000. Read the new breakpoints and the break-even status, and explain from the flat segment why no break-even share is reported.
