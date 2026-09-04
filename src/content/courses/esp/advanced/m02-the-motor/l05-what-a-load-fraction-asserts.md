# What a load fraction asserts

A load fraction makes exactly one claim: this shaft power, against that rating. Everything else people read into it is added by the reader.

{{panel:pd-power-explorer}}

## The two claims, stated plainly

The selection fraction claims a motor is or is not big enough once the thrust derate has taken its share. It feeds a purchasing decision, and motorOverloaded above 1 and motorUnderloaded below 0.5 are compared against it.

The electrical fraction claims a current. On a 250 hp, 67 A plate a fraction of 0.5000000000 asserts 33.500000 A, and nothing more. On a 100 hp, 49 A plate 0.7800000000 asserts 38.220000 A.

## What it does not claim

It is not an efficiency. The published gassyOffshore design runs a pump efficiency of 0.6929775821 at its duty, and a motor efficiency of 0.85 is applied separately to reach 110.273867 kW of motor input power. Neither of those is a load fraction.

It is not a power factor. That is an input, 0.85 on golden electrical case 1 and 0.88 on case 2, and it enters the apparent power at the surface while staying out of the resistive voltage drop.

It is not a temperature or a life expectancy. A fraction of 0.9541621294 on the teaching well QUA-IBOE-4 says the shaft asks 95.41621294 hp of a 100 hp plate, and nothing about how long that is survivable.

## It claims less below half load

Below 0.5 the current estimate is flagged weak, because the linear scaling stops matching the machine. At a fifth of plate the assertion is 0.2000 and 9.8000 A, and the flag says the engine does not stand behind it.

## What it refuses

It refuses to exist without a rating. Motor current with a nameplate power of zero is NaN, and with a nameplate current of zero is NaN. A fraction with nothing underneath it is not a small number, it is not a number.

It also refuses to name its own denominator. The published gassyOffshore design carries 0.5027908635 and 0.6284885794 for the same shaft power at different derates, and the field itself does not say which rating it divided by.

## The mistake

Comparing two load fractions from two reports as though the comparison meant something. The teaching well IBENO-2 moves from 0.4962380648 to 0.5223558577 and the teaching well QUA-IBOE-4 from 0.9541621294 to 1.0043811889, and in both pairs the only thing that changed was the derate. Neither describes a busier motor. Establish that two fractions divided by the same rating before comparing them.

## Exercise

For golden electrical case 1, write down what its 0.5000000000 asserts and what it does not, naming the current, the power factor and the motor efficiency separately.

Then say what the same fraction would assert if the nameplate current were unknown.
