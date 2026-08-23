# Formation water resistivity

The Archie equation you will meet in the next lesson has one input that is not read from any log curve: the resistivity of the formation water itself, written $R_w$. It is a single number for a given reservoir interval, yet it sits inside the saturation calculation for every depth sample. Get $R_w$ wrong and every saturation in the well is wrong with it. That is why petrophysicists treat pinning down $R_w$ as a job in its own right.

## What Rw is

$R_w$ is the resistivity the formation brine would show if you could measure a beaker of it at formation temperature, in ohm.m. It depends on two things:

- Salinity. More dissolved salt means more charge carriers, so saltier water is less resistive. Fresh water can read several ohm.m; a saturated brine can read a few hundredths.
- Temperature. Warmer water lets ions move faster, so resistivity falls as temperature rises. The same brine measured at surface temperature and at reservoir temperature can differ by a factor of two or three.

Because of the temperature effect, an $R_w$ value is meaningless without its temperature. When a value is quoted "at formation conditions" it has already been corrected to reservoir temperature and can go straight into Archie. If a value comes from a surface measurement it must be converted first, using a standard temperature relationship. The conversion itself is covered at the advanced tier; at this tier you need to know that it exists and always ask "at what temperature?" when someone hands you an $R_w$.

## Where Rw comes from

Four sources are used in practice. You should be able to name them and say one sentence about each; the mechanics of the last three are taught in the higher tiers of this course.

1. A produced water sample. The most direct source: brine recovered from a test or from production is measured in the laboratory. The measurement is made at surface temperature and corrected to formation temperature.
2. The SP quicklook. The spontaneous potential curve deflects in proportion to the salinity contrast between mud filtrate and formation water, so a static SP reading can be inverted for an equivalent $R_w$.
3. Apparent Rw in a clean water leg. In an interval known to be fully water bearing, Archie can be run backwards: with $S_w = 1$, the measured resistivity and porosity give $R_w$ directly. This is the workhorse method, because many wells penetrate the aquifer somewhere.
4. A Pickett plot. Porosity against resistivity on log scales; fully water bearing points fall on a straight line whose position gives $R_w$. This is a graphical cousin of method 3 and appears at the intermediate tier.

The methods should agree. When they do not, something is wrong with an assumption (the "water leg" holds residual hydrocarbon, the sample was contaminated with mud filtrate, the SP is suppressed) and the disagreement itself is useful information.

## The typewell value and its sanity check

The typewell dataset provides $R_w = 0.05$ ohm.m at formation conditions as a given, so you can concentrate on the saturation workflow. A value of 0.05 ohm.m is a fairly salty brine, typical of many mature basins.

The dataset also identifies a known water leg at 2075 to 2078 m, in the clean sand at the base of SAND_B. That interval is the built-in check on the given value. If you run the full Archie calculation there with $R_w = 0.05$, the computed water saturation comes out very close to 1.0, which is exactly what a fully water bearing sand should return. This is the standard field sanity check: before believing any pay numbers, confirm that the water leg computes wet.

## Worked example

Suppose you had been given $R_w = 0.10$ ohm.m instead, twice the true value, and you ran the water leg check. Every computed saturation scales with $\sqrt{R_w}$ when $n = 2$, so the water leg would return about $\sqrt{2} \approx 1.41$ times the correct value. Saturations above 1 are physically impossible, so the check would immediately flag the input as too high. Now suppose instead you had been given 0.025 ohm.m, half the true value. The water leg would compute near 0.71 rather than 1.0, and you might wrongly conclude the aquifer holds hydrocarbons. The check catches both errors, which is why it is run first, before any interpretation of the pay.

## Exercise

A colleague hands you $R_w = 0.08$ ohm.m for a nearby field and says it came from a produced water sample measured in the laboratory at 25 degrees C. The reservoir is at 80 degrees C. List two questions you must ask before using this number in Archie, and state qualitatively what will happen to your computed saturations if you use the surface-temperature value uncorrected. Check yourself: you should ask whether the value has been corrected to formation temperature and whether the sample could be contaminated by mud filtrate; using the uncorrected, too-high value inflates every computed $S_w$, making pay look wetter than it is.
