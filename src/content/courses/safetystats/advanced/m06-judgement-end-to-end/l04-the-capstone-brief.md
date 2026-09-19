# The capstone brief

{{panel:ss-uchart-explorer}}
{{panel:ss-intervals-explorer}}

The Expert capstone grades 6 fields, and all 6 answer the Expert question: is anything changing? Each one is a figure the engine returns, read off a u-chart or a comparison of two periods, and each is graded against the engine's own result. On the teaching stream, the equivalent figures are EGBEMA's centre of 2.893273, a limit such as month 3's 10.211920, and the before-and-after p-value of 1.000000.

| graded field | where it comes from |
| --- | --- |
| a centre line | the u-chart, sum then divide |
| an upper limit for one month | the u-chart, that month's units |
| a lower limit for one month | the u-chart, that month's units |
| a revised centre line | the u-chart redrawn on the months kept |
| a before-and-after p-value | the comparison of two periods |
| the same p-value, with a month set aside | the comparison redrawn |

## What you are given

You are given a workplace's monthly counts and hours, the base, and the month an intervention started. Where the brief asks for a revised chart or a comparison with a month set aside, it says on what basis, and you apply exactly that basis. None of the capstone's counts, hours or answers appear anywhere in this course, and every figure in the lessons belongs to the teaching streams.

## How to work it

Work it in the order of the monitoring note. Draw the chart on the base the brief names and read the centre. Read each limit the brief asks for off the month it names, using the reader's month numbering; the engine's `outOfControl` list is zero-based. A lower limit may be floored at zero or may be positive, depending on the month's exposure, so read the engine's figure and its `lclFloored` flag.

Then read the signals, set aside only what the brief's stated basis supports, and redraw for the revised centre. Then split the months at the intervention and run the comparison twice, once with every month in and once with the month the brief names set aside. The p-value is the engine's central p-value, twice the smaller tail and capped at 1.

## What catches people

Four mistakes recur. Taking the mean of the monthly rates as the centre line. Counting a point that sits exactly on its limit as a signal, when the engine's rule is strictly outside. Setting aside a month because it is high, without a found cause. And typing a p-value from another tool that uses the minlike convention, which can differ from the engine's central one on the same counts, as UTOROGU's 0.051759 and 0.025879 showed at Professional.

## A rehearsal on the teaching stream

Every step can be rehearsed on EGBEMA in the panel before the capstone opens. The chart's centre is 2.893273, month 8 signals, the revised centre is 2.389523, and the before-and-after comparison reads 1.000000 with every month in and 0.241552 with month 8 set aside. If your panel work reproduces those, your method is the engine's.

## Exercise

Before you open the capstone, run EGBEMA through all six steps in the panel and write each result beside the field it rehearses: centre, month 3's upper limit, month 1's lower limit and its `lclFloored` flag, the revised centre, and both before-and-after p-values. Mark which of the six depend on a decision about which months to keep.
