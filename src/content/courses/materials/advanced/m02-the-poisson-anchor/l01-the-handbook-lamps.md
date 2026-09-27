# The handbook lamps

{{panel:materials-spares-calculator}}

No public text read for this course prints a worked insurance-spares cost example. The course therefore states the one-for-one model as the engine's model and ties its Poisson figure to a public-domain handbook: MIL-HDBK-338B, Electronic Reliability Design Handbook, dated 1 October 1998, a US Department of Defense handbook in the public domain, read for this course on 2026-09-27. This lesson reads the handbook's example and reproduces it in the spares calculator.

## What the handbook states

In plain words: the handbook gives the chance that no more than a stated number of failures happen in a stated time, which is the Poisson cumulative probability. Its own sentence, quoted from section 5.3.8, eq. 5.58:

> "In the case of redundant equipments, the R(t) might be desired in terms of the probability of r or fewer failures in time t." (MIL-HDBK-338B (1 October 1998) section 5.3.8, eq. 5.58)

Its example holds two spare lamps for a mission of a stated length:

> "A slide projector is needed for 500 hours of operation. Replacement of failed lamps is permitted, but there are only two spare bulbs on hand." (MIL-HDBK-338B (1 October 1998) example 5.3.8.1, p. 5-27)

And it asks whether two spares will see the mission through:

> "If the lamp failure rate is 0.001 failures per hour, what is the reliability for the mission (i.e., the probability that no more than two lamp failures will occur)?" (MIL-HDBK-338B (1 October 1998) example 5.3.8.1, p. 5-27)

## The figure the engine returns

A failure rate of 0.001 an hour over 500 hours is a Poisson mean of 0.500000. The chance of two failures or fewer is 0.985612 (engine); the handbook prints 0.986, the same figure at three decimals.

## The same mean as orders outstanding

The insurance model needs its mean in orders outstanding, so the golden case restates the lamps in its terms: 0.365 failures a year and a lead time of 500 days over 365 days a year. The mean is again 0.500000, and with two spares the probability of no shortage is 0.985612. The insurance calculation and the handbook compute one Poisson probability, and they agree.

That agreement is the anchor. The cost side of the model, holding against downtime, is stated arithmetic on stated inputs; the probability side is the handbook's, and the engine reproduces it.

## Exercise

Open the spares calculator on the view "Insurance spares" and start from "The handbook lamps as orders outstanding". Read the "Mean orders outstanding" tile (0.500000) and, in the row for 2 spares, the probability of no shortage (0.985612). Switch the view to "A slow-moving spare on Poisson demand" and start from "MIL-HDBK-338B, the lamps". Read the Poisson mean, the level the engine chooses for a cycle service level of 0.98, and the cumulative probability at level 2. Write one sentence saying why the two views print the same probability from different inputs.
