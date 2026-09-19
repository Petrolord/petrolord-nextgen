# A blank cost is named

A recovery left blank is refused. On-stream days left blank are refused. A cost box left blank is handled another way: it is taken as zero, and the engine names it in assumedZero.

{{panel:gasvalue-route-explorer}}

## Three CNG years

| CNG route | operatingCostPerYear | valuePerMscf | assumedZero |
| --- | --- | --- | --- |
| both costs typed | 2831875.00 | 7.8904 | none |
| variable cost left blank ('') | 1900000.00 | 8.2404 | variable operating cost |
| fixed cost left blank (null) | 931875.00 | 8.6040 | fixed operating cost |

Read the first row as the reference. The CNG route with both costs typed has an operating cost of 2831875.00 and a value per Mscf of 7.8904, and assumedZero reads none.

In the second row the variable cost box is left blank. The operating cost prints 1900000.00, which is the fixed cost the study typed, 1900000, with nothing added. The value per Mscf prints 8.2404. assumedZero reads variable operating cost.

In the third row the fixed cost is left blank. The operating cost prints 931875.00, and the value per Mscf prints 8.6040. assumedZero reads fixed operating cost. With the fixed cost zeroed, the operating cost is the variable part alone: 0.35 dollars on each of the parcel's 2662500.0000 Mscf.

The two probes blank the boxes in two ways. The variable cost is typed as an empty string (''), and the fixed cost is passed as null. Both are read as blank, and both are named.

## A zero that is named

In both blank rows the year still prints in full. The engine does not refuse the route. It carries a zero in the blank box and writes the name of the box it zeroed into assumedZero.

The two blank rows print values per Mscf of 8.2404 and 8.6040, beside the 7.8904 of the row with both costs typed. Each of them names the box it zeroed. Read the value per Mscf and assumedZero as one pair: the figure, and the input it was built without.

## Four ways a blank is handled

This tier meets four kinds of blank input, and each is handled its own way:

| blank input | what the engine does |
| --- | --- |
| a cost box | taken as zero and named in assumedZero |
| the recovery | refused: needs a recovery fraction in (0, 1] |
| the on-stream days | refused: On-stream days are required, more than 0 and no more than 366. |
| the reference plant cost | capital is null, with the note "No capital cost: a reference plant cost and capacity are required to scale from." |

The credit test adds one more. With the route's price missing, creditSensitivity answers with no verdict: breakevenCreditPrice null, and "No margin for this route, so whether it needs credits cannot be said. Supply its price and costs."

Each blank ends in a printed signal: a name, a refusal, a null with a note. None ends in a figure with nothing beside it.

In the panel, clear the CNG variable cost and read the operating cost, the value per Mscf and assumedZero together. Then type the cost back and read assumedZero return to none.

## Exercise

Read the three CNG rows. For each, give the operating cost, the value per Mscf and what assumedZero reads. Say which typed figure the operating cost equals when the variable cost is blank. Then name one blank input this tier refuses and one it answers with a null and a note, quoting the engine's words for each.
