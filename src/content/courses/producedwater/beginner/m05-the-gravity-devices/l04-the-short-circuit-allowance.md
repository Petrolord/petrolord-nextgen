# The short circuit allowance

Between the ideal basin of the algebra and the basin that gets built there is a factor, and this lesson is about what it is for and how the engine treats the values it is given.

## What the allowance represents

The derivation assumes the water crosses the basin as a uniform plug at one velocity. Real vessels do nothing of the sort. Water finds paths, corners hold stagnant volume, inlets throw jets, and some fraction of the flow reaches the outlet sooner than the arithmetic says it should. The allowance, written F, raises the rise velocity a droplet must achieve, which coarsens the cut size. It is a way of saying that the vessel performs worse than its dimensions suggest, and it is the one place in this device where engineering judgement enters an otherwise closed calculation.

## What it costs to move it

| F | cut micron | warning |
| --- | --- | --- |
| 1 | 134.725142 | F outside the customary band |
| 1.3 | 153.610296 | none |
| 1.5 | 165.003927 | none |
| 1.8 | 180.752746 | none |
| 2.5 | 213.019154 | F outside the customary band and the cut droplet outside creeping flow |

The module defaults to 1.5, and that default is a declared constant rather than a derivation. The customary range is 1.3 to 1.8, and inside it the engine returns no warning at all. Outside it the answer still comes back with the band named, so a reader deliberately working at an unusual allowance is not blocked and is not left to remember the range unaided.

## The row at the top of the table

An allowance of 1 says the basin behaves exactly as its dimensions predict, with no short-circuiting anywhere. That is the most optimistic assumption available and it produces the finest cut size in the table, which is what makes it dangerous. It is the value a designer under pressure reaches for, and it is the value the engine warns about.

## The values it declines outright

Three inputs get a refusal rather than a warning, and the engine's own wording is worth reading. An F of 0 is refused because the short-circuit factor F must be positive and this is 0, and because an F of zero or less is not a perfect separator, it is an undefined one. An F of -2 is refused the same way and named the same way. An F of 6 is refused because F is a turbulence allowance customarily between 1.3 and 1.8, this module holds it to 5, and this is 6.

Notice how those differ from the warnings. The warned values are answerable and doubtful. The refused values are outside what the quantity means at all, and in each case the module states what the quantity is before it states what was wrong with the input. A refusal that only said the input was invalid would leave the caller guessing at the range.

{{panel:pw-water-explorer}}

## Exercise

Explain in physical terms what the allowance is compensating for, and why raising it coarsens the cut size. Then say why 1 earns a warning while 0 earns a refusal, given that neither is a value this module recommends.
