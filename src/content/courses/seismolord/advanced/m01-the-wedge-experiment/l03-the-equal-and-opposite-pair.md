# The equal and opposite pair

The wedge in this tier carries a reflection coefficient of $+0.08$ at its top and $-0.08$ at its base. That choice is not decoration. It is the part of the design that makes the measurement mean something, and this lesson works through why.

## Where an opposite pair comes from

A reflection coefficient at normal incidence is set by the impedance contrast across an interface:

$$R = \frac{I_2 - I_1}{I_2 + I_1}$$

where $I = \rho V$ is acoustic impedance and the subscripts run downward. The Associate tier built this from the logs, so the form should be familiar.

Now consider a bed of impedance $I_b$ sitting inside a uniform surrounding rock of impedance $I_s$. At the top of the bed the contrast is $(I_b - I_s)$ over their sum. At the base it is $(I_s - I_b)$ over the same sum, because the same two impedances meet again in the other order. The numerators are negatives of each other and the denominators are identical, so the base coefficient is exactly the negative of the top one.

That is the ordinary case, not a special one. Any bed encased in a single lithology has an equal and opposite pair at its boundaries. A sand in shale, a limestone stringer in marl, a coal in sandstone: all of them, as long as the rock above and the rock below are the same.

## Why equal and opposite isolates the effect

Suppose instead the pair were unequal, say $+0.08$ at the top and $-0.02$ at the base. The composite amplitude would still change as the bed thins, but you could no longer say the change came from interference alone. Some of it would be the plain fact that one interface reflects four times as strongly as the other. Two causes would be tangled together again, which is exactly what the well tie could not separate.

With the pair equal in size, the two wavelet copies that meet are equal in size. Their sum can be attributed entirely to how they are positioned relative to each other, which is thickness. With the pair opposite in sign, the two copies fight rather than agree, and the way that fight resolves as they slide together is the tuning effect in its purest form.

There is a second reason, and it is arithmetic. At zero thickness the two coefficients land on the same sample, $+0.08$ and $-0.08$ cancel exactly, and the model produces a flat trace with an amplitude of zero. The curve therefore starts from a known value that requires no measurement. A curve that begins at an exact zero, rises to a maximum and settles at an exact 0.08 has both of its ends pinned by theory, which makes the interesting part in the middle much harder to get wrong.

## What the same sign case does instead

The design is worth testing by breaking it. Change the base coefficient to $+0.08$ so that both reflections are positive, and the model behaves completely differently. There is no tuning peak at all. The largest amplitude sits at **zero thickness**, where the two coefficients land on one sample and add to 0.16, and from there the amplitude falls as the bed thickens, reaching a minimum of about 0.0444 at 16 ms before climbing back toward 0.08.

That is the same 16 ms, and it is now a notch rather than a peak. The thickness at which an opposite pair is brightest is the thickness at which a same signed pair is dimmest. Module 2 returns to this, because it is the cleanest demonstration available that tuning is a property of the pairing and not a property of thin beds in general.

A same signed pair is a real configuration too. It happens whenever the rock below a bed differs from the rock above it, for instance a sand between a shale above and a limestone below. In that case a thin bed is dimmer than a thick one, which is the opposite of the warning most interpreters carry.

## Worked example

Take a shale of $V_p = 2500$ m/s and $\rho = 2350$ kg/m3, so $I_s = 5{,}875{,}000$ in SI units, and a sand of $V_p = 3000$ m/s and $\rho = 2200$ kg/m3, so $I_b = 6{,}600{,}000$.

At the top of the sand:

$$R_{top} = \frac{6{,}600{,}000 - 5{,}875{,}000}{6{,}600{,}000 + 5{,}875{,}000} = \frac{725{,}000}{12{,}475{,}000} = 0.058116$$

At the base, the same two numbers swap places, the numerator changes sign, the denominator is unchanged, and $R_{base} = -0.058116$.

The pair is equal and opposite without anyone arranging it, and it is not $\pm 0.08$. The capstone's $\pm 0.08$ is a round number chosen so that the model's arithmetic is easy to follow, and module 6 will run the wedge on this real pair to show what changes and what does not.

## Exercise

A sand is encased in shale and gives a top reflection coefficient of $+0.06$. State the base coefficient and justify it in one sentence. Then state what would have to be true of the section for the base coefficient to be $+0.06$ as well, and say what that would do to the amplitude of a very thin bed.

As a self-check: the base coefficient is $-0.06$, because the same two impedances meet in the reversed order so the numerator changes sign while the denominator is unchanged. A base coefficient of $+0.06$ would require the rock below the sand to be harder than the sand by the same contrast that the sand is harder than the shale above, in other words a different lithology below, and in that case a very thin bed would be at its brightest rather than its dimmest, because the two same signed coefficients would add on nearly the same sample instead of cancelling.
