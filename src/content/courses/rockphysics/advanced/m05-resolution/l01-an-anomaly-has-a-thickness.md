# An anomaly has a thickness

Everything so far treated the sand as a halfspace: infinitely thick, with one interface at its top. Real reservoirs have a base as well, and once the base is close enough to the top the two reflections stop being separate events.

## What changes

A halfspace has one reflection. A bed has two, one at the top and one at the base, separated in time by twice the travel time through the bed.

If that separation is large compared with the length of the wavelet, the two arrive as distinct events and each can be measured. If it is small, they overlap, and what is recorded is their sum.

The sum is not a small perturbation of either. It has a different amplitude and a different apparent time, and both depend on the thickness.

## Why the reflections have opposite signs

At the top of the Ekene gas sand the impedance falls, giving a negative reflection. At the base it rises again, back into whatever lies below, giving a positive one.

That opposition is the general case for a reservoir encased in similar rock, and it is what the wedge fixture models: an equal and opposite pair, $+0.1$ at the top and $-0.1$ at the base in the convention the engine uses.

Two reflections of opposite sign interfering is a different problem from two of the same sign. Opposite signs cancel when they overlap exactly and reinforce at a particular separation, which is what produces tuning.

## What tuning is

As the bed thins from thick to zero, the peak amplitude of the composite does not fall monotonically. It rises to a maximum at a particular thickness and only then collapses.

That maximum is the tuning thickness, and at 25 Hz for this wavelet it is 16 ms.

The amplitude at tuning is larger than the amplitude of an isolated reflection. At Ekene the isolated value is 0.1 and the tuning peak is 0.1444934457540512, which is 44 percent brighter.

## Why this matters for everything before it

Because every reflection coefficient this tier has computed describes an interface, and every amplitude a survey records describes a bed.

If the bed is thicker than tuning, the top reflection is close to the interface coefficient and the arithmetic of the last three modules applies directly.

If it is at or below tuning, the recorded amplitude is a composite and is brighter than the interface coefficient, by up to 44 percent here. An interpreter comparing that amplitude against a modelled reflection coefficient without accounting for thickness will conclude the contrast is larger than it is.

## The two ways this goes wrong

A thin bed reads brighter than it should, and gets interpreted as a stronger fluid effect than it has.

A bed at or below tuning also reads with an amplitude that depends on its thickness, so amplitude variation across a prospect can be thickness variation rather than fluid or porosity variation. Mapping an amplitude and interpreting it as a saturation map, when the reservoir is thinning across the area, is a standard way to produce a confident and wrong picture.

## Worked example

Work out where the Ekene gas sand would sit relative to tuning, using the tier below's velocity.

The gas sand runs at 2905.6972280296195 m/s. A bed of thickness $h$ metres has a two way travel time through it of $2h / 2905.6972280296195$ seconds, or $2000h / 2905.6972280296195$ milliseconds.

Setting that equal to the 16 ms tuning thickness gives

$$h = \frac{16 \times 2905.6972280296195}{2000} = 23.2 \ \mathrm{m}$$

So a gas sand thinner than about 23 m is at or below tuning at 25 Hz, and its amplitude is a composite rather than an interface coefficient.

That is not a thin reservoir. Many producing sands are thinner, and the number scales with velocity and inversely with frequency, so a slower sand or a higher frequency survey pushes it lower.

## Exercise

State what happens to the recorded amplitude of a bed as it thins from well above tuning down to zero thickness.

Self check: it stays close to the isolated interface coefficient while the bed is thick, rises as the bed approaches the tuning thickness and reaches a maximum there, at Ekene 44 percent above the isolated value, and then falls steeply toward zero as the top and base reflections cancel each other at very small separations.
