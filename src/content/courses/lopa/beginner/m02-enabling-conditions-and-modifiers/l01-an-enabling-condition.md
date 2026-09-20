# An enabling condition

{{panel:lp-worksheet}}

An enabling condition is a state that must hold for the initiating event to lead anywhere. It is not a protective layer and it does not stop the event. It describes the fraction of the time the plant is in the configuration where the event can propagate to the consequence on this row. Because it is a fraction of time, it enters the row as a probability above zero and no more than one.

## ORONI's enabling condition

| term | name | probability, stated |
| --- | --- | --- |
| enabling condition | separator on the high pressure manifold | 0.3 |

The separator overfill row only reaches its consequence while the separator is lined up on the high pressure manifold. The stated figure for that is 0.3, and the engine reports the product of the enabling conditions, `enablingProduct`, as 0.300000000000. With one condition on the row the product is simply that condition.

The figure is an input like every other. The engine neither derives it from an operating schedule nor checks it against one. What it enforces is the range, and it names the field when the number is outside it.

## Why it is a separate list

The engine keeps enabling conditions and conditional modifiers in two lists, although it multiplies both into the same product and treats them identically in the arithmetic. The separation is there so the worksheet shows which factor is which, and so each kind is justified the way its kind has to be justified. An enabling condition is defended by showing how much of the year the plant spends in that configuration. A conditional modifier is defended in a different way, which the next lesson takes up.

The alternative would have been one list of factors with a free text note beside each. The engine does not take that route, because the two kinds fail review for different reasons and a worksheet that blurs them makes the reviewer do the sorting.

## What one enabling condition is worth

ORONI's initiating frequency is 0.45 per year. The enabling condition alone carries it to a smaller number before any modifier or layer is applied, and leaving it off the row moves the unmitigated frequency from 0.013500000000 to 0.045000000000 per year, which the digest records as a factor of 3.333333 over the full row.

| what was left out | unmitigated frequency per year | over the full row, derived |
| --- | --- | --- |
| nothing left out | 0.013500000000 | 1.000000 |
| the enabling condition left out | 0.045000000000 | 3.333333 |

A condition claimed and not defensible pulls the frequency the other way and understates the risk reduction the row needs. This is why every enabling condition is entered with its name attached, and why the engine refuses an entry that has no name.

## Exercise

ORONI's enabling product is 0.300000000000 and its unmitigated frequency is 0.013500000000 per year. Suppose a second enabling condition were added to the row at 0.5, defended as the fraction of the year that a particular pump line is in service. Work out what `enablingProduct` would become and what the unmitigated frequency would become, and then write one sentence on the evidence you would need before claiming that second condition.
