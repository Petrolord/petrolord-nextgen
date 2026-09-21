# Isentropic, inside the vessel

The gas that leaves is gone. The gas that stays behind has to fill the same volume at a lower pressure, and it does that by expanding, and expanding costs it temperature. Nothing heats it back up, because this march gives the vessel no heat in from the metal or the surroundings. That is the inside half of the march and it is the half that sets the end state.

{{panel:fc-blowdown-explorer}}

## The two model decisions, stated

The expansion is taken as isentropic with the stated isentropic exponent, and the compressibility is held constant along the whole path at the value the caller states. Both are decisions rather than results, and the audit module names them as such. The validation oracle makes the same two on purpose, which means the published cases check the march and leave the thermodynamics alone.

It answers how long the hole takes to do its work. It does not answer what the real fluid does on the way down.

## Where AFIESERE arrives

| station | time s | pressure psia | temperature degR |
| --- | --- | --- | --- |
| 0 | 0.000000 | 1240.000000 | 545.000000 |
| 5 | 50.000000 | 798.734021 | 495.006596 |
| 10 | 100.000000 | 524.991018 | 451.589391 |
| 15 | 150.000000 | 351.480172 | 413.643606 |
| 20 | 200.000000 | 239.318504 | 380.287079 |
| 25 | 250.000000 | 165.495773 | 350.808529 |
| 27 | 268.419002 | 145.000000 | 340.807983 |

Those rows are drawn from the listing of every tenth station, which lands at intervals of ten seconds, and this table keeps every fifth row of it. The vessel starts at 545.000000 degR and finishes at 340.807983 degR, which is -118.862017 degF. The pressure falls at every one of the 270 stations and the vessel gets colder all the way down.

## What the end state is fixed by

The final temperature follows from the pressure ratio across the whole blowdown and the isentropic exponent. It does not follow from the orifice, and the next module proves that by sweeping the orifice and counting the distinct final temperatures it produces.

This is worth holding onto, because it inverts the intuition a relief valve builds. On a valve, a bigger orifice is a bigger answer to the same question. On a blowdown, a bigger orifice changes only the clock. The cold end is already decided by the two pressures you chose.

## Reading the table honestly

Each row carries a time, a pressure and a temperature, and the course prints no ratio between any two of them. Divide one pressure by another and you have produced a figure nothing here stands behind. The relationship between the pressures and the temperatures along an isentrope exists, but this course prints it nowhere, so a reader who wants it derives it and says so.

Read the columns for direction instead. Both fall, and neither turns. The pressure falls faster early, because the rate through a choked orifice scales with the upstream pressure and the upstream pressure is highest at the start. The temperature column follows it down for the same reason, since the temperature here is carried by the pressure through the isentropic relation and by nothing else. That is the whole of the inside half.

## Exercise

Name the two model decisions this march makes and say what the validation oracle does about each. Record the start and final temperatures in degR, the final temperature in degF, and the number of stations returned. Then say what the final temperature is fixed by, and write one sentence explaining why a reader should not divide two temperatures from the trajectory table.
