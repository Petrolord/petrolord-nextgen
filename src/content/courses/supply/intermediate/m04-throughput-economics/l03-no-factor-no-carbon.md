# No factor, no carbon

A loss with a weight is one step from an emissions figure. The last step needs an emission factor: kilograms of carbon dioxide equivalent for each tonne of product lost. The engine ships no such factor, and it will not compute emissions without one.

{{panel:supply-depot-explorer}}

## The formula

`throughputEconomics` computes:

emissions = loss tonnes x an emission factor the caller supplies

The factor this course uses is SYNTHETIC: 850 kg CO2e a tonne, invented for the course. It is not a published figure and does not describe petrol or any other product. It exists only to show the arithmetic. With it, IBAFO's period prints:

| item | value |
| --- | --- |
| loss tonnes | 3.4279 |
| emissions kg CO2e | 2913.7320 |
| kg CO2e per tonne of throughput | 1.481061 |

The emissions print in kilograms of carbon dioxide equivalent. The last row spreads them over the period's throughput, weighed in tonnes, so that one period can be compared with another at a different volume. It is an intensity, and it inherits the synthetic factor. Quote it only with the factor beside it.

## The refusal

With the factor left out, the engine computes the loss weight and stops:

| item | value |
| --- | --- |
| loss tonnes | 3.4279 |
| emissions kg CO2e | none |
| kg CO2e per tonne of throughput | none |

and it gives its reason in its own words:

> No emission factor supplied, so the carbon side is not computed. Factors are published, versioned data; an invented one would be worse than none.

## Why the engine ships no factor

An emission factor is published data. It comes from an inventory methodology with a name and a version, it differs by product and by what is being counted, and it is revised. A factor built into an engine would silently become whatever version the programmer copied, and every report from that engine would carry it without a citation. When the methodology moves, the reports would not.

So the factor is an input with a source. The depot's sustainability team supplies it, names where it came from, and owns its version. The engine's job is the arithmetic, and a missing factor is a missing input the same way a missing density is.

## Why none is better than a guess

A guessed factor produces a figure with four decimals and no warning. It can enter a disclosure, be summed across depots and be compared year on year, and the guess travels with it. A none cannot be summed or compared by accident. It forces the question of where the factor comes from at the one point where someone can answer it.

This is the same reasoning the Associate tier met with the volume correction factor. The engine shows the form of the calculation, refuses without the coefficients, and ships none. This course's synthetic figures, the coefficient row there and the 850 kg CO2e a tonne here, are labelled as synthetic at every use for the same reason.

## The money side is untouched

In both cases the margin is 4988.00 USD and the revenue 20592.00 USD. The carbon ledger failing to compute does nothing to the money ledger. The two are computed from the same volumes and neither depends on the other, which the next lesson reads directly.

## Exercise

Read the IBAFO case with the synthetic factor and the case with none. Quote the emissions and the intensity in the first, and the engine's note in the second. Say what the factor's unit is, why the engine ships no factor, and why the margin prints the same in both cases.
