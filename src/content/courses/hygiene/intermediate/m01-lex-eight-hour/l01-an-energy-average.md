# An energy average

{{panel:hy-noise-dosimeter}}

HSE L108 Figure 26 works one day of noise exposure: 80 dBA for 5 h, 86 dBA for 2 h and 95 dBA for 45 min. The engine returns a daily noise exposure level, LEX,8h, of 86.613302 dBA and 144.987371 noise exposure points. The source prints 87 dB(A) and 145 points, and the engine reproduces both at the precision the source prints them.

| task | LAeq, dBA | hours | task LEX, dBA | points |
| --- | --- | --- | --- | --- |
| 1 | 80.000000 | 5.000000 | 77.958800 | 19.764235 |
| 2 | 86.000000 | 2.000000 | 79.979400 | 31.473135 |
| 3 | 95.000000 | 0.750000 | 84.719713 | 93.750000 |

## The formula the source prints

LEX,8h = 10 log10( sum( t_i / 8 x 10^(L_i/10) ) ). Each task's sound level is turned back into a quantity proportional to acoustic energy, weighted by its share of an eight-hour day, summed, and turned back into decibels. That is an ENERGY average. The door is `lexEightHourDbA`, and it takes tasks of LAeq and hours.

## Why the shortest task carries the most

Read the points column. The 95 dBA task lasts 0.750000 h and carries 93.750000 points. The 80 dBA task lasts 5.000000 h and carries 19.764235. A task fifteen decibels louder carries far more energy in a fraction of the time, so the last three quarters of an hour decides most of the day. The task LEX column says the same thing in decibels: 84.719713 dBA for the short loud task against 77.958800 dBA for the long quiet one.

This is the property a hygienist most often gets wrong when reading a survey by eye. An arithmetic mean of the three sound levels weights them by count, and a time weighted arithmetic mean weights them by hours. Neither is the quantity the regulation defines, and both understate a day with a loud spell in it.

## Where this sits beside the Associate tier

The Associate tier built a noise dose against a criterion with a threshold and a decibel exchange rate of 5 dB or 3 dB. LEX,8h is a different metric from a different source. It uses the energy relation throughout, it has no criterion level of its own, and it has no threshold. The two can be read from one survey, and each answers its own question. Say which one you mean every time you quote a figure.

## What the engine returns with it

Beside the daily level the engine returns each task's contribution in noise exposure points and its own task LEX, and two flags against the EU action values, which a later lesson in this module reads. Every result names its source, here the UK Control of Noise at Work Regulations 2005 as written up in HSE L108.

## Exercise

From the table, add the three task points and check that they reach the 144.987371 the engine reports for the day. Then state which task carries the largest share of the day's noise exposure points, and give its hours and its sound level. Finally, write one sentence saying why the source's printed 87 dB(A) is reproduced by a result of 86.613302 dBA.
