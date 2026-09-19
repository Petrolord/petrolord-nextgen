# The factor only lowers a limit

{{panel:hy-protection-chemicals}}

On a 6.000000 hour shift the raw Brief and Scala daily factor is 1.500000 and the engine returns a factor of 1.000000. On a 4.000000 hour shift the raw factor is 2.500000 and the factor is again 1.000000. On a 30.000000 hour week the raw weekly factor is 1.437500 and the weekly factor 1.000000. A limit of 100 stays 100.000000 in every case. That is judgement J8.

## The cap

Brief and Scala written out for a short shift gives a number above one. Read literally, a limit set for eight hours would rise on a six-hour shift, by half again. The engine refuses to let that happen. It caps the factor at 1, so the adjusted limit is never above the limit it started from, and it keeps the uncapped value beside it as `rawRf` so the reader can see what the formula gave.

| schedule | raw factor | factor | adjusted limit for a limit of 100 |
| --- | --- | --- | --- |
| 4.000000 hour shift | 2.500000 | 1.000000 | 100.000000 |
| 6.000000 hour shift | 1.500000 | 1.000000 | 100.000000 |
| 8.000000 hour shift | 1.000000 | 1.000000 | 100.000000 |
| 30.000000 hour week | 1.437500 | 1.000000 | 100.000000 |

## Why a limit is never raised

An eight-hour limit is set with the eight-hour day in mind, and the model behind Brief and Scala is a simple one: intake over the shift, recovery over the rest of the day. It is good enough to argue that a longer shift needs a lower limit. It gives no grounds to relax a limit for a shorter one, because a short shift may still carry peaks the eight-hour average does not see. A reduction factor reduces, and nothing else.

## Two things the cap keeps

The cap keeps the adjusted limit protective. Keeping `rawRf` keeps the arithmetic honest: a reader who wonders why a six-hour shift and an eight-hour shift carry the same limit can see the 1.500000 the formula produced and the rule that set it aside.

## Where this sits in the course

Judgement J8 says three things together: the factor is capped at 1 with the raw value kept, the smaller of the daily and weekly factors governs, and 24 hours a day gives 0. The first is this lesson, the second is the previous one, and the third is the end of the daily table. No capstone input in this course sits on the cap.

The edges of the schedule are refused outright. A shift of zero hours, or of 25, is refused on `shiftHours` with the same words:

> shiftHours must be a number of hours above zero and at most 24

So the cap handles every short shift the engine accepts, and the refusal handles every schedule that is not a day.

## Exercise

Evaluate the raw daily factor by hand at 6.000000 hours and confirm 1.500000. Then say what adjusted limit the engine returns for a limit of 100 on that shift, and write the one sentence a report would carry explaining why the raw value is shown but not applied.
