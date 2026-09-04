# Nameplate and derate

A submersible motor nameplate is three numbers: power, volts and amps, all at full load. A thrust derate changes none of them and changes what you are allowed to ask for.

{{panel:pd-power-explorer}}

## The plate is data, not a result

The shipped catalogue carries five motors. These are published catalogue entries, not computed results.

| Motor | Power, hp | Voltage, V | Current, A | Series OD, in |
| --- | --- | --- | --- | --- |
| m-60-1000 | 60 | 1000 | 38 | 4.56 |
| m-100-1300 | 100 | 1300 | 49 | 4.56 |
| m-150-2000 | 150 | 2000 | 48 | 5.43 |
| m-250-2400 | 250 | 2400 | 67 | 5.43 |
| m-400-3300 | 400 | 3300 | 78 | 5.62 |

Read the current column against the power column. The 150 hp motor draws 48 A while the 100 hp motor draws 49 A, and the 400 hp motor draws 78 A. Amps do not track horsepower here, because voltage is doing the work: 1300 V against 2000 V against 3300 V.

## The derate cuts the rating, not the machine

A thrust derate says how much of the plate is usable in the running condition. The derating factor is one minus the derate: 1.0000 at 0 percent, 0.9500 at 5, 0.9200 at 8, 0.9000 at 10, 0.8800 at 12, 0.8500 at 15 and 0.8000 at 20.

The published selection rule divides the required horsepower by that factor, which is the same as measuring utilisation against the usable rating rather than the plate. On the published gassyOffshore design, 125.69771587 hp of shaft on a 250 hp plate, the selection load fraction reads 0.5027908635 at no derate and 0.6284885794 at 20 percent.

Nothing about the motor moved between those two numbers, and nothing about the pump moved either. The shaft still needs 125.69771587 hp.

## What it refuses

It refuses to supply a plate. Motor current computed with a nameplate power of zero returns NaN, and with a nameplate current of zero returns NaN. The plate is an input and the engine will not guess a motor for you.

It also refuses to model the machine's insides. No efficiency curve and no power factor curve exists in the module. The power factor at the surface is supplied: 0.85 on golden electrical case 1, 0.88 on case 2.

## The mistake

Reading a derate as a statement about load. A design that reports 0.6284885794 at a 20 percent derate has not become busier than one reporting 0.5027908635. It is the same shaft power against a smaller allowance, and carrying the derated figure into an amps calculation overstates the current, because current follows the shaft and not the allowance.

## Exercise

Read the selection load fraction for the published gassyOffshore design at 0, 10 and 20 percent derate, and write the shaft horsepower beside each.

Then find the two catalogue motors whose nameplate currents are within a few amps of each other and say what makes their horsepower differ.
