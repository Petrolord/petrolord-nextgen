# Down the span, reading by reading

{{panel:fc-meterrun-explorer}}

Here is the whole span in one table. One transmitter, spanned at 200.000000 in
H2O with an accuracy of 0.075000 percent of span, asked the same question at
twelve readings.

| reading, in H2O | pct of reading | dP turndown | flow turndown | warning |
| --- | --- | --- | --- | --- |
| 200.000000 | 0.075000 | 1.000000 | 1.000000 | silent |
| 150.000000 | 0.100000 | 1.333333 | 1.154701 | silent |
| 100.000000 | 0.150000 | 2.000000 | 1.414214 | silent |
| 63.800000 | 0.235110 | 3.134796 | 1.770536 | silent |
| 40.000000 | 0.375000 | 5.000000 | 2.236068 | silent |
| 25.000000 | 0.600000 | 8.000000 | 2.828427 | silent |
| 18.000000 | 0.833333 | 11.111111 | 3.333333 | fires |
| 16.000000 | 0.937500 | 12.500000 | 3.535534 | fires |
| 14.000000 | 1.071429 | 14.285714 | 3.779645 | fires |
| 12.000000 | 1.250000 | 16.666667 | 4.082483 | fires |
| 5.000000 | 3.000000 | 40.000000 | 6.324555 | fires |
| 2.000000 | 7.500000 | 100.000000 | 10.000000 | fires |

## The five columns

The reading is the differential the transmitter is seeing. The percent of
reading is the accuracy expressed against that reading rather than against the
span, which is the quantity your flow calculation actually needs.

The next two columns are turndowns, meaning how far down from the top of the
span you are. They are different numbers because flow goes as the square root of
the differential, and the next lesson is about nothing else.

The last column is the engine's own warning flag, and it changes state between
two of the rows printed here.

## The row that is the ABOH run

The fourth row is the run you have been reading all tier. A reading of 63.800000
in H2O gives 0.235110 percent of reading, a differential turndown of 3.134796
and a flow turndown of 1.770536, and the warning is silent. That figure of
0.235110 is the one that arrives in the uncertainty budget in module six as the
differential pressure term, which is why the budget on that run is a transmitter
derived budget rather than a typed one.

## Reading a table like this one honestly

There is a temptation, looking at a column of rising percentages, to summarise it
in a sentence about how fast it rises or where it rises fastest. Resist it. The
only comparison available on this span is the one the lab computes between
the top and the bottom, which is the difference of -7.425000 and the ratio of
0.010000 you met in the previous lesson. Anything else about the shape of the
column is arithmetic you did yourself, and arithmetic you did yourself is the
most common way a wrong sentence gets into a lesson or a report.

What you can do without computing anything is read a row. Every row here is an
engine result, and a row is a complete statement about one operating point.

## How to use the table

Find the reading your meter actually sits at on an ordinary day rather than at
design rate. Read the percent of reading on that row. That is what your
differential measurement is worth, and it is an input to everything downstream
of it.

Then look at how far the row you are on sits from the row where the warning
state changes. A meter that spends most of the year a couple of rows above the
change is a meter whose span was chosen for a rate the field no longer makes,
and respanning the transmitter is usually cheap.

## Exercise

Take the row at a reading of 25.000000 in H2O and the row at 18.000000 in H2O.
Say what changes between them other than the four numbers, and say what you
would tell an operator who runs at the lower of the two every night.
