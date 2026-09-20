# The total and its RRF

{{panel:lp-sif-builder}}

Five subsystems reproduced individually is a good result. The claim that matters for a function, though, is the total, because that is the number a verification note carries and the number a LOPA row is answered with. This lesson sums the published example and reads its risk reduction factor, then says exactly what the reproduction rests on.

## The sum

The five subsystem values of the previous lesson added as a series sum, the same operation applied to the teaching function earlier in this tier.

| quantity | engine | printed |
| --- | --- | --- |
| PFDavg | 0.001286431107 | 1.29E-03 |
| RRF | 777.344387 | 777 |
| SIL | 2 | |

The total rounds to the printed 1.29E-03 and the risk reduction factor rounds to the printed 777. Five subsystems and the total all agree with the source at the precision the source printed, which is what makes this example evidence and not only an illustration.

## Where the total comes from

| part | PFDavg |
| --- | --- |
| pressure transmitters | 0.000235764375 |
| analogue input card | 0.000000696679 |
| processor | 0.000000533954 |
| digital output card | 0.000000668459 |
| valve assembly | 0.001048767640 |
| function | 0.001286431107 |

The valve assembly and the pressure transmitters carry almost all of it, and the three electronic subsystems together contribute less than two millionths. That is the same shape the teaching function showed: the mechanical final element leads, the sensors follow, and the logic solver is close to noise. It is worth knowing how typical that shape is, because it tells a reviewer where to look first in a calculation they have not seen before.

## What the reproduction rests on

Two things must be said whenever this example is quoted. The published table reproduces only with the mean repair time after a test set equal to the MTTR on every row, which is an inference this wave made. And the source also prints a second table in which the beta factor is multiplied for a voted arrangement: the pressure transmitter row there reproduces at a beta factor of 0.15, where the engine returns 0.000344085754, or 3.44E-04 against the printed 3.44E-04. Both are facts about the published source and how it was read, and the Expert tier takes up what else follows from them.

## Why a reproduction is worth the trouble

A PFDavg implementation can be self consistent and still be a different model from the one a reviewer expects. The reproduction closes that gap for four of the five architectures in this engine, with published worked values behind them. The one out of three has no published row, which is why this course asks you to handle it with more care than the rest.

## Reading it back onto a row

A function of 0.001286431107 delivers a risk reduction factor of 777.344387, so it answers any LOPA row whose required risk reduction factor is at or below that figure, and misses any row above it. Band 2 is the label, and the row's required PFDavg is the test.

## Exercise

Add the five subsystem values yourself and check your total against 0.001286431107. Then compute one over your total to six decimals, compare it with 777.344387, and say what required PFDavg this function would just fail to meet.
