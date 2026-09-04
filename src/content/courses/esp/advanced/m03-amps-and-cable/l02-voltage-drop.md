# Voltage drop

The drop is a resistive loss down copper. The two things most often got wrong are the temperature of that copper and which voltage the percentage is taken against.

{{panel:pd-power-explorer}}

## Root three, amps, ohms, thousands of feet

The three phase drop is 1.7320508076 times current times conductor resistance times length in thousands of feet. Power factor does not appear: it belongs to the apparent power at the surface.

Golden electrical case 1 runs 33.500000 A down 7200 ft of 2 AWG at 180 degF. The conductor reads 0.1951239150 ohms per 1000 ft there, the drop is 81.51704573 V, and against a 2400 V nameplate that is 3.39654357 percent, so the surface must supply 2481.51704573 V.

Golden electrical case 2 runs 38.220000 A down 6000 ft of 6 AWG at 210 degF. The conductor reads 0.5197664067 ohms per 1000 ft, the drop is 206.44804157 V, and against a 1300 V nameplate that is 15.88061858 percent, for 1506.44804157 V at the surface.

## Copper gets worse with heat, by a known slope

The correction is a linear coefficient of 0.0021833333 per degF referenced to 77 degF. On 2 AWG that reads:

| Temperature, degF | Ohms per 1000 ft | Multiple of the 77 degF value |
| --- | --- | --- |
| 77 | 0.1593000000 | 1.00000000 |
| 100 | 0.1672995150 | 1.05021667 |
| 140 | 0.1812117150 | 1.13755000 |
| 180 | 0.1951239150 | 1.22488333 |
| 220 | 0.2090361150 | 1.31221667 |
| 250 | 0.2194702650 | 1.37771667 |

A design that quotes the catalogue value straight off the shelf at a 250 degF well is understating the resistance by more than a third of itself.

## The percentage has a specific denominator

The drop percentage is taken against the motor nameplate voltage. Golden electrical case 1 divides 81.51704573 V by 2400 V. It is not taken against the surface voltage of 2481.51704573 V, and the two denominators do not give the same answer.

## What it refuses

It refuses to model anything but resistance. No reactance, no skin effect, no capacitance, so the number is a direct current style drop with a temperature correction on it.

It also refuses to size anything. The drop is computed for whatever conductor it is given, including one whose current rating would forbid it, and 15.88061858 percent comes back with no complaint attached.

## The mistake

Two of them, and both flatter the design. Using the 77 degF resistance downhole understates the drop, on 2 AWG by the multiple the table gives for the well temperature. Taking the percentage against the surface voltage rather than the nameplate understates it again, the surface voltage being the larger. Both survive review, because the arithmetic in each is faultless.

## Exercise

Reproduce the drop for golden electrical case 1 from the current, the corrected resistance, the length and the root three factor.

Then recompute its percentage against the surface voltage instead of the nameplate, and say which of the two figures a 5 percent limit is meant to be compared with.
