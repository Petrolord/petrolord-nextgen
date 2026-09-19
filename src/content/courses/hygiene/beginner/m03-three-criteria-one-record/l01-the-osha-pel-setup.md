# The OSHA PEL setup

{{panel:hy-noise-dosimeter}}

On the OSHA PEL setup the OBEN day is a noise dose of 27.748183 percent and a TWA of 80.752126 dBA, and the engine reports `exceedsLimit` false. Only two periods reach the PEL threshold, and between them they make the whole figure: 18.921153 percent from the third period and 8.827030 percent from the fifth.

The PEL setup is the criterion in 29 CFR 1910.95 Appendix A, the mandatory text that also writes the TWA formula with 16.61. Every number that defines it is measured out of the engine.

## The four numbers of the criterion

| part of the criterion | OSHA PEL |
| --- | --- |
| criterion level, dBA | 90.000000000000 |
| decibel exchange rate, dB | 5.000000000000 |
| threshold, dBA | 90.000000000000 |
| limit noise dose, percent | 100.000000000000 |

The criterion level and the threshold are the same number on this setup. That is what makes the PEL so selective: a period has to be at least as loud as the level that gives an eight-hour allowance before it counts at all.

## Two periods out of six

The PEL integrates 2 of the 6 OBEN periods. The third period, 0.800000 h at 94.600000 dBA, has a reference duration of 4.228072 h. The fifth, 0.200000 h at 99.100000 dBA, has one of 2.265768 h. The other four periods sit below 90 and contribute nothing, including the 1.900000 h at 89.800000 dBA that misses the threshold by a fifth of a decibel.

Add the two contributions and you have the day: 18.921153 plus 8.827030 is 27.748183 percent. The TWA of 80.752126 dBA restates it through the formula with 16.61, and it sits below the criterion level because the noise dose sits below 100 percent.

The panel beside this lesson shows the same split. Choose the PEL criterion and four of the six rows go blank in the contribution column. That blank is the threshold at work, and it is the first thing to look for when a PEL figure seems low for a day that felt loud.

## What false means here

`exceedsLimit` false says one thing: the PEL noise dose is under the PEL limit noise dose of 100 percent. It says nothing about the action level or about NIOSH, and the next two lessons show the same day is over both of those. A report that writes "under the limit" without naming the PEL has reported a verdict with no criterion attached, and the course never grades a verdict word for exactly that reason. The graded quantities are the numbers.

## Exercise

Take the two OBEN periods the PEL integrates. Divide 0.800000 h by 4.228072 h and 0.200000 h by 2.265768 h, write each in percent and add them. Check your total against the 27.748183 percent the engine reports. Then put that total through TWA = 16.61 log10(D/100) + 90 and compare your answer with 80.752126 dBA.
