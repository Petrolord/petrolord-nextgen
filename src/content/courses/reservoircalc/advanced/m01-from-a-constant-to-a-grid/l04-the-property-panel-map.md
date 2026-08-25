# The property panel map

The property explorer is the instrument for this tier. It has one control and a great deal to read, and this lesson is a tour.

{{panel:rc-property-explorer}}

## The control

The population method selects how the six well values are turned into a value at every node. Three methods are offered.

Constant fills every node with the weighted mean of the well values, which with equal weights is the arithmetic mean, 0.206667.

Trend fits a least squares plane through the six values and evaluates it at every node. This is the method the capstone books.

Krige uses a spherical variogram to interpolate, honouring the data at the well locations. The variogram parameters are fixed for this panel and are a teaching illustration rather than a fitted model.

Nothing else can be changed. The contact stays at 1560 m, the properties other than porosity stay constant, and the fault from the tier below is not present.

## The map

Every coloured cell is one of the 169 oil bearing cells, shaded by its modelled porosity from the lowest value in the current model to the highest. The colour scale rescales with the method, so do not compare shades across methods; compare the numbers.

The six wells are posted with two lines each. The first is the well name and its measured porosity. The second is what the model says at that location and, in brackets, the difference.

The ring around each well post carries the summary: green means the model reproduces the measurement to within a millionth, red means it does not.

P-1, the prospect location at an easting and northing of 1600 m, is marked with a hollow lime circle and labelled with the modelled porosity there. That value is one of the six graded capstone numbers.

## The tiles

The first row is the three means. The arithmetic mean of the wells does not depend on the method and never moves. The node mean over the oil is the plain average of the modelled porosity over the 169 oil bearing cells. The volume weighted mean is the average weighted by the rock each cell carries, and it is the one the booking actually uses. Module three is about the argument between them.

The porosity at P-1 and the largest well miss follow, which are the two readings that describe the model's behaviour rather than its result.

The next four tiles are the chain: cells, gross rock volume, net volume, pore volume. Watch the first three as you change method. They do not move, and the tile for the cell count says unchanged for that reason.

The last four are hydrocarbon pore volume, the STOIIP for the current model, and the difference against the constant 0.20 booking from the tier below.

## What to notice first

Switch between the three methods and watch two things.

The gross rock volume and net volume tiles never move. Whatever the porosity model does, it cannot touch the geometry, and seeing that hold across three quite different models is the fastest way to internalise where porosity enters the chain.

The well rings change colour. Under constant, all six are red. Under trend, all six are red. Under krige, five turn green and one stays red. That one is Ekene-2, and the reason it stays red is not a defect in the kriging. It is the same reason the mapping course could not report a value at that well, and module five returns to it.

## Worked example

Set the method to trend and read the capstone values straight off the panel.

The porosity at P-1 reads 0.207142. The node mean over the oil reads 0.209368. The pore volume reads 3.7558, the hydrocarbon pore volume 2.4413, the STOIIP 12.7961 and the difference against the constant booking plus 0.6569.

Those six are the capstone answers. As at the tier below, the panel does not hide them, because the point of the tier is not to make them hard to find.

Now switch to krige and watch all six move: the porosity at P-1 jumps to 0.220920, the STOIIP to 13.3377, and the uplift more than doubles to plus 1.1985. The capstone books the trend, so those are not the answers; they are the measure of how much the method choice is worth, which module five discusses.

## Exercise

With the method set to trend, record the three mean tiles and put them in order. Then switch to constant and record them again, and explain why two of the three collapse to the same value.

Self check: under trend the means read 0.206667, 0.209368 and 0.210822, increasing in that order. Under constant all three read 0.206667, because when every node holds the same value, the plain average over nodes and the volume weighted average are both that value; weighting cannot change the average of a constant.
