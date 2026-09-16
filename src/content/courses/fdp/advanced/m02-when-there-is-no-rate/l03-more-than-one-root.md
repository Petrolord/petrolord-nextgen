# More than one root

A cash flow that changes sign more than once can be driven to zero at more than one discount rate. When that happens there is no such thing as the rate of return, and the engine reports the status `multiple-roots` with no number at all.

{{panel:ec-value-explorer}}

## What puts a second crossing in a development plan

The EGINA plan spends 2250.0000 million USD in year 0, earns for twenty years, and pays 260.0000 million USD to abandon the field in the last of them. Its net cash flow therefore changes sign twice, down then up then down again, and by Descartes' rule a flow that changes sign twice can be zeroed at more than one rate. The engine finds every root rather than stopping at the first one it meets, and when it finds two it reports neither.

## The rates that zero each case

| case | NPV | status | the rates that zero this flow, percent |
| --- | --- | --- | --- |
| Base, 70 USD a barrel | 2015.4123 | multiple-roots | -44.3414 and 29.5779 |
| Low price, 48 USD a barrel | 392.8013 | multiple-roots | -26.6855 and 14.2149 |
| High price, 92 USD a barrel | 3638.0233 | multiple-roots | -66.9344 and 43.8661 |
| Tie-back base, 70 USD a barrel | 1013.7182 | multiple-roots | -24.3411 and 40.4136 |
| At 18 USD a barrel | -1834.1220 | no-root | none: the flow is negative at every rate the engine searches |

The cases carrying two roots are the ones that earn. A case that never climbs out of its hole reports `no-root` instead: at 18.0000 USD a barrel the value is -1834.1220 and at 30.0000 USD a barrel it is -935.1995, and both of those flows change sign without any rate inside the band zeroing them.

## Neither root is the rate of return

The two figures on a row are the discount rates at which that flow is worth nothing, and between them the plan is worth more than nothing. Quoting the higher one alone is the mistake the status exists to stop, and quoting the lower one as a loss is the same mistake upside down. A rate of return only ever summarises a flow that spends once and earns thereafter. Charge a real end-of-life cost and most development plans stop being that shape, which is why the value, and not the rate, is what a plan is judged on.

## One line of cost, and the question loses its answer

The same Base case run with no end-of-life cost at all is worth 2047.5653 million USD and reports a single rate of 29.5998 percent at the status `ok`. Charging the 260.0000 costs the plan 32.1530 million USD of present value and takes the rate away entirely.

## The published case that does the same thing

A deck shorter than its profile reads the missing prices as 0, so the uncovered years produce barrels at no revenue while still paying to lift them. That case is worth 126.1636, and the golden records a root the band hides at -52.4425 percent. It is not the return either, because another root exists. In the studio's plan path such a deck is refused by name rather than padded: "the price deck has no price for production year 3: enter a price for every year of the profile".

## The mistake

Reading `multiple-roots` as a synonym for `no-root`. Both withhold a rate and they say opposite things about the flow: one says more than one rate zeroes it, the other says none does.

## Exercise

Give the two rates that zero the Base flow and say why neither is the rate of return. Then state the status and the value at 30.0000 USD a barrel and at 18.0000 USD a barrel, and say what separates a flow with two roots from one with none.
