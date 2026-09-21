# Losses on the product side

Not every barrel that goes into a refinery comes out as product. Where in the netback that loss is taken decides the figure.

{{panel:crude-valuation-explorer}}

## What a loss is

The engine treats losses as a volume shrinkage on the product side. A loss of 0.8 percent takes 0.8 percent off the product value that the yields and prices give, before any cost comes off. On the Kwale blend that is 0.5939 $/bbl off a gross product value of 74.2412 $/bbl.

That locates the loss exactly. It is a reduction in what is sold. It is not a cost that is paid, and it is not a discount on the crude.

## Where the engine takes it

Because losses shrink the products, they come off the product value before the costs. In the formula the gross product value is multiplied by (1 - loss percent / 100), and only then are processing cost and freight subtracted.

For the Kwale blend the digest prints the loss as its own term:

| term | $/bbl of crude |
| --- | --- |
| gross product value | 74.2412 |
| value lost to losses at 0.8 percent | 0.5939 |
| processing cost | 6.8000 |
| freight | 1.9000 |
| netback | 64.9473 |

The value lost is a figure in dollars per barrel of crude, reported separately, so the reader can see what the loss cost without rebuilding the sum.

## Two wrong places to take it

The digest computes the same terms two other ways, for contrast, and prints how far each lands from the engine's netback.

| reading | netback $/bbl | minus the engine's netback |
| --- | --- | --- |
| losses on the product side, before the costs (the engine) | 64.9473 | 0.0000 |
| losses taken off the netback after the costs | 65.0169 | 0.0696 |
| losses left out | 65.5412 | 0.5939 |

Taking the loss percent off the netback after the costs gives 65.0169, which the table above prints as 0.0696 from the engine's figure. That reading applies the shrinkage to a figure that already has processing and freight removed, so it shrinks the wrong quantity. In the engine's formula processing and freight are per barrel of crude and sit outside the loss factor, so the loss does not reduce them.

Leaving losses out gives 65.5412. The digest prints its distance from the engine's netback as 0.5939, and the engine's own term table prints the value lost to losses at 0.8 percent as 0.5939. Leaving the loss out simply puts that term back.

## Why the wrong answers look right

The tier header names this trap too: a loss taken after the costs gives a figure that looks finished. It is formed from the same inputs, the same percent and the same prices, and it prints to four decimals. The difference is purely where in the chain the percent is applied.

The engine reports every term, never only the total. A reader who sees gross, loss value, processing, freight and netback laid out can check that the loss came off the products, before the costs.

## The panel

The valuation explorer draws the netback as a waterfall: gross product value, then the loss, then processing, then freight, landing on the netback. The loss step sits directly after gross, where the engine takes it.

## Exercise

Read the three rows of the wrong-way table. Say what each reading does with the loss percent, and which figure in the engine's term table the "losses left out" difference of 0.5939 matches. Then say why processing cost and freight are not reduced by the loss.
