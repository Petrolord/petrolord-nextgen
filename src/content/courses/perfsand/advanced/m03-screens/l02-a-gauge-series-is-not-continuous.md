# A gauge series is not continuous

Seven standard slot widths, and what that does to the selection.

{{panel:ps-sand-explorer}}

## The series

Wire-wrap screens are made in standard gauges measured in thousandths of an inch: six, eight, ten, twelve, sixteen, twenty and twenty five.

Seven values, spanning a factor of about four, with gaps that widen towards the coarse end.

## The selection

Given a gravel, the rule gives an upper bound: the smallest gravel grain. The engine then picks the largest standard gauge STRICTLY below that bound.

Largest, because a larger opening means more open area, less pressure drop and less erosion. Strictly below, because the rule is an inequality and a gauge exactly equal to the smallest grain would let it through.

## What discretisation does

It saturates at both ends and it wastes margin in the middle.

Run all seven catalog gravels through the rule and two of them, the two coarsest, both land on the largest available gauge of twenty five thousandths. Two more, the two finest, both land on eight. So seven gravels map onto five gauges, and the map is not one to one.

## Why the coarse end saturates

Because there is no gauge above twenty five thousandths in the series. A coarse gravel could tolerate a much wider slot, and the series does not offer one, so the screen is finer than it needs to be and its open area is smaller than it could be.

## Why the fine end saturates

Because the gaps in the series are proportionally large down there. Between eight and ten thousandths there is nothing, so two gravels whose smallest grains fall either side of ten both end up on eight.

## The consequence worth knowing

The margin between the chosen gauge and the bound varies enormously from gravel to gravel, and it is not a design choice. It is an artefact of where the gravel's smallest grain happened to fall relative to the gauge series.

Which is why the margin itself is worth computing rather than assumed, and the next lesson does that.

## Exercise

List the seven standard gauges and say why the selection takes the largest strictly below the bound.

Explain why the map from gravel to gauge is not one to one, and name the two saturating pairs.

Then say why the margin between the gauge and the bound is not a design choice.
