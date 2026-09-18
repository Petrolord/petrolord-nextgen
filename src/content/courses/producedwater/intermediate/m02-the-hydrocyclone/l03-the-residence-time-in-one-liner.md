# The residence time in one liner

The travel is only half the question. The droplet has a fixed amount of time to make it in, and that time is the simplest quantity in this whole module.

{{panel:pw-device-explorer}}

## Volume over flow

A liner is a tube, so its residence time is its own volume divided by the flow going through it. Nothing else enters.

The KOKORI bank splits 75000 bwpd across 200 liners, which is 0.000690049023 m3/s in each one. The liner volume at the declared bore and length is 0.000673478925 m3. Divide and the residence is 0.975987 s.

Just under a second. Everything a de-oiling liner does, it does in that time, which is why the field has to be as large as it is.

## Both dimensions bite, for different reasons

The bore and the length are both declared, and a reader who wants to understand the device should treat them as two different levers:

| bore m | length m | volume m3 | residence s | travel m | cut micron |
| --- | --- | --- | --- | --- | --- |
| 0.035 | 0.5 | 0.000481056375 | 0.697134 | 0.003624368671 | 5.242462 |
| 0.035 | 0.7 | 0.000673478925 | 0.975987 | 0.003624368671 | 4.430689 |
| 0.035 | 1 | 0.000962112750 | 1.394267 | 0.003624368671 | 3.706980 |
| 0.06 | 0.7 | 0.001979203372 | 2.868207 | 0.006213203436 | 3.383995 |

Read the first three rows and one thing is holding still. The travel column does not move, because the travel is a radial distance and lengthening a tube does not change its radius. A longer liner buys residence time at the same travel, and the cut sizes on those rows are 5.242462, 4.430689 and 3.706980 micron.

The fourth row changes the bore instead, and it moves both columns at once. A wider tube holds more water at the same flow, so the residence goes up. It also puts the wall further from the axis, so the travel goes up. Two effects that pull opposite ways, and the reported cut on that row is 3.383995 micron.

The model settles that race. The residence goes as the SQUARE of the bore, because the liner volume does, while the travel goes only as the bore, so the cut goes as one over the square root of the bore. Swept from 0.01 to 0.1 m of bore at one length, the cut times the square root of the bore is 0.828906 on every row, and one over a square root has no turning point, so no bore is wide enough to start cutting coarser.

## Where the flow per liner comes from

The bank flow never appears in the residence directly. What appears is the flow through ONE liner, the bank flow over the liner count, and that is the quantity the whole next module is about. Add liners and each one sees less water and holds it longer.

## Why this is worth stating

Residence time is where most vendor arithmetic stops. This module carries it as one factor of a calculation whose other factor is a distance, so no geometry change can be read off the residence column alone, and it is the constant product across the bore sweep that says which of the two carried the day.

## Exercise

Take the first three rows of the table and confirm for yourself that residence time and liner length rise together while the travel does not move.

Then say, in one sentence, why the bore is the harder of the two inputs to reason about without the model, and name the quantity that settles it once the model has been run.
