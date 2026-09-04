# What density decides

Gas density is the only station property inside the droplet balance, and it enters as one over its square root.

{{panel:pd-droplet-explorer}}

## Six densities serve twelve rows

The published table crosses two fluids with three pressures and two temperatures. The fluid changes the tension and the liquid density, and it changes neither of these:

| Pressure, psia | Temperature, degR | Gas density, lbm/ft3 | Water terminal velocity, ft/s |
| --- | --- | --- | --- |
| 300.0 | 540.0 | 1.0829385833 | 12.1435923634 |
| 300.0 | 620.0 | 0.9432045725 | 13.0189530541 |
| 1000.0 | 540.0 | 3.6097952775 | 6.5866393859 |
| 1000.0 | 620.0 | 3.1440152417 | 7.0706235386 |
| 2500.0 | 540.0 | 9.0244881938 | 4.0737980096 |
| 2500.0 | 620.0 | 7.8600381043 | 4.3868983237 |

The twelve rows carry six densities between them, because a density knows the pressure, the temperature, the compressibility factor and the gas gravity, and knows nothing about the liquid it is being asked to carry.

## The two directions

Pressure raises density and temperature lowers it, which is what `p / (z T)` says. Across the published span the density moves from 0.9432045725 to 9.0244881938 lbm/ft3, and the water terminal velocity moves the opposite way, from 13.0189530541 down to 4.0737980096 ft/s. High pressure gas carries liquid at a lower velocity than low pressure gas, which is the single most useful thing to know about loading, because it says a well gets worse at carrying liquid as it depletes even though its liquid never changed.

## Temperature is not a rounding error

At 2500.0 psia, going from 540.0 degR to 620.0 degR moves the density from 9.0244881938 to 7.8600381043 lbm/ft3 and the velocity requirement from 4.0737980096 to 4.3868983237 ft/s. A wellhead temperature taken from a memory of last month is worth that much, and it is worth it in the direction that flatters, because a temperature guessed too high makes the gas look lighter and the requirement look easier than it is.

## The mistake

Chasing precision in the liquid properties while accepting the station temperature as given. The gas density carries a minus one half power, and it is the only term in the balance a station actually measures. The other two terms come in at a quarter power and neither of them is measured at all.

## What it refuses

The density calculation has no idea what the pipe is, how deep the station is, or what rate is flowing. Hand it a pressure and a temperature and it returns a density, and it will do so for any pair, including a pressure and a temperature that could never occur together in one wellbore.

## Exercise

Record the six published densities and mark which two inputs changed for each step.

Then say what the density does when the temperature rises, and what the terminal velocity does in response.
