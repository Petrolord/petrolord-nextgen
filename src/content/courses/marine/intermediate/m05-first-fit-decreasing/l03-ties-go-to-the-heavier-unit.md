# Ties go to the heavier unit

{{panel:marine-deck-calculator}}

Sorting by area leaves a question the rule itself does not answer: what comes first when two units have the same footprint? Every unit of one item line ties with its siblings, and different items can tie too, a 2 m by 3 m skid and a 3 m by 2 m skid being the obvious case. A packing that is to be repeatable needs a stated order for ties, and the engine states one.

## The tie order

Units of equal footprint are ordered heavier first, then by item id, then by unit number. The unit number settles ties within a line, so pipe-bundle#1 always comes before pipe-bundle#2. The item id settles ties between different items of equal area and equal weight. The weight settles everything else.

## The golden case

Three item lines with the same footprint of 6.000000 m2 each:

| item | size | weight, t | quantity |
| --- | --- | --- | --- |
| b | 2 m by 3 m | 1 | 2 |
| a | 3 m by 2 m | 1 | 1 |
| c | 6 m by 1 m | 4 | 1 |

The engine sorts them c, a, b#1, b#2: c first because it is heavier, then a before b by id, then b's two units by number. The deck holds two of them a voyage, so voyage 1 takes c and a and voyage 2 takes b#1 and b#2.

## A reading the engine states

Putting the heavier of two equal footprints first is a reading the engine states. The alternative puts the lighter first, and on this case it would send c to the second voyage. A planner can see a practical case for it: weight is the limit that bites late, when a voyage's deck load is partly used, so the heavy unit goes on while the most load is free. The voyages used are the same under either reading; which unit rides which voyage is what moves. A plan that relies on the order of equal footprints says which reading it uses.

Ties are rarer than they look on a real manifest. On the Ekene cargo every item line has its own footprint, so the tie order acts only within a line, where the unit number decides and nothing of substance moves.

## Why a stated order matters

Without a stated tie order two runs of the same rule on the same cargo could give different plans, and a checker could not reproduce a planner's deck. With it, the same inputs give the same packing on any machine, which is what lets a plan be audited unit by unit.

## Exercise

Open the deck calculator, choose the view "The deck plan" and start from "Equal footprints".

1. Read the packing order and the units carried on each voyage, and confirm c, a, b#1, b#2.
2. Change "item c: weight, t (stated)" from 4 to 1. Before you read the result, predict the new packing order from the tie rule, and which units share voyage 1.
3. Restore 4 for c and set "item a: weight, t (stated)" to 4. Predict the order when a and c tie on area and on weight.
4. Start from "Ekene deck cargo, one voyage, first-fit decreasing" and find two units of different item lines with the same footprint, if any. Say what that tells you about where the tie rule acts on this cargo.
