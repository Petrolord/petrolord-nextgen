# Reading one station

A gauge gives a pressure and a temperature. Everything else in a loading check is arithmetic on those two and on numbers somebody chose.

{{panel:pd-droplet-explorer}}

## One published station, end to end

| Quantity | Value | Where it came from |
| --- | --- | --- |
| Pressure | 2500.0 psia | measured |
| Temperature | 620.0 degR | measured |
| z | 0.90 | supplied |
| Gas gravity | 0.65 | supplied |
| Interfacial tension | 60.0 dyne/cm | chosen with the fluid |
| Liquid density | 67.0 lbm/ft3 | chosen with the fluid |
| Gas density | 7.8600381043 lbm/ft3 | computed |
| Terminal droplet velocity | 4.3868983237 ft/s | computed |
| Coleman critical velocity | 4.3868983237 ft/s | computed |
| Turner critical velocity | 5.2642779885 ft/s | computed |
| Turner critical rate through 2.441 in | 2341.162863678 Mscf/d | computed |

## Coleman is the terminal velocity

Those two rows are not a coincidence or a rounding. Coleman applies an adjustment of 1.0000, so the Coleman critical velocity is the terminal velocity with a different name on it. Turner applies 1.2000. The goldens publish both names against the same station so that the identity is visible rather than assumed, and it holds on every one of the twelve published rows. Anywhere a report shows a Coleman velocity and a terminal velocity as two independent results, they are one result printed twice.

## The four numbers are not four measurements

Two of the eleven quantities came off a gauge. Two more were supplied as properties of the gas and two as properties of the liquid, and 60.0 dyne/cm with 67.0 lbm/ft3 are the module's labelled starting points for water rather than a measurement of this well's brine. The five computed values then inherit everything that was assumed, and they print with the same run of decimals as the pressure that was actually read.

## The mistake

Quoting 5.2642779885 ft/s as the velocity in the tubing. It is not a velocity anything is travelling at. It is the velocity the gas would have to reach for a droplet to stop falling, a requirement rather than an observation, and the actual velocity is a separate calculation that needs the flow rate. The same confusion turns 2341.162863678 Mscf/d into a production figure when it is a threshold. Written into a table beside a measured rate, with the same units and more decimal places, it stops looking like a requirement within about a week.

## What it refuses

The station knows nothing about depth. There is no length, no gradient and no other station anywhere in this calculation, so the answer is exact and it is exact about one point in a pipe.

## Exercise

Walk the published station at 2500.0 psia and 620.0 degR through the panel and record all five computed values.

Then split the eleven quantities into measured, supplied and computed, and say which of the three groups you could improve tomorrow.
