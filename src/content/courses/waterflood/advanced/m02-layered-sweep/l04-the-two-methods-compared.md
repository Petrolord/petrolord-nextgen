# The two methods compared

Two methods, one column, two answers. This lesson puts them side by side, shows where they agree exactly, and explains the direction of their disagreement.

## Side by side on Ekene

Coverage at each breakthrough, Dykstra-Parsons at $M = 1.2$ against Stiles:

| stage | Dykstra-Parsons | Stiles | difference |
|---|---|---|---|
| 0 | 0.5146907350993352 | 0.5283542009271434 | -0.013663465827808197 |
| 1 | 0.7006338168863273 | 0.712244206408273 | -0.011610389521945708 |
| 2 | 0.82871309650611 | 0.8365881348910084 | -0.007875038384898336 |
| 3 | 0.9282289679872078 | 0.9319439266959082 | -0.003714958708700422 |
| 4 | 1 | 1 | 0 |

Dykstra-Parsons is lower at every stage, by about 1.4 coverage points at the first breakthrough, shrinking to zero at the last.

## The exact agreement at $M = 1$

Set the mobility ratio to 1 and the two coverage columns become identical. Not close: identical, element by element, to the last bit.

The reason is algebraic. The Dykstra-Parsons frontal position

$$x_j = \frac{M - \sqrt{M^2 + r(1 - M^2)}}{M - 1}$$

is indeterminate at $M = 1$ and its limit is $x_j = r$, which is exactly the Stiles kinematic assumption. The engine implements the limit as a special case for $|M - 1| < 10^{-9}$, so at $M = 1$ it literally computes the Stiles rule.

That is a good property to check on any pair of methods that are supposed to be related: find the limit where they should coincide and confirm they do exactly, not approximately. If they only agree to three decimals at the limit, one of them has an error.

## Why Dykstra-Parsons is lower at $M > 1$

At an unfavourable mobility ratio the water behind the front is less mobile relative to the oil ahead of it than the permeability ratio alone suggests. A layer whose front has advanced part way carries a two-bank series resistance, and the water bank is the less conductive of the two, so the slow layers advance more slowly than proportionality would give.

That is the physical content of the $M$ dependence, and it means an unfavourable mobility ratio hurts vertical sweep as well as areal sweep and displacement. Three separate penalties from one number.

At $M < 1$ the sign reverses: Dykstra-Parsons predicts BETTER coverage than Stiles, because the favourable mobility contrast helps the lagging layers catch up.

## The mobility ratio sensitivity

Coverage at first breakthrough for the Ekene column across a range:

| $M$ | coverage at 1st BT | WOR at 1st BT | coverage at 3rd BT |
|---|---|---|---|
| 0.5 | 0.582878889525386 | 0.7293534481099888 | 0.8636284345132272 |
| 1.0 | 0.5283542009271434 | 0.9829435665757289 | 0.8365881348910084 |
| 1.2 | 0.5146907350993352 | 1.099451244867303 | 0.82871309650611 |
| 2.0 | 0.4814021171236619 | 1.6079096864163949 | 0.807288527628272 |
| 5.0 | 0.44357724095944917 | 3.7041953452008216 | 0.7787108778201577 |

Going from $M = 0.5$ to $M = 5$, a factor of ten, costs about 14 coverage points at the first breakthrough and five times the water oil ratio. The coverage effect is real and moderate; the water oil ratio effect is severe.

## Which to use

If the mobility ratio is near 1, either, and Stiles gives you the surface water cut for free.

If the mobility ratio is far from 1, Dykstra-Parsons, because that is the case its extra machinery exists for.

If you want a range, both. The gap between them at your mobility ratio is an honest indication of how much the kinematic assumption is worth, and quoting both is more informative than choosing.

For Ekene at $M = 1.2$ the gap is 1.4 coverage points at first breakthrough, which is small. That is itself a result: at a mobility ratio this close to one, the choice of method does not matter much, and effort is better spent on the layer description than on the method.

## The misconception to avoid

"Dykstra-Parsons is the more sophisticated method, so its answer is better." It is more sophisticated in one respect, the mobility dependence, and identical in every other assumption. Where the mobility ratio is near one, the extra sophistication buys nothing measurable, and both methods carry the same three structural assumptions that dominate the real uncertainty.

## Exercise

First, compute the difference between the two coverage columns at each stage from the table and confirm it shrinks monotonically to zero. Explain why it must vanish at the last stage.

Second, for a reservoir at $M = 4$, estimate from the sensitivity table how much coverage at first breakthrough is lost relative to $M = 1$, and state what fraction of that loss you would expect a polymer flood that brought $M$ to 1 to recover.
