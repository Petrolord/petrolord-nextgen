# The column average

The Professional tier ended on a quiet bombshell: the crest of the Ekene structure, 20.2818603515625 m above the mapped contact, drains to a water saturation of 0.35062979402484734. The NG5 volumetric booking used a flat $S_w = 0.35$ everywhere, so the flat value is true at the crest, and only at the crest. Every metre below it is wetter. This lesson computes the number that statement implies and your capstone grades: the height-averaged water saturation of the crest column.

## The integral, spelled out

The saturation-height model gives $S_w$ at any height. At $h$ feet above the free water level, the capillary pressure is $P_c = 0.07133527522935783 \, h$ psi, the J value is $P_c / 2.942330021361175$, and inverting the designed power law gives

$$S_w = 0.25 + 0.75 \left( \frac{J}{0.25} \right)^{-1}$$

since $b = 1$ for the Ekene curve. The column of interest runs from the contact, which sits at $h = 10.31162356877775$ ft above the free water level where $S_w = 1$, up to the crest at $h = 76.85316015526888$ ft.

Average $S_w$ over that interval by composite trapezoid with 2000 intervals: evaluate $S_w(h)$ at 2001 evenly spaced heights, weight the two endpoints by a half, sum, divide by 2000. The result is

$$\bar{S}_w = 0.48345033394940007$$

That is the capstone field `sw_avg_crest_column`, tolerance 0.002, and the definition matters as much as the value: 2000 intervals, from the CONTACT to the crest. Integrating from the free water level instead of the contact is the natural slip, and it changes the answer, because it pads the column with rock the model holds at $S_w = 1$.

The shape of the transition zone explains why the average lands where it does. The ladder from the Professional tier: the model is back down to $S_w$ 0.9 within 0.48353582519437843 m of the contact, at 0.5 by 6.285965727526915 m, at 0.4 by 12.571931455053829 m. The wet toe is thin, so the column spends most of its height at moderate saturations, and the average settles a little under the midpoint of the range rather than near 1.

## What it says about the booking

Put the two numbers side by side. The flat booking: $S_w = 0.35$, so an oil fraction of 0.65 through the whole column. The saturation-height model: $\bar{S}_w = 0.48345033394940007$, an average oil fraction of 0.5165496660505999. The difference in water saturation is 0.1334503339494001, and it means the crest column as a whole holds roughly four fifths of the oil the flat booking implies for it.

Be precise about what was just claimed, because the temptation to overreach here is strong. This is the honest number for ONE column: the vertical stack of rock at the crest, the tallest column the field has. Shorter columns elsewhere in the field sit lower in the transition zone and are wetter still, but their averages have not been derived, and the 169-cell field-wide average is NOT a number this course possesses. Multiplying the NG5 STOIIP by the ratio of oil fractions you just computed would manufacture a field-wide correction from a single-column calculation, and that is exactly the kind of derived-from-derived number this program refuses to mint. The scope of a calculation is part of the calculation.

{{panel:sc-design-explorer}}

Find the column-average tile in the panel. It runs the 2000-interval trapezoid from the contact to the crest and reports 0.48345033394940007 beside the flat booking's 0.35. Then look at the crest-saturation context tile: 0.35062979402484734. Those two tiles bracket this lesson: the flat value is exactly right at one elevation and 13 saturation points optimistic as a column average.

## The misconception to avoid

The misconception is reading this lesson as "the model contradicts the volumetrics, so the booking is wrong." A flat-saturation booking is a modelling CHOICE, and a defensible one when the transition zone is thin relative to the column or when no capillary data exists to do better. What is not defensible is holding both numbers without knowing they answer different questions. The booking's 0.35 is a crest-calibrated constant applied everywhere; the 0.48345033394940007 is a physics-weighted average for one column. An engineer who can say which question each number answers, and for which cells the difference is material, is doing reservoir engineering. One who swaps them silently is doing arithmetic.

## Exercise

First, without recomputing anything, state whether the height-averaged saturation of a SHORTER column, say one ending 10 m above the contact, would be higher or lower than 0.48345033394940007, and give the one-sentence reason from the shape of the transition zone.

Second, the trapezoid rule was specified with 2000 intervals and endpoint weights of one half. Explain what error you would introduce by evaluating at 2000 interior points with equal weights instead, and why the graded tolerance of 0.002 makes the distinction worth respecting near a boundary where $S_w = 1$.
