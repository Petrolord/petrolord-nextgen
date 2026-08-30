# What skin is

A number invented to hold the difference between the well you have and the well the equations assume.

## The idea

The radial flow solution describes an ideal well: a cylinder of radius rw, open to a uniform reservoir, with nothing between the rock and the wellbore. Real wells are not like that. Drilling mud invades, filtrate damages clays, perforations crush the rock around them, cement squeezes in, scale deposits, fines migrate.

All of that lives in a thin annulus around the wellbore, and all of it does the same thing: it makes the fluid pay an extra pressure drop on its way in that the ideal solution does not account for.

Rather than model the annulus, van Everdingen and Hurst put the whole effect into one dimensionless number added to the solution at the wellbore. That number is the skin factor, S, and the extra pressure drop it represents is

    dp_skin = 141.2 q B mu S / (k h)      psi

Positive S is damage: an extra pressure drop. Negative S is stimulation: less pressure drop than the ideal well, which is what a fracture or a successful acid job produces. Zero is the ideal well.

## Why it is dimensionless

Skin is defined so that it is independent of rate. Double the rate and the skin pressure drop doubles, but the skin factor does not move. That is what makes it a property of the well rather than of the day the test was run, and it is why it is the number that gets compared between wells and over time.

The price of that convenience is that skin has no physical size. A skin of plus 6.5 does not tell you how thick the damaged zone is or how much its permeability was reduced. It tells you the combined effect of the two, and infinitely many combinations give the same skin. A thin, badly damaged zone and a thick, mildly damaged one are indistinguishable to a pressure transient.

## The equivalent wellbore radius

There is a second way to express the same thing that some software and some reports use:

    rw' = rw exp(-S)

A well with a positive skin behaves like an ideal well of a smaller radius; a well with a negative skin behaves like an ideal well of a larger one. For the well in this course, a skin of plus 6.5 on a wellbore radius of 0.354 ft is an effective radius of well under a thousandth of a foot.

That form is useful for building intuition about stimulation. A hydraulic fracture of half-length 250 ft behaves roughly like a wellbore of radius half that, which is an effective skin of about minus 5 or minus 6, and that is the scale of improvement a fracture buys.

It is also the reason the engine's model catalog allows a skin down to minus 5 on the homogeneous model and bounds it at zero for the boundary and dual-porosity models: the effective-radius mapping does not commute with the image wells and the fissure functions, so a negative skin on those models would not mean what it says. That constraint returns in the Expert tier.

## Where skin shows up in the data

Not in the slope. The skin adds a constant pressure drop, the same at every time once radial flow is established, so it shifts the semilog line vertically without tilting it.

That is why the slope gives permeability and the position gives skin. Two separate pieces of information from one line, and they have very different sensitivities to the window you chose: the slope is fairly robust, the position is not.

## What skin is not

It is not the same as formation damage, though damage is its commonest cause. Several things that are not damage produce a positive skin: partial penetration, a well that deviates through the interval, non-Darcy flow in gas wells, a phase change near the wellbore.

Conversely a negative skin is not always a successful stimulation. A well that intersects a natural fracture reads negative. So does a well in a reservoir where the analysis has used a thickness smaller than the interval actually flowing.

The diagnosis of what a skin means is not part of the arithmetic. It comes from knowing the completion.

## The misconception to avoid

"Skin measures damage." Skin measures a pressure drop that the ideal radial solution does not explain. Attributing it to damage is an interpretation, and it is the interpretation that gets acted on, so it is worth stating separately from the number.

## Exercise

Two wells in the same reservoir both report a skin of plus 6. One is a vertical well completed across the whole interval; the other is completed across a fifth of it.

State which of the two you would expect to respond to an acid job, and why the same skin factor means different things in the two cases.
