# The government take curve

One series on one chart can carry three different states, and every point now says which one it is.

{{panel:ec-comparison-explorer}}

## The division and its three states

The price sweep plots government take, undiscounted. At each swept price it divides total government cash flow by total government cash flow plus total contractor net cash flow. That sum is the project's lifetime profit, revenue less opex less capex, and it is the same under every regime at a given price. The engine returns a state beside every value. When profit is positive and the ratio sits between 0 and 100 the state is `share`. When profit is small and positive because the contractor is losing money while the government still collects, the ratio goes above 100 percent, the true value is kept and the state is `exceeds`. When profit is zero or negative there is no share at all, the value is null and the state is `undefined`. An earlier build returned exactly 0 in that last case, with no flag.

## No value over a fortune

The published comparison built with capex of 20000, which is 10000.0000 drilling plus 10000.0000 facilities plus 0.0000 subsea, run against all six templates:

| regime | total government cash flow | total contractor NCF | the two added | value and state at all nine prices |
| --- | --- | --- | --- | --- |
| Nigeria - PIA (2021) | 1431.0440 | -16279.9099 | -14848.8659 | null, undefined |
| Ghana - Deepwater | 712.5465 | -15561.4124 | -14848.8659 | null, undefined |
| Brazil - Concession | 700.1194 | -15548.9853 | -14848.8659 | null, undefined |
| USA - Gulf of Mexico | 1312.7238 | -16161.5898 | -14848.8659 | null, undefined |
| Angola - Deepwater PSC | 1662.7835 | -16511.6494 | -14848.8659 | null, undefined |
| Generic Royalty/Tax | 875.1492 | -15724.0151 | -14848.8659 | null, undefined |

Six regimes, no value at any of the nine prices, and every one of them collected for the government: between 700.1194 and 1662.7835 million USD. The undefined state says the project made no profit to share, so the explorer breaks the line and shades the band.

## The ratio through the roof

The second case appears when the same field is made progressively more expensive. The Angola template on the default project, with every capex line multiplied and nothing else touched:

| capex multiple | 40 | 50 | 60 | 70 | 80 | 90 | 100 | 110 | 120 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| x1 | 63.4520 | 59.5510 | 66.9424 | 72.4012 | 76.0199 | 78.4920 | 80.3565 | 81.6019 | 83.1392 |
| x3 | null | 2223.0766 | 144.0692 | 85.6015 | 67.2176 | 59.3155 | 53.8218 | 56.8449 | 59.9462 |

Read the x3 row along its length: undefined at 40 USD per bbl, exceeds at 50 with a number in the thousands and at 60 with one in the hundreds, and a share from 70 onward, starting at 85.6015. Four consecutive points, three states, one line, and each point flagged.

## The mistake

The dangerous misreading is the comforting one. A regime with no line looks like a regime that dropped out of the comparison, and it is one on which the government still collected hundreds of millions. The second is treating 2223.0766 as a fiscal term. A government take of several hundred percent is arithmetic. It says the denominator collapsed toward zero, and a ratio whose denominator is collapsing is unstable: the very next point along that row falls to 144.0692 and the one after it to 85.6015, without any change in the terms. That is why an exceeds point is pinned to the top of the explorer's axis and never sets its scale.

## The rule

Before believing a point, read its state and the two totals underneath it. If lifetime contractor net cash flow is negative, the point is above 100 percent and flagged exceeds. If it is negative enough to outweigh the take, the point is null and flagged undefined. The state says which case you are in, and the totals say by how much.

## Exercise

State the three states a point on this curve can carry and the test that separates them. Then say what the government collected under Angola - Deepwater PSC on the comparison that returns no value at any price, and which state 2223.0766 carries.
