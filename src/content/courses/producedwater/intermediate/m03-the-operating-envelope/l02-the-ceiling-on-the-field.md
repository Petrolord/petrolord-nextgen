# The ceiling on the field

The square law of the last lesson cannot run forever, and a model in which it did would tell a designer to buy less equipment for a better answer. This module puts a ceiling on the field and says where it is.

{{panel:pw-device-explorer}}

## Where the ceiling sits and why

The field rises as the square of the flow only UP TO the top of the operating envelope, at 1.3 times design. Past that the inlet slot chokes, and the extra energy the pump is putting in goes into pressure drop across the slot rather than into rotation.

So the reported field cannot exceed 1690.000000 g. That is the field at the top of the envelope, and every bank run harder than that reports exactly it.

## The second effect, which runs the other way

A ceiling on its own would only make the cut size stop improving. Something else makes it get worse.

Above the envelope the cut also carries the root of the overload as an INLET SHEAR PENALTY, because the shear at the inlet breaks droplets finer than they arrived. The engine reports that penalty as its own field, so the ideal cut and the reported cut separate:

| liners | turndown | field g | shear penalty | ideal cut micron | CUT MICRON |
| --- | --- | --- | --- | --- | --- |
| 230 | 1.000071 | 1000.142101 | 1.000000 | 4.751385 | 4.751385 |
| 200 | 1.150082 | 1322.687929 | 1.000000 | 4.430689 | 4.430689 |
| 177 | 1.299527 | 1688.771335 | 1.000000 | 4.168146 | 4.168146 |
| 150 | 1.533442 | 1690.000000 | 1.086081 | 4.526119 | 4.915730 |
| 120 | 1.916803 | 1690.000000 | 1.214275 | 5.060355 | 6.144662 |

The field column climbs to 1690.000000 and stops. The shear penalty column sits at 1.000000 until the envelope is passed and then rises. On the 120 liner row the ideal cut is 5.060355 micron and the reported cut is 6.144662 micron, because the penalty is applied to the ideal.

## What the penalty is doing physically

A liner pushed past its slot rating accelerates the water harder than the design intends, and shear breaks oil droplets. Finer droplets are harder for any device to catch, so the same liner on the same water reports a coarser cut when it is being overdriven.

The module writes that as a multiplier on the ideal cut whose size is the square root of the overload, and the table above prints both the multiplier and the two cut sizes it sits between.

## The two together

The cut gets WORSE from the envelope onward, in direct proportion to the overload. A ceiling alone would flatten the curve. A ceiling plus a penalty turns it over, and the turn is the subject of the next lesson.

## Reading a model for its limits

Notice what the module did here. It did not quietly cap a number and carry on. It kept the ideal cut and the reported cut as two separate reported fields with the penalty between them, so a reader can see how much of the answer is physics and how much is the price of running the bank too hard.

A model whose answer improves without limit as one input is pushed has no limit in it. That is worth checking on any model before trusting its optimum.

## Exercise

From the table, read the field and the shear penalty at 177 liners and at 150 liners, and say what changed between those two rows.

Then explain why a cap on the field alone would not have been enough to make this device behave sensibly.
