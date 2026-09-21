# Conditional modifiers

{{panel:lp-worksheet}}

A conditional modifier is the probability that the consequence follows once the initiating event has occurred and the enabling conditions hold. The event has happened, the plant was in the state that lets it propagate, and the modifier answers what still has to go wrong for the consequence on this row to be realised. Like an enabling condition it is a probability above zero and no more than one.

## ORONI's two modifiers

| term | name | probability, stated |
| --- | --- | --- |
| conditional modifier | ignition | 0.5 |
| conditional modifier | operator in the blast zone | 0.2 |

The consequence on this row needs the released hydrocarbon to ignite and needs somebody within reach of the result. Each of those is a stated probability, and the engine multiplies them into one figure, `modifierProduct`, which reads 0.100000000000.

Notice what the two modifiers are doing. They narrow the consequence from any release to the particular consequence the row is carrying. That is why the row's tolerable frequency can be set for a consequence involving people. Change the consequence and the modifiers change with it.

## The engine treats both kinds the same way

An enabling condition and a conditional modifier are both factors in one product, and the engine applies them identically. The difference is in how the analyst justifies them. An enabling condition is defended from the fraction of time the plant spends in a configuration. A modifier is defended from a physical argument about ignition, occupancy or the chance of escape, and those arguments are of a different kind and are reviewed by different people.

The engine keeps them in two lists so the worksheet shows which is which, and it requires a name on every entry. A modifier with no name is refused by field:

> conditionalModifiers[0].name: every entry needs a name

## What each modifier is worth on this row

| what was left out | unmitigated frequency per year | over the full row, derived |
| --- | --- | --- |
| nothing left out | 0.013500000000 | 1.000000 |
| ignition left out | 0.027000000000 | 2.000000 |
| the blast zone modifier left out | 0.067500000000 | 5.000000 |
| every modifier left out | 0.135000000000 | 10.000000 |

Ignition at 0.5 carries a factor of 2.000000 and the blast zone modifier at 0.2 carries a factor of 5.000000. Together they carry 10.000000, which is the whole of the difference between 0.013500000000 and 0.135000000000 per year.

A modifier is the easiest factor on a worksheet to claim and the hardest to defend, because every one of them makes the row look better. The occupancy figure in particular is a claim about where people are during an upset, and an upset is when people go to look. The engine has no view on any of this. It multiplies what you type and prints each factor back with the name you gave it, so a reviewer can argue with the number and the name together.

## Exercise

ORONI's modifier product is 0.100000000000 from 0.5 and 0.2. Work out what the modifier product and the unmitigated frequency would become if the occupancy argument were withdrawn and the blast zone modifier removed from the row. Compare your frequency with the 0.067500000000 per year in the table above, and write one sentence on what that change does to the risk reduction the row will demand.
