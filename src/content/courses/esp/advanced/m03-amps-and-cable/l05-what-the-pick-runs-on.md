# What the pick runs on

The selected cable is decided by one scalar: a drop percentage against a limit. Whatever touches that scalar can move the pick, and whatever does not cannot.

{{panel:pd-power-explorer}}

## The chain, in order

Shaft horsepower over nameplate power gives a load fraction. That times the nameplate current gives the amps. The amps times 1.7320508076, times the corrected resistance, times the length in thousands of feet, gives volts. Those volts over the nameplate voltage give the percentage.

Four things move it: the shaft power, the plate, the conductor temperature and the length. The thrust derate is not among them, and neither is the power factor.

## Where each one bites

The shaft power carries the open question of which brake power the chain should take, and it enters linearly, so an understatement reaches the drop undiminished.

Temperature is the quiet multiplier. On 2 AWG the conductor reads 0.1593000000 ohms per 1000 ft at 77 degF and 0.2194702650 at 250 degF, a factor of 1.37771667.

The limit is itself an input. The default is 5 percent, and the published gate that returns no cable was run at 1.0 percent against 53.600000 A, where the best candidate still read 14.648054 percent.

The ampacity check is not in the list at all. On the shipped table it passes for every candidate on every run, so the ok flag equals the drop flag everywhere.

## How little margin the winner can have

Golden electrical case 2 is decided at 4.983392 percent against a 5.0 percent limit, with 2 AWG behind it at 6.280493 percent. The winner sits inside the last fraction of a percent of the threshold while the size below is more than a percentage point away. Small input errors do not give slightly different cables, they give the next one.

## What it refuses

It refuses to say how close the decision was. The result names a cable and its drop, and reports neither the distance to the limit nor the drop of the size below.

It refuses to weigh anything the table does not carry: ampacity, armour, insulation rating, outside diameter and cost are absent.

It refuses a fallback. When nothing qualifies, nothing is returned, on the 1.0 percent gate and on the teaching well QUA-IBOE-4 at 6.017615 percent on its largest conductor.

## The mistake

Auditing the pick by re-reading the cable table, which is the least likely thing to be wrong. The pick is decided by the shaft power, the conductor temperature, the string length and the limit, and three of those four live in another module or in a default.

## Exercise

For golden electrical case 1, list the four inputs that would change its drop percentage and two that would not.

Then say which check decided its pick, and what in the output shows the other took no part.
