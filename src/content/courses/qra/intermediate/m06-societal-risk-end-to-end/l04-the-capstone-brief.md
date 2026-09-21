# The capstone brief

{{panel:qr-societal}}

The capstone for this tier asks the question the tier has been about: how many at once. It hands you a crew, a population, their stated scenarios and their stated exposure, and asks you to run the societal side of an assessment and report what you find. Every number you need is given in the prompt. Nothing in it needs the Expert tier's material.

## What you will be asked to produce

Six quantities, each at the precision this course prints:

| quantity | the teaching figure that shows the shape | precision |
| --- | --- | --- |
| a crew's PLL from stated scenarios | 0.002420000000 fatalities per year | twelve decimals |
| that crew's FAR from stated exposure | 2.016667 per 100,000,000 exposed hours | six decimals |
| a population's F(N) at a stated N | 0.000049700000 per year at N = 3 | twelve decimals |
| the worst ratio to the Dutch line | 18.000000 | six decimals |
| where the curve exceeds on a stated step | from 24.253563 to 40 | six decimals |
| the ratio to the R2P2 point | 0.001000 | six decimals |

The teaching figures are JISIKE's, printed so you can see what each answer looks like. The capstone's facility and its inputs are its own, so none of these figures is an answer to it.

## How to work it in order

Compute the PLL first and keep the contribution list, because the FAR divides that same PLL by the exposed hours of the same people. Then build the curve: drop every scenario with no deaths and note its frequency, sort the rest by N, merge scenarios that share an N into one corner, and accumulate "N or more". Compare with the Dutch line only at corners from N = 10 upward. For an exceeding step, the range starts at the largest of the previous corner, the line's smallest N and (C / F)^(1 / alpha). Read F(50) for the R2P2 point.

## The habits that carry you through

| habit | why |
| --- | --- |
| quote per-year figures at twelve decimals | that is the precision answers are read at |
| quote FAR and ratios at six | the same reason |
| treat every N and every frequency as given | they come from outside this course |
| read "N or more" at every corner | the engine follows the equation |
| name the criterion beside every ratio | a ratio means nothing without its line |

## Two traps worth naming

The first is the denominator: a crew PLL divided by one person's hours reads 121.000000 where the engine reads 2.016667. The second is the reading: "more than N" drops the scenario at each corner, so F(3) of 0.000049700000 per year becomes 0.000009700000. Both produce plausible numbers, and both are wrong. If the engine refuses a call, read the field it names first, because a refusal is telling you which input you have still to state correctly. Change that input alone and run the call again before touching anything else.

## What this tier does not ask

You will not band an individual risk, weigh a measure, or compute a cost to benefit ratio; those are the Expert tier's. You will not be graded on a state word alone, on an Fd fraction, or on any figure presented as a published F-N reproduction.

## Exercise

Take the JISIKE step ending at N = 12, where F is 0.000009700000 per year. Using the Dutch line's C = 1e-3 and alpha = 2, compute where the range starts, compare it with the previous corner of 3 and the line's smallest N of 10, and confirm the engine's 10.153462.
