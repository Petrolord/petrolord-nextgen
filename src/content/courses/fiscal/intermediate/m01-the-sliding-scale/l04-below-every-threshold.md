# Below every threshold

A price that never reaches a tier does not escape royalty. The rate falls back to the lowest tier's, so that tier is the floor, and on a poor price deck that floor is the only rate the field ever pays.

{{panel:ec-instrument-explorer}}

## The published case

`price_below_every_threshold` runs the Designer's default project at a price multiplier of 0.5, which puts oil at 35 USD per bbl, against the royalty of the Designer's sample PSC regime, 60 USD/bbl at 12.5 percent and 80 USD/bbl at 15 percent; its values are illustrative samples. Neither threshold is ever reached:

| year | grossRevenue | royalty | implied rate |
| --- | --- | --- | --- |
| 1 | 144.2389 | 18.0299 | 0.125000 |
| 2 | 129.4878 | 16.1860 | 0.125000 |
| 3 | 116.2511 | 14.5314 | 0.125000 |
| 5 | 101.3476 | 12.6685 | 0.125000 |
| 8 | 73.3389 | 9.1674 | 0.125000 |

The implied rate is 0.125000 in every year. That is the lowest tier's rate, which `getSlidingScaleRoyalty` falls back to when no threshold has been reached. No threshold was met.

## What that costs

The case is not a marginal project, it is a losing one, and the royalty is charged anyway. Over the life it pays 177.3774 million USD of royalty on total revenue of 1419.0195, while contractor net cash flow reaches only 80.8085, government cash flow is 396.7675 and NPV at 10 percent is negative 111.7254. The internal rate of return is null, payback does not arrive until year 12, and 72.2941 million USD of cost is still sitting unrecovered when the horizon closes. A royalty larger than twice the contractor's whole lifetime cash flow was collected from a project that destroyed value.

## The mistake

The wrong intuition is that a tier list keyed at 60 and 80 USD per bbl means no royalty below 60. It means 12.5 percent below 60. A reader who assumes zero will predict a royalty line of zeros, a much larger profit oil, and a project that looks marginal rather than negative. The number that gives it away is 18.0299 in year 1 on 144.2389 of revenue.

The other trap is the tiered teaching regime, whose lowest tier is keyed at 0 USD/bbl. There that tier is reached at any positive price, so the fallback never shows itself and the behaviour looks like an ordinary threshold rule. Every tier list has to be checked for what its lowest entry does at low price, because that entry is a default and not only a tier.

## What it refuses

There is no relief mechanism. The royalty has no minimum price below which it is waived, no reduction when cost recovery is failing, and no link to whether the field is making money. The instrument sees a price, picks a rate and charges gross revenue, and it does the same in year 1 with 500.0000 million USD of capex in the row as it does in year 25.

## Exercise

State the implied rate in years 1 and 8 of the case and say which tier produced it. Then say what the royalty line would look like if the first tier's rate were treated as zero, and name the year 1 royalty that proves it is not.
