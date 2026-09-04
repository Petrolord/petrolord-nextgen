# Motor current

The amps are one multiplication. That is the whole model, and knowing it is the whole model stops you expecting more from the number.

{{panel:pd-power-explorer}}

## The plate, scaled by the part

A nameplate is power, volts and amps at full load. Motor current is the nameplate current times shaft power over nameplate power.

| Case | Shaft, hp | Plate, hp | Plate, A | Fraction | Current, A |
| --- | --- | --- | --- | --- | --- |
| Golden electrical case 1 | 125.00 | 250 | 67 | 0.5000000000 | 33.500000 |
| Golden electrical case 2 | 78.00 | 100 | 49 | 0.7800000000 | 38.220000 |
| Teaching well QUA-IBOE-4 | 95.41621294 | 100 | 49 | 0.9541621294 | 46.753944 |
| Teaching well IBENO-2 | 29.77428389 | 60 | 38 | 0.4962380648 | 18.857046 |

The plates for the two teaching wells are catalogue motors, m-100-1300 and m-60-1000. Across both golden cases the largest relative deviation between engine and recorded golden is 0.00000000000064.

## What is deliberately absent

No motor efficiency curve and no power factor curve enters this step. A nameplate already contains both at full load, so scaling the nameplate carries them along at the one point where they are known and interpolates them nowhere else.

The consequence is a boundary at half load. Below a fraction of 0.5 the estimate is flagged weak, because the real current flattens toward the magnetising current while the scaling continues toward zero. At a fifth of plate the engine returns 0.2000 and 9.8000 A and flags it. Golden electrical case 1 at exactly 0.5000000000 is not flagged.

## It runs on the shaft power it was handed

The fraction here is shaft power over the plate, with no thrust derate in it. A design that changes only its derate produces the same amps, because the shaft does the same work.

## What it refuses

It refuses a plate it does not have. A nameplate power of zero returns NaN, and so does a nameplate current of zero. There is no default motor.

It refuses to correct the weak estimate: the 9.8000 A comes back unchanged with a flag beside it.

It also knows nothing about the cable. The 46.753944 A on the teaching well QUA-IBOE-4 is the same whatever conductor is hung on the motor: the current is set at the machine, and the cable only spends voltage carrying it.

## The mistake

Building the amps yourself from horsepower, an assumed motor efficiency and an assumed power factor, then treating the difference from the engine as an error. The engine never made those assumptions. It made one: current is linear in loading, which is the published behaviour above half load and the reason for the flag below it.

## Exercise

Compute the current for all four cases from the nameplate current and the load fraction, and check each against the panel.

Then read the current at a fifth of plate, note the flag, and say in one sentence why the engine returns the number anyway.
