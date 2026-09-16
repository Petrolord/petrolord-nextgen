# The capstone walkthrough

The capstone asks for six numbers. Five are read off the panel and one is calculated. This lesson walks the whole exercise in the order that produces the fewest mistakes, and names the errors that lose fields.

{{panel:sl-wedge-explorer}}

## What is being asked

Model the SAND top and base as an equal and opposite reflection pair, $+0.08$ at the top and $-0.08$ at the base, in a wedge running from 0 to 60 ms at a 2 ms sample rate. Read the tuning panel at 25 Hz and at 40 Hz, and report:

| Field | Unit | Tolerance |
| --- | --- | --- |
| Tuning thickness at 25 Hz | ms | 0, exact |
| Peak amplitude at 25 Hz tuning | dimensionless | 0.002 |
| Tuning thickness at 40 Hz | ms | 0, exact |
| Peak amplitude at 40 Hz tuning | dimensionless | 0.002 |
| Tuning amplitude over the isolated level at 25 Hz | dimensionless | 0.001 |
| Theoretical tuning thickness at 25 Hz | ms | 0.05 |

## The order to run it in

**Two panel states, then one calculation.** Do not read fields one at a time and assemble them from notes afterwards, because the two frequencies produce very similar looking numbers and the commonest failure is crossing them.

**State one: 25 Hz.** Set the frequency to 25 Hz and read three fields together while the panel is in that state.

- Tuning thickness: **16 ms**. Read it from the tile, not from the apex of the plotted curve.
- Amplitude at tuning: **0.1155947595834732**.
- Tuning amplitude over the isolated level: **1.4449345270902185**. The isolated level is the thick end of this same 25 Hz run, 0.07999999821186066, so it belongs to this panel state and not to a separate one. Divide the tuning amplitude by it, or read the quotient straight off the "Amplitude relative to isolated" tile with the thickness set to 16 ms. Dividing by the exact 0.08 gives 1.444934494793415 instead, which the tolerance also accepts.

**State two: 40 Hz.** Change the frequency and read two fields.

- Tuning thickness: **10 ms**.
- Amplitude at tuning: **0.1155947595834732**, which is the same number as the 25 Hz field. It is not a copying error and it does not need checking twice. Module 4 explains it: $25 \times 16 = 40 \times 10 = 400$.

**The calculation.** The theoretical tuning thickness at 25 Hz:

$$\frac{\sqrt{6}}{2\pi \times 25} = \frac{2.4494897}{157.0796327} = 0.015593936\ \mathrm{s} = 15.593936\ \mathrm{ms}$$

Report it to at least three decimals. The tolerance is 0.05 ms, so 15.59 passes and 15.6 passes, while the rule of thumb value of 15.3846 does not.

## The four ways fields are lost

**Reporting 15.594 as the modelled tuning thickness.** The theoretical value looks more precise, so it feels like the better answer to a question about tuning thickness. It is a different field, and the modelled field has no tolerance, so this error loses one field outright and often two when the theoretical field is then filled with 16.

**Reporting the isolated level where the ratio is asked for.** The two tiles sit next to each other and read 0.0800 and 1.4449. The graded field is the quotient, not the level: entering 0.08 fails, and so does entering the tuning amplitude 0.1156.

**Reading the 40 Hz tuning thickness off the 25 Hz curve.** Both curves have an apex that looks flat at chart scale. Confirm the frequency tile reads 40 before recording 10.

**Entering 0.08 as 8, or the amplitude in percent.** The fields are dimensionless amplitudes on a model whose reflection coefficients are 0.08. Nothing in this capstone is a percentage.

## The self-consistency check to run before submitting

Four relationships hold across the six fields, and checking them takes a minute.

$$\frac{0.1155947596}{1.4449345} = 0.0800 \qquad 25 \times 16 = 400 \qquad 40 \times 10 = 400$$

$$\frac{16}{15.5939} = 1.026$$

If the first does not return the thick end level of 0.0800, the tuning amplitude and the ratio disagree and one of the two is wrong. If either product fails, a thickness is wrong. If the last is far from 1.026, the modelled and theoretical thicknesses have been crossed.

## Worked example

Suppose the panel is read and the six fields come out as 16 ms, 0.1156, 10 ms, 0.1156, 1.0 and 15.594 ms. Run the check.

The ratio test fails immediately: 0.1156 divided by 1.0 is 0.1156 rather than the thick end level of 0.0800. The ratio field has been filled by dividing the tuning amplitude by itself, which is what happens when the isolated level is read off the tuning tile. Everything else passes, so exactly one field is wrong and it is identifiable without rereading the panel.

## Exercise

Write out the six fields with their units, then state which of them would still be correct if the model had been built with a reflection pair of $\pm 0.05$ instead of $\pm 0.08$.

As a self-check: the six are 16 ms, 0.1155947595834732, 10 ms, 0.1155947595834732, 1.4449345270902185 and 15.593936024673521 ms. FOUR would be unchanged: both tuning thicknesses, at 16 and 10 ms, the theoretical value of 15.593936 ms, and the ratio, which is scale invariant. Only the two tuning amplitudes would move, each scaling by 0.05 over 0.08 to 0.0722467. That the ratio survives a change of coefficients is exactly why it is graded and the isolated level is not: the level is a restatement of the pair you were given, and the ratio is what the interference did with it.
