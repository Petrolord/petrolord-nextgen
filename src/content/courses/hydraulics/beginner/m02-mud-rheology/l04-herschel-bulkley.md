# Herschel-Bulkley

Three parameters, and a low-rate reading to fix the third.

{{panel:hy-rheology-explorer}}

## The model

    tau = tau_y + K gamma^n

A yield stress plus a power law. It contains both of the previous models: set n to 1 and it is Bingham, set tau_y to zero and it is the power law.

## The fit

Three parameters need three readings. The engine uses the 600 and 300 rpm readings for the power-law part and a low-rate reading for the yield.

For kcl_polymer: tau_y = 2.5520178046999997 Pa, n = 0.8382489300033881, K = 0.0904297261728216 Pa.s^n.
For light_wbm: tau_y = 1.5312106828199998 Pa, n = 0.7484612330040356, K = 0.11992153633052774 Pa.s^n.

## Read the yield stresses

2.552 Pa for the heavy mud and 1.531 for the light one. Compare against the Bingham yield points of 6.125 and 5.614 Pa.

The Herschel-Bulkley yield is less than half the Bingham one in both cases. That is the difference between a yield fitted to a low-rate MEASUREMENT and one extrapolated from two high-rate ones.

## Read the exponents

The Herschel-Bulkley n is higher than the power-law n for both muds: 0.838 against 0.752, and 0.748 against 0.684.

That is because the yield stress is now carrying the low-rate behaviour, so the power-law part does not have to bend as hard to reach it.

## What it costs

It does not reproduce any reading exactly.

The power law hits the 600 and 300 rpm readings to the last digit. So does Bingham. Herschel-Bulkley misses all four by a little, because three parameters cannot pass through four points.

That is the right trade. Missing four points by a little is better than hitting two exactly and missing two by a factor of two.

## Why the engine uses it

Every pressure loss in this course is computed with the Herschel-Bulkley fit, and the local power-law method turns it into an effective n and K at whatever shear rate each element is running at.

That is the standard modern approach, and it is what the goldens' method specification names.

## Exercise

Open the panel's model view and read the residual table for both muds.

Confirm that the power law and Bingham are exact at the 600 and 300 rpm rows and that Herschel-Bulkley is not exact anywhere, then say which of the three is closest at the 3 rpm row.
