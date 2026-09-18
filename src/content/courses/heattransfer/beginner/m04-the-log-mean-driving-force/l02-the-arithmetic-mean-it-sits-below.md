# The arithmetic mean it sits below

Add the two end differences and halve them and you have the arithmetic mean. It is the average most people reach for and it is the wrong one here. The log mean is strictly below the arithmetic mean whenever the two ends differ, and equal to it when they do not. That sentence is true by algebra, so you can check it on any row of any table without asking anybody for a reference.

{{panel:fc-exchanger-explorer}}

## The limit

| case | end one, degF | end two, degF | log mean, degF | arithmetic mean, degF |
| --- | --- | --- | --- | --- |
| the studio case, counter | 165.625000 | 100.000000 | 130.064846 | 132.812500 |
| the studio case, parallel | 200.000000 | 65.625000 | 120.584840 | 132.812500 |
| ORON, counter | 177.484127 | 113.000000 | 142.824087 | 145.242063 |
| ORON, parallel | 223.000000 | 67.484127 | 130.108390 | 145.242063 |
| published case 1, golden 109.696299 | 120.000000 | 100.000000 | 109.696299 | 110.000000 |
| published case 2, golden 88.498488 | 110.000000 | 70.000000 | 88.498488 | 90.000000 |
| published case 3, golden 280.000000 | 280.000000 | 280.000000 | 280.000000 | 280.000000 |
| published case 4, golden 216.158486 | 270.000000 | 170.000000 | 216.158486 | 220.000000 |
| published case 5, golden 69.521190 | 60.000000 | 80.000000 | 69.521190 | 70.000000 |
| published case 6, golden 85.264090 | 300.000000 | 10.000000 | 85.264090 | 155.000000 |

Read the last two columns of every row. The log mean is below the arithmetic mean on nine of those ten rows, and equal to it on the one where the two ends are the same number.

## Two arithmetic means that are identical

Rows one and two are the studio case in its two arrangements, and their arithmetic means are the same figure, 132.812500 degF. The arithmetic mean is half the sum of the two ends, and that sum is the same in both pairings because both use all four terminal temperatures with the same signs. Only the log mean tells the two arrangements apart, which alone should stop anybody using the arithmetic mean as a driving force.

## Where the two meet

Look down the rows for how far apart the two ends are, then look at how far the two means are apart. The case with the closest two ends is published case 3, where both ends are 280.000000 degF, and there the two means are the same number. At the other extreme sit ends of 300.000000 and 10.000000 degF, where a log mean of 85.264090 degF sits against an arithmetic mean of 155.000000 degF.

That is the direction and it is as far as this course goes with it. Do not subtract one mean from the other and quote the gap, and do not divide them. This engine was not asked for either figure, and a number you make by combining two columns is a number nothing here stands behind.

## What a transcription cannot see

Six of those rows carry a golden figure. A golden figure is not the engine answering a second time. The published file is written by the oracle, which reaches each log mean by integrating the driving force rather than by evaluating a closed form, so a golden figure beside an engine figure is two methods meeting.

Even two methods meeting has a blind spot, and the limit covers it. A check that compares a formula against a file written from the same formula cannot see an error made in both. Move a factor in the engine and in the file it is checked against and the two agree perfectly and are both wrong. The limit is immune, because nothing in the code was consulted to derive it: the log mean of two unequal positive numbers is below their arithmetic mean, and an answer that breaks it is wrong whatever agrees with it.

## Exercise

Take three rows from the table, compute the arithmetic mean of the two ends yourself, and check the inequality on each. Then find the row where it holds with equality and say what is special about that row. Finish by writing one sentence on what kind of error two agreeing methods can hide.
