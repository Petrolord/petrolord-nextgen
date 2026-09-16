# Miles, not feet

A gas line in this engine is measured in miles because that is the unit the published transmission forms are stated in. The SOKU trunk is 32.000000 miles. The elevation change on the same call is in feet, so one gas call carries two units of length.

{{panel:fc-gasline-explorer}}

## The published cases, and the range they cover

| bore in | length miles |
| --- | --- |
| 12.000000 | 50.000000 |
| 6.065000 | 10.000000 |
| 16.000000 | 80.000000 |
| 8.000000 | 25.000000 |

Ten miles to eighty. Nothing in the gas half of this engine is stated in feet of pipe, and a length handed to a gas form in feet is read as miles, which describes a line far longer than anything that has ever been built.

## Two units on one call

The elevation change stays in feet. The published cases at 8.000000 in over 25.000000 miles are run at 800.000000 ft of rise and at 800.000000 ft of fall, and both figures sit on the same call as a length in miles. The reason is that the two lengths do different work. The miles scale the friction the gas spends along the pipe, and the feet scale the static column the gas has to lift or is given back.

## The engine carries the conversion, and it can be measured

The mile is not left implicit. The engine has to compare a rise in feet against a length in miles wherever it checks that a line does not climb further than it is long, and that comparison is where the conversion lives. Asked for the largest rise it will accept on a gas line 1.000000 mile long, the engine accepts 5280.000000000 ft, and the next representable value above it, higher by about 9.095e-13 ft, it refuses. The conversion is exactly the feet in a mile, and it was read out of the engine rather than typed beside it.

## The liquid half stayed in feet

The traverse later in this tier marches a liquid line over 26400.000000 ft in three segments of 8800.000000 ft. That is the same order of length as a short gas line and it is written in feet, because the liquid correlations are stated in feet. Moving between the two halves of this engine means changing the unit of length, and the engine will not do it for a caller.

## The mistake

The mistake is converting once too often or not at all. A trunk entered in feet where the form expects 32.000000 miles is a line that will carry almost nothing, and a rise entered in miles is a hill of no height. Neither produces an error, because both are numbers a gas line could legitimately have.

The second mistake is assuming the elevation term follows the length unit. It does not. It is feet on every call.

## Exercise

State the unit of length a gas form takes and the unit the elevation change takes on the same call. Give the lengths of the four published gas cases. Then say what the engine accepts as the largest rise on a line 1.000000 mile long, and explain what that figure measures.
