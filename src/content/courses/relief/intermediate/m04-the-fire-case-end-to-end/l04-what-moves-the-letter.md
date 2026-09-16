# What moves the letter

{{panel:fc-fire-drum-explorer}}

A letter is the end of the chain and the only part of it that is discrete. This lesson takes the stated case and changes exactly one input at a time, carrying each change all the way through to the orifice, so you can see which inputs move the answer and by how much.

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

Read the wetted area column first. It changes on three rows only: the two level changes and the orientation change. Everywhere else the geometry is untouched and the movement starts further down the chain.

Then the duty column. It changes on every row except the latent heat one, because the latent heat enters after the duty is finished. Then the load column, which changes on every row. And finally the orifice column, which is the one a purchase order carries.

## What the table shows about the ladder

Six changes, and four different letters between them: G, J, K, L. The letters do not step evenly with the required area, because the ladder is a published table of discrete areas and a required area lands wherever it lands. Two quite different required areas can share a letter, as the two overpressure allowances in the previous lesson do, and two rather similar ones can fall either side of a boundary.

So the sensitivity of the letter is not the sensitivity of the required area. Judging how robust a selection is means knowing where the required area sits inside its letter, which is what the margin tells you.

## Which inputs move nothing

The table is as useful for the columns that stay still. The drainage answer, the environment factor and the latent heat all leave the wetted area exactly where it was, at 683.6960 ft2, because none of them is geometry. The latent heat leaves the duty exactly where it was as well.

That pattern is the chain's order made visible. An input moves only the steps below where it enters, so knowing where it enters tells you which figures can respond to it at all.

## The two cheapest ways to get this wrong

Two rows in the table are a single field each and both are the largest moves on it. The drainage answer is one word and it takes the case from K to L. The orientation is one word and it takes the case from K to G, two letters in the other direction.

Neither is a calculation error. Both are a description of the plant somebody entered, and the answer that follows is correct for the plant described. That is this tier's whole subject in one table.

## What the table does not license

Every figure above is an engine return on a stated case. The table prints no ratio between any two of its rows, so form none. If you want to know how much a change is worth, change that input in the studio and read both answers, rather than dividing two numbers off this page.

## Exercise

Copy the table and mark, for each row, which column is the first one to move. Then list the two single-word inputs that move the letter furthest and the direction each moves it, and say why the sensitivity of the letter differs from the sensitivity of the required area.
