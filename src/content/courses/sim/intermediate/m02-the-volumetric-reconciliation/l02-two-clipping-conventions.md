# Two clipping conventions

The contact is at one depth. How you clip the rock at that depth is a choice, and the two reasonable choices differ by nearly a percent on this field.

## The cell-centre rule

Eclipse decides a cell is oil or water by its CENTRE depth. A cell whose middle is above the contact is oil, all of it; a cell whose middle is below is water, all of it. There is no partial cell.

So the modelled oil volume is a staircase: each column contributes whole layers, and how many depends on where the contact cuts it.

$$\text{STOIIP} = 12132366.897955146 \text{ stb}, \qquad -0.056 \text{ percent against the booking}$$

This is what the DECK actually holds, because it is what the simulator will do when it equilibrates.

## The column-clipped rule

The alternative is to clip the COLUMN rather than the cells. A column whose top is 4 m above the contact contributes 4 m of oil, whatever the layer boundaries are doing.

$$\text{STOIIP} = 12228351.680153307 \text{ stb}, \qquad +0.734 \text{ percent against the booking}$$

That is the more physical answer in the sense that it follows the contact exactly instead of rounding it to layer boundaries. It is also not what the simulator will do.

{{panel:sim-structure-explorer}}

Toggle the convention and watch the volume tiles move. Everything else about the model is identical.

## The gap between them

$$12228351.680153307 - 12132366.897955146 = 95984.8 \text{ stb}$$

which is 0.79 percent of the deck's volume. That is the cost of rounding the contact to cell centres on this grid, and it is a direct measure of vertical resolution: five layers over 34.6 ft means the staircase tread is about 7 ft, and the error is roughly half a tread over the cells the contact passes through.

Refine the layering and the two conventions converge. That is a useful test in itself, and it is a cheap one.

## Which one to report

The one the simulator will use, which is the cell-centre rule, because that is the oil the model will actually produce from.

But report the other alongside it when the gap is material, because the difference tells a reader how resolution-limited the model is. A model whose two conventions agree to a hundredth of a percent is well resolved at the contact; one where they differ by five percent has a contact smeared across a layer thickness that matters.

## The third convention

There is one more, and it is the one the booking used: clip the AREA at the contact and give every oil cell its full thickness.

That reads as generous and it is standard practice in volumetric mapping, where the isochore is mapped separately from the structure and the contact defines the outline of the accumulation rather than the top of the water in each column.

The three conventions are all defensible and all in use. What is not defensible is comparing numbers computed under different ones without saying so, which is exactly what makes this module necessary.

## The misconception to avoid

"The volume is the volume." A hydrocarbon volume is the integral of a saturation over a region, and both the region and the saturation are defined by conventions. Three reasonable people can compute three different volumes for the same field from the same data and all be right. Ask what was clipped and how before comparing anything.

## Exercise

First, compute the difference between the two conventions in stock tank barrels and as a percentage of the deck's own volume, and relate it to the layer thickness.

Second, name the three clipping conventions in this lesson and say which one each of these would use: a simulator, a volumetric mapping package, and a hand calculation on a structure contour map.
