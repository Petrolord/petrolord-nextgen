# Working the capstone

The order of work, and the checks that catch the mistakes people make.

{{panel:pd-card-explorer}}

## The method

A graded card problem runs on its own conditions. What carries across is the order, because every step needs the one before it.

**One. Build the string and the pump before anything is marched.** Weight, buoyed weight, spring rate, elastic constant, linkage stroke, plunger area, fluid load. None of it depends on speed and all of it is closed form.

**Two. Get the string's note, then choose a speed.** The engine refuses any design at or above the fundamental, with a message that names the number, so a speed chosen first can be refused rather than adjusted.

**Three. State the damping ratio and treat it as an input, not a default.** Walking it across nine rows on one design moves the peak load 2223.684206 lb, the plunger stroke 13.541308 in and the horsepower from 15.588073 to 24.404568 hp, on a quantity nobody measures and whose field range the engine's own message puts between about 0.05 and 0.15 of critical.

**Four. March, then read the plunger stroke against the spring rule.** The spring rule is the static limit of the same quantity and does not move with speed: 45.279814701 in on the published taper, against a marched 49.670227367 in at 9 spm, 9.696181 percent longer. Report the marched one, quote the difference, and call it overtravel.

**Five. Read the two loads together and against the rod weight.** A peak of 16490.601223 lb and a minimum of 5823.210940 lb say more standing 7816.843261277 lb above and 2850.547021552 lb below a buoyed weight of 8673.757961783 lb than either says alone.

**Six. Take the card area into horsepower at the speed you marched at.** Area times speed over 396000, and say where the number is measured.

**Seven. Take the plunger stroke into a rate, then state fillage and pump efficiency beside the answer.** A rate without those two is not reportable.

## The checks

**The slow speed identity.** March the same design near static and the wave answer should collapse onto the spring rule: 45.286791250 in against 45.279814701, 0.015408 percent, with the two loads landing on the buoyed weight plus the fluid load and on the buoyed weight alone. If it does not, the build is wrong.

**Converged, and the warning list, before any number is read.** Rows can come back with notPeriodic inside an ordinary damping range.

**The three rates in order.** Rated above swept above produced, on a design where the ratio of the last to the first is 0.831154611.

## The failures to expect

Quoting the spring rule as the stroke. Quoting a rating as a production. Reading silence from the warning list as a full barrel, when 0.8500 and 0.8499 differ by 0.035477 bbl/d and only one of them speaks. Multiplying a rating by a fillage by hand and expecting the engine's produced rate: the effective factor at a nominal 0.9000 is 0.928442245. Reporting a horsepower without the speed and the card behind it. And calling three rising rows of a speed sweep a trend.

## Exercise

Work one design in order: string, note, speed, damping ratio, march, both loads, area, horsepower, then the three rates.

Beside each number write the choice that produced it, and run the slow speed identity first.
