# The import panel map

This lesson is the map of the tier. It names the four readings the import panel produces, says which module owns each one, and puts the six graded numbers in front of you at the start rather than at the end. Knowing what you are being asked to produce changes how you read everything between here and the capstone.

## The four readings

The panel runs the real pipeline on whichever teaching file you choose and reports four things about it.

**Depth units.** The native depth unit as the file declares it, the native start and stop in that unit, and the converted start and stop in metres. This is the reading that makes the file's foreignness visible, because both the native and the converted numbers are on screen together. Module 2 owns it.

**Curve units.** For every curve, the unit it arrived in, the unit it now carries, and a flag saying whether it was converted. Reading down that flag column and counting the yes entries is how you answer the question of how many curves were converted. Module 3 owns it.

**Curve kinds.** For every curve, the kind the pipeline assigned to it from its mnemonic alone, or nothing where the mnemonic was not recognised. The index curve is shown with its own kind, stamped on it because it comes first rather than because it was recognised, and it is not counted among the recognised value curves. Module 4 owns it.

**Step uniformity.** The verdict on the converted depth column, which is either a step in metres or a statement that no uniform step exists. Module 5 owns it, and module 5 is where you learn why that verdict is a tolerance test rather than an equality test.

Module 6 then puts the four together as a workflow, in the order you would actually run them on a file that arrived this morning, and walks the capstone.

## The six graded numbers

Five of these come from feet_20.las and one comes from irregular_20.las. The tolerances are part of the fact, so learn them alongside the values.

| reading | value | tolerance |
|---|---|---|
| start depth converted | 1493.52001953125 m | 0.01 |
| stop depth converted | 1584.9599609375 m | 0.01 |
| depth step converted | 0.609619140625 m | 0.001 |
| curves unit-converted | 2 | 0, must be exact |
| curve kinds recognised | 4 | 0, must be exact |
| irregular_20 has a uniform step | 0, meaning no | 0 |

Notice the shape of that table. The first three are continuous quantities with a tolerance, so an answer close enough passes and the interesting question is what "close enough" means. The last three are counts and verdicts with no tolerance at all, so an answer that is one off fails outright, and the interesting question is what a careful reader miscounts.

Both halves have a trap in them, and both traps are worth naming now.

The continuous readings are graded on values with far more digits than any calculator will give you. Hand arithmetic on the start depth gives 1493.52 m converted, and the graded value carries digits beyond that. Both pass, comfortably, and module 2 explains exactly where the extra digits come from and why the hand answer is a correct answer rather than a near miss.

The counted readings are graded on definitions rather than on arithmetic. Two curves are converted, and getting one means you assumed unit trouble is a depth problem. Four kinds are recognised out of five curves, and getting five means you counted the index curve as a measurement. Neither mistake is a slip. Each is a wrong model of what the pipeline is doing, which is why they are graded with no tolerance.

## How to use the panel

Use it to check yourself, in that order, rather than to find out. The productive loop is to predict a reading from the file's header and your understanding of the rules, write the prediction down, then open the panel and compare. A prediction that matches confirms the rule. A prediction that misses tells you which rule you have wrong, and the panel shows you enough intermediate detail to find out which.

There is one particular habit to build now. Whenever you read a converted depth off the panel, say the word converted when you write it down. The panel shows the native and converted values side by side precisely because a depth without its unit and its provenance is a number that will mislead someone later, and the discipline of saying which one you mean is cheap here and expensive to acquire after a mistake.

The panel below runs the import pipeline on any of the six teaching files and reports the native and converted depths, each curve's unit, kind and converted flag, and the uniformity verdict.

{{panel:wd-import-explorer}}

## Exercise

Open the panel on feet_20.las and locate all five of its readings, then open it on irregular_20.las and locate the sixth. For each reading, write one sentence naming the module that will explain it and one sentence saying what you would have to believe to get it wrong. Then answer this without looking: which two of the six are graded with no tolerance at all because they are counts, and which one is graded with no tolerance because it is a verdict.

Self-check: the counts with no tolerance are the two curves unit-converted and the four curve kinds recognised, and the verdict with no tolerance is whether irregular_20 has a uniform step, which is 0 meaning no. To get the converted count wrong you have to believe unit conversion is a property of the depth column alone; to get the kind count wrong you have to believe the index curve is a measurement like the others; to get the uniformity verdict wrong you have to believe an average step is evidence about the interior of a depth column.
