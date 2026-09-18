# Four populations of one register

A dashboard tile reads "Critical risks" with a number under it. That number is an answer, and every answer in this course has a question behind it. For a band count the question has two parts the caller chooses, and on the OBODO register those two choices produce four different counts from the same twelve rows.

{{panel:rc-risk-explorer}}

## Two choices

The first choice is which risks to hand to countByBand: every risk in the register, or only the live ones. The engine does not filter by status, so this is entirely the caller's decision. The second choice is which score to count: the inherent band, the risk before any control, or the residual band, the risk with its controls in place.

Two choices of two options each give four populations.

## The four counts

| population | "Critical" | "High" | "Medium" | "Low" | "None" |
| --- | --- | --- | --- | --- | --- |
| every risk, inherent | 5 | 3 | 2 | 1 | 1 |
| every risk, residual | 1 | 1 | 5 | 3 | 2 |
| live risks, inherent | 4 | 3 | 2 | 0 | 1 |
| live risks, residual | 1 | 1 | 4 | 2 | 2 |

The same register gives Critical counts of 5, 1, 4 and 1 across those four rows, 3 different values, depending on the two choices the CALLER makes.

## Where each Critical count comes from

Every risk, inherent: 5. OB-01, OB-02, OB-03, OB-08 and OB-10 all have an inherent band of "Critical".

Every risk, residual: 1. Only OB-03 has a residual band of "Critical", its residual of 20. OB-03's residual is 20 because neither residual axis is assessed and both fall back to the inherent levels.

Live risks, inherent: 4. The same list as the first row without OB-10, which is "Closed".

Live risks, residual: 1. OB-03 again, which is "Under Review" and live.

## Where the "None" column grows

The "None" count is 1 for both inherent rows and 2 for both residual rows. Inherent, only OB-11 is unscored. Residual, OB-11 is joined by OB-08, whose residual likelihood of 2.5 is off the scale. Both are live, so the live rows keep them.

## Each count is right

It is tempting to ask which of the four is the true number of Critical risks. Each count is right for the question it answers. "How many carried risks would be Critical with no controls?" is answered by 4. "How many risks in the register, drafts and closed included, are Critical after controls?" is answered by 1. A board asking how exposed the organisation is today wants a different row from an assessor asking how much depends on controls working.

What is never right is a tile that shows one of these numbers without saying which question it answers. A dashboard tile has to say which question that is. A reader who sees 5 on one screen and 1 on another, both labelled "Critical risks", will conclude that one of them is broken. Both are working. They were asked different things.

## The mistake

The mistake is to quote a band count without its population and its score. "OBODO has 4 Critical risks" is only checkable as "OBODO has 4 live risks with a Critical inherent band". Write the population and the score beside every count.

## Exercise

Record the Critical count for each of the four populations and name the risks behind each. Record the "None" count for every risk, residual, and name those risks. State the two choices that separate the four populations, and which choice each change in a count comes from.
