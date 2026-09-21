# Expected deaths need not be whole

{{panel:qr-societal}}

The JISIKE process fire has an N of 1.2 and the fall from height an N of 0.5. Neither is a count of bodies. Each is an expected number of deaths, the average over the ways the scenario can unfold, and an average need not be whole. The engine takes that position openly, citing the Purple Book, and this lesson explains why it is the right one.

## What N is

For a scenario that reaches a population, N is the sum over the people exposed of each person's probability of death. Several people each facing a modest probability of death can together expect 1.2 deaths, even though any single occurrence kills a whole number of them. That probability of death is a stated input here, because producing it is consequence modelling and belongs to the consequence course. This course receives N already assembled and never rounds it.

## The engine's words

The model string says it:

> PLL = sum f_i x N_i; N the expected number of deaths of the scenario (PB 6.3, 6.4: not necessarily whole)

And so does its refusal when N is negative, the one thing N may never be:

> scenarios[0].fatalities: 'fire' must have 0 or more fatalities (an expected number need not be whole)

The refusal names the field and the scenario, carries no number of its own, and reminds the caller in the same breath that a fraction is welcome.

## What rounding would do

| scenario | N, stated | f x N per year |
| --- | --- | --- |
| process fire | 1.2 | 0.000600000000 |
| fall from height | 0.5 | 0.001500000000 |

Rounding each N to a whole number before multiplying would move the crew PLL of 0.002420000000 fatalities per year in a direction set by the rounding rule and by nothing physical. A fall from height rounded down to zero would vanish from the ledger, and it is the largest contributor the crew has. The engine therefore keeps every N as typed and does the arithmetic on it exactly.

## A golden case

The engine's golden set carries a case built to test exactly this, named fractional-and-zero-N: a fractional N beside an N of zero. Run through the engine it gives 0.000685000000 per year. The golden file was written by the engine's independent oracle, so the case checks the engine against a second, separate computation of the same declared arithmetic.

## Why the choice matters later

The same N feeds the F-N curve, where scenarios are sorted by N and the frequency of N or more deaths is accumulated. A fractional N is a legitimate corner on that curve too. A PLL above one is also legitimate: it means more than one death is expected each year across a large population, and it shows once again that PLL is an expected count per year and never a probability.

## Exercise

The process fire's N of 1.2 is the product of a stated head count and a stated probability of death. Using the crew table, compute what the process fire's f x N would be if its N were doubled, then say by how much the crew PLL of 0.002420000000 fatalities per year would rise.
