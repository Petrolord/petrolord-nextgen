# Working the capstone

Six numbers spanning regression, rate history, gas and production data.

{{panel:wt-regression-explorer}}

## What is asked

1. The fault distance from fitting the sealing-fault model to the SEALING-FAULT test.
2. The permeability from the multi-rate semilog on the three-rate history.
3. The equivalent producing time for that history, shut in at 96 hours.
4. The percentage by which the back-pressure absolute open flow exceeds the LIT one on the flow-after-flow test.
5. The oil in place from the flowing material balance on the oil decline.
6. The gas in place from the dynamic material balance on the gas decline.

Six analyses on five different datasets. That is deliberate: the Expert tier is about knowing which method belongs to which dataset, and each field is a different method.

## Field one: the real fault

Fit `homogeneous-sealing-fault` to the `faultDrawdown` fixture as a DRAWDOWN, using the fixture's own pressure change, the catalog defaults as starting values, derivative weight 1 and smoothing L = 0.1.

Report the fitted distance in feet.

Two traps. The planted value is 800 ft and the fitted value is not; reporting 800 fails. And this is the fault fixture, not the buildup: fitting the same model to the buildup gives the phantom, which is not reproducible and is not what is asked.

The settings are stated because the fit moves with them. Changing the smoothing window to 0.15 moves this distance by about three feet, which is outside the tolerance.

## Field two: the multi-rate permeability

Build the three-rate response, 450 stb/d for 24 hours, 250 for 36, 700 thereafter, by superposing the planted homogeneous response, and run `multiRateSemilogAnalysis` on the late points of each period.

The panel does this for you. The point of the field is that you know what it did.

## Field three: the equivalent producing time

Cumulative rate-hours divided by the last rate, with the well shut in at 96 hours. This is arithmetic and it is the one field in this capstone you can do on paper.

Do it on paper first. Then check it against the panel.

## Field four: the deliverability disagreement

Run both fits on the three flow-after-flow points at an average reservoir pressure of 1952 psia, evaluate both absolute open flows at a base pressure of 14.7 psia, and report

    100 x (back-pressure AOF - LIT AOF) / LIT AOF

Note the denominator: the LIT value, not the average of the two. It is a percentage difference relative to the more conservative method.

## Field five: the oil in place

Prepare the 80 rows, compute material-balance time, regress the rate-normalised drawdown against it, and report N in stock tank barrels using the fixture's own total compressibility of 1.2e-5 per psi.

The tolerance is 5 stb on about two million, which is two parts per million. It is tight because the calculation is deterministic and the grader is checking that you ran it. Reporting the planted 2 million fails.

## Field six: the gas in place

The dynamic material balance, iterating to convergence, with pseudo-pressure and material-balance pseudo-time built from the fixture's own gravity of 0.65 and temperature of 180 F on a 200-point table to 10000 psia, and the initial total compressibility taken as the gas compressibility at 4800 psia.

Report G in Mscf. Again the planted 20 million fails.

## The order to work in

Do three first, on paper. Then five, which is the most self-contained of the analyses. Then six, which is five with two transforms and an iteration. Then four, which needs no transient machinery at all. Then two and one, which are the two that need the model catalog.

Working in that order builds each analysis on the one before it, which is how the module was written.

## What to notice

Two of the six are volumes and both are recovered to a fraction of a percent. Three of the six are flow-capacity or geometry quantities and all three are recovered to within a couple of percent. One of the six, field four, is not a recovery of anything: it is the disagreement between two methods, and its existence is the result.

That distribution is the honest summary of what well test analysis delivers.

## Exercise

Before opening the panel, write down for each of the six fields the engine function that produces it, its inputs, and the units of its output.

Then produce the six. Any field whose units you had to look up is one to revisit.
