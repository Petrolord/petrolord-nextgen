# Testing the estimator

The capstone asks for a shear estimate at 3000 m/s, where no measurement exists. The Ekene sand itself logs at 3200 m/s and does have a measured shear. Running the estimator there, where the answer is known, is the most useful thing this module does.

## The test

Run the same Greenberg-Castagna composite on the same 70/30 lithology at the logged compressional velocity of 3200 m/s:

$$v_s^{est} = 1679.9458454651794 \ \mathrm{m/s}$$

The tool measured 1800 m/s.

The estimator under-predicts by 120.05415453482057 m/s, which is 6.7 percent.

## What that means for the capstone answer

The graded value of 1521.197276567149 m/s at 3000 m/s is the correct output of the method. It is not a correct shear velocity for this rock.

If the same 6.7 percent bias applies at 3000 m/s, the true shear velocity there would be nearer 1620 m/s than 1521.

That is not a criticism of the capstone, which asks what the method gives. It is the difference between reporting a method's output and reporting a rock property, and knowing which you have is the point of the lesson.

## Why it under-predicts here

The mudrock line lesson already found the reason. This sand plots 13.5 percent above the clastic brine trend in shear, which says it is cleaner and better cemented than the average rock in the fitted dataset.

Greenberg-Castagna is lithology aware and therefore closer, missing by 6.7 percent instead of 13.5. But it is still a regression through a population, and a rock that sits at the stiff edge of that population will be under-predicted by any fit through its middle.

## The correction that follows

If a field has even one well with both a compressional and a shear log over the reservoir, that well calibrates the estimator for every other well.

The procedure is short. Run the estimator at the calibration well, compare to the measurement, and carry the ratio or the offset to the wells that lack shear. Here the ratio is $1800/1679.9458454651794 = 1.0714631098727931$.

Applying that to the 3000 m/s estimate gives $1521.197276567149 \times 1.0714631098727931 = 1629.906764680661$ m/s, which is a better estimate of this rock's shear velocity than the raw regression, and it is defensible because it was calibrated on the same rock.

The caveat is that one well is one point. The correction assumes the lithology and cementation at the estimate depth match the calibration depth, and that assumption should be stated.

## What it costs to skip this

A 6.7 percent error in shear velocity is a 12.9 percent error in the shear modulus, since $\mu = \rho v_s^2$.

Carry that into the tier. The shear modulus is subtracted to get the bulk modulus, so an over- or under-estimated $\mu$ moves $K_{sat}$ in the opposite direction and by a comparable absolute amount. At Ekene, using 1679.95 instead of 1800 would give $\mu = 6.349990598315363$ GPa instead of 7.29, and $K_{sat} = 14.573345868912849$ GPa instead of 13.32.

That is a 9.41 percent error in the saturated bulk modulus before any substitution has been done, and it propagates through the dry frame and into every predicted velocity.

## Worked example

Work out how the error propagates to the substituted gas velocity, which is the number that matters.

With the estimated shear velocity the recovered dry frame would be higher, because more of the observed stiffness is being attributed to bulk than to shear. A stiffer frame is less fluid sensitive, so the predicted gas velocity would fall less than it should.

Directionally, an under-estimated shear velocity produces an over-estimated bulk modulus, an over-estimated dry frame, and a gas case that looks too much like the brine case. The predicted amplitude anomaly would be too small, and a prospect could be dismissed on it.

That is the more dangerous direction of the two, because a missing anomaly is not investigated, while an over-large one usually is.

## Exercise

A field has four wells, one with dipole shear. State how you would use it, and name the assumption the procedure rests on.

Self check: run the shear estimator at the well that has a measurement, form the ratio of measured to estimated shear over the reservoir interval, and apply that ratio to the estimates in the other three wells. The assumption is that the lithology and degree of cementation at the other wells match the calibration well closely enough for the same bias to apply, which should be checked against whatever lithology logs exist and stated in the report.
