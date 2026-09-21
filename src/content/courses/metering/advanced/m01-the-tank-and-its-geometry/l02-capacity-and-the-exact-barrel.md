# Capacity, working capacity and the exact barrel

{{panel:fc-venting-explorer}}

A tank capacity looks like the easiest number on the facility. It is a cylinder. The care in this result is not in the volume itself but in what the engine hands back with it, because every figure it returns is a figure a reader can check rather than assume.

## What the engine returns for this tank

For the OGBOGENE geometry, from a diameter of 62.400000 ft and a shell height of 36.000000 ft, the engine returns:

| quantity | value |
| --- | --- |
| cross section, ft2 | 3058.1520 |
| nominal capacity, ft3 | 110093.4703 |
| nominal capacity, bbl | 19608.4845 |
| working capacity to the design level, bbl | 18845.9323 |
| barrels per foot of shell | 544.6801 |
| cubic feet in a barrel | 5.614583333333333 |

The nominal capacity is the volume to the top of the shell. The working capacity is the volume to the design liquid level, which for this tank is stated at 34.600000 ft. Barrels per foot of shell is the same cross section expressed the way an operator thinks about a gauge, and on this tank it is 544.6801.

## The conversion is returned so it can be checked

The last row is the one worth stopping on. The engine returns the cubic feet in a barrel as 5.614583333333333 rather than burying it. That conversion is exact by definition, and returning it means a reader who suspects the barrels can divide the returned cubic feet by the returned conversion and see whether the two agree.

That is a habit worth carrying into every tool you use. A conversion a package holds privately is a conversion you are trusting on somebody else's word. A conversion the result hands back is one you can audit in a second without reading the source. The tank module does the same thing with the factors behind its venting, which the module on normal venting returns one by one for exactly this reason.

## Which capacity a question wants

The two capacities answer different questions and they are not interchangeable. A venting question is asked against the nominal capacity, because the thermal rate in this package is carried per barrel of capacity and the engine returns a thermal inbreathing of 19608.4845 scfh for this tank. An inventory or a custody question is asked against the working capacity of 18845.9323 bbl, because nobody fills a fixed-roof tank to the top of the shell.

The mistake this distinction exists to prevent is a quiet one. Nothing in a spreadsheet flags it, because the wrong choice is still a capacity of the right tank in the right units. Both figures are volumes in barrels, both are plausible, and a result that used the wrong one still looks like a tank. The next lesson takes the two side by side and quotes the one relation the lab computes between them.

## Exercise

Using only the capacity table in this lesson, describe how you would confirm the nominal capacity in barrels from two other returned figures in that same table. Say which two figures you would use and in which direction.
