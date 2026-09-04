# Working the capstone

There is a right order for the electrical half of a design, and most of what goes wrong comes from doing the steps in the wrong one.

{{panel:pd-power-explorer}}

## Fix which shaft power you are on, and write it down

Two brake powers exist for every stack and they differ by exactly the ratio of the head made to the head required. Record both. This package builds on the power at the head required and the published method takes the other, so a report naming neither cannot be checked. The gap is 0.037345 percent on golden design gassyOffshore and 2.503380 percent on teaching well IBENO-2: one stage of slack, on a much shorter stack.

## Choose the motor, then record the derate separately

The derate is an input, not a property of the motor, so it belongs on its own line. Compute both load fractions and label each with its module: utilisation against the usable rating from the sizing, the electrical fraction against the plate from the current. They agree only at a derate of zero, and they can straddle one, as on teaching well QUA-IBOE-4 at a 12 percent derate.

## Take the amps from the plate, not from the derated rating

The current is the nameplate current scaled by the electrical fraction. Check the weak-estimate flag before quoting it: below half load the scaling is linear where the machine is not.

## Pick the cable, and state what the pick ran on

List the candidates smallest conductor first with each drop percentage against the limit, name the one taken, then say in words that the ampacity half of the published method did not run. A pick reported as a cable that carries the current is a claim the shipped table cannot support. A pick reported as one that keeps the drop inside the limit is exactly true.

## Read the surface numbers, and do not try to balance them

Take `dropPct`, `surfaceVolts`, `kva` and `lossKw`, and quote the cable loss as a percentage of the real power rather than as a subtraction. No combination of the four is motor input power, and inventing one produces a figure nobody can reproduce.

## Diagnose only if you have measured data

Read the head ratio and the region as numbers first, then look at the flags. A ratio at a threshold raises nothing and still tells you where the pump is.

## Before you submit

| Check | What passing looks like |
| --- | --- |
| Shaft power | Named as required or as made, both recorded |
| Load fractions | Two numbers, each labelled with its module |
| Cable | Drop percentage stated, ampacity stated as unchecked |
| Surface | Four fields, no balance attempted |
| Ratios | Quoted with a decimal, not as flags |

Then the units: bbl/d for rate, ft for head, hp for power, psia for pressure, degF for temperature, A, V, kVA and kW at surface, Hz for the drive.

## Exercise

Work one published golden design through the order, one line for each step, ending with both load fractions and all four surface fields.

Then name the one error that would make every electrical field wrong at once, and the comparison that catches it.
