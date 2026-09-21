# From one person to many

{{panel:qr-societal}}

The Associate tier followed one person. It built a location-specific individual risk at each place and weighted each by the share of the year that person spends there, and the EREMOR operator ended the tier carrying an individual risk per annum of 0.000017541379 per year. That figure answers one question well: how exposed is this person. It says nothing about how many people a single event could kill. This tier asks that second question, how many die at once, and its first measure is potential loss of life.

## Two questions, two measures

Individual risk is a property of a person or a place. Societal risk is a property of a population and the events that can reach it. A release that could kill one operator and a release that could kill forty people in a town can carry the same individual risk at the fence, and a society judges them very differently. So the course keeps two ledgers. The individual ledger ends in the IRPA. The societal ledger begins with the potential loss of life, PLL, the expected number of deaths per year across the whole population the assessment covers.

## What PLL is

PLL is the sum over scenarios of the scenario frequency times the expected number of deaths N in that scenario. The engine says so in its own words:

> PLL = sum f_i x N_i; N the expected number of deaths of the scenario (PB 6.3, 6.4: not necessarily whole)

Its unit is fatalities per year. It is an expected value, so it is never a probability, and for a large enough population it can exceed one.

## The JISIKE crew

The teaching facility for this tier is JISIKE. Its crew faces four scenarios, each with a stated frequency and a stated N.

| scenario | frequency per year, stated | N, stated | f x N per year |
| --- | --- | --- | --- |
| process fire | 5e-4 | 1.2 | 0.000600000000 |
| module explosion | 4e-5 | 8 | 0.000320000000 |
| fall from height | 3e-3 | 0.5 | 0.001500000000 |
| spill with no one near | 6e-3 | 0 | 0.000000000000 |

The engine returns a PLL of 0.002420000000 fatalities per year.

## Where N comes from

N is a stated input in this course. Producing it means laying a probability of death over the people in each cell of the area a scenario reaches, and that probability of death comes from consequence modelling, which belongs to the consequence course. This engine takes N as given and does the bookkeeping. That is the first of its declared choices in this tier: nothing is invented, and every N the lessons use is typed into the prompt.

## Why the crew figure matters

A single crew figure lets a duty holder compare one facility with another. It also feeds the fatal accident rate in the next module, which turns the PLL into a rate per 100,000,000 exposed hours. Neither measure replaces the IRPA; each answers its own question.

## Exercise

Take the four f x N contributions in the table and add them. Check that your total is the engine's 0.002420000000 fatalities per year, then say which single scenario carries the largest share of it and roughly what fraction that is.
