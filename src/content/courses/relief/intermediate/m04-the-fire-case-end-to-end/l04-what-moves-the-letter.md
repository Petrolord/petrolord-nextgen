# What moves the letter

{{panel:fc-fire-drum-explorer}}

A letter is the end of the chain and its only discrete part. This lesson changes one input at a time and carries each change through to the orifice.

## One input at a time

| changed input | wetted ft2 | duty Btu/hr | load lb/hr | required in2 | orifice |
| --- | --- | --- | --- | --- | --- |
| none, the stated case | 683.6960 | 4434115.2612 | 34641.5255 | 1.578271 | K |
| drainage answered false | 683.6960 | 7284617.9291 | 56911.0776 | 2.592873 | L |
| environment factor 0.3 | 683.6960 | 1330234.5784 | 10392.4576 | 0.473481 | G |
| level trimmed to 2.0 ft | 454.1771 | 3170618.3714 | 24770.4560 | 1.128544 | J |
| level raised to 8.0 ft | 1031.7419 | 6213661.4471 | 48544.2301 | 2.211679 | L |
| latent heat 90 Btu/lb | 683.6960 | 4434115.2612 | 49267.9473 | 2.244651 | L |
| read standing up | 158.3363 | 1336211.5771 | 10439.1529 | 0.475609 | G |

Read the wetted area column first. It changes on three rows only, the two level changes and the orientation. Everywhere else the geometry is untouched and the movement starts further down the chain. Then the duty column, which changes on every row except the latent heat one. Then the load column, which changes on every row. And finally the orifice column, the one a purchase order carries.

## Which inputs move nothing

The table is as useful for the columns that stay still. The drainage answer, the environment factor and the latent heat all leave the wetted area at 683.6960 ft2, because none is geometry, and the latent heat leaves the duty alone too. That is the chain's order made visible: an input moves only the steps below where it enters.

## The same table, ranked

A ranking is an answer, so the digest computes this one rather than leaving it to be read off the rows above by eye.

| changed input | duty factor against the stated case | direction | orifice | rungs moved on the ladder |
| --- | --- | --- | --- | --- |
| environment factor 0.3 | 3.333333333333 | down | G | -3 |
| read standing up | 3.318423022984 | down | G | -3 |
| drainage answered false | 1.642857142857 | up | L | +1 |
| level raised to 8.0 ft | 1.401330610749 | up | L | +1 |
| level trimmed to 2.0 ft | 1.398501724833 | down | J | -1 |
| latent heat 90 Btu/lb | 1.000000000000 | up | L | +1 |

Read the last row first. The latent heat changes the duty by a factor of 1.000000000000, because it enters after the duty is finished, and it still moves the letter a rung. A duty ranking and a letter ranking differ, because the ladder is a table of discrete areas and a required area lands wherever it lands. Two quite different required areas can share a letter and two similar ones can fall either side of a boundary, so judging a selection means knowing where the required area sits inside its letter, which is what the margin tells you.

## The two cheapest ways to get this wrong

Two rows are a single word each, and that is what makes them cheap to get wrong rather than what makes them large.

The orientation takes the case from K to G, 3 rungs and joint furthest in the table. The drainage answer takes it from K to L, 1 rung, the smallest non-zero move there is and shared with three other rows. They sit at opposite ends of the ranking, and the one reading as more consequential is the smaller.

Neither is a calculation error. Both describe the plant somebody entered, and the answer that follows is correct for that plant.

## What the table does not license

The one-input table prints no ratio between any two of its rows, so form none off it. The ranking table is where the comparisons live, and it prints them because they are answers somebody has to be right about: its figures were computed against the stated case rather than formed by eye. For any other change, change that input in the studio and read both answers rather than dividing two numbers off this page.

## Exercise

Mark, for each row of the one-input table, the first column to move. Then, from the ranking table, name the two rows that move the letter furthest and by how many rungs, give the rung move of each single-word input, and say why the letter's sensitivity differs from the required area's. Finish with the row whose duty factor is 1.000000000000 and explain how it still moves the letter.
