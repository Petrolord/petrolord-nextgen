# Three ways to fill a grid

Six values have to become five hundred. The engine offers three ways of doing that and they differ in what they promise, not just in what they compute.

## Constant

Take the weighted mean of the well values and write it at every node. With equal weights that is the arithmetic mean, 0.206667 at Ekene.

What it promises: nothing about spatial variation. It says the field has one porosity and that the best estimate of it is the average of what was measured.

When it is right: when the wells show no spatial pattern you believe in, or when there are too few of them to support one. Two wells cannot establish a trend. Three collinear wells cannot either.

## Trend

Fit a plane through the well values by least squares and evaluate it at every node.

What it promises: that the property varies smoothly and monotonically across the field, in one direction, at a constant rate. That is a strong claim about geology and it is the claim to examine before using the method.

When it is right: when there is a genuine regional gradient, such as porosity declining toward a basin margin or with burial depth, and when the well control is too sparse to justify anything more detailed.

What it does not promise, and this is the point most often missed: it does not promise to reproduce the well values. A plane through six points that are not coplanar cannot pass through all of them, so it passes near them.

## Krige

Interpolate using a variogram, a model of how quickly the property decorrelates with distance.

What it promises: that the property is spatially correlated over some range, and that the estimate at a location is a weighted average of nearby data with weights derived from that correlation. It also promises, in the form used here, to return the measured value exactly at a data location.

When it is right: when there is enough data to estimate a variogram. Six wells is not enough. The variogram used in this panel is supplied rather than fitted, which means the kriged map is an illustration of a method, not a defensible model of this field.

## The ladder

The engine arranges the three as a fallback ladder. Ask for kriging and it will use kriging if it can, fall back to a trend if the kriging system cannot be solved, and fall back to a constant if the trend cannot be fitted. Ask for a trend and it falls back to a constant. The fallback is recorded rather than silent.

Fallbacks fire for real reasons. A trend needs at least three wells and they must not be collinear, since three points on a line do not determine a plane. Kriging needs a valid variogram and a solvable system.

That recording matters. A property model that quietly degraded from the method you asked for to a simpler one, and produced a number anyway, is the kind of thing that is discovered years later.

## Reading it off the panel

Cycle the method control through all three and watch the map and the well rings.

{{panel:rc-property-explorer}}

Constant gives a flat map: every cell the same shade, every well ring red, every model value 0.206667.

Trend gives a smooth gradient from lower porosity in the east to higher in the west, every well ring still red, and the model values now different at each well.

Krige gives a patchier map with bullseyes around the wells, five green rings and one red.

Those three pictures are three different claims about the same six numbers. Nothing in the six numbers decides between them.

## Worked example

Compare what the three methods book, so that the method choice has a price attached.

Constant books 12.543848 MMstb. Trend books 12.796077. Krige books 13.337665.

The spread across methods is 0.793817 MMstb, which is larger than the 0.656868 MMstb that the whole property model is said to be worth relative to the tier below. In other words, the choice of how to populate the grid is worth more than the choice of whether to populate it at all.

That comparison is the single most useful thing this module produces. A report that says a property model was used, without saying which method and why, has left out the larger of the two decisions.

## Exercise

A field has four wells, three of which lie almost exactly on a north to south line, and asks for a trend model of porosity. State what you expect the engine to do and what you would do instead.

Self check: three collinear wells plus one off the line is still enough to fit a plane, since only three non collinear points are needed and the fourth well provides the second direction, but the fit will be very poorly constrained in the direction along the line of three. The engine will produce a plane rather than fall back. The better response is to use a constant, or a trend in the one direction the data actually constrains, and to say so.
