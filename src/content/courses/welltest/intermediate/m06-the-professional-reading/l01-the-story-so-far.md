# The story so far

Five modules, one plot, and a set of shapes.

## The claim

The straight-line analysis is a measurement. The derivative plot is the diagnosis. A measurement without a diagnosis is a number attached to an unidentified flow regime, and every failure the Associate tier catalogued was a diagnosis failure.

This tier gave you the diagnosis and then showed you six wells on which it changes the answer.

## What each module established

**Module 1.** Differentiating pressure with respect to the logarithm of time turns radial flow into a flat line, which the eye reads reliably where a straight semilog line is unreliable. The plateau's height is 70.6 q B mu / (k h), so it gives a permeability with no fitting at all. The Bourdet three-point rule takes its neighbours at least L log cycles away to keep noise amplification under control, and on clean data the whole range of L moves the answer by less than three tenths of a percent, which tells you L is a noise parameter rather than an accuracy one. And `bourdetDerivative` returns an EMPTY array rather than an error if you pass the wrong key names.

**Module 2.** Six regimes, four characteristic derivative slopes, and a required ORDER: storage first, near-well geometry early, boundaries late. The engine's classifier reads slope bands and one ordering rule, so a steep fall between regimes gets labelled recharge and a slow rise between plateaus gets labelled bilinear. Six of the seven fixtures in this course get at least one false label. A label needs three things before it is a diagnosis: the slope is in the band, the segment is long enough, and the regime is possible where it appears.

**Module 3.** A sealing fault doubles the derivative asymptotically, reaching only about 1.76 times the plateau in a thousand hours on a fault 800 ft away. Fitting a semilog line to that late stretch reports a bit over half the permeability and inverts the skin, the same failure as fitting through storage, from the opposite end of the test. A constant-pressure boundary plunges the derivative; a channel gives it a half slope; a closed system gives it a unit slope. And when the reservoir is closed and pseudo-steady state is reached, the late CARTESIAN line gives a pore volume to within a few thousandths of a percent, because it is an equilibrium rather than an extrapolation.

**Module 4.** A fracture gives linear flow and a half slope for three and a quarter decades on this fixture, and radial flow for a quarter of a decade at the very end. The sqrt-time line gives the product of half-length and root permeability, and splitting it needs a permeability from elsewhere. Fitting a semilog line to the same early data instead reports 26.266915078269914 mD on 5 mD rock and a skin of minus 4.3726416175327625 on a well with no skin. A horizontal well shows vertical radial, then linear, then pseudoradial flow, with two plateaus that mean different things.

**Module 5.** Dual porosity gives two plateaus at the same level with a dip between them, and the dip ratio is a diagnostic rather than a value of omega. Log decimation fixes a real weighting bias in favour of late data. And one 1.6x spike in one point out of 45 moves the Bourdet derivative by 988.1603135426369 percent while leaving the pressure plot looking fine.

## The three numbers to carry

- The radial derivative plateau for this reservoir at 85 mD: 9.344117647058821 psi. The plateau of any test on this reservoir should be near it if the permeability is.
- The early radial semilog permeability on the fault fixture: 81.25445414895721 mD, against a planted 85, which is what a correctly diagnosed window gives.
- 26.266915078269914 mD, which is what the same software gives on a fractured well when the diagnosis is skipped.

## What you cannot yet do

You can diagnose a regime and run the right straight-line analysis on it. What you cannot do is extract a model's parameters properly, because features give diagnoses and fitting gives parameters, and fitting is the Expert tier.

You also have not met a rate history with more than one change in it, a gas well, or a well analysed entirely from production data. And you have not yet seen what happens when a fit converges beautifully on a model that is wrong.

## Exercise

Write down, from memory, the derivative signature of each of these: wellbore storage, radial flow, a sealing fault, a constant-pressure boundary, a closed reservoir, a fracture, a channel, and dual porosity.

Then, for each one, write the ordering constraint that distinguishes it from the other regime that shares its slope.
