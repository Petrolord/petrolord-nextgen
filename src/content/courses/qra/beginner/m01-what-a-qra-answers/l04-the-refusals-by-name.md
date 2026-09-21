# The refusals, each naming its field

{{panel:qr-event-tree}}

When an input cannot support a calculation, the engine computes nothing. It returns an object with `error` and `field`, where `field` names the offending input down to its position in a list. A refusal carries no number of its own, because a number would look like a result. Across the whole engine 39 refusals are tabled across 13 functions. Five that guard the arithmetic of this tier are quoted below, each in the engine's own words.

## Two refusals that guard a tree

> tree.branches: must be a non-empty list of { name, probability, next? }

An event tree with no branches has nothing to split the initiating frequency into. The message also tells you the shape a branch must have: a name, a probability and, optionally, a further branch set beneath it.

The second guards the rule every event tree lives by.

> tree.branches: the branch probabilities sum to 0.8999999999999999, not 1 (tolerance 1e-9): every branch set must be exhaustive and exclusive

This is the call that passed branches of 0.6 and 0.3. The two do not cover every way the event can go, so a tenth of the initiating frequency would vanish from the tree. The engine prints the sum it found, names the tolerance it allows, and states the rule the set broke.

## One refusal that guards a probability of death

> scenarios[0].fatalityProbability: 'fire' must be a probability of death in [0, 1]

The message names the list, the index, and the scenario by the name you gave it. A stated Pd is an input from the consequence course, and whatever that course returned, it can never be more than certain death.

## Two refusals that guard a roster

> locations[0].occupancyFraction: 'deck': give exactly one of occupancyFraction and hoursPerYr

Occupancy may be typed either way. Typing both invites the two to disagree, and the engine refuses to guess which one you meant. Pick the form your roster already uses and type only that one.

The second catches a roster that is internally impossible.

> locations: the occupancy fractions sum to 1.1: one person cannot spend more than the whole year across locations

A roster of 0.6 and 0.5 of the year puts one person in two places at once. The field here is the whole `locations` list, because no single entry is wrong on its own; the total is.

## Reading a refusal

| what to read first | why |
| --- | --- |
| `field` | it names the input, with its list index |
| the quoted name inside the message | it identifies the entry by the name you typed |
| the clause after the colon | it states the rule that was broken |

The engine never partially computes. Either a `basis` block comes back with the whole answer, or one of these strings does, and nothing else. That is the second face of the choice that nothing is invented: when the engine cannot use an input as given, it declines, and it never substitutes a value of its own.

## Exercise

A roster places one operator on the deck for 0.6 of the year and in the accommodation for 0.5 of the year. Add the two fractions and compare the total with the 1.1 in the message above. Write the field the engine returns, then change one fraction so that the total reaches one exactly and say whether the engine would accept it.
