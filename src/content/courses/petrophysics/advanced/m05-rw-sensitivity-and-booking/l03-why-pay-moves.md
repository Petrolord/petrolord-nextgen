# Why pay moves

The two bookings differ by 1.5 m of net pay. This lesson explains the mechanics of that difference precisely: a smooth, uniform scaling of saturation, converted into discrete jumps of pay by the cutoff. Understanding the conversion is what lets an Expert predict the damage of a parameter error before rerunning anything.

## The square-root scaling

Rearrange Archie for $n = 2$:

$$S_w = \sqrt{\frac{a R_w}{\phi^m R_t}}$$

Porosity and $R_t$ belong to the sample; $a$ and $R_w$ are parameters shared by every sample. So when Rw alone changes, every saturation in the well scales by the same factor:

$$\frac{S_w^{raw}}{S_w^{corr}} = \sqrt{\frac{0.114}{0.049910}} = \sqrt{2.2841} = 1.5113$$

Check it against the samples you already know. At 2020 m: $0.3497 \times 1.5113 = 0.5285$, exactly the raw-Rw value. In the water leg at 2076 m: $0.9991 \times 1.5113 = 1.510$, which is the physically impossible reading the water-leg check exposed two modules ago. The scaling is exact and universal across samples; nothing about it depends on depth or lithology. That regularity is what makes Rw errors so treacherous: every sample is wrong by the same well-behaved factor, so nothing looks locally anomalous.

## The flip band

The cutoff is what turns this smooth scaling into lost metres. A sample is pay when its saturation is at or below 0.6. Under the raw Rw, a sample survives only if its inflated saturation still clears the bar, that is if its corrected saturation satisfies:

$$S_w^{corr} \le \frac{0.6}{1.5113} = 0.397$$

So the samples at risk form a band: any sample whose corrected saturation lies between 0.397 and 0.600 is pay in the correct booking and non-pay in the raw one. Samples below 0.397 are safe either way; samples above 0.600 were never pay. The parameter error does not nibble at the pay randomly; it harvests a precisely defined saturation interval.

In SAND_A that band catches three samples. At 0.5 m sampling, three samples is exactly the 1.5 m the table lost. They sit at the edges of the sand, where saturation climbs away from the sweet mid-zone values around 0.35 toward the cutoff. The centre of SAND_A, with corrected saturations near 0.35, sits below the 0.397 line and survives; the fringes do not.

The band's width depends on the size of the error. A smaller Rw mistake gives a scaling factor closer to 1, the band narrows toward the cutoff itself, and fewer samples flip. This is why the same blunder can be nearly invisible in one well and expensive in another: the damage depends on how much rock happens to carry saturations inside the band, which is a property of the reservoir's saturation profile, not of the mistake.

## The conditional-average subtlety

Now the porosity oddity from the last lesson. Pay-average porosity rose from 0.2081 to 0.2099 in the booking that lost pay. No porosity value changed anywhere; only the membership of the average did. The three flipped samples were edge-of-sand samples with poorer porosity than the zone's core, so removing them raised the average of the survivors.

You met this behaviour in the Professional tier's sensitivity module, and it generalises: averages conditioned on a cutoff move whenever the sample set moves, and they can move in the direction that looks like an improvement while the booking is deteriorating. A reviewer who glanced only at pay-average porosity would see 0.2099 versus 0.2081 and conclude the raw booking found slightly better rock. The defence is mechanical: never read a pay average without its net beside it. Net, NTG and the pay averages are one package over one sample set; quoted separately they can each mislead.

## Predicting damage without rerunning

Put the three pieces together and you can bound a parameter error's cost by inspection. Given a proposed wrong Rw: compute the scaling factor as the square root of the Rw ratio; divide the cutoff by it to locate the flip band; then ask how much of the zone's saturation histogram sits inside the band. That last question is the only one needing the data, and a glance at the saturation curve answers it. Experts run this mental estimate before any sensitivity case, so the rerun confirms an expectation instead of producing a surprise.

## Exercise

Suppose the lab error had been milder: a proposed $R_w$ of 0.075 ohm.m instead of the corrected 0.049910. Compute the scaling factor and the flip band, and state whether the 2020 m sample (corrected $S_w = 0.3497$) would keep its pay flag. Self-check: the factor is $\sqrt{0.075/0.049910} = \sqrt{1.5027} = 1.2259$; the band runs from $0.6/1.2259 = 0.489$ up to 0.600; and 0.3497 sits below 0.489, so the sample survives, with its saturation reading $0.3497 \times 1.2259 = 0.4287$.
