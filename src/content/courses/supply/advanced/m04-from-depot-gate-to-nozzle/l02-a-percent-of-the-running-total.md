# A percent of the running total

A per-litre element is the same amount wherever it sits in the build-up. A percentage element is not, because it is a percent of some base, and the base depends on where the walk has reached. The pump template gives its one percentage line, the value added tax, the basis percent_of_running. This lesson reads what that basis means and what changes when the same rate is typed on the other percentage basis the engine knows.

{{panel:supply-price-explorer}}

## On the running total

The engine's `PRICE_ELEMENT_BASIS` list has three entries: per_litre, percent_of_landed and percent_of_running. A percent of the running total adds that percent of everything above it in the waterfall.

On BADAGRY, the value added tax is the course's invented 6.5 percent. It is the last element. Everything above it sums to a running total of 1009.2253 naira a litre, which is the landed cost of 884.6753 plus every invented margin and the invented levies. The tax row adds 65.5996 naira a litre, and the pump price is 1074.8249 naira a litre.

Because the tax bites on everything above it, it bites on the margins and on the levies too. The depot margin, the dealer margin and the statutory levies are all part of its base.

## On the landed cost

The course prices the same 6.5 percent a second way, typed as a percent of the landed cost instead of the running total. Every other invented element is unchanged. The engine prints a pump price of 1066.7292 naira a litre.

So the same rate, on the same cargo, with the same margins, gives:

| the 6.5 percent typed as | pump price naira/L |
| --- | --- |
| percent of the running total | 1074.8249 |
| percent of the landed cost | 1066.7292 |

The only input that differs is the basis. That is the tier's trap in its simplest form: a percentage bites on the base it names, and the base is part of the answer.

## Which basis is right

Neither this course nor the engine can say which basis a real tax uses. A value added tax, a sales tax or any levy expressed as a percentage is defined by the regulation that imposes it, and the regulation names its base. The engine's job is to make the base an explicit, named input and to apply the rate to exactly that base. The user's job is to read the base off the regulation and type it.

What the two prices show is the cost of getting the base wrong. A tax typed on the landed cost where the regulation puts it on the running total leaves the price at 1066.7292 naira a litre where the build-up with the right base prints 1074.8249. Nothing in the first figure looks wrong. It carries every invented rate, and only its base is mistaken.

## The order and the running basis

A running-total element depends on its place. If an invented margin were added after the tax, the tax would not bite on it. That is why a percentage row's place in the waterfall belongs to the input. In the template, the value added tax sits last, so every other element is in its base.

## Exercise

Record the running total before the value added tax, the tax row's amount and the pump price with the tax on the running total, then the pump price with the same 6.5 percent typed on the landed cost. Say what the two pump prices, read against each other, show about the basis of a percentage element being part of the input.
