# A stated weather factor

{{panel:marine-voyage-calculator}}

Weather slows a supply vessel. Head seas cut its speed, and swell can stop cargo work alongside an installation until it eases. The engine does not forecast any of that. It takes one stated factor and multiplies the time of the activities the plan names. This lesson reads the factor on the Ekene milk run.

## One number from 1 to 10

The weather factor is a number from 1 to 10. A factor of 1 is calm: every activity keeps its calm time. A factor of 1.2 adds a fifth to the time of each activity it applies to. The Ekene plan states 1.2 on sailing and field time as a rainy-season allowance, a planning factor the planner chose and wrote down.

| weather | sailing hours | field hours | total hours | days |
| --- | --- | --- | --- | --- |
| calm, factor 1 | 18.727273 | 23.000000 | 53.727273 | 2.238636 |
| rainy season, factor 1.2 | 22.472727 | 27.600000 | 62.072727 | 2.586364 |

Port time is 12.000000 hours in both rows, because the plan does not name port time. The next lesson turns to that choice.

## Where the idea comes from

Aas, Halskau and Wallace describe weather as a limit on two things: on sailing, and on loading and unloading at the installation. The engine takes that idea by concept and turns it into the simplest stated form, one factor on named time. It models no weather window, no wave height and no rule for waiting on weather. A plan that needs those states them outside the engine and reflects them in the factor it chooses.

## The factor has limits

A factor below 1 would make bad weather faster than calm, and the engine refuses it:

> weather.factor must be a finite number from 1 to 10; got 0.9

A factor above 10 is refused as well:

> weather.factor must be a finite number from 1 to 10; got 10.5

Both ends of the range are accepted. A factor of exactly 1 is the calm plan.

## A factor is a planning choice

Nothing in the engine says what factor a season deserves. The rainy-season 1.2 is the Ekene planner's stated allowance, and another planner could state another. What the course asks is that the factor is written down beside every figure it moves, so a reader can see how much of a voyage's time is weather allowance and argue with it.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "Ekene PSV milk run, rainy season". Change "Weather factor (stated)" from 1.2 to 1 and check the Total hours tile against the calm row above; then set Start from to "Ekene PSV milk run, calm" and confirm the two agree. Return to the rainy-season start. Type 0.9 into the weather factor control and read the refusal, then 10.5. Finally, restore 1.2 and note which hour columns the factor moved.
