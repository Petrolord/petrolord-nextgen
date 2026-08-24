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
| Isolated reflector amplitude at 25 Hz | dimensionless | 0.002 |
| Theoretical tuning thickness at 25 Hz | ms | 0.05 |

## The order to run it in

**Two panel states, then one calculation.** Do not read fields one at a time and assemble them from notes afterwards, because the two frequencies produce very similar looking numbers and the commonest failure is crossing them.

**State one: 25 Hz.** Set the frequency to 25 Hz and read three fields together while the panel is in that state.

- Tuning thickness: **16 ms**. Read it from the tile, not from the apex of the plotted curve.
- Amplitude at tuning: **0.1155947595834732**.
- Isolated reflector amplitude: **0.07999999821186066**. This is the thick end of the same 25 Hz run, so it belongs to this panel state and not to a separate one.

**State two: 40 Hz.** Change the frequency and read two fields.

- Tuning thickness: **10 ms**.
- Amplitude at tuning: **0.1155947595834732**, which is the same number as the 25 Hz field. It is not a copying error and it does not need checking twice. Module 4 explains it: $25 \times 16 = 40 \times 10 = 400$.

**The calculation.** The theoretical tuning thickness at 25 Hz:

$$\frac{\sqrt{6}}{2\pi \times 25} = \frac{2.4494897}{157.0796327} = 0.015593936\ \mathrm{s} = 15.593936\ \mathrm{ms}$$

Report it to at least three decimals. The tolerance is 0.05 ms, so 15.59 passes and 15.6 passes, while the rule of thumb value of 15.3846 does not.

## The four ways fields are lost

**Reporting 15.594 as the modelled tuning thickness.** The theoretical value looks more precise, so it feels like the better answer to a question about tuning thickness. It is a different field, and the modelled field has no tolerance, so this error loses one field outright and often two when the theoretical field is then filled with 16.

**Reporting the isolated amplitude as the tuning amplitude, or the reverse.** They are 0.0800 and 0.1156 and they sit next to each other on the panel. The ratio between them is 1.4449, which is a useful check: if your two amplitudes are not in that ratio, one of them is in the wrong box.

**Reading the 40 Hz tuning thickness off the 25 Hz curve.** Both curves have an apex that looks flat at chart scale. Confirm the frequency tile reads 40 before recording 10.

**Entering 0.08 as 8, or the amplitude in percent.** The fields are dimensionless amplitudes on a model whose reflection coefficients are 0.08. Nothing in this capstone is a percentage.

## The self-consistency check to run before submitting

Four relationships hold across the six fields, and checking them takes a minute.

$$\frac{0.1155947596}{0.0799999982} = 1.4449 \qquad 25 \times 16 = 400 \qquad 40 \times 10 = 400$$

$$\frac{16}{15.5939} = 1.026$$

If the first fails, an amplitude is in the wrong field. If either product fails, a thickness is wrong. If the last is far from 1.026, the modelled and theoretical thicknesses have been crossed.

## Worked example

Suppose the panel is read and the six fields come out as 16 ms, 0.1156, 10 ms, 0.1156, 0.1156 and 15.594 ms. Run the check.

The ratio test fails immediately: the isolated field and the tuning fields are all the same number, so the ratio is 1.0 rather than 1.4449. The isolated amplitude has been read from the tuning tile rather than from the isolated tile. Everything else passes, so exactly one field is wrong and it is identifiable without rereading the panel.

## Exercise

Write out the six fields with their units, then state which of them would still be correct if the model had been built with a reflection pair of $\pm 0.05$ instead of $\pm 0.08$.

As a self-check: the six are 16 ms, 0.1155947595834732, 10 ms, 0.1155947595834732, 0.07999999821186066 and 15.593936024673521 ms. The three that would be unchanged are both tuning thicknesses, at 16 and 10 ms, along with the theoretical value of 15.593936 ms, since all three depend on the wavelet alone; the three amplitudes would all scale by 0.05 over 0.08, giving 0.0722467, 0.0722467 and 0.05.
