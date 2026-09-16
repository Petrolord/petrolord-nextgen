# Working the capstone

A graded exercise is marked on the figure produced, and most lost marks come from answering a nearby question. Four habits carry it: read the conditions, know which question a figure answers, check the units and the precision, and never guess.

{{panel:fc-suction-explorer}}

## Read the conditions

Almost everything here is conditional. An NPSH available of 52.808173 ft belongs to a drum pressure, a vapour pressure, a gravity, a static height and a suction friction, and moving the drum pressure alone takes it to 131.659135 ft. Neither figure is wrong and only one was asked for.

Before working anything, write down every stated condition: the suction and vapour pressures, the gravity, the static height and its sign, the suction friction, the required NPSH, the speed or trim ratio, the machine count, the viscosity and the rpm.

## Know which question a figure answers

Two pairs here are easy to swap and expensive to swap.

A crossing and an affinity map. At a trim ratio of 0.800000 the re-solved duty is 695.297235 gpm and the one-point answer is 943.122068 gpm. If the question asks where the pump will run, the crossing is the answer.

An ideal figure and a real one. On that same trim ratio the ideal flow is 987.562375 gpm and the real flow is 943.122068 gpm. The column label is the whole of what tells them apart.

## Check the units and the precision

| quantity | how it is written |
| --- | --- |
| suction and vapour pressure | psia |
| heads, margins and static columns | ft |
| flow | gpm |
| power | brake hp |
| viscosity | cSt |
| speed | rpm |
| trim and shortfall | percent |
| ratios, factors and quotients | dimensionless |

Pump figures print to six decimals and the small factors and differences print longer. Quote them as the engine prints them. A margin quoted as a ratio is the error the margin rule invites: at a required NPSH of 16.000000 ft the required margin is 5.600000 ft and the boundary ratio is 1.350000000.

## What a published case does and does not settle

Two published NPSH cases sit beside this work. At 14.700000 psia over 0.500000 psia at a gravity of 0.850000 the engine gives 43.590588 ft against a golden 43.573343 ft, a quotient of 1.000395783. At 35.000000 psia over 12.000000 psia at 0.720000 it gives 62.791667 ft against 62.758690 ft, a quotient of 1.000525448.

Those quotients are not failures. The goldens were written through a different route at a water density their own oracle states, so a gate against them carries a tolerance chosen from the size of the disagreement the two routes really have. The useful question about any tolerance is what error it is still small enough to see: one loose enough to swallow a mis-transcribed constant catches nothing.

Every published case in this course was written by an oracle. There is no measured pump test and no vendor performance run anywhere in it.

## Never guess

Where the engine declines, the decline is the answer. A margin check handed an unreadable available head returns an error and no severity, and a fractional machine count returns an error naming both halves of what it needs.

Nothing here is graded on a held item. No required margin, pass flag or severity, no trimmed flow, head or shortfall, and no corrected flow, head or efficiency is ever the answer.

## Exercise

Take any figure you are about to write, name the conditions it belongs to and the question it answers, then confirm its unit, its precision, and that the engine returned it rather than you.
