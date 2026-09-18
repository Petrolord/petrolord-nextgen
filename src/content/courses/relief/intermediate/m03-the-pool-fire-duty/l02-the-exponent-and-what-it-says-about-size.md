# The exponent, and what it says about size

{{panel:fc-fire-drum-explorer}}

The wetted area in the pool fire duty is raised to a power, and that power is below one. Everything interesting about how the fire case behaves as vessels get larger follows from that single fact.

## The exponent, measured

| what was asked | answer |
| --- | --- |
| the log ratio of two duties at 100 and 1000 ft2 over the log ratio of the areas | 0.820000000000 |

That is how an exponent is recovered from a function you can only call. Two duties at two areas, the factor and the drainage answer held fixed, and the exponent falls out of the two logs. The constant in front never enters, which is what makes it a measurement rather than a rearrangement.

The exponent is held for literature on the same terms as the two constants. It is stated with its reference and never derived here.

## Duty per square foot falls as the vessel grows

| wetted area ft2 | duty Btu/hr | duty per ft2 Btu/hr |
| --- | --- | --- |
| 50.0000 | 519247.8396 | 10384.9568 |
| 100.0000 | 916683.2477 | 9166.8325 |
| 250.0000 | 1943256.3783 | 7773.0255 |
| 500.0000 | 3430636.4553 | 6861.2729 |
| 1000.0000 | 6056466.1566 | 6056.4662 |
| 2500.0000 | 12838967.5692 | 5135.5870 |
| 5000.0000 | 22665990.2852 | 4533.1981 |

The third column is a per-unit-area figure the course computes and prints, so it may be read as it stands. It falls the whole way down the table. A larger vessel in the same pool fire absorbs more heat in total and less heat per square foot of wetted shell.

## What the exponent is standing in for

An exponent of one would say every square foot of wetted shell absorbs the same flux. The published exponent says it does not, and the physical reason is that a large vessel is not uniformly engulfed. Flames have a height and a width, a pool has an extent, and radiation falls off with distance, so the shell far from the fire's core sees less than the shell in it. The exponent packages all of that into one number.

Packaging is exactly what it is. The relation has no flame height in it, no pool diameter, no wind, no orientation of the vessel with respect to the fire. The fire's whole geometry lives inside one published constant and one published power, which is why this is a screening calculation.

## Why this shows up as a design surprise

The practical consequence catches people out. Trim a level, or read a vessel standing up rather than lying down, and the wetted area changes a great deal. The duty changes less, because the area enters under a power below one. Engineers who expect the duty to track the area proportionally find the movement smaller than they predicted and go looking for an error that is not there.

The per-square-foot column also shows why one enormous vessel is a different problem from several small ones carrying the same total shell.

## The habit this teaches

When a correlation carries an exponent that is not one, ask what physical fact the exponent is standing in for. Then ask whether your case resembles the cases the exponent was fitted to. A small vessel fully engulfed and a very large vessel touched at one end both get the same relation here, and only one of them is the situation the relation describes well.

The engine will not raise that question. It applies the published form to whatever area it is handed.

## Exercise

State the exponent at the precision this lesson prints it and the question that measured it. Then read the duty per ft2 column and say which direction it moves, and write two sentences on what the exponent is standing in for that the relation does not carry explicitly.
