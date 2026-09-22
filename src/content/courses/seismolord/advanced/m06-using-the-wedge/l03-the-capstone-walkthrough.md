# The capstone walkthrough

> **Open book, in part.** Some of the figures this capstone grades can be read in this tier's lessons or on a panel as it opens, so for now those check that you can find, read and report them correctly. A later update takes them out of the lessons and panels.

The capstone asks for six numbers. Five are read off the panel and one is calculated. This lesson walks the whole exercise in the order that produces the fewest mistakes, works each reading on a 15 Hz run of the same wedge, which is where the panel opens, and names the errors that lose fields.

{{panel:sl-wedge-explorer}}

## What is being asked

Model the SAND top and base as an equal and opposite reflection pair, $+0.08$ at the top and $-0.08$ at the base, in a wedge running from 0 to 60 ms at a 2 ms sample rate. Read the tuning panel at 25 Hz and at 40 Hz, and report:

| Field | Unit | Tolerance |
| --- | --- | --- |
| Tuning thickness at 25 Hz | ms | 0, exact |
| Amplitude of a 24 ms bed at 25 Hz | dimensionless | 0.0001 |
| Tuning thickness at 40 Hz | ms | 0, exact |
| Amplitude of the 6 ms bed at 40 Hz | dimensionless | 0.0005 |
| Amplitude of a 28 ms bed over the isolated level at 25 Hz | dimensionless | 0.0002 |
| Theoretical tuning thickness at 25 Hz | ms | 0.05 |

## The order to run it in

**Two panel states, then one calculation.** Do not read fields one at a time and assemble them from notes afterwards, because the two frequencies produce very similar looking numbers and the commonest failure is crossing them.

**The readings, worked at 15 Hz.** The panel opens at 15 Hz. There the tuning thickness tile reads 26 ms; read it from the tile, not from the apex of the plotted curve. A bed at a stated thickness is read by setting the thickness selector to it and reading the "Amplitude there" tile, printed to ten decimals: at 15 Hz a 36 ms bed reads 0.1032706648. Its ratio to the isolated level is on the "Amplitude relative to isolated" tile beside it, printed to four decimals, 1.2844 for that bed. The isolated level is the thick end of this same run, so it belongs to this panel state and not to a separate one; dividing the amplitude by it gives the same ratio to the digits the tile prints.

**State one: 25 Hz.** Set the frequency to 25 Hz and read the tuning thickness. Then set the thickness selector to 24 ms and read the amplitude there, and to 28 ms and read the amplitude relative to isolated. Both beds are thicker than tuning, on the falling side of the curve, where every 2 ms step moves the reading by far more than its tolerance. Check the thickness tile before you record each one.

**State two: 40 Hz.** Change the frequency, read the tuning thickness, then set the thickness selector to 6 ms and read the amplitude there. The 6 ms bed sits below the 40 Hz tuning thickness, on the thin side where the amplitude falls away, and it is the reading the tier is really about: how bright a bed thinner than tuning looks. Check the frequency tile reads 40 and the thickness tile reads 6 before you record it.

**The calculation.** The theoretical tuning thickness is $\sqrt{6}/(2\pi f)$. At 15 Hz:

$$\frac{\sqrt{6}}{2\pi \times 15} = 0.0259899\ \mathrm{s} = 25.9899\ \mathrm{ms}$$

Run the same line at 25 Hz and report it to at least three decimals.

## The four ways fields are lost

**Reporting the theoretical value as the modelled tuning thickness.** The theoretical value looks more precise, so it feels like the better answer to a question about tuning thickness. It is a different field, and the modelled field has no tolerance, so this error loses one field outright and often two.

**Reporting an amplitude where the ratio is asked for.** The two tiles sit next to each other. The ratio field is the quotient against the isolated level, read at 28 ms; the amplitude field is read at 24 ms. Reading both at one thickness loses one of them.

**Reading at the wrong frequency.** The 25 Hz readings and the 40 Hz ones are different numbers at the same thickness, and the tuning amplitude, the one reading that does not change, is not graded. Confirm the frequency tile before recording each field.

**Entering 0.08 as 8, or the amplitude in percent.** The fields are dimensionless amplitudes on a model whose reflection coefficients are 0.08. Nothing in this capstone is a percentage.

## The self-consistency check to run before submitting

Three relationships hold across the fields. Both 25 Hz readings sit between the isolated level and the tuning peak, so the 28 ms ratio must lie between 1 and the tuning ratio, and the 24 ms amplitude must be larger than 0.08 times that ratio, because the curve falls toward the isolated level as the bed thickens. The frequency times the tuning thickness must land near 390 to 400 Hz ms at each frequency, because the tuning thickness scales as the inverse of the frequency (module 4). And the modelled thickness must sit on the 2 ms grid step nearest the theoretical one. At 15 Hz: $15 \times 26 = 390$, and 26 is the grid step nearest 25.99.

## Exercise

Write out the six fields with their units, then state which of them would still be correct if the model had been built with a reflection pair of $\pm 0.05$ instead of $\pm 0.08$.

As a self-check: both tuning thicknesses, the theoretical value and the ratio would be unchanged, the ratio because it is scale invariant; only the two amplitudes would move, each scaling by 0.05 over 0.08, because the model is linear in the coefficients. That the ratio survives a change of coefficients is exactly why it is graded and the isolated level is not.
