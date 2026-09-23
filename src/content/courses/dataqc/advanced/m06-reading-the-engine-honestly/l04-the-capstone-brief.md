# The capstone brief

{{panel:dq-monitor-explorer}}

The Expert capstone grades 6 fields, and every one answers the Expert question: has the process changed, and what does the scorecard say? Each is a figure the engine returns from a control chart or a scorecard, graded against the engine's own result. On the teaching stream the equivalent figures are EKENE-3's phase one upper limit of 622.702188 psig, its moving range upper limit of 13.908086 psi and the scorecard total of 0.927390.

| graded field | where it comes from |
| --- | --- |
| the phase one individuals upper limit | the individuals chart on the in-control days |
| the phase one moving range upper limit | the same chart, D4 times MRbar |
| an EWMA value on a named day | the EWMA chart, target and sigma from phase one |
| an exact EWMA upper limit on a named day | the same chart, with exact limits |
| a CUSUM upper sum on a named day | the tabular CUSUM, k and h in the stated unit |
| a weighted scorecard total | the scorecard, with the stated weights |

## What you are given

You are given a pressure series in two phases, the in-control history and the days to monitor, with its unit. The brief states lambda, L, k, h and the unit of k and h, and it gives the scorecard's counts and weights. None of the capstone's values or answers appear anywhere in this course, and every figure in the lessons belongs to the teaching streams.

## How to work it

Work it in the order of a monitoring plan. Chart phase one on its own and read the centre, MRbar, sigma = MRbar / 1.128, the individuals upper limit and the moving range upper limit. Check that phase one raises no flag. Then chart phase two with the target and sigma from phase one: the EWMA with the stated lambda and L, once with asymptotic limits and once with exact ones, and the CUSUM with the stated k, h and unit. Read each figure off the day the brief names, counting days from 1. Last, enter the scorecard's counts and weights and read the total.

## What catches people

Five mistakes recur. Drawing phase two's chart on its own averages, which moves the centre into the data being monitored. Reading an EWMA limit from the asymptotic pair when the brief asks for the exact one, which differs on the early days. Entering k and h in the wrong unit, which on EKENE-3 moved the first upper signal from day 8 to day 4. Reading the engine's zero-based entry as a day. And typing weights that do not match the brief, which moves the total even though the scores are the same.

## A rehearsal on the teaching stream

Every step can be rehearsed on EKENE-3 in the panel. Phase one's upper limit is 622.702188 and its moving range upper limit 13.908086. With lambda 0.2 and L 3, the EWMA on day 10 is 614.813527 and the exact upper limit on day 3 is 614.621865. With k 0.5 and h 4 in sigma units, S_hi on day 13 is 24.362655. The scorecard at weights 3, 2, 2, 1 and 1 totals 0.927390. If your panel work reproduces those, your method is the engine's.

## Exercise

Before you open the capstone, run EKENE-3 through all six steps in the panel and write each result beside the field it rehearses. Then mark which of the six depend on phase one alone and which also depend on the monitored days, and which one would change if you switched the EWMA from exact limits to asymptotic ones.
