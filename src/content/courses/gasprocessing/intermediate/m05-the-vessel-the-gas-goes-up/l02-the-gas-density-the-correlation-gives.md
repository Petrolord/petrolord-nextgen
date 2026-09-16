# The gas density the correlation gives

The compressibility is not an input here. The engine computes it from the same DAK correlation the rest of the platform uses, off Sutton pseudo-criticals built from the gas gravity alone, and the gas density follows from it.

That is the module's doctrine again, and this is the clearest case of it. A compressibility is computable from first principles once a correlation has been chosen, so it is computed. A K value is a chart figure, so it stays an input.

## What the engine builds for itself

| psia | degF | gravity | z the engine computes | gas density, lb/ft3 | allowed velocity, ft/s | diameter, ft |
| --- | --- | --- | --- | --- | --- | --- |
| 600.000000 | 100.000000 | 0.650000 | 0.919606033 | 2.045042 | 1.723846 | 3.585683 |
| 950.000000 | 104.000000 | 0.660000 | 0.876617747 | 3.424553 | 1.318455 | 3.192661 |
| 1400.000000 | 110.000000 | 0.700000 | 0.818461451 | 5.672520 | 1.006865 | 2.923419 |
| 1400.000000 | 60.000000 | 0.700000 | 0.738367833 | 6.892825 | 0.904635 | 2.797882 |
| 2000.000000 | 110.000000 | 0.750000 | 0.751811429 | 9.452149 | 0.756578 | 2.704296 |

{{panel:fc-absorber-explorer}}

## Read the compressibility column as a function of three things

Three inputs move down that table at once, and the compressibility responds to all three. Pressure alone will not predict it, and the fourth and fifth rows are in the table to make that visible. Note the pressure, the temperature and the gravity on each of those two rows, then note the compressibility, and see what you would have got by reading the pressure alone.

This is the habit the whole tier is built on. A column of numbers in front of you was produced by everything the engine was given, and a sentence that attributes it to one input is a sentence about a calculation nobody performed.

The gas density carries the same warning. It is built from the pressure, the temperature, the gravity and the compressibility together, so it is a property of a stream at a state rather than a property of the gas. The allowed velocity is built on the density, and the diameter on the velocity, which means every one of those three columns inherits all four inputs.

## Which branch produced the number

A caller may supply a compressibility, and the engine will use it. When none is supplied it builds one. Either way the answer says which happened: it reports zSource as "DAK correlation at these conditions" when it forms one and "supplied by the caller" when it is handed one.

That is a small piece of design worth copying. A reader of the answer is never guessing which branch produced the number in front of them, and the two branches are genuinely different claims. A supplied compressibility is somebody's assertion. A computed one is a correlation's answer at stated conditions, with the validity band of that correlation behind it.

## Two kinds of published case

The golden behind this routine comes in two kinds and the difference is the most useful thing about it. Three of the cases pass a compressibility in, so they check the sizing arithmetic and never the correlation. Two let the engine compute its own, which is the branch the live studio always takes, because it never passes one.

That is worth knowing before quoting an agreement figure. A published case that hands the engine half the answer can only check the other half, and both halves need checking by somebody.

## Exercise

Record the compressibility, the gas density and the diameter on the rows at 1400.000000 psia and 60.000000 degF and at 2000.000000 psia and 110.000000 degF. Then say what else changed between those two rows, and name the two things zSource can report.
