# The units it works in

Gas arrives in MMscfd, liquid in bpd, pressure in psig and psia, temperature in degF, dimensions in ft and retention in minutes. Every conversion between them happens inside the engine.

{{panel:fc-separator-explorer}}

## The six units and what carries them

| quantity | unit | an example |
| --- | --- | --- |
| gas rate | MMscfd | 110.000000 |
| liquid rate | bpd | 3000.000000 |
| pressure in | psig | 600.000000 |
| pressure computed with | psia | 614.700000 |
| temperature | degF | 95.000000 |
| dimensions | ft | 2.052551 |
| retention | minutes | 3.000000 |

The two pressures are the pair that causes trouble, because both are pressures and both print as numbers around six hundred.

## Gauge and absolute

A gauge pressure is read against the atmosphere. An absolute pressure is read against nothing. The gas law needs the second, so 600.000000 psig becomes 614.700000 psia by adding 14.7, and 350.000000 psig becomes 364.700000 psia.

A 14.7 error in six hundred looks small and it is not. It runs into Ppr, then z, then the gas density, then the settling velocity and the diameter. The vessel that comes out is plausible, which is the problem.

## Temperature the same way

Temperature has the same pairing. The correlations work in degrees Rankine, so the ABANA conditions of 95.000000 degF become 554.670000 degR by adding 459.67. Nothing in the method takes Fahrenheit directly.

## Rates into volumes

A gas rate in MMscfd is a daily volume at standard conditions. To become a velocity it has to be a volume per second at vessel conditions. The first half of that is arithmetic: 110.000000 MMscfd is 1273.148148 standard ft3/s, the rate times a million over the 86400 seconds in a day. The second half is physics and needs the pressure, the temperature and z.

Liquid takes the same journey through a different constant. A retention volume is a liquid rate in bpd, converted by 5.614583333333333 ft3 per barrel and by the 1440 minutes in a day, held for the retention time: 3000.000000 bpd held 3.000000 minutes is 35.091146 ft3.

## Where the units meet the geometry

Once everything is in ft3 per second, ft per second and ft, the geometry is ordinary. A rate in ft3/s over an area in ft2 gives a velocity in ft/s, and a volume in ft3 over an area gives a height in ft. Slenderness is a length over a length and carries no unit, which is why the L/D of 8.090042 on the gas-sized ABANA-1 vessel is a bare number.

## The mistake

Writing psia where the input asked for psig. Handing 614.700000 to the K lookup derates against a pressure the vessel does not see. Both numbers are real and both belong to the same vessel, so the label is the only thing that tells them apart.

## Exercise

Convert 600.000000 psig and 350.000000 psig to psia, and 95.000000 degF to degR. Then take 110.000000 MMscfd to 1273.148148 standard ft3/s and say what else is needed before it becomes a velocity, and take 3000.000000 bpd held 3.000000 minutes to 35.091146 ft3.
