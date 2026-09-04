# kVA

Amps and volts are each one number. Switchboards, transformers and drives are bought in kVA, so the design has to produce that number too.

{{panel:pd-power-explorer}}

## What the field is built on

`kva` is root three, 1.7320508076, times `surfaceVolts` times the motor current, divided by 1000. It uses the voltage at the top of the cable, which already contains the drop, and the current the motor draws. `kw` is that same `kva` multiplied by the power factor, which is a caller input defaulting to 0.85 and has no curve behind it.

## The two published cases

Golden electrical case 1: 2481.51704573 V at 33.500000 A gives 143.98680570 kVA, and a power factor of 0.85 gives 122.38878485 kW.

Golden electrical case 2: 1506.44804157 V at 38.220000 A gives 99.72532659 kVA, and a power factor of 0.88 gives 87.75828739 kW.

Case 2 draws more current than case 1, 38.220000 A against 33.500000 A, and still lands at the lower apparent power, because its motor plate is 1300 V against 2400 V. Voltage carries the kVA, and not current alone.

## Where the power factor goes, and where it does not

The power factor enters the step from kVA to kW and nowhere else. The resistive drop of 81.51704573 V on case 1 and 206.44804157 V on case 2 carries no power factor at all, because the current through a conductor heats it whatever its phase relationship to the voltage.

The error this invites is multiplying the drop by 0.85 on the way down the hole. That produces a smaller drop, a smaller surface voltage, a smaller kVA and, on a table of candidate conductors, a different cable. Nothing in the returned object flags it, because the function was handed the answer it was asked for.

## The scale it reaches

The published gate that runs 192 hp of shaft on a 200 hp, 200 A, 4160 V motor puts 192.000000 A down the hole and asks for 4315.302473 V and 1435.070042 kVA at surface. Case 1 asks 143.98680570 kVA. The same three-line calculation covers both, so nothing in the arithmetic tells you which installation is ordinary.

## What it refuses

It knows nothing about the switchboard, the transformer, the surface cabling or the harmonics a variable speed drive puts on the line. The power factor is a constant and not a load curve, so the kW is only as good as the constant handed in, and at part load a real motor's power factor falls away from its plate value. Motor efficiency appears nowhere in the field at all.

## Exercise

Read the kVA and the kW for both golden electrical cases in the panel, then change the power factor on case 1 from 0.85 to 0.88 and record what moved and what did not.

Then say which of the four numbers you have written down would change if the cable temperature rose, and why the power factor is not one of them.
