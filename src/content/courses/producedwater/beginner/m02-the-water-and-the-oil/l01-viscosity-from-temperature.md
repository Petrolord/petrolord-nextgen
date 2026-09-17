# Viscosity from temperature

Viscosity is the resistance a droplet feels on its way up through the water, and it is the first place a stated temperature earns its keep. A stream sampled at one temperature and treated at another is a different treating duty, and this is the number that says so.

## The fit, and the sweep it gives

The engine takes fresh water viscosity from a fit in temperature and then applies a salinity factor to it. Run the UZERE salinity of 62000 ppm TDS across six temperatures and the whole picture is one column:

| degC | fresh Pa.s | salinity factor | brine Pa.s |
| --- | --- | --- | --- |
| 20 | 0.001001748759 | 1.111600 | 0.001113543921 |
| 35 | 0.000718491238 | 1.111600 | 0.000798674860 |
| 50 | 0.000544160005 | 1.111600 | 0.000604888262 |
| 65 | 0.000429838208 | 1.111600 | 0.000477808153 |
| 80 | 0.000350993313 | 1.111600 | 0.000390164166 |
| 95 | 0.000294350524 | 1.111600 | 0.000327200043 |

The salinity factor is the same on every row because the salinity did not move. Everything that changes down that table is temperature, and the fresh column and the brine column move together because one is a fixed multiple of the other.

## What the thinning is worth

Across that sweep the water thins by a factor of 3.403251, taking the brine viscosity at each temperature against the value in the last row. That is a large number for a property people quote as though it were a constant of the fluid. A Stokes rise velocity goes as one over the viscosity, so the same basin at the top of that table and at the bottom of it is catching a very different droplet out of the same water.

## Where this bites in practice

Two consequences follow, and both of them are design decisions rather than curiosities. The first is that a treating train sized on a summer sample and run on winter water is not the train that was sized. The second is that heat is a treating variable in its own right: raising the temperature of produced water upstream of a separator does real work on the droplets, and the size of that work is readable in the table above rather than a matter of opinion.

## The shape of the fit, and its edges

The temperature fit is the ordinary three-constant form, with a coefficient, a numerator and an offset, and all three of those sit in the module's declared constants where a reviewer can find them. They are declared rather than derived, which means this repository carries nothing to check them against, and the engine says so about itself. The module also states the range the water viscosity fit holds over, so a temperature outside it comes back with the engine saying which limit was crossed rather than quietly extrapolating.

{{panel:pw-water-explorer}}

## Exercise

Read the brine column of the table and say how the treating duty changes between 20 and 95 degrees on the same water. Then explain why the salinity factor column repeats the value 1.111600 on every row, and what would have to change in the inputs for that column to move.
