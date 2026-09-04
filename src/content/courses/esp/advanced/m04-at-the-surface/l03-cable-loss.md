# Cable loss

Some of the power that leaves the switchboard never reaches the motor. It heats the cable instead, and the amount is a square law.

{{panel:pd-power-explorer}}

## The field

`lossKw` is three times the current squared, times the conductor resistance at the cable temperature, times the length in thousands of feet, divided by 1000 to land in kW. It uses the same corrected resistance the voltage drop uses, so both numbers move together with well temperature.

## The two published cases

| Case | Current, A | Length, ft | Ohms per 1000 ft | Loss, kW | Loss as a percentage of the real power |
| --- | --- | --- | --- | --- | --- |
| Golden electrical case 1 | 33.500000 | 7200 | 0.1951239150 | 4.72992077 | 3.864668 |
| Golden electrical case 2 | 38.220000 | 6000 | 0.5197664067 | 13.66665016 | 15.573059 |

Case 2 runs the shorter cable and loses far more of a smaller load: 13.66665016 kW against a real power of 87.75828739 kW, where case 1 loses 4.72992077 kW against 122.38878485 kW. The current difference is 38.220000 A against 33.500000 A. The conductor and the temperature did the rest, 0.5197664067 ohms per 1000 ft against 0.1951239150.

## The square is where the surprises live

Loss goes as the square of the current while the voltage drop goes as the current itself, so the two do not warn you at the same time. The published gate that runs 192.000000 A down 6 AWG has a drop of 3.733233 percent, comfortably inside the 5 percent limit that selects the cable, and loses 51.646421 kW as heat in the process. The number that would have refused that pick is not the one being checked.

## The circle nobody closes

`cableTempF` is an input. The engine takes it, corrects the copper resistance to it, and returns the watts that would be dissipated. Those watts are exactly what would set the cable temperature, and nothing feeds them back. A colder assumed temperature gives a lower resistance, a lower loss and a lower drop, and the result is self-consistent and wrong in the direction that flatters the design. The same 2 AWG conductor is 0.1593000000 ohms per 1000 ft at 77 degF and 0.2194702650 at 250 degF, a multiple of 1.37771667, so the assumption is worth a great deal.

## What it refuses

It is conductor loss and only conductor loss. There is no armour, no dielectric loss, no splices, no motor lead extension and no surface cabling in it. It also refuses to say what the heat does: it returns kW, not a conductor temperature, not an insulation life and not a derating.

## Exercise

Read the loss for both golden electrical cases in the panel, then raise case 1's cable temperature to 250 degF and record the new resistance, the new drop and the new loss.

Then say why the drop and the loss moved by the same multiple, and why a drop check that passes is not evidence that a cable is carrying its current comfortably.
