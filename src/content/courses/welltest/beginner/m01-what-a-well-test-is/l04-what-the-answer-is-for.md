# What the answer is for

A permeability nobody acts on is a number. A skin somebody acts on is a workover.

## Four decisions

Well tests are not run out of curiosity. Each of the four quantities this course recovers feeds a decision that costs money.

**Permeability decides whether the field works.** It sets how many wells are needed to drain the accumulation at the rate the development plan assumes, and it feeds every simulation forecast. A permeability wrong by a factor of three, which module 5 will show you is easy to produce, changes a development from twelve wells to a different project entirely.

**Skin decides whether to intervene.** A positive skin is a pressure drop you are paying for at every barrel, caused by something near the wellbore that could in principle be removed: drilling damage, perforation crush, scale, fines. If the skin is large, an acid job or a re-perforation pays for itself. If the well is actually undamaged and simply sits in poor rock, the same intervention buys nothing.

**The extrapolated pressure decides what is left.** A buildup extrapolated to infinite shut-in time gives a pressure that feeds material balance and reserves. If it is high, the tank is fuller than you thought.

**The boundaries decide the drainage volume.** A test that runs long enough to feel the edges of the compartment measures the volume inside them, and that is the only place in this course where a well test measures a volume rather than a rate capacity.

## What a wrong skin costs

The well in this course carries a skin of plus 6.5, and at 450 stb/d that skin is responsible for something over a hundred psi of the pressure drop. Removing it entirely would let the well produce the same rate at a hundred psi higher flowing pressure, or a higher rate at the same pressure.

Now suppose the analysis reports a skin of minus 2.7 instead. That says the well is stimulated: better than an undamaged well, nothing to fix, look elsewhere for the underperformance. The intervention does not happen, the hundred psi keeps being paid, and the diagnosis of the field moves towards "the rock is worse than we thought."

Module 5 produces exactly that answer, from the correct data, using a defensible-looking straight line. That is the reason this tier exists.

## Flow efficiency, the number an engineer quotes

Skin is a dimensionless number and it does not communicate well. Flow efficiency is the same information as a fraction:

    flow efficiency = (average pressure - flowing pressure - skin pressure drop)
                    / (average pressure - flowing pressure)

It answers a plain question: of the pressure drop this well is being produced under, how much is doing useful work in the reservoir, and how much is being spent crossing the damaged zone?

A flow efficiency of 1 is an undamaged well. The well in this course comes out well below that, and you will compute it yourself in module 3. When the number goes to a manager, it goes as a percentage rather than as a skin factor, and the manager is right to prefer it.

## What a test cannot tell you

It is as important to know what a pressure transient does not measure.

It does not measure porosity. Porosity appears in the equations, but as an input you supply from logs and cores; the test cannot separate it from compressibility.

It does not measure net pay. The test measures the product of permeability and thickness, which is called kh, and dividing by a thickness to report a permeability is a choice you make with a log in your hand. If the thickness is wrong, the permeability is wrong by the same factor, and the kh was right all along.

It does not, on its own, measure oil in place. A closed-boundary test measures a pore volume, and turning that into oil needs a saturation from somewhere else.

And it does not measure the future. A test measures the reservoir as it is now, over the region the transient reached, and the extrapolation to a field forecast is somebody else's model.

## The misconception to avoid

"Well test results are hard data." A well test produces a pressure history, which is hard data, and an interpretation, which is not. Reports that hand over a permeability without the pressure plot, the window that was fitted and the model that was assumed are hiding the part that could be checked.

## Exercise

A well is producing at half the rate the development plan assumed. A buildup is run and reports a permeability a third of the mapped value and a skin near zero.

Write down two different physical explanations consistent with that result, and for each one, say what you would do next. Then say what you would ask to see before believing the result at all.
