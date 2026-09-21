# Fractions indoors and outdoors

{{panel:qr-societal}}

Every N in this tier has been a stated input. This lesson looks one step behind it, at the rule the Purple Book gives for turning a probability of death into the fraction of a population that dies when some people are indoors and some are out. The engine implements that rule as a function of its own. The course teaches it so you can read an N critically, and it never grades a number that passes through it; the next lesson says why.

## The rule

For societal risk the Purple Book counts deaths indoors and outdoors separately:

Fd = FE,in x fpop,in + FE,out x (1 - fpop,in)

FE,in and FE,out are the fractions of people indoors and outdoors who die from the effect. fpop,in is the fraction of the population indoors, which Table 5.3 gives as 0.93 by day and 0.99 by night. The expected number of deaths in a population cell is then Fd times the people in it. The rule is written for a crowd: it does not ask where any one person is, only what share of the people in a cell are sheltered at the time the effect arrives. That is why a night case and a day case of the same release can give different N for the same town.

## The rules by effect, run through the engine

| case | PE | FE,in | FE,out | fpop,in | Fd |
| --- | --- | --- | --- | --- | --- |
| toxic, PE 0.4 stated, day | 0.400000 | 0.040000 | 0.400000 | 0.930000 | 0.065200000000 |
| toxic, PE 0.4 stated, night | 0.400000 | 0.040000 | 0.400000 | 0.990000 | 0.043600000000 |
| explosion, 20000 Pa gauge, day | 0.000000 | 0.025000 | 0.000000 | 0.930000 | 0.023250000000 |
| explosion, 30000 Pa gauge, day | 0.000000 | 0.025000 | 0.000000 | 0.930000 | 0.023250000000 |
| explosion, 40000 Pa gauge, day | 1.000000 | 1.000000 | 1.000000 | 0.930000 | 1.000000000000 |
| flash fire, inside the envelope, night | 1.000000 | 1.000000 | 1.000000 | 0.990000 | 1.000000000000 |
| fire at 35000 W/m2, day | 1.000000 | 1.000000 | 1.000000 | 0.930000 | 1.000000000000 |

## Reading the toxic rows

The outdoor probability of death PE of 0.4 is a stated input, the output of consequence modelling in the consequence course. Indoors the rule takes a tenth of it, 0.040000, because a building shelters its occupants. With 0.93 of people indoors by day, Fd is 0.065200000000; with 0.99 indoors at night it falls to 0.043600000000. The same cloud kills fewer at night because more people are sheltered.

## Reading the explosion and fire rows

The explosion rows follow Figure 5.5. Above 30000 Pa gauge everyone dies, indoors or out. Above 10000 Pa only 0.025 of those indoors die, and nobody outdoors. At or below either threshold the lower rule applies, so exactly 30000 Pa falls in the lower rule, with Fd of 0.023250000000, and 40000 Pa gives 1.000000000000. A fire at 35000 W/m2 or more kills everyone, as Figure 5.4 prints it; below that flux the probability of death comes from a heat probit, which is consequence modelling and belongs to the consequence course. A flash fire kills everyone inside its envelope and nobody outside it.

## The refusals

The function takes a period or a fraction indoors, and refuses both together:

> fractionIndoors: give a period ('day' or 'night') or fractionIndoors, not both

It refuses a period the table does not have:

> period: must be 'day' or 'night' (PB Table 5.3), or give fractionIndoors

And an effect it does not model:

> effect: must be 'toxic', 'fire', 'flash-fire' or 'explosion'

Each message names the field that failed and carries no number of its own.

## Exercise

Using the toxic day row, multiply FE,in of 0.040000 by fpop,in of 0.930000 and FE,out of 0.400000 by the fraction outdoors, add the two, and confirm the engine's Fd of 0.065200000000. Then do the same for the night row and confirm 0.043600000000.
