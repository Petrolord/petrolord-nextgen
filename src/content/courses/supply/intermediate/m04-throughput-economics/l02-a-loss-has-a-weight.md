# A loss has a weight

A depot loses product. Some evaporates from tank vents and loading arms, some is left in lines, some is measured away by meters that drift. The stock ledger records the loss as a volume. The carbon ledger needs a mass. The engine converts one to the other only when it is given the one fact that links them, and this lesson reads that conversion and its refusal.

{{panel:supply-depot-explorer}}

## From cubic metres to tonnes

`throughputEconomics` weighs the period's loss:

loss tonnes = loss m3 x density / 1000

IBAFO's period loss is 4.600 m3 of petrol, at a density of 745.2 kg/m3. The engine prints:

| item | value |
| --- | --- |
| loss m3 | 4.600 |
| density kg/m3 | 745.2 |
| loss tonnes | 3.4279 |

Tonnes print to four decimals. The division by 1000 turns kilograms into tonnes. Nothing else enters.

## Density is a measured input

The density belongs to the product actually lost, from the depot's own certificate of quality or its own measurement. The engine's pricing module carries a table of typical densities by product, labelled as a starting point, and nothing in the engine reads it unless a caller passes a figure in. The throughput call does not reach for a typical petrol density when the box is blank. It does the only honest thing and gives the loss no weight.

With the density left out, the same IBAFO period prints:

| item | value |
| --- | --- |
| margin USD | 4988.00 |
| loss tonnes | none |
| emissions kg CO2e | none |

and a note in the engine's words:

> No product density supplied, so the loss has no weight and the carbon side is not computed.

The margin is untouched at 4988.00 USD, because the money ledger never needed a weight. The loss tonnes and every figure built on them read none.

## Why not assume a density

A typical petrol density is close enough for many purposes, and that is the danger. A carbon figure computed from an assumed density looks exactly like one computed from a measured density, and nobody reading the report can tell them apart. The course's Associate tier made the same point about the opening stock of a day and the coefficients of a volume correction factor: a figure that nobody measured enters a chain without a trace, and everything after it inherits the guess. The engine's answer is to stop the chain at the missing link and say which link it is.

## The loss volume itself

The loss volume is the depot's own figure, and it carries its own history. At a terminal it comes from a reconciled day: opening stock, receipts, deliveries and a closing dip, with the unaccounted volume set against a tolerance. The Associate tier worked that ledger for AKODO. Here the loss arrives as a typed input for the period, and the engine takes it as given. If the loss is itself uncertain, its weight inherits that uncertainty, and so does the carbon figure.

## Units

Keep three units apart: the loss in cubic metres, the density in kilograms per cubic metre, the weight in tonnes. The weight is a mass, and it is the only one of the three a carbon factor can act on.

## Exercise

Read IBAFO's loss volume, density and loss tonnes. Say what the formula does with each figure and why the division by 1000 is there. Then read the case with no density: quote the engine's note, and say why the margin still prints while the loss tonnes do not.
