# Hotter is not always faster

{{panel:fc-rate-explorer}}

Raise the temperature on a carbon dioxide corrosion calculation and the reaction term climbs. On a real line the metal loss does not climb for ever, because iron carbonate plates out on the steel and the layer it forms slows the attack down. A naive extrapolation of the low temperature equation gets that exactly backwards, and it does so in the direction that looks safe on a screen and is not.

The engine handles it with a multiplier on the rate. Below a computed onset the multiplier is exactly one and the rate behaves as the correlation says. Above the onset the multiplier falls, and it falls fast enough to turn the rate downward with further heating.

## The turn, on one of the engine's own streams

Hold everything fixed and walk the temperature up. At 40.000000 C the multiplier is 1.000000000000 and the rate is 1.270135 mm/yr. At 55.000000 C the multiplier is still 1.000000000000 and the rate is 1.401052 mm/yr. At 70.000000 C the multiplier is still one and the rate is 1.508421 mm/yr, which is the highest of the three.

Then the film is credited. At 85.000000 C the multiplier is 0.820838044032 and the rate is 1.311185 mm/yr. At 100.000000 C it is 0.435371430361 and the rate is 0.728051 mm/yr. At 115.000000 C it is 0.242520118987 and the rate is 0.421113 mm/yr. At 130.000000 C it is 0.141105882050 and the rate is 0.252905 mm/yr, and at 150.000000 C it is 0.072757985058 and the rate is 0.135116 mm/yr.

Read the rate column as a whole. It rises, turns and then falls, and the turn is the film arriving rather than the chemistry slowing.

## What is held in that story

Three scale constants sit behind the multiplier and all three carry no source in this repository. So does the temperature at which the published correlation turns protective, which is a separate question from the onset this engine computes. Both are held for literature, so the shape above is what this module does and the position of the turn is something the module cannot defend with a citation.

There is a second caution that matters more on a real line. A film credited by a correlation is a film the flow has to leave in place, and this module handles that question separately through the wall shear.

One practical consequence follows for anyone reading a screening from a hot line. A rate that looks reassuringly low at high temperature is carrying a film credit inside it, and that credit rests on constants nobody here can source. Record the multiplier beside the rate whenever it is below one, so the next reader can see how much of the answer it is carrying.

## Exercise

Walk the temperature from 40.000000 C to 150.000000 C on the panel and write the multiplier and the rate at each of the eight steps above. Mark the step where the multiplier first leaves 1.000000000000 and the step where the rate stops rising, and say whether they are the same step. Then state what you would need in hand before quoting the turn in that column to a colleague.
