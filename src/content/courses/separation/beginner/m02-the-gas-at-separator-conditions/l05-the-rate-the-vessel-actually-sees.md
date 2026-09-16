# The rate the vessel actually sees

ABANA-2 carries 110.000000 MMscfd, which is 1273.148148 standard ft3/s, and 29.490437 ft3/s inside the vessel at 614.700000 psia and 95.000000 degF. The vessel is sized on the third of those figures.

{{panel:fc-separator-explorer}}

## Standard is a bookkeeping condition

A rate in MMscfd is a daily volume measured at standard pressure and temperature, which is a way of counting molecules in volume units. No part of the separator is at standard conditions, so no part of it ever sees that volume.

Turning the daily figure into a rate per second is plain arithmetic: the rate times a million over the 86400 seconds in a day, which takes 110.000000 MMscfd to 1273.148148 standard ft3/s. That number is still at standard conditions and still not what the vessel passes.

## Three scalings to get to conditions

The standard rate is scaled by 14.7 over the absolute pressure, by the absolute temperature over 520 degR, and by z. Pressure squeezes the gas and is much the largest of the three, temperature expands it, and z corrects for the gas being real.

On ABANA-2 the three together take 1273.148148 standard ft3/s to 29.490437 ft3/s. The vessel passes about one fortieth of the standard volume, because it is holding the gas at forty times atmospheric pressure.

## The same stream, two rates

| stream | gas MMscfd | absolute psia | actual ft3/s |
| --- | --- | --- | --- |
| ABANA-1 | 18.000000 | 614.700000 | 4.825708 |
| ABANA-2 | 110.000000 | 614.700000 | 29.490437 |
| AGBAMI | 18.000000 | 364.700000 | 8.713371 |

ABANA-1 and AGBAMI carry the same 18.000000 MMscfd and arrive at 4.825708 and 8.713371 ft3/s, close to twice the volume for the same gas rate, because AGBAMI is at 364.700000 psia against 614.700000 psia. The standard rate says nothing about how much room the gas needs until the conditions are applied to it.

## Where the rate lands

The actual rate is the numerator of the gas area. Divide it by the settling velocity and the result is the area the gas must cross slowly enough for drops to fall out. On ABANA-1 that is 4.825708 ft3/s over 1.458422 ft/s, an area of 3.308855 ft2, which is a diameter of 2.052551 ft.

Use 1273.148148 in place of 29.490437 and the vessel comes out absurd rather than wrong, which is the one comfort in this particular error. The dangerous version is subtler: using the actual rate computed at some other stage's conditions, where the answer is merely a plausible vessel for a pressure this one does not run at.

## What moves it

Everything upstream. The conditions move the three scalings, the gravity moves z through the reduced pair, and the gas rate moves the whole figure in proportion. Nothing about the vessel itself appears in it, which is why the actual rate is computed once per stream and then used by every candidate diameter.

## The mistake

Comparing two vessels on their MMscfd. ABANA-1 and AGBAMI both carry 18.000000 MMscfd and need quite different amounts of room, so the rate on the nameplate is not a measure of duty until somebody states the pressure and temperature beside it.

## Exercise

Take 110.000000 MMscfd to 1273.148148 standard ft3/s and name the three scalings that take it to 29.490437 ft3/s. Then explain why ABANA-1 and AGBAMI arrive at 4.825708 and 8.713371 ft3/s on the same 18.000000 MMscfd, and say which of the two figures the gas area is built from.
