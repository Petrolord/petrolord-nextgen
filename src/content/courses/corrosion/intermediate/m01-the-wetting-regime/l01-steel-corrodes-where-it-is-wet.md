# Steel corrodes where it is wet

{{panel:fc-rate-explorer}}

Steel does not corrode where it is oil wet. This module treats that fact as a
REGIME and not as a multiplier it applies everywhere, and the distinction is
the first thing to understand about the largest input on the screen. The
multiplier the oil-wet regime carries is zero, so the rate it produces is zero,
and a zero rate is the strongest reassurance a screening tool can offer.

Hold every other condition still and move only the regime, and the module
answers three different ways.

| regime | wetting factor | rate mm/yr | category | life |
| --- | --- | --- | --- | --- |
| waterWet | 1.000000 | 1.676428 | severe | 1.655305 yr |
| intermittent | 0.370000 | 0.620278 | high | 4.473797 yr |
| oilWet | 0.000000 | 0.000000 | WITHHELD | WITHHELD |

## The two regimes where the model applies

For the water-wet and the intermittent regimes the engine says the model
applies and returns a rate, a band label and a life. At a wetting factor of
1.000000 the rate is 1.676428 mm/yr and the life is 1.655305 yr. At a wetting
factor of 0.370000 the rate is 0.620278 mm/yr and the life is 4.473797 yr. The
words in the category column are band labels and the engine declares that the
bands they come from carry no source in this repository, so read the number and
treat the word as a label.

The studio's own shipped case runs water wet with a water cut of 1.000000, and
on that case the rate is 0.754524 mm/yr, the effective corrosion inhibition is
85.500000 percent and the remaining life is 4.207953 yr. Every figure a user
meets on the first screen sits inside the water-wet branch.

## The third regime answers a different question

The oil-wet regime returns a rate of 0.000000 mm/yr and then withholds its
category and its life rather than issuing them. It says why, in its own words:

> the wetting regime is oil wet, so the rate is zero because that was assumed
> and not because it was calculated. An unbounded life off a dropdown is the
> strongest reassurance on the screen arriving from the weakest input.

The corrosion inhibition figure on that case is `null` rather than zero. A
reported zero percent inhibition on a line that carries a corrosion inhibitor
programme is a statement about the programme, and it would be a false one. With
the rate at zero there is nothing for the corrosion inhibitor to be effective
against, so the engine reports an absence where a reader might expect a
quantity.

## Why this is the largest lever

Across the three regimes the rate runs from 1.676428 mm/yr to 0.000000 mm/yr on
one dropdown, with no other input touched. That is why the regime is worth a
whole module at this tier, and why the engine refuses an unrecognised regime
string rather than resolving it to the least limiting branch.

## Exercise

Open the rate explorer and record the wetting factor and the rate the engine
returns for each of the three regimes at one fixed set of conditions. Then
record the category and the life for each. Write one sentence stating which
regime withholds its category and its life, and one more stating what the
engine gives instead of a corrosion inhibition percentage in that regime.
