# Dykstra-Parsons stages

The Dykstra-Parsons method takes a layer set and a mobility ratio and produces a table: at each layer's breakthrough, how much of the column has been swept and what water oil ratio the producer is making. This lesson works it on the Ekene column.

## The frontal position

The central relation gives where the front in layer $j$ sits when layer $i$ breaks through, as a fraction of the distance. With $r = k_j / k_i$ and mobility ratio $M$:

$$x_j = \frac{M - \sqrt{M^2 + r(1 - M^2)}}{M - 1}$$

and in the limit $M \to 1$ this reduces to $x_j = r$: fronts advance in proportion to permeability.

Hand values worth knowing, at $r = 0.5$:

| $M$ | $x$ |
|---|---|
| 0.5 | 0.5811388300841898 |
| 1.0 | 0.5 |
| 1.2 | 0.47731949140636953 |
| 2.0 | 0.41886116991581024 |

A favourable mobility ratio pushes the slow layer's front FURTHER along than the permeability ratio alone would, and an unfavourable one holds it back. That is the whole reason $M$ belongs in a sweep calculation: it changes the geometry, not just the recovery.

A layer with $r \ge 1$ has already broken through and returns $x = 1$.

## The coverage

$$E_V = \frac{\sum_j h_j x_j}{\sum_j h_j}$$

with $x_j = 1$ for the layers already through.

## The water oil ratio

At reservoir conditions, in units of endpoint water mobility which cancel:

$$\text{WOR}_i = \frac{\sum_{j \le i} k_j h_j}{\sum_{j > i} \dfrac{k_j h_j}{x_j + M(1 - x_j)}}$$

The numerator is the conductivity of the layers making water. The denominator is the conductivity of the layers still making oil, each reduced by a two-bank series resistance: the water bank of length $x$ and the oil bank of length $1 - x$ in series, which is where the $x + M(1-x)$ comes from.

At the last stage every layer is through, there is no oil, and the water oil ratio is infinite.

## The Ekene table

At $M = 1.2$:

| stage | $k$ broken (md) | coverage | WOR |
|---|---|---|---|
| 0 | 607.7507038307907 | 0.5146907350993352 | 1.099451244867303 |
| 1 | 359.5839451276606 | 0.7006338168863273 | 2.3487180336335642 |
| 2 | 250 | 0.82871309650611 | 5.307953543353247 |
| 3 | 173.81198701129736 | 0.9282289679872078 | 19.26213317694089 |
| 4 | 102.8382190362731 | 1 | infinite |

Read it as a story. When the fast layer breaks through, just over half the column has been contacted and the producer immediately makes about one barrel of water per barrel of oil. By the third breakthrough the coverage is 0.83 and the water oil ratio is over five. By the fourth it is 19, and the well is producing almost nothing but water while a fifth of the column has still not been reached.

That shape is the signature of vertical conformance loss: coverage improves slowly and the water oil ratio deteriorates fast.

{{panel:wf-design-explorer}}

In layers mode the tiles report the first-breakthrough coverage and water oil ratio, and the coverage at the third breakthrough. Move the mobility ratio slider and watch all three move.

## Where the economic limit lands

Take a water oil ratio limit of 5 at reservoir conditions, which is not extreme. Ekene's column reaches it at the third breakthrough, at a coverage of 0.82871309650611.

So the vertical sweep this column can deliver, within a plausible economic limit, is about 0.83, not 1. The last two layers, 32 feet of the 84, contribute almost nothing because reaching them costs a water oil ratio nobody will pay.

That is the number that matters for a design, and it is the reason a sweep calculation has to be paired with an economic limit before it means anything.

## The misconception to avoid

"Coverage of 1 at the last stage means full sweep is achievable." It is achievable in the sense that continued injection eventually reaches every layer. It is not achievable economically, because the water oil ratio on the way there goes through 19 and then to infinity. A coverage number without the water oil ratio beside it is half a result.

## Exercise

First, verify the frontal position at $r = 0.5$ and $M = 1.2$ from the formula, and confirm you get 0.47731949140636953. Then compute it at $M = 1.2$ for $r = 0.2$.

Second, using the Ekene stage table, find the coverage at a reservoir water oil ratio limit of 2.5 and of 10, and comment on how much extra sweep the higher limit buys.
