# What a diagnosis cannot tell you

The function compares two heads and two currents against four constants and reports which comparison failed. Everything a reader wants to know beyond that is not in it.

{{panel:pd-power-explorer}}

## It cannot name a cause

The `underCurve` message lists wear, free gas through the stages and a wrong stage count, and then picks none of them. That is not modesty. From a head ratio the three are identical, because each one lowers the head the stack makes at a rate without touching the curve the comparison is against. There is no wear model and no gas lock model in the function to break the tie.

## It cannot tell you the pump is healthy

A stack making 4760.000000 ft where its curve expects 5600.000000 ft returns no flag, because 0.8500 is not below 0.85. So does 6440.000000 ft at a ratio of 1.1500. Silence means no band was crossed, and reading it as a clean bill of health is the most expensive mistake available here. The returned ratio is the reading; the flags are only a threshold applied to it.

## It cannot separate a bad input from a bad pump

When the head comes from two pressures it comes through a gradient of 0.433 times the specific gravity, 0.41135000 psi/ft on the published fixture. A specific gravity that is wrong moves the recovered head and therefore the ratio directly, and the result is indistinguishable from a worn stack. The `overCurve` message is the only place the engine admits this, and it names the whole list: the rate, the pressures, the fluid gradient or the stage count.

## It cannot read a stopped pump or a plateless motor

At zero drive frequency the stage read returns NaN head, a region of invalid and inside the published range false, so there is nothing to compare. Without a nameplate current there is no amps reading, in the same way `motorCurrent` returns NaN when either the nameplate power or the nameplate current is zero.

The amps reading is weak before it is absent. Below half load the real current flattens toward the magnetising current, so a load fraction of 0.2000 returning 9.8000 A is flagged rather than trusted. A low amps flag on a lightly loaded motor is reporting a linear estimate, not a measurement.

## What it does tell you

A head ratio, a region, an amps ratio and the four constants they were judged against, each printed to a precision that can sit off its threshold. Carried with the record, those numbers survive being wrong about the cause. A flag alone does not.

## Exercise

Write the four questions this function answers and four it does not.

Then take the fixture at a head ratio of 0.8500 and say what you would record about the pump, given that no flag was raised.
