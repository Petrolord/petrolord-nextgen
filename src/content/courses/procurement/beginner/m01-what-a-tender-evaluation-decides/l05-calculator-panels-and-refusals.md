# The calculator panels and the refusals

{{panel:pr-envelope-calculator}}

This course has no Suite app. Its practicals run in three calculator panels of its own, one a tier, and each calls the same vendored engine the lessons quote. This lesson shows the envelope calculator, the engine's refusals and what the course grades.

## Five views, one engine

The envelope calculator has a View selector with five choices: "The technical envelope", "Arithmetic correction of a bill", "Evaluated cost of the passing bids", "The combined score" and "The whole tender in one call". Each starts from the Ekene well services tender and takes your own criteria, bids, bill lines and settings as text in the shape the engine reads. The panel prints what the engine returns, the reasons beside each figure and the rule in the engine's own words.

## A refusal is the engine's answer to a bad input

When an input is missing or out of range, the engine returns no figure. It returns an error and the name of the field it refused, and the message starts with that name and states the exact condition that failed. Four refusals to meet early:

With no pass mark:

> passMark must be a number from 0 to 100 (a percentage of the maximum technical score); there is no default

With criteria weights that sum to 99:

> criteria weights must sum to 100; they sum to 99

With a price method the engine does not offer, such as `mean-deviation`:

> priceMethod must be 'lowest-ratio' or 'linear'; there is no default

With no award basis:

> award must be 'lowest-cost' or 'combined'; there is no default

Notice the words "there is no default" in three of them. The pass mark, the technical weight, the price and technical methods and the award basis are decisions a tender committee must state. The engine guesses none of them, because a guessed setting would decide the award silently.

## A result with a reason is not a refusal

When WS4 scores below the pass mark, the engine still returns a full result: WS4 carries the status fail-pass-mark and a reason in the engine's words, and the other bids go on. The course says such a bid was excluded, or that the result was returned with the reason, and keeps "refused" for an input the engine would not accept.

## What is graded

Every graded number in this course is a value the engine returns on fixed inputs: bids, criteria and settings written down in advance. The same inputs give the same number on any machine, so a graded question has exactly one right answer, and each graded figure is quoted to six decimals as the panel prints it. The Associate capstone runs a synthetic tender of its own, which appears in no lesson, and you work it in this calculator.

## Exercise

Produce each of the four refusals above in the envelope calculator. In "The technical envelope", clear the pass mark box, then restore it and lower the schedule criterion's weight from 10 to 9. In "The whole tender in one call", change the priceMethod text to mean-deviation, restore it, then delete the award line. For each, copy the field the panel names and check that the message begins with it.
