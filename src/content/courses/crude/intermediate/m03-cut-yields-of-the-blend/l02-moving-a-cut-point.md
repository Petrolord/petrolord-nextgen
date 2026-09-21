# Moving a cut point

A cut point is a decision the refinery makes, and it moves. When it does, the barrels move with it, and they move only one way.

{{panel:crude-valuation-explorer}}

## A cut point is a shared boundary

In Kwale's cut set, 650 F is the top of Diesel / AGO and the bottom of Atmospheric residue. It is one temperature serving as two bounds. Kwale's cut table shows the same at every boundary: each cut starts at the temperature where the one below it stops, 90, 330, 480 and 650 F.

A cut's yield is the curve at its upper bound minus the curve at its lower bound, so a cut whose two bounds did not move reads the same curve at the same two temperatures.

## The diesel end point, moved

The course moves the diesel end point from 650 F to 700 F on the Kwale blend and prints every cut before and after.

| cut | yield, diesel to 650 F | yield, diesel to 700 F | change |
| --- | --- | --- | --- |
| LPG / Light ends | 0.7174 | 0.7174 | 0.0000 |
| Naphtha | 20.5591 | 20.5591 | 0.0000 |
| Kerosene / DPK | 16.2860 | 16.2860 | 0.0000 |
| Diesel / AGO | 19.3849 | 24.4225 | 5.0376 |
| Atmospheric residue | 43.0526 | 38.0150 | -5.0376 |
| total | 100.0000 | 100.0000 | 0.0000 |

Read the change column. Three cuts show 0.0000. Diesel / AGO gains 5.0376 and Atmospheric residue changes by -5.0376. The total changes by 0.0000. Moving a cut point moves barrels between two cuts and nowhere else.

## The two cuts that share the bound

The moved temperature is diesel's top and residue's bottom. Diesel's yield is the curve at its top minus the curve at its bottom. Residue has no upper bound, and the Associate tier's rule says a last cut with no upper bound runs to 100 percent: it takes everything not yet distilled at its lower bound. So both yields read the curve at the moved temperature, one as its top and one as its bottom. The change column prints 5.0376 for diesel and -5.0376 for residue, and 0.0000 for the total.

## The rows that did not move

LPG / Light ends reads 0.7174 in both columns, Naphtha 20.5591 and Kerosene / DPK 16.2860. The bounds of those three cuts are no lower bound, 90, 330 and 480 F, and none of them is the moved temperature, so each reads the curve at the same two temperatures before and after. Their change column prints 0.0000. Diesel / AGO runs from 480 F to 650 F before the move and from 480 F to 700 F after it. Atmospheric residue runs from 650 F before and from 700 F after, to 100 percent both times.

## What the lesson fixes

This lesson fixes the accounting and nothing more. This lesson gives no reason for moving a cut point, only what the move does. This course prices the cuts in module 4, and the planning of a refinery's cut points is the subject of the `refinery` course. On the Kwale blend, the barrels come from one neighbour and go to the other, no cut further away changes, and the total changes by 0.0000.

## Reading the change column

The Kwale table is the one printed above, and it reads this way: two nonzero entries of opposite sign, 5.0376 on Diesel / AGO and -5.0376 on Atmospheric residue, the two cuts that share the moved boundary, and a total change of 0.0000. The panel lets you drag Kwale's cut points and watch the same check hold on every move.

## Exercise

Read the change column. Name the two cuts whose yields changed and the two figures, and name the three that did not. Then say which single temperature both changed cuts share as a bound, and quote this lesson's sentence that describes what moving a cut point does.
