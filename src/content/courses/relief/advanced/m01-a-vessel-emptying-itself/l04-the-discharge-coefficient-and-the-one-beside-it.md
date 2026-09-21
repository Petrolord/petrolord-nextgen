# The discharge coefficient, and the one beside it

Two coefficients sit in the mass flow through the blowdown orifice. One is yours: the discharge coefficient you type, which on AFIESERE is 0.820000. The other is the engine's: the gas coefficient C, computed from the isentropic exponent, which the Associate tier measured at 520.000000000000 times a bracket in k alone. Telling those two apart is the whole of this lesson, because a mistake in either looks identical on the answer and different only in a ratio.

{{panel:fc-blowdown-explorer}}

## The coefficient you type does exactly what it says

Walk the discharge coefficient and hold everything else. A coefficient of 0.600000 gives 366.839286 s, 0.820000 gives 268.419002 s, and 1.000000 gives 220.103588 s.

Now the check the lab prints, which is the only comparison this sweep entitles you to. The ratio of the first time to the last is 1.666666542759, against a coefficient ratio of 1.666666666667. Those two figures are the same quantity read two ways, and the departure between them is the march's own step error rather than anything in how the coefficient is handled. The time runs inversely with the coefficient and with nothing else.

That is what it looks like when a caller's figure is used once and nothing multiplies it. Any input worth typing should be able to survive this test, and the audit module turns it into a general procedure: walk the input across its whole declared range, print the spread of the answer, and compare that spread with the precision the answer prints at.

## The coefficient beside it, and how it is caught

C never appears on the screen. It is computed inside the mass flux from k, and a reader has no direct sight of it. So the course checks it a different way.

With the compressibility held constant and the flow choked throughout, the mass balance is separable: the rate of mass loss goes as the mass raised to (k+1)/2, so the time between two masses integrates exactly. Build that closed form from the engine's own C, the gas constant recovered from the start mass, and the stated geometry, and compare.

| case | marched time s | closed-form time s | ratio |
| --- | --- | --- | --- |
| AFIESERE as stated | 268.419002 | 268.418973 | 0.999999894249 |
| AFIESERE at a 2.0 in orifice | 104.851242 | 104.851161 | 0.999999232099 |
| AFIESERE at a discharge coefficient of 0.60 | 366.839286 | 366.839263 | 0.999999938032 |
| AFIESERE from 1800 psia | 321.794698 | 321.794669 | 0.999999911186 |

## Why the ratio column is the instrument

The ratio column is the check. A discharge coefficient applied twice, a coefficient hidden inside the mass flow, or an isentropic exponent off by one would every one of them show as a ratio away from one.

None of those three faults would move the answer in a way a reader could see. Each would move it smoothly, across every case at once. A constant factor is invisible on a number and visible only against a second derivation of the same quantity, and building that second derivation is the only way to look.

The four ratios above sit within a part in a million of one. That is the march's step error, and the third module of this tier measures it directly.

## Exercise

Record the three times at discharge coefficients of 0.600000, 0.820000 and 1.000000, then the ratio of the first to the last and the coefficient ratio it is read against. Say which of those two numbers you may quote as a comparison and why. Record the four closed-form ratios. Then name the three faults the ratio column would catch and say what they have in common.
