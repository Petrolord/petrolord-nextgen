# PLL as a sum

{{panel:qr-societal}}

The potential loss of life is one multiplication per scenario and one sum over them. That makes it the simplest calculation in this tier, and also the easiest to build wrongly, because three different sums can be made from the same table and only one of them means anything. This lesson works the JISIKE crew through the engine and then shows the two sums a hurried analyst might make instead.

## The engine's method

> PLL = sum f_i x N_i; N the expected number of deaths of the scenario (PB 6.3, 6.4: not necessarily whole)

Each scenario carries a frequency per year and an expected number of deaths N, both stated. Their product is the expected deaths per year from that scenario. The PLL adds those products, so its unit is fatalities per year, the same unit as each contribution.

## The crew, line by line

| scenario | frequency per year, stated | N, stated | f x N per year |
| --- | --- | --- | --- |
| process fire | 5e-4 | 1.2 | 0.000600000000 |
| module explosion | 4e-5 | 8 | 0.000320000000 |
| fall from height | 3e-3 | 0.5 | 0.001500000000 |
| spill with no one near | 6e-3 | 0 | 0.000000000000 |

The PLL is 0.002420000000 fatalities per year. The engine also returns each scenario's contribution, which is the useful part for a review: the fall from height, a frequent event with half a death expected each time, carries more of the crew's expected deaths than the module explosion, a rare event that kills eight.

## Three sums from one table

| how PLL was built | value per year |
| --- | --- |
| sum of f x N, the engine | 0.002420000000 |
| sum of f over N, derived | 0.006421666667 |
| sum of f with N ignored, derived | 0.009540000000 |

Dividing f by N has no physical meaning, and it rewards scenarios that kill fewer people. Ignoring N counts every event as one death, so the spill that reaches no one adds its full frequency and the module explosion counts as one death where eight are expected. Both wrong sums come out larger than the right one here, which is a coincidence of this table. Neither error announces itself: the engine would happily add any column you hand it, so the check is to ask what the unit of each term is. Frequency times deaths is deaths per year; frequency over deaths has no unit anyone can use.

## Reading a contribution

The contribution list tells a duty holder where expected deaths come from. It does not say which scenario is most feared. A rare event that kills many is weighed differently by society than a frequent event that kills one, even at equal f x N, and PLL deliberately cannot see that difference. The F-N curve later in this tier is built to show it. The PLL is the expected value and nothing more, and the engine does not weight it for aversion: no source it read defines such a weighting.

Keep the contribution list beside the total whenever you report a PLL.

## Exercise

Multiply each stated frequency by its stated N yourself and confirm each f x N entry in the crew table. Then compute what the crew PLL would become if the fall from height were removed entirely, and say which scenario would then carry the largest share.
