# Losses outside zero to one hundred

Most of this tier has been about what the engine computes. This lesson is about one input it will not compute with at all.

{{panel:crude-valuation-explorer}}

## What a loss percent can be

A loss percent says what share of the product barrels never reach a buyer. The engine applies it as a factor on the product value, (1 - loss percent / 100). For that factor to describe a real refinery, the loss has to be a share of something that exists: at least nothing lost, and at most everything lost. That is the range from 0 to 100 percent.

Outside that range the arithmetic still runs, and that is the danger. A loss of 101 percent makes the factor negative, so the product value turns into a negative number and the netback reads as a large loss with nothing to say that the input was impossible. A loss of -1 percent makes the factor greater than one, so the refinery appears to produce more product than the crude it ran, and the netback rises. Both would print as clean figures to four decimals.

## What the engine returns

netbackValue refuses both, in its own words:

| asked | what the engine returned |
| --- | --- |
| losses of 101 percent | REFUSED: Losses must be between 0 and 100 percent. |
| losses of -1 percent | REFUSED: Losses must be between 0 and 100 percent. |

A refusal is an answer. It says the question as asked has no meaning, and it names the range the input must lie in. There is no figure to carry forward, so no differential is formed on a netback that should not exist.

## How this differs from a blank

Module 4 showed a blank loss treated as zero and named in assumedZero. That is a question with an answer: what is the netback if nothing is lost. A loss of 101 percent is a question with no answer, because no refinery loses more than it runs. So a blank is filled and labelled, and an impossible value is refused. The engine separates the input it can interpret from the input it cannot.

## Where such values come from

An impossible loss usually comes from a slip. A fraction typed where a percent was expected, a sign dropped from a gain figure, a column shifted by one in a spreadsheet. The refusal catches the slip at the point of entry, where it is cheap to fix, instead of letting it pass through the chain into a netback, then a differential, then a decision.

## Reading a refusal

When the engine refuses, read its sentence as it is printed. It says what was wrong and what range is acceptable. It does not guess a corrected value, and it does not clamp the input to the nearest end of the range. Either would produce a netback on a loss nobody entered. The valuation explorer shows the refusal in place of the waterfall, with the engine's sentence, so the learner sees the answer the engine actually gives.

## Exercise

Read the two refused requests and the engine's sentence for each. Say what the factor (1 - loss percent / 100) would do to the product value at each of the two inputs if the engine computed with them, and why the engine refuses both. Then say how the engine's treatment of a blank loss differs from its treatment of these two.
