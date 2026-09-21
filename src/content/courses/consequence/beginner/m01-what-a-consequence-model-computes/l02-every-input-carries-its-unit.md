# Every input carries its unit

{{panel:cq-release}}

Read the argument names of any function in this engine: `massRateKgS`, `holeDiameterM`, `upstreamPressurePa`, `windSpeed10mMS`. Each name carries its unit, and the engine reads the unit from the name. It never converts a unit it was not asked to. That is the second declared choice, and it removes a whole family of silent mistakes. There is no field called plain pressure that might hold bar, psi or pascals depending on who typed it.

## The suffixes this tier meets

The suffixes, for the fields the Associate functions use:

| suffix in the argument name | unit | an example argument |
| --- | --- | --- |
| KgS | kilograms per second | `massRateKgS` |
| M, M2, M3 | metres, square metres, cubic metres | `holeDiameterM`, `bundAreaM2`, `spillVolumeM3` |
| Pa | pascals, ABSOLUTE for a pressure | `upstreamPressurePa`, `ambientPressurePa` |
| K | kelvin | `upstreamTemperatureK` |
| KgMol, GMol | kilograms per mole (source terms), grams per mole (concentrations) | `molarMassKgMol`, `molarMassGMol` |
| MS, 10mMS | metres per second; the 10m form is the wind at 10 m | `windSpeedMS`, `windSpeed10mMS` |
| Ppm, MgM3 | parts per million by volume, milligrams per cubic metre | `concentrationPpm`, `concentrationMgM3` |

Read a name before you type a value into it. The wind that drives pool evaporation is the wind at 10 m, and its field says so. The wind in the plume is a plain wind speed in metres per second.

## Two molar mass units

One quantity appears in two units, and it is the trap most worth remembering. The source terms take kilograms per mole: methane is typed as 0.01604 in `molarMassKgMol`. The concentration functions take grams per mole: carbon monoxide is typed as 28.01 in `molarMassGMol`. Each convention follows the calculation it serves. A gas outflow works in SI units throughout, while exposure limits and conversions between ppm and mg/m3 are conventionally written in grams per mole.

The engine reminds you which unit it wants when it refuses a molar mass on the source term side:

> molarMassKgMol: must be a molar mass above 0 kg/mol (hydrogen is 0.002016)

The hydrogen figure in that message shows the size a kilogram per mole value takes. A value typed in the wrong unit is still a positive number, so the engine has no ground to refuse it. The name on the field is your only guard, and the panel labels repeat the unit for that reason.

## Pressures are absolute

Every pressure is absolute. Ambient is `ATM_PA`, 101325 Pa, unless a call states otherwise. The AMENAM crude line used through the next module carries a pressure above the liquid of 200000 Pa absolute.

A gauge pressure typed where an absolute one is due understates the driving pressure by one atmosphere. The engine cannot catch this for you, because a gauge reading is still a sensible looking number of pascals. On a liquid line the slip can change a flowing hole into a refusal, since a pressure at the hole that does not exceed ambient means nothing flows out.

## Exercise

On the liquid part of the outflow view, keep the head at 6 m and run the AMENAM line twice: with the pressure above the liquid at 200000 Pa, then at 101325 Pa. Check your two driving pressures and mass rates against these rows of the engine's ullage ladder:

| pressure above the liquid Pa, stated | driving pressure Pa | mass rate kg/s |
| --- | --- | --- |
| 101325 | 50013.915000 | 11.225132 |
| 200000 | 148688.915000 | 19.354651 |

Now type 0 into the same field, as someone reading a gauge at atmospheric pressure might, and read what the engine returns. Write one sentence explaining the result in terms of absolute pressure.
