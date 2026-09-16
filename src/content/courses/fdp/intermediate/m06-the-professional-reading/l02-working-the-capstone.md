# Working the capstone

A graded exercise on a development plan is marked on the number you produce, and almost every lost mark comes from answering a slightly different question than the one asked. Four habits carry it: read the conditions, run the method, check the units, and never guess.

{{panel:ec-schedule-explorer}}

## Read the conditions

Most questions of this kind name a basis, and the basis changes the answer. A facility reads an oil utilisation of 1.000000 when its nameplate of 60000 bopd is measured against a plan peaking at 60.0000 kbpd, and 0.400000 when the nameplate is 150000 against the same peak. Neither figure is wrong. They answer different questions, and only one of them was asked. Before working anything, write down which rate, which date, which facility and which concept the question names.

## Run the method

The method is not a shape to recognise. A network of activities is worked by a forward pass for early dates, a backward pass for late dates, and float as late start minus early start. Done properly on the teaching schedule it gives 870 days along a1, a3, a4, a7 and a8, and it gives detailed engineering 180 days of float, topsides fabrication 180 and subsea installation 480. Guessing that everything in a long chain is critical returns all 8 activities critical, which is exactly what the engine returned before it was repaired.

The method also has to be run on what is actually there. With no dependencies typed at all, every activity starts on day 0 and the network is only as long as its longest single activity: a published case of four independent activities returns 7 days with all four critical, and that is arithmetic rather than a finding about the project.

## Check the units

| quantity | how it is written |
| --- | --- |
| oil reserves | MMbbl |
| gas reserves | Bcf |
| plan money | million USD to four decimals |
| well and task costs | whole currency units |
| ratios | six decimals |
| percents | four decimals |

Oil of 130.0000 MMbbl and gas of 70.0000 Bcf do not add, and 200.0000 is a number of nothing. A sum of low cases is not the low case of a sum, so adding P90s across reservoirs and labelling the total a P90 is wrong even within one fluid. A peak of 60.0000 kbpd is 60000 bopd. A plan capex of 2250.0000 million USD and a campaign cost of 141050000 USD are both money and neither converts to the other by moving a decimal in your head.

## Never guess

When the engine has no answer it says so, and the honest answer is the one it gives. A case with a net present value of -1834.1220 returns no rate of return and a status of no-root. An activity with no readable dates returns a calendar span of null. A project with no costed task returns no schedule index, no cost index and no percent complete, with the basis stated: no costed task, so there is no planned value. A concept with no capex is refused by name. Writing a plausible figure into any of those gaps turns a correct reading into a wrong answer.

## Exercise

Take any number you are about to write and say which method produced it, which inputs it read and what it was measured against. Then check its unit against the table, and its precision against the way the engine prints it.
