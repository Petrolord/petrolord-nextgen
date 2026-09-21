# The worked SIF, subsystem by subsystem

{{panel:lp-sif-builder}}

Everything in this tier so far has been computed on teaching channels. A teaching channel proves that an implementation is self consistent. It cannot prove that the implementation matches the equations a practitioner would use. For that you need a worked example someone else published, with its inputs and its answers, and you have to reproduce it with your own implementation. This module is that check, and it is the reason the figures in this tier can be offered as evidence.

## The source

The published example is the 61508 Association worked function presented by Dolan in 2024, in guidance on the use of IEC 61508-6:2010, and the golden reproduces its results table. The failure rates are the source's own, cited there to industry databases and vendor certificates, and this course offers them as nothing more than that source's example values. No licensed table is copied anywhere here.

## The five subsystems, as published

| case | architecture | lambdaDU per hour | lambdaDD per hour | T1 hours | MTTR hours | MRT hours | beta factor | betaD |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pressure transmitters | 2oo3 | 5e-7 | 8e-7 | 8760 | 8 | 8 | 0.1 | 0.1 |
| analogue input card | 2oo3 | 7.06e-9 | 8.86e-7 | 8760 | 8 | 8 | 0.02 | 0.01 |
| processor | 1oo2 | 4.9e-9 | 1.28e-6 | 8760 | 8 | 8 | 0.02 | 0.01 |
| digital output card | 1oo2 | 6.81e-9 | 8.61e-7 | 8760 | 8 | 8 | 0.02 | 0.01 |
| valve assembly | 1oo2 | 2.1e-6 | 4e-7 | 8760 | 120 | 120 | 0.1 | 0.1 |

The proof test interval is one year, 8760 hours, on every row. Note the valve assembly again: the largest undetected rate of the five at 2.1e-6 per hour, the longest restoration times at 120 hours, and the highest beta factor at 0.1 alongside the transmitters.

## Reading the five rows against each other

The five rows are a short course in instrument reliability on their own. The three electronic subsystems all carry undetected rates in the single digits of 1e-9 per hour against detected rates near 1e-6, which is diagnostics doing most of the work. The pressure transmitters sit between the two worlds at 5e-7 undetected against 8e-7 detected. The valve assembly has almost no useful diagnostics, so its dangerous failures wait for a proof test, and its beta factor and its restoration times are both the highest in the set. Before any arithmetic, the ranking of the five answers is already visible in the input table.

## What the engine returns against what was printed

| case | engine PFDavg | engine at three significant figures | printed |
| --- | --- | --- | --- |
| pressure transmitters | 0.000235764375 | 2.36E-04 | 2.36E-04 |
| analogue input card | 0.000000696679 | 6.97E-07 | 6.97E-07 |
| processor | 0.000000533954 | 5.34E-07 | 5.34E-07 |
| digital output card | 0.000000668459 | 6.68E-07 | 6.68E-07 |
| valve assembly | 0.001048767640 | 1.05E-03 | 1.05E-03 |

Every one of the five rounds to the three significant figures the source printed. That is the strongest evidence this wave holds that the implementation is the published Annex B form and no variant of it.

## One inference, stated plainly

The reproduction is not free of assumption. The published table reproduces only with the mean repair time after a test set equal to the MTTR on every row, and that equality is an inference this wave made to get the numbers to agree. Say so wherever you lean on this example. A reproduction that needed an inferred input is evidence about the equations for the rows it reproduces, and the fuller account of what the source printed and what had to be assumed belongs to the Expert tier.

## Exercise

Compare the valve assembly figure of 0.001048767640 with the pressure transmitter figure of 0.000235764375. Compute the ratio, then, using the input table, name the two inputs you think account for most of it and say which one you would attack first in a redesign.
