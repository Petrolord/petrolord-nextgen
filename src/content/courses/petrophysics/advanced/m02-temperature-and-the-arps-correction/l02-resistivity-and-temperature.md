# Resistivity and temperature

Before the correction formula arrives in the next lesson, it is worth owning the physics well enough that the direction and rough size of the correction are automatic. An expert who has to consult a formula to know whether hot water is more or less resistive than cold water is one wrong keystroke away from booking the wrong pay.

## How brine conducts

Formation water is a salt solution, and it conducts electricity by ionic transport: dissolved Na+ and Cl- ions drift under the applied field and carry the current. Two things set how much current flows at a given salinity: how many ions are available, and how fast they can move. Salinity fixes the first. Temperature controls the second, because the ions move through a viscous medium and the water's viscosity falls steeply as it heats up. Warmer water is thinner, the ions drift faster for the same field, conductivity rises, and resistivity falls.

This is the whole story in one line: **heating brine lowers its resistivity**. Nothing about the rock is involved yet; this is a property of the water alone, which is why a bench measurement at 75 degF says nothing directly about the same water at 180 degF.

## The size of the effect

The effect is not a nuisance correction of a few percent. Over the temperature ranges that separate a laboratory from a reservoir, resistivity changes by factors. The empirical behaviour for NaCl solutions is close to inverse proportionality on an offset temperature scale: resistivity varies roughly as $1/(T + 6.77)$ with $T$ in degF. Double the offset temperature and you roughly halve the resistivity.

The typewell sample makes the point concretely. The offset temperatures are $75 + 6.77 = 81.77$ at the bench and $180 + 6.77 = 186.77$ in the formation, a ratio of about 2.28. So the sample that measures 0.114 ohm.m on the bench is expected to read

$$0.114 \div 2.28 \approx 0.050 \ \text{ohm.m}$$

in the formation: less than half the lab value. An interpreter who typed the raw 0.114 into Archie would overstate Rw by a factor of 2.28, and since Archie saturation scales as the square root of Rw, every Sw in the well would come out about $\sqrt{2.28} = 1.51$ times too high. That factor is the entire subject of module 5.

## Direction checks you should never skip

Three sanity habits, each one line:

* **Hotter means lower Rw.** A corrected formation Rw must always be smaller than its cooler lab value. If your correction made the number bigger while the temperature went up, the ratio is upside down.
* **Same temperature, same Rw.** Comparing two waters, or a water against a catalog, is only meaningful at a common temperature. Catalogs and lab reports quote a reference temperature for exactly this reason; read it before you compare anything.
* **Rough magnitude first.** Estimate the offset-temperature ratio in your head before computing. If the formal answer disagrees with the mental estimate by more than a few percent, find the arithmetic slip.

## Why this matters for the triangulation

The Expert workflow cross-checks three Rw routes against each other: the corrected lab sample, the SP quicklook, and the Pickett fit from the Professional tier. The comparison is only fair if all three speak at the same temperature. The Pickett fit reads the formation directly, so it is already at formation temperature. The SP conversion uses a coefficient that depends on formation temperature. And the lab sample must be corrected from bench to formation before it can join the conversation. Temperature discipline is what makes the three routes commensurable; without it the triangulation would be comparing apples at three different orchards.

## Worked example

Predict, without the full formula, roughly what the typewell sample should read at 140 degF:

1. Offset temperatures: $75 + 6.77 = 81.77$ and $140 + 6.77 = 146.77$.
2. Ratio: $146.77 / 81.77 = 1.79$.
3. Expected resistivity: $0.114 / 1.79 \approx 0.064$ ohm.m.

The exact engine value in the next lesson is 0.0635 ohm.m, so the one-line estimate is already within a percent or two. This is the level of mental arithmetic an expert runs continuously while reading a log.

## Exercise

The same sample is to be corrected to 100 degF. Estimate the answer by the offset-ratio method: $106.77 / 81.77 = 1.306$, so $0.114 / 1.306 \approx 0.087$ ohm.m. State in one sentence why a corrected Rw larger than 0.114 would be physically impossible for any temperature above 75 degF, and in one more sentence why comparing your result against a catalog value quoted at 75 degF would be meaningless without converting one of them.
