# A checklist is not a calculation

`screenLift` is a rules matrix. Six methods, each starting at 100, each deducting with a stated reason. Nothing in it is derived from anything, and its output is a ranking device with no unit, not a probability.

{{panel:pd-reading-explorer}}

## What silence scores

An empty input object gives every numeric field a zero and every boolean field a true, so the missing numbers read as the worst possible well and the missing conditions as the best possible facility. The golden commits the result: rodPump 100, gasLift 90, pcp 90, jetPump 65, esp 45, plunger 45, recommended `rodPump gasLift pcp`.

The rod pump reaches 100 on four printed pros, among them "Squarely in the rate range beam pumping is most economic at" and "Well inside what a rod string and a beam unit handle", on a well with no stated depth and no stated rate.

## The two deductions silence cannot trigger

`powerAvailable` and `gasAvailable` are read as `inputs?.x !== false`, so an unstated facility is fully equipped. Those two are the largest deductions in the matrix at sixty points each: turning `powerAvailable` false costs the ESP 60 points, and turning `gasAvailable` false costs gas lift 60. State them absent and the same empty well returns rodPump 100, pcp 90, plunger 45, jetPump 40, gasLift 30, esp 0.

## What a model does not fill in

`screeningInputsFromModel` returns seven fields and leaves six conditions unstated, every one defaulting to the favourable reading. With a fluid description it returns depthFt 6350, bhtF 232, api 24.6, gor 640, targetRate 800, wctPct 50 and isDeviated true, and the screening comes back gasLift 100, esp 100, jetPump 80, pcp 60, rodPump 50, plunger 0. Drop the fluid description and the same model gives gasLift 100, esp 80, pcp 80, jetPump 80, rodPump 70, plunger 0. An absent API is coerced to zero and zero reads as heavier than any real crude.

## What the return refuses to say

The recommendation band is score at or above the top less 15, and above 50. On a well that suits nothing, jetPump 30, gasLift 5, pcp 5 and three zeroes, that band is empty: recommended = 0 of 6, and no field in the return says so. The jet pump is docked twenty points unconditionally, so 80 is its ceiling. Over a 540 point sweep its highest score reached is 80, it is recommended at 54 points, and the highest leader score on any of those is 90.

## The mistake

Reading 100 as confidence. It is the number a method starts at, and it survives wherever the matrix had no reason to deduct, including every reason it was never told.

## Exercise

Score an empty input in the panel, then score it again with power and gas stated absent.

Then name the two conditions that moved, and say why no amount of missing data can produce that second answer.
