# The swept range

The sweep is nine fixed prices, and every one of them re-runs the entire comparison rather than rescaling a result.

{{panel:ec-comparison-explorer}}

## Nine points, and where they come from

The price sweep runs the whole comparison again at oil prices of 40, 50, 60, 70, 80, 90, 100, 110 and 120 USD per bbl. It reaches each of those prices by a multiplier: the price the sweep wants divided by the first deck point's oil price. That multiplier then scales the oil price in every year of the deck, so the deck's step structure survives the sweep intact and only its level moves.

Every point is a full re-run: the whole comparison, every regime, all 25 rows of every ledger, computed again from the scaled deck. The default project's first deck point is 70 USD per bbl, so the sweep's 70 point is the deck itself at a multiplier of one, and it returns the base case exactly, an NPV of 169.7176 million USD and government cash flow of 1269.4940. Three of the nine points sit below the deck and five above it, so the range is not centred on the base case.

## What each point returns

Because the comparison is re-run, everything moves, not only the take. The nine published runs of the Designer's production sharing regime on the default project:

| case | npv | irr | totalContractorNCF | totalGovTake | paybackYear | finalUnrecoveredPool |
| --- | --- | --- | --- | --- | --- | --- |
| price_40_pia_default | -51.1673 | null | 176.7787 | 481.9270 | 9 | 5.9578 |
| price_50_pia_default | 34.9271 | 12.6081 | 288.4069 | 732.5583 | 6 | 0.7642 |
| price_60_pia_default | 107.7526 | 19.0202 | 397.2743 | 985.9503 | 5 | 0.0000 |
| price_70_pia_default | 169.7176 | 26.1629 | 475.9901 | 1269.4940 | 4 | 0.0000 |
| price_120_pia_default | 408.0752 | 79.0360 | 846.3067 | 2710.4748 | 2 | 0.0000 |

The 40 USD per bbl point is the interesting one. NPV is -51.1673 million USD, the engine names no internal rate of return at all, payback slips to year 9, and the recoverable pool never clears: 5.9578 million USD of cost is still unrecovered at the end of the 25 years. At 50 USD per bbl the pool closes to 0.7642 and from 60 upward it closes completely. A cost recovery limit that never binds at the deck price binds hard at the bottom of the sweep.

## The mistake

The sweep looks like a set of price scenarios and is not. It is one deck, scaled. Nothing in it changes the step years, the decline, the capex or the opex, so a reader who quotes the 40 USD per bbl point as a low price case is quoting a case in which every other assumption is still the base case's. The second mistake is interpolation. There is no point between 70 and 80, and the curve drawn between them is the chart's line, not the engine's answer.

## What it refuses

The nine prices are fixed and there is no input that changes them, so a project whose economics turn at 45 USD per bbl cannot be examined there. The sweep moves price only: it will not sweep capex, opex or the discount rate at the same time. And it plots one quantity per regime, its government take (undiscounted), so the NPV, the payback year and the unrecovered pool that also moved at each point are computed and then discarded before the chart is drawn.

## Exercise

List the nine swept prices and say which one reproduces the default project's own deck. Then state what happens to the unrecovered pool at 40, 50 and 60 USD per bbl.
