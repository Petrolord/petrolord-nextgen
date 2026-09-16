# Actual inlet volume

A compressor does not move standard cubic feet. It moves whatever volume the gas occupies at the flange, and that volume is what decides the size and the type of the machine.

{{panel:fc-compressor-explorer}}

## The same rate, seven suctions

Hold the SOKU rate, gas and temperature and move only the suction pressure:

| suction psia | actual inlet acfm |
| --- | --- |
| 30.000000 | 9555.2490 |
| 60.000000 | 4758.4333 |
| 92.000000 | 3090.0016 |
| 150.000000 | 1880.4357 |
| 300.000000 | 921.2989 |
| 600.000000 | 442.2902 |
| 1200.000000 | 204.9510 |

Every row is the same molar flow. At the SOKU suction of 92.000000 psia the inlet volume is 3090.0016 acfm.

## Why it falls with pressure

The rate in MMscfd is a molar quantity dressed as a volume, measured at a standard pressure and temperature that no part of the plant is at. Turning it into the volume the machine actually swallows means putting the moles back at the real pressure, the real temperature and the real compressibility. Raise the pressure and the same moles occupy less space.

That is why a low-pressure gathering duty and a high-pressure booster with identical MMscfd figures are not remotely the same machine. One of them is a large low-pressure casing and the other is a small high-pressure one.

## What the inlet volume carries

Three things go into it and all three matter. The absolute pressure, because that is what compresses the gas. The absolute temperature, because a hotter gas at the same pressure occupies more. And the compressibility at that state, because a real gas is not an ideal one, and the engine evaluates z at the suction rather than assuming it.

The standard base is a property of the module rather than of the duty. The ratio of the standard pressure to the standard temperature that this function uses is 0.028279485058 psia per degR, and that quotient is all the volume route reveals about its base from outside. The mass-flow route in the same module reaches the same quotient, with a difference of 0, so one MMscfd is one molar quantity here whether it becomes a mass flow or an inlet volume.

## The mistake

The mistake is screening a machine on MMscfd. A rate says nothing about casing size until it has been put at the suction conditions, and two duties with the same rate can land on opposite sides of every threshold a screen uses.

The second mistake is the standard-condition mix-up: taking a rate quoted at one standard base and putting it through a module that uses another. It never announces itself, because a base error is a small multiplicative shift and the answer stays plausible. Reading the base a module actually carries, as this one can be read from outside, is what settles it.

## Exercise

Give the inlet volume at the SOKU suction and say what happens to it as the suction pressure rises, quoting two rows from the table. Then name the three inputs the inlet volume is built from, and say why a machine cannot be screened from a rate in MMscfd alone.
