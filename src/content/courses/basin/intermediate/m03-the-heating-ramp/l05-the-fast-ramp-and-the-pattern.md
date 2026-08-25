# The fast ramp and the pattern

The third golden ramp heats at 10 degC per Ma. None of its values are graded, and that is precisely why it completes the module: it turns the graded pair into a pattern you can extrapolate, and patterns are what you will actually use on rocks whose heating rate matches none of the fixtures.

{{panel:bs-kinetics-explorer}}

## The three-curve family

Collect the 150 degC readings: 1.1129254516555198 at 1 degC per Ma, 0.9871413464062039 at 3, 0.8795791051334334 at 10. Each factor of about 3 in rate costs about 11 to 13 percent of reflectance, or in reacted weight, F falls 0.4613492136231176, 0.4289345833269452, 0.39775357417623014: a nearly constant decrement of about 0.032 per rate step.

That evenness in F per factor-of-rate is the logarithmic time dependence of lesson 3 wearing a different coat: multiplying the rate by 3 divides every residence time by 3, and on the ladder a constant factor in time is worth a constant decrement of progress. Whenever you see equal steps of a quantity per multiplicative step of a driver, you are looking at a logarithm, and this tier hands you two of them, time at fixed temperature and rate along a fixed ramp.

## Interpolating a real basin

Real heating rates rarely land on a fixture. Suppose burial history work suggests a source warmed at about 5 degC per Ma. Five is halfway between 3 and 10 in the logarithmic sense, roughly $\sqrt{3 \times 10} = 5.48$, so its 150 degC reflectance should sit near the middle of 0.9871 and 0.8796, around 0.93. The family brackets it, and the bracket width, about 0.11 of Ro, is itself useful: it is the most your answer can be wrong by if your rate estimate is off by the full factor of 3 either way.

This is the honest way to use the fixtures on a rock that is not a fixture: bracket, interpolate logarithmically in rate, and carry the bracket as the uncertainty attached to the rate estimate.

## Where the pattern bends

The evenness has limits, and the table shows one if you look at the low-temperature rows. At 60 degC the three curves read 0.36384483639156284, 0.3462245030986587 and 0.32309490689048337: gaps of five percent, half the size of the gaps at 150. The rate effect grows with maturity, because early on only the fastest bins have begun and they are quick enough to finish at any geological rate; the discrimination happens in the mid-ladder, where residence time decides how deep the front drains. Practical consequence: heating-rate uncertainty matters most exactly in the oil window, and least for calling a rock barely mature versus immature.

The convention lesson flagged the other caveat: at 10 degC per Ma the 0.01 Ma sub-steps span 0.1 degC each, the coarsest integration of the three, part of why this curve is the pattern member rather than a graded one.

## Worked example

Estimate Ro at 150 degC for a rock heated at 30 degC per Ma, a rate typical of very rapid rift subsidence. Thirty is one factor-of-3 step beyond 10, and each step has cost about 0.032 of F. From F = 0.39775357417623014 at rate 10, predict F near 0.3657, so $R_o = e^{-1.6 + 3.7 \times 0.3657} = e^{-0.2469} = 0.781$. The fixtures cannot check this one for you; the pattern is the instrument, and its expected accuracy, based on how evenly the known steps behaved, is a couple of percent.

## Exercise

Using the F values for the three ramps at 150 degC, compute the two decrements and comment on their evenness. Then answer in one sentence: why does heating rate discriminate maturity most strongly in the oil window?

As a self check: the decrements are $0.4613492136231176 - 0.4289345833269452 = 0.0324146302961724$ and $0.4289345833269452 - 0.39775357417623014 = 0.03118100915071506$, even to within 4 percent, which is what makes logarithmic interpolation in rate trustworthy. The window is where the mid-ladder bins are partially drained, and their drain depth is set by residence time; the earliest bins finish regardless of rate and the high bins barely start, so the rate effect concentrates in the middle of the climb.
