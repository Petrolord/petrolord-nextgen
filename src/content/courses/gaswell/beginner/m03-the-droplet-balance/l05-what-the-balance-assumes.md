# What the balance assumes

Three of the numbers inside the droplet balance are choices, and one of them changes the answer by more than any fluid ever will.

{{panel:pd-droplet-explorer}}

## One droplet, and that is the whole population

The balance models one droplet at its terminal velocity. There is no droplet population, no coalescence, no break-up in transit and no film flowing on the tubing wall, which is the other way a gas well carries liquid. So the verdict on offer is whether a single droplet of the largest stable size rises or falls, and never how much liquid reaches surface.

## The Weber number is an input

The critical Weber number of 30.0000 sets the largest droplet that survives the gas going past it, and it is chosen rather than measured.

| Critical Weber number | Constant | Ratio to the shipped 30 |
| --- | --- | --- |
| 10.0 | 1.2108244638 | 0.7598351238 |
| 20.0 | 1.4399210674 | 0.9036013354 |
| 30.0 | 1.5935346111 | 0.9999992605 |
| 40.0 | 1.7123643784 | 1.0745691372 |
| 60.0 | 1.8950426975 | 1.1892062356 |
| 120.0 | 2.2535982591 | 1.4142125166 |

Moving from 20.0 to 60.0 moves the constant from 1.4399210674 to 1.8950426975, a larger swing than the entire span of liquid properties a gas well produces. The row at 30.0 reads 0.9999992605 rather than exactly one because it is measured against the published 1.5935357894 while the engine derives 1.5935346111.

## A rigid sphere and two supplied properties

0.4400 is the drag coefficient of a rigid sphere in the Newton regime. A real droplet deforms, flattens and sheds, and nothing here knows that, so the value is describing a different object rather than being wrong. Interfacial tension and liquid density are supplied too. Neither is a function of anything these modules know, and the Turner fluid properties are labelled starting points rather than correlations.

## The mistake

Ranking these assumptions by how uncomfortable they sound. The film flow omission is the one that sounds worst and it is not the one that moves the number. The chosen Weber number is, and it never appears in any output, so it is the one nobody argues about.

## What it refuses outright

A liquid density below the gas density returns `ok = false` with no velocity, and so does an interfacial tension of 0.0 dyne/cm. Both are cases with no answer rather than cases with a bad answer, and the module distinguishes the two.

## Exercise

Read the constant at critical Weber numbers 20.0 and 60.0 and compare that range to the range a liquid property could produce.

Then list the three chosen numbers inside the balance and say which of them appears anywhere in what the module returns.
