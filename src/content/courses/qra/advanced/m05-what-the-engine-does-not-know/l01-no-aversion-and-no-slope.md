# No aversion weighting and no slope

{{panel:qr-societal}}

The societal half of an ALARP case rests on the F-N curve and on a criterion to compare it with. Two things an analyst might expect to find are absent from the engine, and both are absent for the same reason: no source the engine read defines them. This lesson says what they are, what the engine does instead, and what the analyst writes in their place.

## No aversion weighted integral

Some practice weights one large accident more heavily than several small ones with the same expected deaths, through an aversion weighted risk integral. The engine has none. No source it read defines one, so it reports the expected value sum of f times N and the F-N curve itself. For the JISIKE off-site scenarios the expected fatalities are 0.000336000000 per year. An analyst who believes that a large accident deserves extra weight argues that aversion in words, beside the curve, where a reviewer can weigh the argument openly.

A criterion line's own slope carries some aversion. A line with alpha of 1 is called risk neutral, and one with alpha of 2 risk averse; the Dutch line has alpha 2. A line with no slope at all is refused:

> criterion.exponentAlpha: must be above 0 (1 is risk neutral, 2 risk averse)

## No slope for the R2P2 point

R2P2 paragraph 136 gives a single POINT: an accident killing 50 or more people in one event should be regarded as intolerable if its frequency is more than one in five thousand a year. The preset `r2p2-para-136` is that one point, N = 50 at 0.000200000000 per year. R2P2 defers extrapolation to other N to a reference the engine did not read, so the engine gives the point NO SLOPE.

| N | F(N) per year | point per year | ratio | state |
| --- | --- | --- | --- | --- |
| 50.000000 | 0.000000200000 | 0.000200000000 | 0.001000 | BELOW |

Against the point, the JISIKE off-site curve is BELOW. F(50) is the frequency of 50 OR MORE deaths, which here is the scenario at N = 300 alone.

## A line the analyst supplies

A line of slope minus one through the point is common practice. R2P2 does not print it, and the engine has no preset for it. An analyst who wants it gives it as their own criterion, C = 0.01 and alpha = 1, from N = 1 by default. The JISIKE curve against that line is BELOW, worst ratio 0.014910 at N = 3.000000, and the basis then says the source is "criterion as given". The note says plainly that the line is the analyst's own choice, with the reason for choosing it, so that no reader mistakes it for R2P2's.

## Exercise

Take the JISIKE point comparison: F(50) of 0.000000200000 per year against the point's 0.000200000000. Divide to check the ratio of 0.001000. Then write two sentences for an ALARP note: one reporting the state against the R2P2 point, and one explaining why a comparison at any N other than 50 needs a line the analyst supplies and names as their own.
