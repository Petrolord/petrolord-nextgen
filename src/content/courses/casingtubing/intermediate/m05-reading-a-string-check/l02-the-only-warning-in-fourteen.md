# The only warning in fourteen

Seven cases, two sections, and one verdict that is not a pass.

{{panel:ct-loadcase-explorer}}

## The census

Fourteen section evaluations. Thirteen PASS. One WARNING. Zero FAIL.

The one is the pressure test on section 2.

## Its four numbers

| check | safety factor | design factor | warning below |
|---|---|---|---|
| burst | 1.2123376873879477 | 1.1 | 1.2100000000000002 |
| collapse | none | 1.0 | 1.1 |
| tension | 7.879089408631784 | 1.6 | not applicable |
| triaxial | 1.3684762565196722 | 1.25 | 1.375 |

Burst clears its warning threshold. Triaxial does not.

So the WARNING on a case called pressureTestBurst was produced by the TRIAXIAL check.

## Why that is the interesting outcome

The case is named after burst. The reader's eye goes to the burst column, sees 1.21 against a design factor of 1.1, and concludes the string is ten percent inside its burst margin.

That reading is not wrong, but it is not the reason for the flag, and the fix it suggests is not the fix that would work.

## What would fix it

Raising the burst rating, by a grade or a wall, would raise both numbers, so it would work. But it would work by accident.

The triaxial number is low because THREE things are acting at once at the shoe: 70415778.63557866 Pa inside, 25332119.440726407 Pa outside, and a bending stress from the 2 degree per 30 m dogleg.

Take the dogleg out and the triaxial number rises without a single change to the pipe. Reduce the test pressure and both fall. Which of those is the right answer depends on what is actually true about the well, and the burst column alone will not tell you.

## Why it is not a FAIL

Because 1.3684762565196722 is above 1.25. The section is inside its design factor on every one of the four checks. It is simply not inside it by much on one of them.

## The lesson in one line

The check that produces a verdict is not always the check the case is named after, and the name of a case describes what it was built to load rather than what it turns out to load worst.

## Exercise

Look at the fourteen rows in the panel's matrix view.

Find the second-lowest triaxial number in the whole table and say which case and section it belongs to. Then say how close that one is to its own warning threshold.
