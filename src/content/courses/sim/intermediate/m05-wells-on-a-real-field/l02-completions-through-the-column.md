# Completions through the column

Every vertical well in this deck is completed through all five layers. That is a modelling decision with consequences, and this lesson is about what it asserts and what the alternatives would say.

## What the deck says

    k1 = 1, k2 = 5, wellbore radius 0.35 ft

Five connections per well, one per layer, six vertical wells, thirty connections.

## What that asserts

That the well is open to the whole interval and every layer can flow to it.

For Ekene's producers that means the fast layer and the slow layers all report to the same well, and the well produces their mixture. That is exactly the situation the waterflood course's layered sweep analysis described: the 607 md layer breaks through first while the 102 md layer is still mostly unswept, and the producer sees the combination.

So the completion in the deck is consistent with the analysis the field already has. That consistency is not automatic and it is worth checking whenever a deck arrives with an analysis attached.

## The alternatives

**Selective completion.** Open only layers 1 to 3. The fast layer is layer 2, so this still includes it, and shutting layer 2 specifically is what conformance control would do.

**Layer by layer over time.** Open the whole column initially, then shut the layer that waters out. That is a real operating strategy and it needs a schedule that changes completions at dates.

**Perforate below the contact.** Never deliberate for a producer, and easy to do by accident when the model's layer depths differ from the well's own log. Ekene-2's half-cell offset is exactly the kind of thing that causes it.

## The well index

A connection is not just an on-off switch. The simulator computes a well index from the cell's permeability, its dimensions, the wellbore radius and the direction the well crosses it, and that index sets how strongly the cell is coupled to the well.

So a connection in the 607 md layer delivers far more than one in the 102 md layer, in roughly the ratio of their permeabilities. The five connections are not five equal contributions; they are weighted by kh.

That means the producer's output is dominated by layer 2, and the waterflood course's conclusion that the fast layer carries the flood follows in the deck as well.

## The wellbore radius

0.35 ft, which is about 8.4 inches, a reasonable hole size. It enters the well index logarithmically, so it is one of the least sensitive inputs in the deck: doubling it changes the well index by a few percent.

That insensitivity is worth knowing, because it means a wrong wellbore radius is not the explanation for a well that will not match. People spend time on it anyway.

## What a completion cannot express

Anything finer than a layer. A well perforated over 2 ft at the top of a 7 ft layer and one perforated over the full 7 ft are the same connection with the same well index.

If that distinction matters, the model needs more layers. A completion is as resolved as the grid, and no more.

## The misconception to avoid

"Completing the whole column is the neutral choice." It is a choice that says every layer contributes, which maximises the influence of the fast layer and therefore the early water. A selective completion is not more interventionist than a full one; both are decisions and both change the answer.

## Exercise

First, the five layers have permeabilities of 173.8, 607.8, 250, 102.8 and 359.6 md and thicknesses of 7.41, 9.06, 6.59, 5.76 and 5.76 ft. Compute each layer's share of the total kh, and state which layer dominates the well.

Second, name two operating strategies that require the completion to change during the run, and say what deck feature each needs.
