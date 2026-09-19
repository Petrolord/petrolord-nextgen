# Moving a cut point

A cut point is a decision the refinery makes, and it moves. When it does, the barrels move with it, and they move only one way.

{{panel:crude-valuation-explorer}}

## A cut point is a shared boundary

In Kwale's cut set, 650 F is the top of Diesel / AGO and the bottom of Atmospheric residue. It is one temperature serving as two bounds. That is what makes a cut set close: each cut starts where the one below it stops, so the cuts tile the curve with no gap and no overlap.

Because the boundary is shared, moving it changes exactly two cuts. Everything below the lower of the two, and everything above the upper, is drawn between bounds that did not move.

## The diesel end point, moved

The digest moves the diesel end point from 650 F to 700 F on the Kwale blend and prints every cut before and after.

| cut | yield, diesel to 650 F | yield, diesel to 700 F | change |
| --- | --- | --- | --- |
| LPG / Light ends | 0.7174 | 0.7174 | 0.0000 |
| Naphtha | 20.5591 | 20.5591 | 0.0000 |
| Kerosene / DPK | 16.2860 | 16.2860 | 0.0000 |
| Diesel / AGO | 19.3849 | 24.4225 | 5.0376 |
| Atmospheric residue | 43.0526 | 38.0150 | -5.0376 |
| total | 100.0000 | 100.0000 | 0.0000 |

Read the change column. Three cuts show 0.0000. Diesel / AGO gains 5.0376 and Atmospheric residue changes by -5.0376. The total changes by 0.0000. Moving a cut point moves barrels between two cuts and nowhere else.

## Why the two changes cancel

Diesel's yield is the curve at its top minus the curve at its bottom. Residue has no upper bound, so its yield is 100 percent minus the curve at its bottom. The moved temperature is diesel's top and residue's bottom. Raising it adds the curve's rise between 650 F and 700 F to diesel and takes the same rise from residue. One quantity is added in one place and subtracted in the other, which is why the change column prints 5.0376 and -5.0376.

That is also why the total is unmoved. The first cut starts at 0 percent and the last runs to 100 percent, and neither end moved.

## Why a refinery moves a cut point

A refinery sets its diesel end point by what the product specification allows and what the market pays. Lifting the end point pulls heavier material into diesel. Whether that is worth doing depends on what diesel and residue are worth and whether the heavier diesel still meets its own specification. This course prices the cuts in module 4. The quality side of a product is the recipe question the Expert tier takes up, and the planning of a refinery's cut points against its markets is taught in the `refinery` course.

What this lesson fixes is the accounting. Whatever the reason for moving a cut point, the barrels come from one neighbour and go to the other. No cut further away changes, and the blend does not gain or lose volume.

## A check you can run on any cut table

When two yield tables differ by a cut point, the change column should show exactly two nonzero entries of opposite sign, on the two cuts that share the moved boundary, and a total change of zero. Anything else means more than one boundary moved, or the curve itself changed. The Kwale table above passes it: two nonzero entries, on Diesel / AGO and Atmospheric residue, and a total change of 0.0000. The panel lets you drag Kwale's cut points and watch the same check hold on every move.

## Exercise

Read the change column. Name the two cuts whose yields changed and the two figures, and name the three that did not. Then say which single temperature both changed cuts share as a bound, and why the total's change is 0.0000.
