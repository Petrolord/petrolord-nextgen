# Classes and their minimums

{{panel:materials-register-calculator}}

A weighted score becomes a criticality class when you state where each class begins. The Ekene policy states three classes, highest first: V from 70, E from 44 and D from 0. An item takes the highest class whose minimum its score reaches.

## The Ekene classes

On the Ekene register the policy gives 6 items class V, 5 class E and 7 class D. A few of them, with the engine's reasons verbatim:

| id | weighted score | class | the engine's reason, verbatim |
| --- | --- | --- | --- |
| ESP-PMP | 74.000000 | V | ESP-PMP: weighted score 74 is at or above 70, the minimum for class V |
| COMP-RP | 66.000000 | E | COMP-RP: weighted score 66 is at or above 44, the minimum for class E, and below 70 for class V |
| CSG-958 | 42.000000 | D | CSG-958: weighted score 42 is at or above 0, the minimum for class D, and below 44 for class E |

Each reason names the minimum the item reached and, below the top class, the minimum it missed. Reading the reason tells you how far an item sits from a change of class: COMP-RP is 4 short of V, and CSG-958 is 2 short of E.

## Met at or above

What happens to a score exactly on a minimum? The engine's stated choice is that a class minimum is met at or above it. The register plants two items to show it. MECH-SEAL scores 70.000000, exactly the V minimum, and is V. GASKET-RJ scores 44.000000, exactly the E minimum, and is E. The engine's reason for MECH-SEAL, verbatim:

> MECH-SEAL: weighted score 70 is at or above 70, the minimum for class V

The alternative a policy could state is a minimum met only strictly above it, which would drop both items a class. The engine takes at or above, says so in every reason, and no graded figure in this course moves under the alternative. On two stated cases with classes V from 70, E from 40 and D from 0, a score of exactly 70 is V and a score of 69.95 is E:

> X: weighted score 69.95 is at or above 40, the minimum for class E, and below 70 for class V

## Classes that cannot work are refused

The classes are listed highest first, and each minimum must sit below the one above it. The last minimum must be 0, so that every item takes a class; a policy whose last class starts at 40 would leave low scorers with nowhere to go:

> classes[1].minScore must be 0 so that every item takes a class; got 40

A minimum that does not fall is refused with the figure it had to stay below:

> classes[1].minScore must be below the class above it (40); got 70

And a policy with a single class is no classification at all:

> classes must be an array of at least 2 classes, highest first

A call may carry at most 10 classes. A label may be used once only.

Each item id may be used once only as well. When the first two items share the id X, the repeat is refused on the second item's field:

> items[1].id repeats the id 'X'

## Exercise

Open the register calculator in "Criticality classes". Start from "A score exactly on a class minimum" and then "A score just below a class minimum", and copy each reason. Now start from the Ekene register and raise the class 2 minimum score control from 44 to 45. Before you look, predict GASKET-RJ's new class and the new count in each class; then check both against the panel. Restore the minimum to 44 and set the class 2 minimum to 70, and copy the refusal it gives.
