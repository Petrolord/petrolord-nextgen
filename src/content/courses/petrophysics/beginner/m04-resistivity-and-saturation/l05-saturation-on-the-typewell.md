# Saturation on the typewell

You now have every input Archie needs: $V_{sh}$ from module 2 to confirm the sands are clean, porosity from module 3, $R_t$ from the deep resistivity curve, and the givens $R_w = 0.05$ ohm.m, $a = 1$, $m = 2$, $n = 2$. This lesson runs the saturation over the whole typewell and teaches you to read the result the way an interpreter does: not sample by sample, but as a picture with three distinct fluid regimes.

## The saturation profile

Run $S_w = \sqrt{a R_w / (\phi^m R_t)}$ at every depth sample and plot it against depth next to the input curves. Three intervals tell the story.

SAND_A, 2010 to 2030 m. High porosity around 0.21 and deep resistivity around 9 ohm.m combine to give saturations clustered near 0.35. Averaged over its 18.0 m of net pay, SAND_A carries $S_{w,avg} = 0.361$. Roughly two thirds of the pore volume is hydrocarbon. Every sample sits far below the 0.6 saturation cutoff, so saturation never disqualifies this sand; you saw at 2020 m the representative single-sample value of exactly 0.35.

SAND_B, 2050 to 2080 m. The same clean sand mineralogy, but the picture is different. Porosity is lower, resistivity is closer to the wet baseline, and the computed saturations hover around the cutoff. The zone averages $S_{w,avg} = 0.542$ over the samples that qualify as pay, and only 5.5 m of the 30.5 m gross interval survives all three cutoffs. SAND_B is a marginal reservoir where the saturation and porosity tests are doing real work, sample by sample. This is the interval where a careless input error changes the answer, which is exactly why the previous lesson practised error propagation.

The water leg, 2075 to 2078 m. At the base of SAND_B the computed saturation rises to values indistinguishable from 1.0. This is the built-in confirmation that the whole chain is consistent: correct $R_w$, correct porosity and correct exponents must reproduce $S_w = 1$ where the sand is known to be wet. If you ever rerun this well with modified parameters, check this interval first.

## Reading a transition

Between the pay in SAND_B and its water leg, saturation climbs smoothly rather than jumping. Physically this is a transition zone: capillary forces hold more water in the smaller pores as you approach the free water level, so $S_w$ grades from irreducible values down-dip to 1.0 at the aquifer. On the log you see it as $R_t$ sliding down toward the wet baseline $R_0$ while porosity stays roughly constant. Recognising a transition matters commercially: samples in it may pass cutoffs yet produce water along with oil. Quantifying that behaviour belongs to capillary pressure work in later courses; at this tier, learn to see the pattern and name it.

## Worked example

Take a sample from the transition in SAND_B with $\phi = 0.14$ and $R_t = 3.2$ ohm.m. Step through Archie: $\phi^2 = 0.0196$, $\phi^2 R_t = 0.06272$, ratio $= 0.05 / 0.06272 = 0.7972$, $S_w = \sqrt{0.7972} = 0.893$. Now a second sample higher up with the same porosity but $R_t = 7$ ohm.m: $\phi^2 R_t = 0.1372$, ratio $= 0.3644$, $S_w = 0.604$. Same rock, resistivity a factor of 2.2 higher, saturation moved from 0.89 to 0.60, right at the cutoff. You can watch the pay boundary being drawn by the resistivity curve alone.

## What saturation feeds

$S_w$ is not the end product; it is the last log-derived input to the decisions that follow:

- Net pay. In the next module, the three cutoffs ($\phi \ge 0.08$, $V_{sh} \le 0.5$, $S_w \le 0.6$) flag which samples count, and the flagged thickness with its averages becomes the zone summary you report.
- Volumetrics. Beyond this course, hydrocarbon pore volume scales with $\phi (1 - S_w) $ integrated over the net pay. Every barrel in a resource estimate passes through the saturation you computed here.
- The capstone. The graded practical asks you for the net thickness, average porosity and average saturation of SAND_A and SAND_B computed from these exact curves and givens, so the numbers in this lesson are the ones your own workflow should reproduce.

## Exercise

Without recomputing anything, rank the three intervals (SAND_A pay, SAND_B pay, water leg) by average $S_w$, then state which single interval you would use to test a proposed change to $R_w$ and why. Check yourself: SAND_A near 0.36 is lowest, SAND_B pay near 0.54 next, the water leg near 1.0 highest; the water leg is the test interval because its true saturation is known independently of any parameter choice, so a computed value away from 1.0 there isolates the input error.
