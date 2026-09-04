# Surface voltage

The motor has to see its nameplate voltage at the bottom of the cable, so the switchboard has to present more than that at the top. How much more is one subtraction the other way.

{{panel:pd-power-explorer}}

## The field is a sum of two things

`surfaceRequirement` returns `surfaceVolts` as the nameplate voltage plus the three-phase resistive drop, and nothing else is in it. The drop is root three, 1.7320508076, times the current, times the conductor resistance at the cable temperature, times the length in thousands of feet. Power factor does not appear.

## Two published cases

Golden electrical case 1: 125.00 hp of shaft on a 250 hp, 2400 V, 67 A motor draws 33.500000 A. The cable is 7200 ft of conductor rated 0.1593 ohms per 1000 ft at 77 degF, running at 180 degF, which corrects to 0.1951239150 ohms per 1000 ft. The drop is 81.51704573 V, or 3.39654357 percent of plate, and the surface voltage is 2481.51704573 V.

Golden electrical case 2: 78.00 hp on a 100 hp, 1300 V, 49 A motor draws 38.220000 A. The cable is 6000 ft of conductor rated 0.4028 ohms per 1000 ft at 77 degF at 210 degF, which corrects to 0.5197664067. The drop is 206.44804157 V, 15.88061858 percent of plate, and the surface voltage is 1506.44804157 V.

## The temperature is not a detail

Copper resistance is corrected from a 77 degF reference at 0.0021833333 per degF, so the same 2 AWG conductor is a different cable at every well temperature.

| Cable temperature, degF | Ohms per 1000 ft | Multiple of the 77 degF value |
| --- | --- | --- |
| 77 | 0.1593000000 | 1.00000000 |
| 140 | 0.1812117150 | 1.13755000 |
| 180 | 0.1951239150 | 1.22488333 |
| 250 | 0.2194702650 | 1.37771667 |

The current is identical at every row. Only the conductor changed, and the drop and the surface voltage moved with it.

## The mistake

Reading `surfaceVolts` as a design that exists. Case 2 returns 1506.44804157 V with exactly the confidence case 1 returns 2481.51704573 V, and case 2's drop is 15.88061858 percent against a default selection limit of 5 percent. The voltage is still computed, in full precision, for a cable no method would accept. `dropPct` is the field that judges. `surfaceVolts` only reports.

## What it refuses

It carries no transformer taps, no reactance, no starting current and no voltage unbalance. It is a resistive drop on a steady current. It also never checks that the motor sees the plate, because the current it used came from scaling the plate by the load fraction in the first place: the assumption is upstream of the answer.

## Exercise

Take golden electrical case 1 in the panel and move the cable temperature from 77 degF to 180 degF to 250 degF, writing the resistance and the surface voltage at each.

Then say in one sentence why the current did not move, and which of the three surface voltages a switchboard would have to be bought for.
