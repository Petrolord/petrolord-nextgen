# The overpressure probit

{{panel:cq-harm}}

The blast module ended at a peak side-on overpressure. This lesson turns that overpressure into a fatality probability with the one blast probit the engine carries, and shows the unit conversion that sits inside it, because the preset's source printed its coefficients for pounds per square inch.

## One preset, in psig

The engine exports `OVERPRESSURE_PROBITS` with a single preset, hsc: Y = 1.47 + 1.37 ln(P), with P in psig. Its source, verbatim: "UK HSE SPC/Tech/OSD/30, Indicative human vulnerability to the hazardous agents present offshore Equation 4a (HSC road and rail study)".

The Kinney and Graham fit returns pascals, so the engine takes the overpressure in Pa and converts it with its exported constant `PA_PER_PSI`, 6894.757293168361. You type pascals and the preset sees psig. The ladder (stated in psig):

| overpressure psig, stated | overpressure Pa, derived | probit | probability |
| --- | --- | --- | --- |
| 2 | 13789.514586 | 2.419612 | 0.004934 |
| 5 | 34473.786466 | 3.674930 | 0.092574 |
| 10 | 68947.572932 | 4.624542 | 0.353660 |
| 20 | 137895.145863 | 5.574153 | 0.717068 |
| 40 | 275790.291727 | 6.523765 | 0.936216 |

Each doubling of the overpressure adds the same step to the probit, because the probit is linear in ln(P). The probability steps are not equal, because the normal curve is steepest in the middle.

## The unit trap

If the overpressure in Pa were fed where psig is due, the probit would read a number `PA_PER_PSI` times too large. The logarithm softens that, but only by adding a fixed offset of 1.37 times ln of the conversion to every probit, which would push every probit far up the ladder. That is why the engine accepts pascals only and converts internally. When you copy an overpressure probit from any paper, look first for the unit of P.

## The points the source prints

OSD/30 Equation 4 prints three points on this curve, which the golden checks:

| probability | engine psig | printed psig | relative difference |
| --- | --- | --- | --- |
| 0.01 | 2.407476 | 2.4 | 3.11e-3 |
| 0.5 | 13.152901 | 13.1 | 4.04e-3 |
| 0.95 | 43.696383 | 43.5 | 4.51e-3 |

The ninety-five percent point prints lower than the probit gives, which the engine's validation record lists as an erratum in the source. Those printed points are what makes the overpressure probit a graded quantity in this course: a second, published route stands behind it.

## What it covers

This is a fatality probit for a person exposed to the overpressure. It does not separate the ways a blast harms, such as lung or eardrum injury, and it says nothing about structures. A consequence note that uses it states the preset and its source and says what it covers.

There is also only one preset. The thermal and toxic probits each offer a second source to set beside the first, so a note can show their spread. For a blast the note has a single curve, and it says so plainly, so that a reader does not take one preset for a settled consensus.

## Exercise

The harm panel's probit view takes the overpressure in psig, the preset's own unit. Enter 10 psig and confirm the probit and probability of the ten psig row. Then, on the blast view, find the overpressure BONGA's 500 kg of TNT gives at 50 m, convert it to psig with `PA_PER_PSI`, and enter it in the probit view; record the probit and the probability. Write one sentence naming the unit the preset expects and the constant that converts to it.
