# The noise dose from a TWA

{{panel:hy-noise-dosimeter}}

A TWA of 90 dBA is a noise dose of 100.000000 percent on OSHA and 316.227766 percent on NIOSH. A TWA of 85 dBA is 50.000750 percent on OSHA and 100.000000 percent on NIOSH. The door is `noiseDoseFromTwaPct`, and it runs the TWA formula backwards: from a level to the noise dose it restates.

This is the question to ask when a report hands you a TWA and nothing else. Older survey records, contractor summaries and some instrument displays give the TWA alone, and the noise dose is what tells you how much of the allowance was used.

## The table

| TWA, dBA | OSHA noise dose, percent | NIOSH noise dose, percent |
| --- | --- | --- |
| 80.000000 | 25.000750 | 31.622777 |
| 82.000000 | 32.988490 | 50.118723 |
| 85.000000 | 50.000750 | 100.000000 |
| 87.000000 | 65.975989 | 158.489319 |
| 88.000000 | 75.786283 | 199.526231 |
| 90.000000 | 100.000000 | 316.227766 |
| 92.000000 | 131.949999 | 501.187234 |
| 95.000000 | 199.996999 | 1000.000000 |
| 100.000000 | 399.987998 | 3162.277660 |

At its own criterion level each scale gives exactly 100 percent: OSHA at 90, NIOSH at 85. Everything else follows the decibel exchange rate and the printed coefficient.

## The printed coefficient shows here too

On OSHA a TWA of 95 dBA gives 199.996999 percent, a hair short of 200. On NIOSH a TWA of 88 dBA gives 199.526231 percent, a little further short. With the exact coefficients both would land on 200, because one decibel exchange rate is exactly a doubling. The printed 16.61 and 10.0 are both slightly larger than exact, so a given rise in TWA buys slightly less than a doubling. That is judgement J1 again, seen from the other side, and the NIOSH gap is larger because its printed coefficient sits further from the exact one.

The same effect puts the OSHA action level at 50.000750 percent for a TWA of 85. The regulation calls the two equivalent, and at its printed precision they are.

## A round trip

The two doors undo each other. The OBEN day's PEL TWA of 80.752126 dBA goes back to a noise dose of 27.748183 percent, and its NIOSH TWA of 89.242460 dBA goes back to 265.610944 percent. A TWA and its noise dose are one fact, and you can move between them in either direction as long as you keep the criterion fixed.

What you cannot do is take a TWA read on one criterion and turn it into a noise dose on another. A TWA of 89.242460 dBA from the NIOSH scale fed into the OSHA formula would give a number that describes no record at all, because the TWA already carries its criterion's level and coefficient inside it.

Keep the direction clear in a report as well. Write which quantity was measured and which was derived, so a reader knows whether the noise dose came from the instrument or from a TWA someone quoted.

## Exercise

Take the OSHA row for a TWA of 92 dBA, a noise dose of 131.949999 percent. Put 92 into D = 100 x 10^((TWA - 90)/16.61) and check the noise dose. Then read the NIOSH noise dose at the same TWA from the table, and say how many times larger it is than the OSHA figure and which two parts of the criterion account for the difference.
