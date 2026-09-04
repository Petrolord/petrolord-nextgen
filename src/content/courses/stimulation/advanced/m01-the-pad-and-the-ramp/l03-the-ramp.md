# The ramp

The concentration schedule is a power law in dimensionless time, cut into steps a blender can actually hold.

{{panel:st-pack-explorer}}

## The curve

Once the pad is away, the concentration follows

    c(tau) = c_EOJ tau^eps

where tau runs from 0 to 1 across the slurry stage, c_EOJ is the end of job concentration and eps is the exponent from the previous lesson. On this case c_EOJ is 800 kg/m3 and eps is 0.7052381992848291.

The curve starts at zero and finishes at the end of job value. Because eps is less than 1 the curve is concave, so the concentration climbs quickly at first and then flattens as it approaches its final value.

## Why it is stepped

A blender does not track a continuous curve. It holds a stage, then changes to the next one, and the field record is a staircase.

So the engine divides the slurry time into a fixed number of equal stages, 8 on this case, and evaluates the power law at the midpoint of each stage. Each stage lasts the same length of time and carries the same slurry volume, and only the concentration changes between them. Midpoint sampling is the choice that keeps the staircase from systematically running rich or lean against the curve it approximates.

The engine will refuse a step count that is not a positive whole number, and it will refuse an end of job concentration that is not positive. Both are refusals of nonsense rather than of hard cases.

## The mass in the ramp

The placed mass is the concentration multiplied by the slurry rate, integrated over the slurry time. The rate is constant, so the integral is the rate multiplied by the slurry time multiplied by the average of the concentration curve.

The average of tau raised to the power eps, taken over tau from 0 to 1, is one divided by one plus eps. So the mass is the end of job concentration times the rate times the ramp time, all divided by one plus eps. That single division by one plus eps is the whole of the ramp's effect on the mass.

On this case the ramp lasts 1162.9028538130178 s at 0.053 m3/s, ending at 800 kg/m3, and the mass placed is 28915.069473784468 kg.

## Exercise

Read the eight step concentrations off the panel and confirm the last one is below 800 kg/m3. Explain why the schedule never actually pumps the end of job concentration.

Then double the end of job concentration in the panel and predict the placed mass before you read it.
