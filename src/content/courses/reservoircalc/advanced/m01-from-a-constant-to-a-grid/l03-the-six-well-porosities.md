# The six well porosities

The property model is built from six numbers. This lesson looks at them before anything is fitted to them, because the shape of the data decides what any model can honestly do with it.

## The values

| Well | Easting | Northing | Porosity (v/v) | Block at the tier below |
| --- | --- | --- | --- | --- |
| Ekene-1 | 1000 | 1000 | 0.22 | West |
| Ekene-2 | 2200 | 1150 | 0.19 | East |
| Ekene-3 | 1400 | 2300 | 0.23 | West |
| Ekene-4 | 2600 | 2500 | 0.17 | East |
| Ekene-5 | 600 | 1900 | 0.21 | West |
| Ekene-6 | 1900 | 1800 | 0.22 | East |

Their arithmetic mean is

$$\frac{0.22 + 0.19 + 0.23 + 0.17 + 0.21 + 0.22}{6} = \frac{1.24}{6} = 0.206667$$

Their range is 0.17 to 0.23, a spread of 0.06, which is 29 percent of the mean. Porosity varies by nearly a third across this field, which is entirely ordinary and is exactly what a constant of 0.20 was averaging away.

## Where such numbers come from

A well porosity is not a measurement in the sense that a depth is. It is a petrophysical result: a log response converted to porosity through a mineral model, then averaged over the reservoir interval, usually weighted by net thickness and screened by a net reservoir cutoff.

Three consequences follow and they set the ceiling on what any property model can be worth.

Each value carries its own uncertainty, typically a couple of porosity units, from the mineral model and the cutoffs as much as from the tool.

Each value is already an average over 25 to 36 m of reservoir. The variation within a well is thrown away before the property model ever sees it, and that internal variation is usually larger than the variation between wells.

Each value is a point sample of an area. Ekene-1 characterises 100 m by 100 m at best, and it is being used to say something about a field 2.4 km across.

## The spatial pattern

Plot the six values against easting and a pattern is visible without any fitting. The three highest, 0.23 at Ekene-3, 0.22 at Ekene-1 and 0.22 at Ekene-6, sit at eastings of 1400, 1000 and 1900 m. The two lowest, 0.19 and 0.17, sit at 2200 and 2600 m.

Porosity falls toward the east. Against northing there is no clear pattern at all: the highest value is at a northing of 2300 and the lowest at 2500, and the two are 0.06 apart.

That is a real signal with six points, and it is worth being explicit about how weak six points is. Two of them could be swapped by their own uncertainty. The eastward trend rests mainly on Ekene-4 being both the furthest east and the lowest, and Ekene-4 is a dry well on the far flank.

## Reading it off the panel

Open the property explorer and set the method to constant, which fills every node with the arithmetic mean.

{{panel:rc-property-explorer}}

Each well is posted with its measured porosity and, underneath, what the model says there. With the constant method every well shows the same modelled value of 0.206667 and every ring is red, meaning the model disagrees with the measurement. Ekene-4 is out by 0.036667 and Ekene-3 by 0.023333.

That is a useful baseline. Even the simplest possible model already disagrees with every well, and nobody finds that surprising. The next module shows that the trend model disagrees with every well too, which people do find surprising, and the difference between the two cases is smaller than it looks.

## Worked example

Work out how much the porosity range alone could be worth, as a bound before any modelling.

Book the field with a constant porosity of 0.17, the lowest measured value: the STOIIP scales as $12.139208 \times 0.17 / 0.20 = 10.318$ MMstb. With 0.23, the highest: $12.139208 \times 0.23 / 0.20 = 13.960$ MMstb.

So the porosity data spans a booking range of 3.64 MMstb, or 30 percent of the field, if you had only one well and did not know which.

Against that, the entire trend model is worth 0.656868 MMstb. Fitting a model to six values is worth about a fifth of what knowing the values at all is worth, which is a fair summary of where the effort should go: measuring more wells beats modelling the wells you have.

## Exercise

Compute the arithmetic mean of the three wells that lay in the western block at the tier below, and of the three that lay in the east. State what the comparison suggests and one reason to be careful about it.

Self check: the west wells average $(0.22 + 0.23 + 0.21)/3 = 0.22$ and the east wells $(0.19 + 0.17 + 0.22)/3 = 0.193333$. The west is better rock by 0.026667, which supports the eastward decline. Be careful because Ekene-6 at 0.22 sits in the east block and disagrees with its neighbours, so the east average is carrying a well that behaves like a western one, which is unsurprising given that Ekene-6 is 100 m from the fault.
