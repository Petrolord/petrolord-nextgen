# Intensity and its boundary

{{panel:carbon-inventory-explorer}}

## A total divided by an output

carbonIntensity divides an inventory's tonnes by a denominator, an amount of output, and returns tCO2e per unit of that output. It needs two things besides the inventory: the denominator and the boundary it was measured over. Leave out the boundary and the engine refuses, verbatim:

REFUSED: A boundary must be named. Tonnes per tonne charged and tonnes per tonne of saleable product are different numbers for the same plant, and an intensity without its boundary cannot be compared with anything.

A denominator of 0 or a blank denominator is refused as well: "A positive denominator is required."

## The same inventory over two boundaries

The digest runs the complete Igbogene inventory over two boundaries. Both boundaries and both denominators are invented for this course:

| boundary | denominator | unit | Scope 1 intensity | Scope 2 intensity | total intensity | reportable |
| --- | --- | --- | --- | --- | --- | --- |
| Igbogene flow station and gas plant, inlet to export | 3650000 | tCO2e per barrel of oil equivalent produced | 0.00822761 | 0.00353836 | 0.01176597 | true |
| Igbogene crude export only | 2410000 | tCO2e per barrel of oil exported | 0.01246090 | 0.00535892 | 0.01781982 | true |

The numerator is the same inventory in both rows, 42945.777 tCO2e on "IPCC AR6 GWP100, fossil methane". The boundary and the denominator are what change. Over the whole flow station and gas plant, the total intensity is 0.01176597 tCO2e per barrel of oil equivalent produced. Over crude export only, it is 0.01781982 tCO2e per barrel of oil exported.

Those two figures describe one plant. They differ because they divide by different outputs in different units, and the refusal's own sentence says exactly that: they are different numbers for the same plant.

## The comparability note

The engine attaches a note to the intensity that says what it can be compared with. For the first boundary, verbatim:

"Comparable only with an intensity on the same boundary (Igbogene flow station and gas plant, inlet to export) and the same global warming potential set (IPCC AR6 GWP100, fossil methane)."

The note carries two conditions. The boundary must match, and the GWP set must match. The intensity carries its inventory's set, and the note names it.

## An intensity inherits its inventory's status

An intensity is only as reportable as the inventory under it. With the electricity factor blank, the total intensity over the first boundary is 0.00822761 tCO2e per barrel of oil equivalent produced, reportable false, because: 1 line(s) could not be computed. The division still runs. The status travels with the result, so the intensity says what its inventory says.

In practice, operators and investors compare intensities across companies, and that comparison is sound only where the boundary and the GWP set match, which is what the engine's note states.

In the panel, switch between the two boundaries and read the comparability note change with them. Then step back to a first pass and watch the intensity's reportable flag turn false.

## Exercise

Read the total intensity on the two boundaries and the comparability note. Say what the relationship between 0.01176597 and 0.01781982 shows about comparing two intensities.

Self check: both intensities divide the same 42945.777 tCO2e on the same set. Over the flow station and gas plant, inlet to export, the total is 0.01176597 tCO2e per barrel of oil equivalent produced, and over crude export only it is 0.01781982 tCO2e per barrel of oil exported. The same plant gives two different numbers, so an intensity is comparable only with another on the same boundary and the same GWP set.
