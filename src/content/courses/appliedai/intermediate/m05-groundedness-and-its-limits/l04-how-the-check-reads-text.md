# How the check reads text

{{panel:ae-scoring-explorer}}

The groundedness check pulls claims out of an answer by a stated grammar, and anything the grammar does not describe is invisible to it.

## The claim grammar

The engine prints it in its basis:

> quoted spans (straight or curly double quotes) first, then ISO dates YYYY-MM-DD, then numbers: digits with optional comma thousands groups and a decimal part, a leading minus only after a non-alphanumeric character, a percent sign ignored; a number directly after a letter, or after - _ or / that follows a letter or digit, is part of an identifier and not a claim; every occurrence is a claim

A number glued to a name is part of the name: "Ekene-1" makes no claim; "-2" after a space is the number minus 2; "45%" is the number 45.

The course's stated answer shows all of it. It cites d1 and d4, with d1, d2 and d4 retrieved: Ekene-1 made 120 bopd; the survey read 2,096 psia on 2023-01-01, a "water injection" start, and 45% water, -2 skin. The check finds six claims and supports 2 of them, 120 and 2,096, a supported fraction of 0.333333. The date and the quote are in d2, retrieved and not cited.

## A right answer the grammar marks unsupported

System A's Q13, "Ekene-6 water cut at the end of 2025", answers:

> Ekene-6 water cut was 45 percent at the end of 2025 (2025-12-01).

The answer is right. The grammar reads the bare year in "the end of 2025" as the number 2025, and EKD-030, the passage it cites, writes only the date "2025-12-01":

> the number 2025 is not in the cited passage EKD-030; it appears in retrieved passage EKD-037, which the answer does not cite

This was planted: "the end of 2025" read as a number. A deterministic check reads exactly the forms it states and no others. Its reason shows which form it read.

## One tolerance, stated

By default a number must equal a number in the passage: numericRelTol is 0. System B's Q01 answer says "about 2,100 psia" for the 2,096 psia in EKD-018, a planted rounding. At numericRelTol 0 it is unsupported. At 0.002 the allowance is 0.002 x 2096, which the course derives as 4.192, and the difference is 4, so the claim is supported. System B then has 31 of 41 claims supported, 0.756098.

Quote the tolerance with every figure it produced. It has a ceiling. At 1, any number from 0 to twice a passage value would match it, and the engine refuses it:

> numericRelTol must be a number from 0 (inclusive) to 1 (exclusive)

## Exercise

Open the view for groundedness. Replace the passages with three of the course's hand set, one a line: `d1: Oil rate 120 bopd at Ekene-1. Oil rate fell.`, `d2: Water injection at Ekene-2 started on 2023-01-01.` and `d4: Pressure survey: 2,096 psia.` Enter the stated answer under a query id h1, citing d1 and d4 (write the quote with curly quotation marks so the JSON stays valid), and give h1 the retrieved list d1, d2, d4. Read the claims and the reasons. Then switch views and back to restore the defaults, set numericRelTol to 0.002, and find which of B's unsupported claims disappeared. Finally set it to 1 and read the refusal.
