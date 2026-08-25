# What K hides

The formula is one line; the single letter $K$ is where the rest of geomechanics went. This lesson opens the letter, sorts what is inside into what matters at this tier, and prices the uncertainty the way module 4 priced the trend, so the two error sources can be compared honestly.

## The costume and the body

The elastic derivation, $K = \nu/(1-\nu)$, is a real derivation with real assumptions: isotropic elastic rock, laterally confined, loaded only vertically, no history, no strength, no tectonics. Under those assumptions a Poisson's ratio of 0.4 gives exactly two thirds.

Every assumption fails somewhere ordinary. Rocks have failure histories that leave locked-in stress. Basins near margins carry tectonic compression or extension that adds to or subtracts from the elastic horizontal stress. Shales are anisotropic. Fracture initiation at a wellbore also involves the hoop-stress concentration and the rock's tensile strength, neither of which appears in the coefficient form at all.

So in practice the derivation runs backwards: measure fracture pressure with a leak-off test, back-calculate $K$, and use THAT. The measured $K$ is then not a Poisson's ratio in costume; it is the ratio of effective horizontal to effective vertical stress at the shoe, whatever made it so, plus a smearing-in of strength and hoop effects. Matthews and Kelly published depth-varying $K$ curves for Gulf Coast fields in 1967, and the industry has run on locally calibrated $K(z)$ ever since.

## Pricing the uncertainty in K

The sensitivity is clean, from the mixture form: $\partial FP / \partial K = S - PP$, the effective stress. At this well's TD, 43.714487325732826 MPa. So five points of $K$, 0.667 to 0.717 say, move the TD fracture pressure by $0.05 \times 43.714 = 2.186$ MPa.

Put that beside module 4's numbers. The trend disagreement moved the TD pore pressure by 6.43 MPa and the fracture pressure by 2.14. A five-point $K$ uncertainty moves the fracture pressure by a comparable 2.19, and moves the pore pressure not at all. The two error sources are similar in size on the ceiling and utterly different on the floor, which has an operational consequence: pore pressure error threatens kicks, $K$ error threatens losses and casing design, and they are defended by different measurements, pressure points for the floor, leak-off tests for the ceiling.

There is also an asymmetry worth naming: $K$ errors do not amplify. No exponent touches $K$; its error passes through linearly, once. The trend error ran through the cube and the budget. This is why the module on the trend is twice as long as the lesson on $K$, and on an uncalibrated well that priority order, trend first, then $K$, is usually right.

## What a leak-off test actually gives

Since calibration keeps being the answer, be precise about the instrument. After cementing a casing string, the shoe is drilled out a few metres and the well is pressured slowly until the pressure-volume line departs from linearity: the leak-off pressure, where a fracture begins to take fluid. Recorded against the true vertical depth of the shoe, converted to pressure, it is one measured point of the green curve.

One point per casing string is typically all a well yields, four or five points in a deep well, which is why the curve BETWEEN shoes is still a model, and why the coefficient form persists: it is the sanctioned interpolator between the few honest measurements the well affords. Its calibrated K also travels to the next well in the field with reasonable grace, which is more than a raw pressure can do, since the next well has different depths and different pore pressure.

## The tier boundary, drawn exactly

What this tier claims: a fracture pressure curve from the coefficient form with a stated $K$, its sensitivities, its couplings to the prognosis, and the knowledge of what calibrates it. What this tier deliberately does not claim: predicting $K$ from geology, tectonic corrections, inclined wells, fracture propagation versus initiation, or wellbore-stability limits that can close a window from the pore pressure side without any kick. Those live beyond this course; the coefficient form is the honest floor of the subject, not its ceiling.

## Worked example

A field's leak-off tests give $K = 0.62$ at shallow shoes rising to 0.70 at deep ones, a common pattern as horizontal stress builds with depth. Price the difference against the fixed 2/3 at two depths on this well. At 2500 m, $S - PP = 54.95258938967901 - 26.257305375 = 28.69528401467901$ MPa; using 0.62 instead of 0.6667 lowers the fracture pressure by $0.0467 \times 28.695 = 1.340$ MPa. At TD, using 0.70 instead of 0.6667 raises it by $0.0333 \times 43.714 = 1.456$ MPa. The fixed-K curve is 1.3 MPa high at the shallow shoe and 1.5 low at TD: a twist, not an offset, and no single K removes it. That twist shape is why calibrated K comes as a function of depth, not a number.

## Exercise

Answer in three sentences: a well team proposes skipping the leak-off test at the next shoe to save rig time, arguing the coefficient form with the regional K has matched the last two tests within half an MPa. What is the strongest argument for running it anyway, using this module's framework?

Self check: the test is the only measurement of the green curve the section will ever get, and the next section's mud program and kick tolerance stand entirely on that curve at this shoe. Two prior matches calibrate the regional K where it was tested, not at the new shoe's depth, where K varies and where the effective stress multiplying any K error is larger than it has ever been on this well. Half an MPa of demonstrated error at previous shoes prices the risk of skipping at exactly zero only if K is constant with depth, which the field's own data pattern contradicts.
