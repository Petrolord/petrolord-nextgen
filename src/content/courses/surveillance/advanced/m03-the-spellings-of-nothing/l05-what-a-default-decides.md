# What a default decides

An absent API is zero in `screenLift` and 32 degrees in `liftAdvisor.liquidGravity`. Two files apart, one quantity, two defaults, and neither call site announces the substitution.

{{panel:pd-reading-explorer}}

## Zero as a crude

`screenLift` coerces with `Number(x) || 0`, so an absent API becomes zero, and zero reads as heavier than any real crude. The golden prints both sides. With the API known the scores are esp 100, gasLift 100, jetPump 80, pcp 55, plunger 0 and rodPump 85. With the API missing they are esp 80, gasLift 100, jetPump 80, pcp 80, plunger 0 and rodPump 85. The deltas are esp -20 and pcp +25: the ESP loses its viscosity points and the progressing cavity pump gains its best reason, on no information at all. A screening score is unitless and is a ranking device, not a probability, so a move of that size reorders a recommendation.

## The same absence, one file over

`liftAdvisor.num(api, 32)` reads an absent API as a 32 degree oil, and the derived liquid gravity at zero water cut is 0.865443425076 for undefined, for null and for a stated 32. A stated zero is taken literally there and returns 1.076045627376, which is denser than water. The two modules disagree about the same missing cell, and one takes a typed zero differently from an inferred one.

## The empty form

Hand `screenLift` an empty object and the golden returns rodPump 100, gasLift 90, pcp 90, jetPump 65, esp 45 and plunger 45, recommending rodPump, gasLift and pcp. Every numeric field defaulted to zero, which is the most favourable duty the matrix has, and every boolean defaulted to true.

The facility flags run the other way from the well. `powerAvailable` and `gasAvailable` are read as `inputs?.x !== false`, so an unstated facility is fully equipped, and the two sixty-point deductions in the matrix are the two that silence can never trigger. State both as absent and the same call returns rodPump 100, pcp 90, plunger 45, jetPump 40, gasLift 30 and esp 0.

## The mistake

Reading a recommendation off a form that was never filled in. Missing numbers read as the best possible well and missing booleans read as the best possible facility, so the emptier the input the more confident the answer looks.

## What the return will not tell you

No field says a value was defaulted, and none says the recommendation band is empty when it is. The band is a score at or above the leader less 15 and above 50, so on a well suiting nothing every method comes back not recommended and the caller receives a ranked list with no answer in it.

## Exercise

Run the screening in the panel with the API stated and then with it removed, and record both score sets.

Then name the two methods that moved, and say which moved on something learned about the well.
