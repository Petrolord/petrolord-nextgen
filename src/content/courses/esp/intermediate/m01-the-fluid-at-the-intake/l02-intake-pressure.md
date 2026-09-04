# Intake pressure

The pump sits above the perforations, so it never sees the flowing bottomhole pressure. What it sees is that pressure less the weight of whatever is standing in the annulus between the two depths.

{{panel:pd-lift-explorer}}

## One subtraction, three inputs

The lift is the perforation depth less the pump setting depth, floored at zero. Multiply it by the annulus gradient and subtract from the flowing bottomhole pressure.

| Case | Flowing bottomhole, psia | Lift, ft | Annulus gradient, psi/ft | Column, psi | Intake, psia |
| --- | --- | --- | --- | --- | --- |
| gassyOffshore, published | 1500.0 | 500 | 0.3200 | 160.0000 | 1340.0000 |
| highWaterCut, published | 1100.0 | 400 | 0.4200 | 168.0000 | 932.0000 |
| QUA-IBOE-4, teaching | 1600.0 | 600 | 0.2800 | 168.0000 | 1432.0000 |

The published golden design gassyOffshore is set 7000 ft against perforations at 7500 ft TVD, highWaterCut 5800 ft against 6200 ft TVD, and the teaching well QUA-IBOE-4, which is not a published case, 7600 ft against 8200 ft TVD.

## The gradient is not the produced gradient

Read the last two rows together. A 400 ft column costs 168.0000 psi and so does a 600 ft column, because the longer column is the lighter one. Above the pump the annulus carries whatever gas has separated out, so it is lighter than the produced liquid, and how much lighter is a caller input. The gassiest of these three wells carries the lightest annulus at 0.2800 psi/ft and the wettest carries the heaviest at 0.4200 psi/ft.

## Why the number matters twice

Intake pressure sets the conditions the black oil properties are evaluated at, so it decides how much gas is free and how large the in situ rates are. It is also the lower of the two pressures in the head calculation, so an intake pressure that is too high understates the pressure the pump must add.

## The mistake

Using the produced liquid gradient in the annulus. It is the single easiest way to overstate the intake pressure, and every consequence of that is optimistic: less free gas, a friendlier verdict, a smaller pressure rise and a shorter stack. Nothing in the module objects, because the gradient it was handed is exactly the gradient it used.

## What it refuses

It refuses to invent the annulus gradient, and it refuses to model the annulus at all: there is no separation calculation behind that number. It also refuses to give credit for a pump set below the perforations, since the lift is floored at zero rather than allowed to go negative.

## Exercise

Compute the intake pressure for all three cases from the flowing bottomhole pressure, the two depths and the annulus gradient, then read the same three in the panel.

Then rerun gassyOffshore with the annulus gradient raised to 0.4200 psi/ft and say in one sentence which direction the error in the intake pressure runs.
