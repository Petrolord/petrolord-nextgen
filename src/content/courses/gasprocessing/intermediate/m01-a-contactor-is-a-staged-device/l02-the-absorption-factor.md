# The absorption factor

The absorption factor is the one dial in the staged half of this module that carries the whole of the solvent side of the problem. Everything about how much solution the column has, and how readily that solution takes the solute up, arrives in the relation as this single number.

## One number standing for the solvent side

The engine takes the absorption factor as an input. It does not build one for you out of a circulation rate, and nothing in this module derives it from the amine or glycol balances that sit next to it. That is deliberate and it is worth knowing before the first answer comes back, because it means a removal figure is only as good as the factor somebody typed above it.

What the engine does tell you is which way to move it. When a spec is out of reach the refusal names the remedy as more solvent rather than more trays, so the factor is the quantity that more solvent moves.

{{panel:fc-absorber-explorer}}

## The values the surface is read at

The teaching surface is read at seven factors, from a starved column at 0.6 through a well supplied one at 3. Three of those sit below one, one sits exactly at one, and three sit above it, and that arrangement is the point of the table rather than an accident of spacing.

| absorption factor | what the column is |
| --- | --- |
| 0.6 | starved of solvent |
| 0.8 | starved of solvent |
| 1 | the boundary case |
| 1.2 | supplied |
| 1.5 | supplied |
| 2 | supplied |
| 3 | generously supplied |

On the OBIAFU absorber the factor is 1.600000, which falls between two of the columns above. That is why the surface is a map to be read across rather than a lookup table to be indexed into.

## Why one is the interesting value

The number one is where the behaviour of the relation changes shape, and the whole of the next module is built on it. Above one, adding stages keeps buying removal. At and below one, the factor itself sets a ceiling and stages stop paying for themselves. The engine takes a separate arithmetic branch at exactly one, which is a fair measure of how sharp the change is.

So the habit to build now is to read the factor first and the stage count second. A stage count of six means one thing on a column whose factor is 1.600000 and something quite different on a column whose factor is 0.800000, and the difference between the two readings is not a difference of degree. On the first, more stages are an option. On the second, they are a way of spending money on a spec that will still be missed.

## Exercise

Record the absorption factor on the OBIAFU absorber and the removal it reaches at 6.000000 stages. Then name the seven factors the surface is read at, say which of them are below one, and state what the engine tells a user to change when a spec cannot be met.
