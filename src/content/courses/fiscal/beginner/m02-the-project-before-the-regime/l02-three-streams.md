# Three streams

A project carries oil, gas and NGL, each with its own initial rate and its own decline. They are summed in revenue and summed again, on a different conversion, in opex.

{{panel:ec-regime-explorer}}

## Three rates, three declines

The Designer's default project runs oil 10000 bbl/d declining 10 percent a year, gas 50 Mscf/d declining 8 percent, and NGL 1500 bbl/d declining 12 percent. ODIDI runs oil 8000 bbl/d declining 14 percent, gas 40 Mscf/d declining 9 percent, and NGL 900 bbl/d declining 15 percent. The published test project runs oil 30000 bbl/d declining 12 percent with gas at 0 Mscf/d and NGL at 0 bbl/d, so it is a single stream project and a useful control.

| year | default oil, million bbl | default gas, million Mscf | default NGL, million bbl |
| --- | --- | --- | --- |
| 1 | 3.650000 | 0.018250 | 0.547500 |
| 5 | 2.394765 | 0.013074 | 0.328333 |
| 25 | 0.291148 | 0.002467 | 0.025466 |

## The slowest decline wins the tail

Because each stream declines at its own rate, their proportions move. On the default project gas declines at 8 percent while NGL declines at 12, so between year 1 and year 25 gas falls from 0.018250 to 0.002467 million Mscf while NGL falls from 0.547500 to 0.025466 million bbl. The gas stream keeps a larger fraction of itself than either liquid stream does.

ODIDI shows the same thing harder, because its spread of declines is wider. Gas at 9 percent goes from 0.014600 to 0.001518 million Mscf, while NGL at 15 percent goes from 0.328500 to 0.006646 million bbl.

## Two summations, two conversions

The streams are combined twice, and not in the same way. In revenue each is multiplied by its own price from the deck. In opex they are converted to barrels of oil equivalent, with gas at 6000 scf per barrel, and the total is multiplied by one variable rate in USD per boe.

The published case `gas_and_ngl_streams` exists to prove the secondary streams reach both places. It runs the Generic template on the default project and reports total revenue 2686.9277 million USD, total royalty 335.8660 million USD and total contractor net cash flow 986.7327 million USD.

## The mistake

The careful reader reads 0.018250 in a gas column and compares it directly with 3.650000 in an oil column, concluding the gas is irrelevant. The gas column is million Mscf where the oil column is million bbl, and the two columns are not on the same axis. The conversion for opex is 6000 scf to the barrel, which the engine writes as a multiply by 1000 and a divide by 6000.

A related slip is assuming a zero stream is absent. The test project's gas rate of 0 Mscf/d and NGL rate of 0 bbl/d still declare a decline of 0 percent each and still produce a column of zeros for all 25 years. They contribute 0.0000 to revenue and 0 boe to opex, which is not the same as the engine skipping them.

## What the streams refuse

They refuse to interact. There is no gas oil ratio, no condensate yield tied to gas rate, no shrinkage and no fuel or flare deduction. Three independent exponentials, summed twice.

## Exercise

For year 5 of the default project, say which stream contributes most to revenue and which contributes least to boe. Then explain why the answer to those two questions can differ even though both start from the same three volumes.
