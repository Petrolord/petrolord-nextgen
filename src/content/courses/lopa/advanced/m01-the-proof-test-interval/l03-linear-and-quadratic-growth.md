# Linear and quadratic growth

{{panel:lp-proof-test}}

Doubling a proof test interval does not always double the PFDavg. How much it multiplies by depends on which term inside the Annex B form is carrying the subsystem, and the engine lets you measure that without knowing the algebra. Take each row of a sensitivity sweep, divide it by the row at half the interval, and the ratio tells you which term is in charge. A ratio of two says a linear term dominates. A ratio climbing toward four says a term that grows with the square of the interval is taking over.

## The ratio for each doubling

Each figure below is the PFDavg at that interval over the PFDavg at half of it, on the four subsystems of the sensitivity sweep.

| T1 hours | EKULAMA 1oo1, DU only | EKULAMA full 1oo2 | EKULAMA full 2oo3 | IDU valves 1oo2 |
| --- | --- | --- | --- | --- |
| 4380 | 2.000000 | 2.049485 | 2.164389 | 2.037515 |
| 8760 | 2.000000 | 2.116328 | 2.321406 | 2.104288 |
| 17520 | 2.000000 | 2.229198 | 2.561394 | 2.212798 |
| 35040 | 2.000000 | 2.415452 | 2.879660 | 2.391248 |
| 70080 | 2.000000 | 2.689723 | 3.222922 | 2.657218 |

## The exactly linear case

A 1oo1 with no detected failures is linear in the interval. Its PFDavg is the undetected failure rate times the interval over two, and doubling the interval doubles it. The column reads 2.000000 at every doubling, and it would read 2.000000 at any doubling you chose to add. There is one term and the interval enters it once.

## Where the ratios above two come from

The three redundant columns start just above two and climb. Each of them carries two kinds of term. The common cause term is a single channel failing, so the interval enters it once and it grows linearly. The independent term needs two channels to fail, so the interval enters it twice and it grows with the square. At a one year interval these three subsystems are common cause dominated, which is why their ratios sit near two at the top of the table. As the interval grows the independent term takes a larger share, the square starts to show, and the ratio climbs toward four without reaching it anywhere in this sweep. The 2oo3 climbs fastest, from 2.164389 to 3.222922, because its independent term carries the largest coefficient of the three.

There is a second reading of the same columns. A ratio near two says the subsystem is behaving like a single channel, because the common cause term is a single channel failure. A redundant subsystem whose ratio sits near two has bought less from its redundancy than its architecture suggests.

## Why the shape matters before the number does

Knowing the shape tells you what a stretch will cost before you compute it. On a linear subsystem a stretch from one year to two years costs a factor of two and no argument is needed. On a subsystem that is turning quadratic the same stretch costs more each time you repeat it, so a plan to stretch once and then stretch again is not two identical decisions. The engine reports the numbers; the shape is what lets an analyst predict the next one.

## Exercise

Take the EKULAMA full 2oo3 ratios of 2.321406 at 8760 hours and 2.879660 at 35040 hours. Write down how much the ratio itself grew between those two doublings. Then multiply the IDU valves figure of 0.001287026426 at 8760 hours by the ratio 2.212798 printed against 17520 hours, and write one sentence saying what you would expect the next ratio in that column to do if the sweep carried on past eight years.
