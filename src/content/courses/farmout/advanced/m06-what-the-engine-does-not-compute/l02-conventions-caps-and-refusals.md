# Conventions, caps and refusals

{{panel:farmout-valuation-calculator}}

Three things shape every call besides the deal terms: the conventions the engine chose where no text fixes one, the size caps that keep a call bounded, and the order in which the engine refuses a bad input.

## Conventions that are choices

Each is the engine's stated choice, and a different choice would move a figure, so a report that quotes the figure names it:

| convention | the engine's choice |
| --- | --- |
| the promote | the share of the gross cost paid less the interest held after the event, in points; the ratio is share paid over interest held |
| the carry | what the farminee pays less its own held interest of the gross cost |
| the equivalent working interest | (well payment + cash bonus + reimbursement) / gross cost of the completed events x 100 |
| the positions | the farmor receives the bonus and reimbursement and pays the assignor fees in both outcomes |
| ties | reported, every tied action named |
| percentile labels | P90 the low case, P10 the high case |
| money in a reason | rounded to the cent, half away from zero, trailing zeros dropped; every numeric field keeps full precision |

The last row is why a lesson reasons with a field and never with a reason's figure.

## Size caps

| cap | value | the engine's message, verbatim |
| --- | --- | --- |
| `MAX_PARTIES` | 20 | parties must have at most 20 entries; got 21 |
| `MAX_EVENTS` | 20 | events must have at most 20 entries; got 21 |
| `MAX_YEARS` | 100 | project.successValue.cashFlows must have at most 100 entries; got 101 |
| `MAX_SIGNALS` | 10 | information.signals must have at most 10 entries; got 11 |
| `MAX_POSITIONS` | 10 | positions must have at most 10 entries; got 11 |
| `MAX_HOLDINGS` | 50 | positions[0].holdings must have at most 50 entries; got 51 |
| `MAX_ITERATIONS` | 200000 | iterations must be an integer from 1 to 200000 (stated; no default); got 200001 |
| `MAX_RESERVES` | 10 | transaction.reserves must have at most 10 entries; got 11 |

The draws times the holdings over all positions may not exceed 500000, and the refusal names the most draws the stated holdings allow:

> iterations must be at most 166666 for 3 holdings in all (iterations x holdings at most 500000); got 200000

A panel stays well inside these caps. They exist so that no call can ask for unbounded work, and each refusal names the cap and the count it was given, so a caller building a large case from a script knows exactly how far over it went.

## The order of refusals

Every function checks its accepted keys before it reads a term. A box that carries an unknown key and also lacks a required term is refused on the unknown key first, with the path to the key and the full list of accepted keys:

> vest is not an accepted key; the accepted keys at the top level are parties, farmor, farminee, events, vesting, eventsCompleted, cashBonus, pastCosts

A misspelt optional key is therefore refused. It is never silently dropped, which would leave a deal term out of the arithmetic without a word.

## Reading a refusal

A refusal is an object with an error and a field, and the message starts with the field's name and states the exact condition that failed. A stated figure inside a message prints as it was given; a computed one prints to six decimals. A result returned with a reason, such as a consent deemed withdrawn, is a result and carries no error.

## Exercise

Open the valuation calculator on the view "A price for a working interest" and start from "The Ekene Deep price, risked". Add a key the engine does not read to the top of the box and read the refusal and its list of accepted keys. Then add a second mistake by clearing the value basis, and confirm which refusal comes first. On the view "Risk sharing: spread, the chance of a loss, the low and high cases", set "Draws (stated)" above the most the Ekene holdings allow and read the draw-work refusal.
