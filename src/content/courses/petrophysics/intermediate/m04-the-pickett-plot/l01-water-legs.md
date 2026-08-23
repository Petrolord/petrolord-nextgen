# Water legs

Every parameter in the Archie equation is a claim about the rock and its water. So far you have taken those claims on trust: the typewell arrived with $R_w = 0.05$ ohm.m, $a = 1$, $m = 2$ and $n = 2$ printed in its parameter block. A professional interpreter does not stop there. The best place to test those numbers is an interval where you already know the answer, and there is exactly one saturation value you can ever know in advance: $S_w = 1$. An interval that is fully water saturated is called a water leg, and it is the petrophysicist's calibration ground.

## What a water leg is

Hydrocarbons are lighter than water, so in a connected reservoir they float. Below the free water level, the pressure in the hydrocarbon phase can no longer support any hydrocarbon in the pores, and the rock carries water and nothing else. Any interval you can demonstrate to sit below the free water level is a water leg: same rock, same water, but with the one unknown removed.

That removal is what makes the leg valuable. Write Archie in full:

$$S_w^n = \frac{a R_w}{\phi^m R_t}$$

With $S_w = 1$ the left side becomes 1 and the equation collapses to a direct relationship between the two things a log actually measures in the leg:

$$R_t = \frac{a R_w}{\phi^m}$$

Resistivity is now a function of porosity alone, with the parameters $a R_w$ and $m$ setting the shape. Measure $R_t$ and $\phi$ at several depths in the leg, and the parameters have nowhere to hide. The next two lessons turn this observation into a fitting procedure; this one is about finding the leg in the first place.

## Recognising a water leg

Three signs, taken together, identify a water leg on logs:

* Low resistivity for the porosity. Water conducts, hydrocarbons do not. A porous sand full of water reads far lower resistivity than the same sand with oil or gas in it.
* Resistivity tracking porosity. In the collapsed equation above, $R_t$ moves only because $\phi$ moves. When porosity drops slightly, resistivity rises slightly, in lockstep. A hydrocarbon zone breaks that lockstep because saturation varies too.
* No hydrocarbon shows. Mud logs, cuttings and any test data should agree that the interval produced nothing but water.

No single sign is sufficient. Low resistivity alone can be shale; tracking alone can be coincidence over a short interval. The professional habit is to require all the evidence to point the same way before promoting an interval to calibration duty.

## The typewell's water leg

The typewell carries its water leg at 2075 to 2078 m, at the base of SAND_B. It is a clean sand interval (gamma ray at the clean line, so $V_{sh}$ is 0) with porosity easing down from 0.0990 to 0.0940 across the leg while resistivity climbs from 5.1015 to 5.6587 ohm.m: porosity down, resistivity up, exactly the lockstep the collapsed equation demands.

The confirmation comes from evaluating Archie across the leg with the given parameters. At every sample from 2075.5 m to 2078 m the computed $S_w$ is 1.0000. Take the sample at 2076 m as a check: $\phi = 0.0980$, $R_t = 5.2062$ ohm.m, and

$$S_w = \sqrt{\frac{1 \times 0.05}{0.0980^2 \times 5.2062}} = \sqrt{\frac{0.05}{0.0500}} = 1.0000$$

A leg that evaluates to exactly 100 percent water with the given parameters is telling you the parameters and the leg agree with each other. The fitting lesson will run this logic in the productive direction: start from the leg, and extract the parameters.

## Interpretation, not observation

Be honest about what picking a water leg is: an interpretation, not a measurement. You are asserting that every sample in the window is at $S_w = 1$. If a transition zone creeps into the window, or a few shaly samples, or an interval still flushed by mud filtrate, that assertion is false and every parameter fitted from the window inherits the error. A water leg picked 2 m too high can hand you an $m$ that is wrong by tenths, and that error then multiplies through every saturation you compute in the reservoir above.

The discipline is the same one you learned for the gamma ray anchors: choose the window deliberately, state it in your report, and treat the fitted parameters as conclusions that depend on it. The typewell's window, 2075 to 2078 m, is given to you for this course, and the capstone uses exactly that window.

## Exercise

The sample at 2077 m reads $\phi = 0.0960$ and $R_t = 5.4253$ ohm.m. Using the given parameters ($a = 1$, $R_w = 0.05$, $m = 2$, $n = 2$), compute $S_w$ and confirm the sample belongs in the water leg. As a self-check: $\phi^2 = 0.009216$, the denominator $\phi^2 R_t = 0.05000$, the ratio is 1.0000 and its square root is 1.0000. Then state in one sentence what it would mean for the calibration if the same arithmetic at some sample returned 0.75 instead.
