# What TDH refuses

The head is exact arithmetic on numbers this module did not produce.

{{panel:pd-lift-explorer}}

## The discharge pressure is an input

`totalDynamicHead` takes two pressures and a gradient. The intake pressure it can build: on the published gassyOffshore design, 1500.0 psia of flowing bottomhole pressure less 160.0000 psi of annulus column gives 1340.0000 psia. The discharge pressure it cannot build. That is a flowing traverse result, and the honest way to get it is to march the tubing at the design rate with the gas that is actually still in the stream. This module will not guess it from a static column, and it will not tell you when the one you supplied is wrong.

## What a zero gradient does

Given a gradient of zero, the head comes back NaN and the pressure difference comes back 2000.0 psi. Half the return value is still live. A report that prints the pressure the pump must add beside a blank head has not failed loudly: it answered one question and declined the other in the same object.

## The decomposition does not check itself

`tdhBreakdown` adds a net lift, a friction and a wellhead term and returns the sum. It never goes back to the two pressures. On gassyOffshore the sum lands 0.000000000000 ft from the head those pressures gave, and on QUA-IBOE-4 the residual prints as -0.000000000000 ft, but only because the three parts were derived from the same pressures. Hand it three parts from three different wells and it returns their sum without comment.

## The gradient you convert at is a choice

The package carries the conversion twice. The exact form is 62.4 divided by 144, which is 0.433333333333 psi/ft per SG. The rounded field form is 0.433000. They stand 0.076982 percent apart, and on a real requirement that is 3.832442 ft on gassyOffshore, 2.923126 ft on highWaterCut, 3.104070 ft on QUA-IBOE-4 and 0.558191 ft on IBENO-2.

Derive the specific gravity from the design gradient by dividing by 0.433, and the two routes disagree by 0.000000000000 ft on every one of those cases. That is the convention the goldens are cut on. The disagreement is not an error in either conversion. It is an error in mixing them on one well.

## The mistake

Reading total dynamic head as a verdict on a design. It is a requirement, and it says nothing about whether a pump can meet it or whether the duty sits on a sensible part of a curve. A head of 4978.341767 ft is the same number whether the stage that has to make it runs in its recommended band or off the end of its published data.

## Exercise

Set the gradient to zero in the panel and record both fields that come back.

Then compute one case's head twice, once on the design gradient and once on the true specific gravity route, and write the gap in feet.
