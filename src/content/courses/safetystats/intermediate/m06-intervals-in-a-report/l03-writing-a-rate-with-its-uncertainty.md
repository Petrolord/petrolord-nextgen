# Writing a rate with its uncertainty

{{panel:ss-intervals-explorer}}

The house form this course uses, and three figures written in it:

| part | what it says | BLS example |
| --- | --- | --- |
| the rate | the estimate | 3.500000 |
| the base | what the number is per | per 200,000 hours |
| the count and hours | what it rests on | 7 cases in 400000 hours |
| the interval and its confidence | how far the true rate might be | 95 percent exact interval 1.407182 to 7.211338 |

Put together: "3.500000 per 200,000 hours (7 cases in 400000 hours; 95 percent exact interval 1.407182 to 7.211338)".

## Why every part is there

The rate is the figure a reader came for. The base says what it is per, and without it the Associate tier showed a factor of five hiding between OSHA and IOGP TRIR. The count and hours let anyone recompute the rate and see at once how many events it rests on. The interval with its confidence says how far the true rate might sit from the one printed. Drop any one of them and the reader must either guess or go back to the source.

## Two more in the same form

The IOGP 2024 observed FAR: 0.769438 per 100,000,000 hours (32 fatalities in 4158877000 hours; 95 percent exact interval 0.526295 to 1.086218).

A crew with no recordables: 0 per 200,000 hours (0 recordables in 41300 hours; 95 percent exact interval 0.000000 to 17.863823).

The zero reads very differently once it carries its upper limit. The line tells a reader the record is clean and that it cannot rule out a true rate as high as 17.863823 per 200,000 hours.

## No P label

No P label is used for a confidence interval anywhere in this course. An interval here is an interval on an estimated rate at a stated confidence. The academy's percentile labels belong to ranges of outcomes in other courses, and borrowing one here would dress the Garwood interval up as a percentile of outcomes, which it is not. Write the confidence as a percentage and call the result an exact interval.

## A comparison in the same spirit

A comparison of two rates gets the same treatment. Give the rate ratio, what it compares, the counts and hours on each side, and the interval with its confidence, then the central p-value as a check. For ERHA: east over west 2.047326 (6 events in 240500 hours against 11 in 902700 hours; 95 percent interval 0.621694 to 6.039396; central p-value 0.256209). Name the convention whenever a p-value appears, because a reader checking it in R will otherwise find a different number on some inputs.

## Where the form is strict

Keep the six decimals the course prints for a rate and a limit. State the confidence every time, even when it is 95 percent. Keep the count whole and the hours as stated. A report that follows the form can be checked line by line by anyone with the engine, and that is the purpose of writing it this way.

## Exercise

Write UTOROGU's comparison in the form shown for ERHA, using north's 7 events in 355200 hours, south's 6 in 1048900 hours, the rate ratio of 3.445148, the interval of 0.991404 to 12.408545 and the central p-value of 0.051759. Then add one plain sentence beneath it that says what the interval allows at each end.
