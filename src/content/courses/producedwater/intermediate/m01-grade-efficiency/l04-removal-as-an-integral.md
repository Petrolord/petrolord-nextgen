# Removal as an integral over the distribution

Removal in this module is a quadrature. The droplet distribution arrives as volume bins, the grade curve is evaluated on each bin, and the removed fraction is the sum of the two multiplied together. Everything a train reports is built on that one operation.

{{panel:pw-train-explorer}}

## What is summed, and what is left

Each bin carries a volume fraction and a representative diameter. The grade curve turns that diameter into a removed fraction between zero and one. Multiply and sum across the bins and you have the device REMOVAL. Take the complement bin by bin instead and you have the volume that survives, which becomes the outlet distribution once it is renormalised.

The surviving volume is reported rather than hidden, because it is the divisor of that renormalisation and it is the quantity that tells you whether an outlet is worth reporting at all. It is also the cleanest check a reader can run on a device return without any tooling: the removal and the surviving volume are two views of the same sum and they account for all of the oil between them.

| cut micron | removal percent | surviving volume |
| --- | --- | --- |
| 30 | 44.236922 | 0.557630781833 |
| 20 | 60.477315 | 0.395226848971 |
| 12 | 78.263077 | 0.217369227363 |
| 6 | 92.922276 | 0.070777242939 |
| 2 | 99.398720 | 0.006012799541 |

## When there is nothing left to describe

Push the cut far enough and the surviving volume stops being oil and starts being arithmetic. A device cutting at 0.001 micron on this water removes 99.999999999904 percent and leaves a surviving volume of 9.618e-13. The module then reports `outletNormalised` no, and warns in its own words:

this device leaves 9.62e-13 of the oil volume behind: what is left is numerical dust and no outlet droplet median is reported for it

Renormalising a number that small would produce a droplet median with a confident look and no content, so the module declines to produce one and says why. A concentration still comes back. The shape of what is left does not.

## Why the quadrature can be trusted

A binned integral is an approximation, and the obvious worry is that the bins are doing something to the answer. The published train cases in this course are written by an oracle that runs 400,000 droplets through every stage, each carrying its own surviving weight, with no binning anywhere. That is a method with no quadrature in it at all, and it reproduces the outlet concentration, every stage and both droplet medians.

An agreement between two routes that share no arithmetic is worth something. An agreement between two copies of one routine is worth nothing, and that distinction is the Expert tier's subject. For this tier it is enough to know that the quadrature under every removal figure you are about to read has been checked by a route with no bins in it.

## Exercise

In the panel, run one device at a cut of 12 micron on the inlet water and note the removal and the surviving volume. Check that the two add to one.

Then push the cut down until the outlet median stops being reported, and write down what the module said instead of a median.
