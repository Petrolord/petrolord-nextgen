# The usable fraction of the deck

{{panel:marine-voyage-calculator}}

A deck's rated area is never all available for cargo. Bulwarks, crash rails, lashing points, walkways, the crane's working space and the gaps between units all take their share. The engine does not guess that share. It asks for a usable fraction and multiplies the deck area by it. This lesson reads that input and shows how far it reaches into a plan.

## Deck area times the usable fraction

The deck area capacity is the stated deck area times the stated usable fraction. The Ekene vessels both state 0.75:

| vessel | deck area, m2 | usable fraction | deck area capacity, m2 |
| --- | --- | --- | --- |
| PSV Ekene Star (synthetic) | 800.000000 | 0.750000 | 600.000000 |

The AHTS's 550 m2 deck at the same fraction gives a smaller capacity, which the Ekene milk run's cargo overfills. The engine's basis for the PSV voyage states the rule: deck area capacity is the deck area times the usable fraction 0.75. The fraction applies to the deck area only. The deck load, the deadweight and the tanks are stated as capacities in their own right.

## A fraction between zero and one

The usable fraction must be above 0 and at most 1. A fraction of 1 says every square metre of the deck can take cargo, and it is accepted. A fraction of 0 would leave no deck at all, and a fraction above 1 would claim more deck than the vessel has; both are refused:

> vessel.deckUsableFraction must be a number above 0 and at most 1; got 0

> vessel.deckUsableFraction must be a number above 0 and at most 1; got 1.1

The fraction is required on every call, and a box that leaves it out is refused by name.

## How much the fraction moves

On the Ekene PSV milk run, deck area binds at a utilisation of 0.900000 with the fraction at 0.75. Raise the fraction to 1 and the deck area capacity becomes the full 800 m2. The deck is then far from full, and a different constraint becomes the closest to its limit: the deadweight, at 0.682857. One input changed which limit governs the voyage.

## Choosing a fraction

Skoko et al. treat a share of each vessel's capacity as usable (their Table 4), and the Ekene fixture states its own figure. Neither is a rule for every vessel. The share depends on the deck's layout and on the cargo mix, since long pipe and round tanks leave more gaps than square containers. A plan states its fraction and says where it came from.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "Ekene PSV milk run, rainy season". Note the binding constraint and its utilisation. Change "Usable deck fraction (stated)" from 0.75 to 1 and predict, before reading, whether deck area stays binding; then read the binding constraint and check it against the figure above. Type 0 into the same control and read the refusal, then 1.1. Restore 0.75 and confirm that deck area binds again at its first utilisation.
