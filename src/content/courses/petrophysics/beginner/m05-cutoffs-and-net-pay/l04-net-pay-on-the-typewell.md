# Net pay on the typewell

Everything in this module comes together here. We run the full pay evaluation on the typewell's two named zones and read what the numbers say about the well. These are the same numbers the interactive app computes in Learning Mode, and the same six values the capstone grades, so work through this lesson carefully.

## The setup

The typewell is logged from 2000 to 2100 m at 0.5 m sampling. Interpretation used the course parameters throughout: density porosity with $\rho_{ma} = 2.65$ and $\rho_{fl} = 1.0$ g/cc, Larionov tertiary $V_{sh}$ between clean and clay lines of 20 and 120 API, Archie saturation with $R_w = 0.05\ \Omega\text{m}$, $a = 1$, $m = 2$, $n = 2$. Cutoffs: $\phi \geq 0.08$, $V_{sh} \leq 0.5$, $S_w \leq 0.6$. Two zones are defined:

| Zone | Top (m) | Base (m) |
|---|---|---|
| SAND_A | 2010 | 2030 |
| SAND_B | 2050 | 2080 |

## A note on gross thickness

Before the results, one small bookkeeping point that puzzles almost everyone the first time. SAND_A runs from 2010 to 2030, which reads as 20 m. The summary books $h_{gross} = 20.5$ m. Why? The zone contains every sample from 2010.0 to 2030.0 **inclusive**. At 0.5 m sampling that is 41 samples, and $41 \times 0.5 = 20.5$ m. Both bounding depths carry a sample, so a zone picks up one extra sample increment over its nominal top-to-base difference. SAND_B likewise books $h_{gross} = 30.5$ m for a nominal 30 m interval (61 samples). This is a convention of sample counting, it is applied identically to every zone, and knowing it will save you from chasing a phantom half metre.

## The results

| Zone | $h_{gross}$ (m) | $h_{net}$ (m) | NTG | $\bar{\phi}$ | $\bar{V_{sh}}$ | $\bar{S_w}$ |
|---|---|---|---|---|---|---|
| SAND_A | 20.5 | 18.0 | 0.878 | 0.208 | 0.003 | 0.361 |
| SAND_B | 30.5 | 5.5 | 0.180 | 0.142 | 0.001 | 0.542 |

Check one number by hand to trust the machinery: SAND_A's NTG is $18.0 / 20.5 = 0.878$. And $h_{net} = 18.0$ m means $36$ of the zone's $41$ samples passed all three tests.

## Reading SAND_A

SAND_A is the kind of interval that makes a well commercial. Nearly ninety percent of the gross interval is pay. The pay averages tell a consistent story: porosity around 21 percent is excellent for a consolidated sand, shale volume in the pay is essentially zero (the sand is clean, with $\bar{V_{sh}}$ about 0.003), and water saturation of 0.36 means roughly two thirds of the pore space holds hydrocarbon. The few samples that failed sit at the zone margins where the sand shales up or porosity dips. When you plot the curves, the pay flag runs almost unbroken across the zone.

## Reading SAND_B

SAND_B is the cautionary tale. Its gross interval is half again thicker than SAND_A's, 30.5 m against 20.5 m, and if gross thickness were the story SAND_B would look like the better target. The filters say otherwise. Only 5.5 m survives, an NTG of 0.18. The pay that remains is poorer as well: $\bar{\phi} = 0.142$ against SAND_A's 0.208, and $\bar{S_w} = 0.542$ sits uncomfortably close to the 0.6 cutoff, meaning even the booked rock is carrying a lot of water.

Why does so much of SAND_B fail? Two compounding reasons. First, porosity in SAND_B is systematically lower, and long runs of samples fall below the 0.08 floor. Second, saturation climbs with depth through the zone, and the interval from 2075 to 2078 m is the well's water leg, rock at or near $S_w = 1$ that fails the saturation test outright. A thick gross interval has been reduced to a modest pay column of wetter, tighter rock. An engineer reading this row would expect SAND_B to contribute little, and to produce water early if completed.

## The capstone connection

The capstone practical for this tier asks you to reproduce exactly six of these numbers with the interactive app: $h_{net}$, $\bar{\phi}$ and $\bar{S_w}$ for each of SAND_A and SAND_B. The grading is automatic and tolerance-based, so small rounding differences are fine, but parameter mistakes are not. If your $R_w$, matrix density, clean and clay lines or cutoffs differ from the course parameters, your six numbers will drift out of tolerance in recognisable ways (module 6 walks through those sensitivities). The strong advice: before submitting, sanity-check your SAND_A net against the hand arithmetic above.

## Exercise

Using the results table:

1. Compute the hydrocarbon-filled porosity thickness $h_{net} \times \bar{\phi} \times (1 - \bar{S_w})$ for each zone, the quantity volumetrics actually consumes.
2. A colleague proposes extending SAND_B's base from 2080 to 2085 m to "capture more pay". The added rock is all below the water leg. What happens to $h_{net}$, NTG and $\bar{S_w}$?

Self-check: (1) SAND_A: $18.0 \times 0.208 \times 0.639 = 2.39$ m; SAND_B: $5.5 \times 0.142 \times 0.458 = 0.36$ m. SAND_A carries about 87 percent of the well's pay volume. (2) $h_{net}$ is unchanged (wet samples fail the $S_w$ test), NTG falls because gross grew, and $\bar{S_w}$ is unchanged because the averages only see pay samples.
