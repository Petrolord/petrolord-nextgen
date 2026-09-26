# The reasons the engine prints

{{panel:gsa-quantity-calculator}}

Every figure the engine returns comes with its working. A day's buyer shortfall carries a sentence saying what was taken against what; a year's deficiency carries the sum that produced its payment. These reasons are part of the result, and reading them is how you check a contract year without redoing the arithmetic yourself.

## Reasons on a day

The daily balance prints a reason for every day on which something is owed, excused or trimmed. From the power plant's January 2027, verbatim:

> 2027-01-01: taken 20790 is below the adjusted DCQ 21000: buyer shortfall 210

> 2027-01-12: force majeure and maintenance cover the whole DCQ; no quantity is owed either way for the day

> 2027-01-25: nominated 24150 is above the MaxDCQ 23100; 1050 is not properly nominated

A day with nothing to say gets no reason. On 2027-01-11 the buyer nominated, was offered and took exactly the DCQ, 21000.000000, and the engine prints nothing for that day.

## Reasons on a year

The take-or-pay year prints its working in full. From the golden case with force majeure and a seller shortfall, verbatim:

> 2027: 600 counted against the take-or-pay quantity 640 leaves a deficiency of 40; the deficiency payment is 40 x 3 = 120; the buyer may make up 40 in the 2 contract years after 2027, to the end of 2029

> 2027: seller shortfall 50 reduces the Adjusted ACQ and is paid to the buyer at 1.5: 75

Read the first reason from left to right and you have the whole reconciliation: the quantity counted, the take-or-pay quantity, the deficiency, the payment with its price, and the make-up right the deficiency opens. What happens to that make-up right in the following years is the Professional tier's subject.

A year with nothing to reconcile prints no reason: the exactly met case and the whole year of force majeure both come back without one.

## Reason figures and field figures

A figure inside a reason is printed as the shortest decimal that reads back to the value the engine holds, so it can carry many digits or very few. The fields, the numbers in the table and the tiles, are what this course quotes, always at six decimals. Use a reason to understand a result and the fields to quote it.

## A result with a reason is a result

A reason explains a figure. A refusal replaces one: it returns no figures at all, only the field it refused and the condition that failed. A deficiency with no make-up right, a day trimmed at MaxDCQ, a day excused by force majeure: each is a result, returned with its reason.

## Reading reasons as a check

When a figure surprises you, find its reason before changing any input. A wrong nomination or a mistyped price shows up there first.

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "The daily balance". Run the power plant's January 2027 and read every reason printed below the table. Count how many name a buyer shortfall, how many a seller shortfall, and how many say nothing is owed. Then switch to "One take-or-pay year", start from "The power plant, 2027 alone", and match each figure in its reason to a column of the table.
