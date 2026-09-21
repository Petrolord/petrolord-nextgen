# Forgetting a factor, and what it costs

{{panel:lp-worksheet}}

A LOPA row is a product, so every factor left off it multiplies the answer by the reciprocal of that factor. There is no rounding and no cushioning. The ORONI row run five times, each time with one term left out, shows exactly what a missing factor is worth, and the sizes are large enough that no review should treat any of them as detail.

## The same row, five ways

| what was left out | unmitigated frequency per year | over the full row, derived |
| --- | --- | --- |
| nothing left out | 0.013500000000 | 1.000000 |
| the enabling condition left out | 0.045000000000 | 3.333333 |
| ignition left out | 0.027000000000 | 2.000000 |
| the blast zone modifier left out | 0.067500000000 | 5.000000 |
| every modifier left out | 0.135000000000 | 10.000000 |

The full row is 0.013500000000 per year. Dropping the enabling condition of 0.3 multiplies it by 3.333333. Dropping ignition at 0.5 doubles it. Dropping the blast zone modifier at 0.2 multiplies it by 5.000000. Dropping both modifiers multiplies it by 10.000000, all the way to 0.135000000000 per year.

## A forgotten factor is never harmless

It is tempting to read the table as a safety margin, because leaving a factor out raises the frequency and so raises the risk reduction the row demands. That reading is wrong in both directions. Leaving out a real enabling condition overstates the frequency and so the risk reduction demanded, and the plant buys a function it did not need and maintains and proof tests it for its life. Typing a factor the analyst cannot justify understates the frequency, and the plant does not buy the function it did need.

Neither error is on the safe side of anything. Both are errors in a number that people will act on, and the cost of the first is real money and real proof test effort while the cost of the second is the hazard itself.

## Why each factor carries a name

Every factor on the row has to be defended in writing, which is why the engine keeps each one with the name the analyst gave it and returns them in their two lists. A reviewer reads the name, asks for the argument behind the figure, and strikes out the ones with no argument. That is the only control there is, because the engine will multiply any admissible probability without comment.

There is a second habit the table argues for. When a row is revised, the revision is to the list of factors and their names, and the frequency is recomputed from the list. Editing a frequency directly to reach a number that feels right leaves the list and the frequency describing different scenarios. The engine helps here by returning the enabling product of 0.300000000000 and the modifier product of 0.100000000000 beside the frequency of 0.013500000000 per year.

Because the whole chain is proportional, the size of a missing factor follows through untouched. A row missing a factor of 0.2 demands a required risk reduction factor five times larger, and that is enough to move an outcome a whole band in many rows. The effect is the same whichever end of the chain the factor was on.

## Exercise

ORONI's required risk reduction factor is 13.500000 at an unmitigated frequency of 0.013500000000 per year. Using the table above, work out the required risk reduction factor the row would have reported with every modifier left out, and say which of the two figures would send a plant looking for a higher band of SIF. Then name the one document you would ask for before accepting the blast zone modifier of 0.2.
