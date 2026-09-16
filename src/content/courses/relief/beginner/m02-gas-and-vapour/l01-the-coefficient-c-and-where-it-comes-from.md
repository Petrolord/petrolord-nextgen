# The coefficient C, and where it comes from

{{panel:fc-sizing-explorer}}

The gas and vapour equation in critical flow carries a coefficient written C, and a great many people treat it as a chart lookup. In this engine it is nothing of the kind. C is a function of the isentropic exponent alone, and it is computed every time.

## The whole surface, in one column

Walked across the range the standard covers, C looks like this.

| k (stated) | C |
| --- | --- |
| 1.050000 | 321.187587 |
| 1.100000 | 326.747329 |
| 1.200000 | 337.236209 |
| 1.300000 | 346.976423 |
| 1.400000 | 356.060357 |
| 1.500000 | 364.564134 |
| 1.600000 | 372.551290 |
| 1.800000 | 387.182334 |

The direction is the whole reading. A stiffer gas, meaning one with a larger isentropic exponent, has a larger C, and a larger C gives a smaller required area for the same load. The column is monotonic across every row printed, which is a property of the closed form rather than a fit to measurements.

Do not divide one of those figures by another. The digest behind this course prints a ratio wherever one is entitled to exist, and it prints none between these rows. Two values of a function evaluated at two inputs are not in a relationship this engine computes, and a learner who forms the quotient produces a number nothing stands behind.

## Where the 520 comes from

Underneath C there is a leading constant, and the engine never exports it. It was recovered by dividing gasConstantC(1.4) by the bracket that depends only on the exponent, which leaves 520.000000000000 and nothing else. So the constant that carries the whole unit system of this equation is measurable out of one function call, and that measurement is what this course quotes rather than a figure copied from a textbook.

## What checks it

The validation oracle behind this route does not restate the equation. For the critical rows it derives the isentropic nozzle mass flux from the gas constant, the molecular weight, the temperature and the pressure in absolute SI units, so the customary leading constant is checked against a different derivation instead of being repeated in a second place. An oracle that restates the formula under test validates nothing, and this one does not. That is worth carrying forward as a habit: when you are told a calculation has been checked, the useful question is what the checker derived independently.

## The exponent is an input, and it is yours

C is computed, so nothing about it is held for literature. The exponent it is computed from is a different matter: it is stated by the caller, and it is a property of the gas at relieving conditions rather than a constant of the valve. ORUBIRI states an exponent of 1.270000. The digest walks the table at the stated values above and prints no C at 1.270000, so this lesson prints none either. A figure that is not in the digest does not get invented into a lesson, however easy it would be to interpolate one.

## Exercise

Read the table and write down what happens to C as the exponent rises, then say what that does to the required area for a fixed load. Name the one figure in this lesson that was measured out of the engine rather than read off a chart, and say which single call it came from.
