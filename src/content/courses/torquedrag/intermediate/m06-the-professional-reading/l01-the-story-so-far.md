# The story so far

Five modules, one fitted constant, and two implementations.

## The claim

The friction factor is the only number in a torque and drag model that nobody measured. It absorbs everything the model left out, it can be fitted from one observation and always succeeds, and the only defence against what it hides is to predict a second observation with it.

## What each module established

**Module 1.** A friction factor is not a coefficient of friction. It carries genuine sliding friction, the bending stiffness the soft-string model discarded, cuttings, and the model's own omissions. Book values are the distribution of a fitted parameter across thousands of wells, not a material property. On the build-and-hold well the pick-up hookload moves 274778.6273721045 N across the range 0.15 to 0.50, and the response is exactly linear at 785.081792 N per 0.001. Which factor matters depends on where the side force is, so the cased-hole factor is irrelevant on a well whose shoe sits in the vertical section.

**Module 2.** Rotating does not reduce friction, it redirects it. One pair of direction cosines, set by the ratio of trip speed to tool joint surface speed, produces every difference between the six operations. The moment arm is the tool joint radius, not the pipe body radius, and using the wrong one understates the torque by 24.53 percent. Torque is 88 to 90 percent friction on a deviated well against a much smaller share for hookload, which is why it is the better diagnostic and why it comes through a worse instrument. Going on bottom does not raise the torque by the bit torque, because the compression it adds changes the side force at the same time.

**Module 3.** Side force is largest where a tensioned string passes through a curve, which is near the TOP of a build and not at total depth. Tripping out gives a larger maximum than tripping in on the same well, because friction feeds back into tension. In a horizontal lateral the side force is exactly the buoyed weight per metre, uniform along its length. The azimuth term carries the sine of inclination, which is why azimuth is set early.

**Module 4.** Calibration is bisection over a monotone response, 200 halvings, and it always succeeds. That is what makes it useful and what makes it dangerous. A factor fitted to a hookload absorbs a survey error, a wrong string description, a wrong mud weight and a dirty hole, and then predicts a torque that inherits all of them. Fitting one observation and predicting another is the test, and predicting torque from a hookload fit is the version of it with the most power. There are at least two factors and usually one observation, so something is always held fixed, and reporting which is part of reporting the number.

**Module 5.** The goldens come from an independent Runge-Kutta implementation because there is no closed form on a real survey. Over a hundred published values the two agree to better than 1e-4 except on two operations of the horizontal well, where the string is in compression. Refining the step halves the horizontal gap and does not move the slant one, which separates discretisation from a model difference. The vertical well, which has a closed form, says the residual is most likely the oracle's.

## The numbers to carry

- Pick-up sensitivity on the build-and-hold well: 785.081792 N per 0.001 of friction factor.
- Tool joint radius over pipe body radius: 1.325, so 24.53 percent of torque.
- Tangential velocity at 120 rpm on this tool joint: 1.0573030075656449 m/s, against a 0.3 m/s trip speed.
- The engine's error against the one closed form available: about 4e-9 N. The oracle's: 42.6224374640733 N.

## The one sentence

Every number this model produces is a geometry you can check multiplied by a constant you fitted, and the discipline is knowing which is which.
