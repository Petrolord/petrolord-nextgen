# A deck that does not cover the profile

A price deck with fewer prices than the profile has years is refused by name, and the refusal says which year is missing: FdpInputError: "the price deck has no price for production year 3: enter a price for every year of the profile".

{{panel:ec-plan-explorer}}

## Two prices against three years

| deck | profile | result |
| --- | --- | --- |
| two prices | three years | refused: no price for production year 3 |
| three prices | three years | accepted, NPV -202.4284 |

Nothing about the field changed between those two attempts. One had a complete deck and the other did not, and the engine will not decide for itself what the third year is worth.

## What padding used to do

Before this course's repair the engine did not refuse. One caller filled the missing years with 70.0000 USD a barrel and another filled them with zero, so the same plan run through two paths gave two different answers and neither path said a price had been supplied on the reader's behalf. Padding with zero is the more dangerous of the two, because a run can look nearly right while valuing its whole tail at nothing. One published case shows what that costs: a deck shorter than its profile, with the missing prices treated as zero, returns an NPV of 126.1636 and no rate of return, because the flow changes sign more than once and the status reads multiple-roots.

## Zero typed and zero assumed

A scenario priced at zero is accepted and returns an NPV of -3517.4133 million USD. A typed zero is a number somebody chose, and the engine owes them the answer to the question they asked. A missing year is a question nobody asked, and an engine that answers it has made up the input and the output together.

## The mistake

Extending the last price you have across the years you do not. It is a forecast, it is invisible in the result, and it never gets reviewed because it never appears as an assumption. Write the price for every year, and let the refusal tell you when one is missing.

## What it refuses

The engine refuses an incomplete deck, a missing price with FdpInputError: "the scenario oil price is missing" and a negative one with FdpInputError: "the scenario oil price may not be negative: -5". It does not refuse a bad price. Nothing in it knows whether 70.0000 USD a barrel is a reasonable figure for any year, and a complete deck of implausible prices runs just as smoothly as a good one.

## Exercise

State what the engine does with a three year profile given two prices and what it does with the same profile given three. Then explain why a typed price of zero is accepted while a missing year is not, and say what padding a deck with zero did to the published case that reports no rate of return.
