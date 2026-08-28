# Fill-up and the spurious water

Ekene never went below its bubble point, so it has no free gas and no gas fill-up. The forecast engine models fill-up anyway, because most floods need it, and running the Ekene element with a hypothetical free gas saturation exposes an artefact worth understanding.

## The model

If the pore space contains a free gas saturation $S_{gi}$, injected water first refills that space before it displaces any oil. The engine handles this by subtracting a fill-up volume from the cumulative injection:

$$W_i = \max(0,\ W_{i,\text{total}} - PV \, S_{gi})$$

and everything downstream uses the reduced $W_i$. While $W_i$ is zero or negative, the areal sweep is zero, the cumulative oil is zero, and nothing is produced.

The engine warns:

> Initial free gas: injection first refills PV*Sgi with no production response (fill-up simplification).

## The Ekene what-if

Run the design case with $S_{gi} = 0.05$, everything else unchanged. The fill-up volume is

$$PV \times S_{gi} = 5767063.995536059 \times 0.05 = 288353.19977680296 \text{ rb}$$

which at 2000 rb/d takes 144.17659988840148 days.

| | design | with $S_{gi} = 0.05$ |
|---|---|---|
| breakthrough | 639.1875 days | 791.375 days |
| cumulative oil | 1709784.4164781766 stb | 1710241.7585443351 stb |
| elapsed | 2221.9375 days | 2374.125 days |
| final water oil ratio | 31.119000015950355 | 31.990119457932582 |

Breakthrough is delayed by 152.1875 days, which is exactly five monthly steps, and the fill-up volume corresponds to 144 days. The whole run shifts later by the fill-up time, quantised to the step, and the ultimate oil is essentially unchanged.

That is the correct behaviour and it is what fill-up does: it delays the flood, it does not diminish it.

## The artefact

Look at the fifth step of the fill-up run, at day 152.1875, just past the fill-up volume:

| quantity | value |
|---|---|
| areal sweep | 0.008399048090314783 |
| oil rate | 432.93819929286684 stb/d |
| water rate | 1444.721980168393 stb/d |
| surface water cut | 0.7694267556885156 |
| RESERVOIR fractional flow at the outlet | 0 |

The engine reports a 77 percent water cut at a moment when the displacement solution says the outlet is producing no water at all.

## Why it happens

The water rate is defined as the injection minus the oil rate:

$$q_{w,rb} = i_w - q_{o,rb}$$

Immediately after fill-up, $W_i$ has just become positive and is tiny, so the cumulative oil is tiny, so the oil rate over that step is small. The injection rate is still 2000. The difference is booked as water.

It is not water. During and just after fill-up the fluid coming back is GAS, the free gas that the injected water is pushing ahead of it. The engine has no gas phase, so the enforced production balance assigns the volume to the only other phase it knows.

## What to do about it

**Recognise it.** A high water cut in the first step or two after fill-up, with a reservoir fractional flow of zero, is the signature. Both numbers are in the output.

**Discard those steps for water handling design.** Sizing water treatment on that spike would be sizing for gas.

**Remember the balance is enforced, not derived.** Lesson 2 made the point in the abstract; this is what it looks like in practice. Any quantity that the engine computes by difference from an enforced identity inherits every error in the other terms.

## Why the engine is built this way

Because the alternative is a three-phase forecast, which is a simulator. The fill-up model is deliberately crude: subtract a volume, produce nothing, resume. It gets the timing right, which is what a screening forecast needs, and it gets the composition of the returned fluid wrong during the transition, which a screening forecast does not need.

The warning string is the engine saying exactly that. It is one of the better examples in this course of a tool declaring the boundary of its own competence rather than presenting a uniform-looking output.

## The Ekene reality

None of this applies to Ekene, which had no free gas. The $S_{gi} = 0.05$ run is a what-if, and its value is that it teaches the artefact on a case where you know the truth.

Had the flood started two years later, after the reservoir had dropped through 2000 psia, there would have been free gas, there would have been a real fill-up period, and the producers would have carried on declining through it while the operator wondered why the flood was not working. That is the practical argument for starting a flood before the bubble point, which is what Ekene did.

## The misconception to avoid

"The forecast shows early water production, so we will need water handling from day one." Check the reservoir fractional flow beside it. A surface water cut with a zero reservoir fractional flow is the fill-up artefact, not a prediction. Two numbers in the same row of the same output, saying different things, and only one of them is physical.

## Exercise

First, compute the fill-up volume and time for $S_{gi} = 0.02$ and for $S_{gi} = 0.10$ on the design case, and state how the breakthrough time changes in each.

Second, explain in three sentences why the ultimate cumulative oil is almost unchanged by fill-up, and name the one thing fill-up genuinely costs.
