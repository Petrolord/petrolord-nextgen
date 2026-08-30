# Gas, liquid and mixed

Three labels, two thresholds.

{{panel:wc-killsheet-explorer}}

## The thresholds

    gas:    density at or below 480 kg/m3
    liquid: density at or above 960 kg/m3
    mixed:  anything between

## Where they come from

**480 kg/m3** is a generous upper bound for hydrocarbon gas at bottom hole conditions. Methane at 20 MPa and 100 degrees is a few hundred kilograms per cubic metre, and the number is set above it so that a genuine gas kick is not misclassified.

**960 kg/m3** is a lower bound for a liquid: formation water is around 1000 to 1200 and oil is around 700 to 900, so the threshold catches most liquid influxes and admits that light oil sits near it.

Both are conventions in this engine rather than measurements.

## Why the classification matters

**A gas kick expands** on the way up, dramatically. Its volume at surface can be tens of times its volume at the bottom, and that expansion is what makes the casing pressure peak.

**A liquid kick does not.** It arrives at surface at about the volume it entered at, and the casing pressure history is much gentler.

So the same pit gain is a very different operation depending on which it is.

## The mixed case

Real influxes are often mixed: gas dissolved in oil, gas and water together, or a gas cap on a liquid column.

The engine returns 'mixed' for anything between the thresholds, which is an admission that the single-density model does not describe it rather than a statement about the fluid.

## The hand-built example

The IWCF-style example in this course has an influx density of 894.0851361066216 kg/m3, which sits between the thresholds and is classified as mixed.

That was deliberate on the example's author's part: a case that exercises the middle branch.

## What the classification does NOT do

Change any of the kill sheet's four outputs. The kill mud weight, the two circulating pressures and the schedule are identical whatever the influx is.

The classification is an expectation about the annulus, and the annulus is not on the schedule.

## The honest reading

The classification is a label applied to an inferred density that is two assumptions deep. It is a useful prompt for what to expect and it is not a measurement of the fluid.

## Exercise

For each of the three classes, say what you would expect the casing pressure to do as the influx is circulated up.

Then say which of the three you would most want to know before starting, and why the answer is not the one with the highest density.
