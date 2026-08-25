# The Ekene plane

Here is the plane the engine fits to the six Ekene porosities, and what it says about the field.

## The coefficients

$$\phi(x,y) = 0.241071 - 2.043685 \times 10^{-5} \, x - 7.691320 \times 10^{-7} \, y$$

with $x$ and $y$ in metres. Converted to gradients per kilometre, which is the form worth carrying:

$$\frac{\partial \phi}{\partial x} = -0.020437 \ \text{per km}, \qquad \frac{\partial \phi}{\partial y} = -0.000769 \ \text{per km}$$

## Reading the coefficients

The intercept of 0.241071 is the porosity the plane predicts at the frame origin, at an easting and northing of zero. That is a kilometre outside the mapped area to the south west and no well is near it, so the intercept is a fitting parameter rather than a prediction. Quoting it as the porosity of anything would be a mistake.

The eastward gradient is the substance of the model. Porosity falls by about 0.0204 per kilometre as you move east, so across the 2.4 km of the frame the plane drops by 0.049, which is most of the 0.06 spread in the measured values.

The northward gradient is 0.000769 per kilometre, which is 26.6 times smaller. Across the whole 1.9 km height of the frame it accounts for a change of 0.0015, less than one porosity unit.

## The trend is essentially east to west

Put the two gradients together as a vector and the direction of steepest increase points almost due west, about 2.2 degrees south of west. The magnitude is 0.020451 per kilometre.

So the model, stated in a sentence a geologist can argue with: porosity at the Ekene SAND improves toward the west at about two porosity units per kilometre, with no significant variation north to south.

That is a testable claim and it connects to a depositional story. A sand improving in one map direction is what you would expect approaching a sediment source or moving from a distal to a proximal setting.

The absence of a northward gradient is also a claim, and a weaker one. It rests on the fact that the two extreme wells, Ekene-3 at 0.23 and Ekene-4 at 0.17, sit at northings of 2300 and 2500 m, within 200 m of each other. The data has almost no ability to see a north to south trend because the highest and lowest values sit at the same northing.

## Reading it off the panel

Set the method to trend and look at the map before looking at any number.

{{panel:rc-property-explorer}}

The shading runs smoothly from one side to the other with no local features whatsoever, and the bands of equal shade run almost exactly north to south. That is the picture of a plane whose gradient is nearly all in one direction.

Compare it with the krige map. That one has closed contours around the wells and no consistent direction. The two maps are built from the same six numbers and they look nothing alike.

## Worked example

Evaluate the plane at the prospect and check it against the panel.

P-1 sits at an easting and northing of 1600 m. Substituting:

$$\phi = 0.241071 - 2.043685 \times 10^{-5} \times 1600 - 7.691320 \times 10^{-7} \times 1600$$

$$= 0.241071 - 0.032699 - 0.001231 = 0.207142$$

which is the graded capstone value of 0.20714187889686578, and the panel's P-1 label reads 0.207142.

Note what that means. The porosity assigned to the prospect is a plane evaluated at a location, computed from six wells the nearest of which is 300 m away. It carries none of the local detail that a well at P-1 would give, and it is not an average of the nearby wells either. It is the value of a global fit at a point.

One more thing about P-1 is worth recording. It sits exactly on a grid node, since the frame starts at an easting of 400 m with 100 m spacing, so 1600 m is the twelfth column, and the same holds for the northing. So no interpolation happens when the panel reports the porosity there, and the reported value is the plane evaluated directly. Module five shows a well where that is not true.

## Exercise

Compute the plane's porosity at Ekene-4, at an easting of 2600 m and a northing of 2500 m, and compare it with the 0.17 the well measured.

Self check: $0.241071 - 2.043685 \times 10^{-5} \times 2600 - 7.691320 \times 10^{-7} \times 2500 = 0.241071 - 0.053136 - 0.001923 = 0.186013$. The well measured 0.17, so the plane is 0.016013 too high there, which is a miss of about 9 percent of the measured value. The next lesson takes up why that is not a bug.
