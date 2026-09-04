# The relaxation length

A flowline has a natural length, and the fluid brings it rather than the route. Everything else in a steady state answer is that length compared against the pipe.

{{panel:pd-line-explorer}}

## The length the stream carries

Lc = m Cp / (U pi D). The mass rate and the heat capacity on top, the conductance the wall offers per foot underneath. It is the distance over which the stream gives up 63 percent of the excess temperature it has over ambient, and the length of the actual pipe appears nowhere in it. A relaxation length is a property of a fluid moving through a pipe, not of a route.

## Three published cases, computed twice each

All three run through the published insulated build on the 6.065 in bore, with the golden U at 1.334879072040 Btu/(hr ft2 degF).

| Mass rate, lb/hr | Cp, Btu/(lb degF) | Golden Lc, ft | Engine Lc, ft |
| --- | --- | --- | --- |
| 60000.0 | 0.50 | 14154.02315291 | 14154.02305043 |
| 120000.0 | 0.50 | 28308.04630582 | 28308.04610085 |
| 120000.0 | 0.60 | 33969.65556698 | 33969.65532102 |

Each row parts company at the ninth figure, a relative difference of 7.240504e-9 on all three. That is the oracle working in metres and watts and converting once at the boundary, not a disagreement about physics.

## Linear where you would guess it

Doubling the mass rate doubles the relaxation length: the second case over the first is 2.0000000000 against a mass rate ratio of 2.0000000000. Raising the heat capacity gives 1.2000000000 against a Cp ratio of 1.2000000000. Exactly, both times, because m and Cp sit alone on the numerator.

U enters from the other side. Carrying the same 120000.0 lb/hr at Cp 0.5 through the three published builds of one pipe gives, as derived runs on published inputs, 356.55635841 ft at the bare U of 105.9799311355, 28308.04522908 ft at the insulated U of 1.3348791131, and 52983.47772700 ft at the buried U of 0.7132000377.

## What it refuses, and how quietly

`relaxationLengthFt` returns a bare NaN for a zero U, a zero mass rate and a zero heat capacity. Not an object, no ok flag, no message, no note. A caller who checks `ok` gets nothing to check. The NaN then divides into ntu, the exponential swallows it, and a profile comes back with a NaN in every station rather than a refusal at the top.

## The careful mistake

Reading Lc as a distance the line is allowed to run. It is a scale, and a line at half of one relaxation length and a line at four of them are the same problem read at different points. The second mistake is quieter: Lc is exactly inverse in the bore diameter, so it carries whatever diameter the U was quoted against, and a U referred to a coated outside diameter handed in with a bore gives a relaxation length wrong by the ratio of the two.

## Exercise

Run the published fluid at 60000.0 lb/hr and then at 120000.0 lb/hr on the insulated build and record both relaxation lengths.

Then say what happens to a 26400.0 ft line when the rate doubles, and whether the answer depends on the length at all.
