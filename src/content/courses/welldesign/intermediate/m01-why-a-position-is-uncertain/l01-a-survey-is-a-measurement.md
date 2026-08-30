# A survey is a measurement

Three numbers, three instruments, and none of them exact.

## Where the three numbers come from

**Measured depth** is counted at surface: pipe tally, or a depth wheel on the wireline. It is wrong by stretch under tension, by thermal expansion, by the pressure the string is under, and by whatever the counting missed.

**Inclination** comes from three accelerometers measuring the direction of gravity. They are wrong by sensor bias, by scale factor error, by misalignment of the sensor package in the collar, and by any acceleration that is not gravity.

**Azimuth** comes from three magnetometers measuring the earth's field, resolved against the accelerometers' idea of down. They are wrong by all of the above plus everything magnetic within a few metres, plus any error in the field model the reading is corrected against.

So the position at any station is a function of three uncertain inputs, and the function accumulates: an inclination error at 500 m displaces every point below 500 m.

## Why the errors do not average out

This is the crux and it is why a proper model is needed.

If sensor errors were independent from station to station, they would partially cancel and the position error would grow as the square root of the number of stations. Some do behave that way.

But most do not. A sensor bias is the SAME at every station in the run, so its effect on position accumulates linearly, not as a square root. A declination error is a single rotation applied to the entire well below it. A depth reference error shifts everything.

Those are systematic errors, and they are why a well surveyed with a hundred stations is not ten times better than one surveyed with ten.

## What the model has to do

Given a survey and a description of the tool, produce a covariance matrix at every station: three variances and three covariances describing an ellipsoid of possible true positions around the computed one.

To do that it needs to know, for every error source:

- how large it is, which is a property of the tool and comes from a published error model;
- how a unit of it changes the inclination, azimuth and depth at each station, which is a weighting function derived from the physics;
- how it accumulates down the well, which is the propagation mode.

Those three are the whole model, and the next four lessons take them in turn.

## Why it is published

Because it has to be agreed. Two operators drilling into the same field need to agree on how close is too close, and that requires agreeing on how uncertain each other's wells are.

So the model is a standard, maintained by an industry group, with published parameter sets and a published validation case. Anyone can check an implementation against it, and this course does exactly that.

## What it does not model

Gross errors. A station recorded at the wrong depth, a tool run with the wrong parameters, a survey from a different well pasted into the wrong file: none of these is in the covariance, and all of them have happened.

The model describes the spread of correct measurements. It says nothing about blunders, and the ISCWSA documentation is explicit about that.

## The misconception to avoid

"More survey stations means a more accurate position." More stations reduce the interpolation error between them, which is not the dominant term. The dominant terms are systematic and are unaffected by station density: a bias in a magnetometer produces the same azimuth error whether you sample it ten times or a thousand.

## Exercise

List the three measured quantities and, for each, name two physical mechanisms that could make it wrong.

Then, for each of your six mechanisms, say whether its effect on the FINAL position would grow with the number of stations, stay the same, or shrink.
