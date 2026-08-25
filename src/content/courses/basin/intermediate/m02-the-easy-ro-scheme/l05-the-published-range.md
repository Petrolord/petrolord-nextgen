# The published range

Every measured vitrinite reflectance you will ever see quoted sits between about 0.2 and 5 percent. This lesson closes the module by connecting that observed range to the two closed forms you now own, and by placing the familiar interpretation bands on the scheme's own scale, so that module 3 can show what heating rate does to them.

## The endpoints are the model's range

The scheme's floor is unreacted vitrinite, $e^{-1.6} = 0.20189651799465538$. Its ceiling is fully reacted vitrinite, $e^{-1.6+3.7 \times 0.85} = 4.687971627022019$ as the engine evaluates it. No history can produce a value outside them, because F cannot leave $[0, 0.85]$.

Both are graded on your capstone with tolerances of 0.001 and 0.005, and both are hand arithmetic. The examiners are not testing whether you can run an integrator; they are testing whether you know that the range of the entire scheme is two constants and an exponential, and that everything else this tier computes lives strictly between them.

## The bands people actually use

Interpretation attaches names to reflectance intervals. Conventions differ between authors, which module 5 will make a point of, but a common set is: immature below about 0.55, oil window from about 0.55 to 1.3, wet gas and condensate from 1.3 to about 2.0, dry gas above.

Put those on the model's scale using the inverse map $F = (\ln R_o + 1.6)/3.7$. Ro 0.55 is F = 0.2709. Ro 1.3 is F = 0.5033. So the entire oil window, the interval every exploration report cares most about, spans F from about 0.27 to 0.50: roughly a quarter of the scheme's reacted weight enters it and another quarter exits it. The remaining half of the ladder's weight is spent outside the window, early bins before it and high-energy bins after it. The scheme spreads its bookkeeping evenly; the economically interesting part of it is a middle slice.

## What the fixtures deliver into this range

Preview where module 3's graded values will land. The capstone ramp at 3 degC per Ma reaches 150 degC with Ro at 0.9871413464062039: mid oil window. The slow 1 degC per Ma ramp at the same temperature reads 1.1129254516555198: still in the window, but noticeably further along. The fast 10 degC per Ma ramp reads 0.8795791051334334. One temperature, three positions in the band, and none of the three is "the" maturity of 150 degC. That is the point the next module exists to drive home.

## A habit for reading reported values

Because the read-out is exponential in F, equal-looking differences in Ro are not equal amounts of reaction. The step from 0.3 to 0.4 percent crosses F = 0.078; the step from 2.0 to 2.1 crosses F = 0.0132. A 0.1 percent disagreement between two labs is six times more reaction near the immature end than in the gas window. When you compare maturities, compare them as F, or at least remember the ruler is logarithmic; module 5 returns to this when discussing calibration.

## Worked example

A report quotes Ro = 0.9 percent. Place it: compute F, its fraction of full reaction, and its position in the oil window. $F = (\ln 0.9 + 1.6)/3.7 = (1.6 - 0.10536)/3.7 = 0.40396$, which is 47.5 percent of the 0.85 maximum, and sits 58 percent of the way through the window's F span from 0.2709 to 0.5033. So mid-window, slightly past halfway, and now you can say so on the model's own scale rather than by eye.

## Exercise

Compute the F values for Ro 0.7 and Ro 2.0, and state how much reacted weight separates them. Then answer in a sentence: why is it misleading to average two Ro measurements arithmetically?

As a self check: Ro 0.7 gives $F = (1.6 - 0.35667)/3.7 = 0.33604$; Ro 2.0 gives $F = (1.6 + 0.69315)/3.7 = 0.61977$; the separation is 0.28374 of reacted weight, a third of the scheme's total. Averaging reflectances arithmetically averages an exponential, which weights the higher value too heavily; on the model's scale the honest average is taken in F, or equivalently as a geometric mean of the reflectances.
