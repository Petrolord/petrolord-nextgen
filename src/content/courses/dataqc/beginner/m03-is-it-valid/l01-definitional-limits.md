# Definitional limits and nothing more

{{panel:dq-checks-explorer}}

Some values cannot exist. A porosity above one, a negative produced rate, a temperature below absolute zero: each of these is impossible by the definition of the quantity, in any well and any file. The engine ships limits of exactly this kind and no other. It calls them definitional limits, keys each one by unit, and marks a bound exclusive when the bound itself is not allowed.

| channel | unit | minimum | maximum | minimum excluded | the engine note |
| --- | --- | --- | --- | --- | --- |
| fraction | v/v | 0 | 1 | no | a fraction lies in [0, 1] (water cut, porosity, saturation, shale volume, net to gross) |
| rate | any | 0 | none | no | a produced or injected volume rate is not negative |
| cumulative | any | 0 | none | no | a cumulative volume is not negative |
| gammaRay | gAPI | 0 | none | no | API gamma ray units are counts on a non-negative scale |
| resistivity | ohm.m | 0 | none | yes | resistivity is positive |
| bulkDensity | g/cm3 | 0 | none | yes | density is positive |
| sonic | us/ft | 0 | none | yes | a slowness is positive |
| caliper | in | 0 | none | yes | a hole diameter is positive |
| absolutePressure | psia | 0 | none | no | an absolute pressure is not negative |
| temperature | degF | -459.670000 | none | no | no temperature is below absolute zero |

These are ten of the 16 channel and unit pairs, one for each of the 10 channels. The others repeat a channel in another unit.

## Inclusive and exclusive

Look at the minimum excluded column. A gamma ray of exactly 0 is allowed: the scale is non-negative. A resistivity of exactly 0 is not: resistivity is positive, so the minimum itself is excluded. The same number sits in the minimum column for both, and the column beside it changes what the number means. When you read a range flag, read which kind of bound fired.

## EKENE-7 against its limits

| EKENE-7 channel | checked | failed | entries flagged | rule |
| --- | --- | --- | --- | --- |
| GR | 240 | 4 | 236, 237, 238, 239 | below-minimum |
| RHOB | 228 | 0 | none | none |
| NPHI | 237 | 10 | 150, 151, 152, 153, 154, 155, 156, 157, 158, 159 | above-maximum |
| RT | 240 | 1 | 120 | below-minimum |
| DT | 240 | 0 | none | none |

The checked column counts present values only, which is why the density checks 228 and the neutron 237. The gamma ray failures are the four sentinels from module one. The neutron failures are ten samples written in percent, which lesson four takes apart.

The resistivity at entry 120 is zero, a stated planted defect, and its reason names the exclusive bound, verbatim: "value 0 is below the minimum 0 (the minimum itself is not allowed)". Read quickly, that sentence looks like a contradiction. Read with the table, it is exact: the value equals the minimum, and the minimum is excluded.

## Why definitional only

A limit set this wide catches only what cannot be true. It will never flag a density that is merely unusual for a sandstone, or a gamma ray that is high for this basin. That is deliberate. A definitional limit holds in every well, every basin and every tool, so a flag against one is always a statement about the data themselves, whatever the rock or the tool. Anything narrower is a claim about a particular place and tool, and the next lesson shows who supplies it.

The price is honest to state. The density and the sonic pass with 0 failures here, and that says only that none of their values is impossible. It says nothing about whether any of them is right, and no definitional check can.

## Exercise

Open the checks explorer on the view for range limits and rate rules. Set the channel to resistivity with unit ohm.m and type the values 0 and 1 into the values box. Read the Checked and Failed tiles and copy the reason. Now set the channel to gammaRay with unit gAPI, keep the same two values, and read the tiles again. Explain the difference using the minimum excluded column.
