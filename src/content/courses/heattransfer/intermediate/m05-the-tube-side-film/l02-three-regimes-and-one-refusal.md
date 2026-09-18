# Three regimes and one refusal

The tube side has three regimes and the engine treats them as three different questions. Below a Reynolds number of 2300 it uses a laminar limit and warns. Above 10000 it uses the turbulent correlation and answers plainly. Between the two it refuses, and the refusal is the correct answer rather than a gap in the coverage.

Both of those boundaries are declared constants of the module. They are numbers a reviewer can find in one place rather than comparisons buried in the arithmetic, and the refusal quotes them back in its own message, so a reader never has to go looking for the band they have landed in.

## One bundle, swept across its flow

| tube-side flow, lb an hour | Reynolds | regime | film coefficient |
| --- | --- | --- | --- |
| 2600.0000 | 1431.684995 | laminar | 5.667097 |
| 45000.0000 | 24779.163375 | turbulent | 345.692714 |
| 120000.0000 | 66077.769000 | turbulent | 757.644042 |
| 400000.0000 | 220259.229998 | turbulent | 1985.035182 |

Two flows are missing from that table on purpose. At 12000.0000 lb an hour the engine refuses, and so does 6000.0000 lb an hour, because both land the Reynolds number inside the transition band. The laminar row carries a warning, which is the subject of the next lesson.

Read the turbulent rows for direction only. More flow gives a higher Reynolds number and a higher film coefficient, and this course prints no ratio between those rows because the engine computes none.

{{panel:fc-coefficient-explorer}}

## The refusal, and the evidence beside it

Asked for the film at 6000.0000 lb an hour on the studio bundle, the engine refuses: tube-side Reynolds 3304 is in the transition band (2300 to 10000): no film correlation is trustworthy here. Change the tube count, the passes or the bore to leave it.

That refusal does not arrive alone. It carries the Reynolds number that put the case there, at 3303.888450, the Prandtl number at 15.119375, and the tubes a pass at 37.000000. A refusal that carried only the message would leave a caller with no idea how far inside the band they were, or which way to move to get out.

## Why refusing beats answering here

The transition band is where no correlation is dependable. The laminar limit has stopped applying and the turbulent fit has not started, so a number produced in that gap would be a confident figure with nothing behind it. Sizing steel on one is worse than being told to change something.

Notice also what the refusal tells the caller to change. The tube count, the passes or the bore, which are three inputs, and all three move the velocity inside a tube. The band is a property of the velocity rather than of the duty, so the remedy is geometry.

There is a second reason the band matters on this engine in particular. The tube count here is found by iteration, and an intermediate count on the way to the answer can land the film inside the band even when the final count sits well outside it. That is why the studio walks a ladder of seeds rather than starting from one guess: a seed that refuses is a seed the loop cannot start from, and the ladder gives it somewhere else to begin.

## Exercise

Record the four flows in the table with the Reynolds number, the regime and the film coefficient at each. Then record the two flows the engine refuses, the band boundaries, and the three pieces of evidence the refusal carries beside its message.
