# The import panel map

This lesson is the map of the tier. It names the four readings the import panel produces, says which module owns each one, and puts the six graded readings in front of you at the start rather than at the end, worked on the teaching files. Knowing what you are being asked to produce changes how you read everything between here and the capstone.

## The four readings

The panel runs the real pipeline on whichever teaching file you choose and reports four things about it.

**Depth units.** The native depth unit as the file declares it, the native start and stop in that unit, and the converted start and stop in metres. This is the reading that makes the file's foreignness visible, because both the native and the converted numbers are on screen together. Module 2 owns it.

**Curve units.** For every curve, the unit it arrived in, the unit it now carries, and a flag saying whether it was converted. Reading down that flag column and counting the yes entries is how you answer the question of how many curves were converted. Module 3 owns it.

**Curve kinds.** For every curve, the kind the pipeline assigned to it from its mnemonic alone, or nothing where the mnemonic was not recognised. The index curve is shown with its own kind, stamped on it because it comes first rather than because it was recognised, and it is not counted among the recognised value curves. Module 4 owns it.

**Step uniformity.** The verdict on the converted depth column, which is either a step in metres or a statement that no uniform step exists. Module 5 owns it, and module 5 is where you learn why that verdict is a tolerance test rather than an equality test.

Module 6 then puts the four together as a workflow, in the order you would actually run them on a file that arrived this morning, and walks the capstone.

## The six graded readings

The capstone asks for these six readings on its own case files, the ODUMA campaign: five from oduma3_feet.las and one from oduma4_irregular.las, which you download from the capstone card and open in the import panel with Open your own LAS files. Here they are worked on the teaching files, five from feet_20.las and one from irregular_20.las. Your capstone values will be different. The tolerances are the ones the capstone uses, so learn them alongside the readings.

| reading | worked example (teaching files) | tolerance |
|---|---|---|
| start depth converted | 1493.52001953125 m | 0.01 |
| stop depth converted | 1584.9599609375 m | 0.01 |
| depth step converted | 0.609619140625 m | 0.001 |
| curves unit-converted | 2 | 0, must be exact |
| curve kinds recognised | 4 | 0, must be exact |
| irregular_20 depth samples | 121 | 0, must be exact |

Notice the shape of that table. The first three are continuous quantities with a tolerance, so an answer close enough passes and the interesting question is what "close enough" means. The last three are counts with no tolerance at all, so an answer that is one off fails outright, and the interesting question is what a careful reader miscounts.

Both halves have a trap in them, and both traps are worth naming now.

The continuous readings are graded on pipeline values with far more digits than any calculator will give you. Hand arithmetic on the start depth gives 1493.52 m converted, and the pipeline value carries digits beyond that. Both pass, comfortably, and module 2 explains exactly where the extra digits come from and why the hand answer is a correct answer rather than a near miss.

The counted readings are graded on definitions rather than on arithmetic. On feet_20 two curves are converted, and getting one means you assumed unit trouble is a depth problem. Four kinds are recognised out of five curves, and getting five means you counted the index curve as a measurement. Neither mistake is a slip. Each is a wrong model of what the pipeline is doing, which is why they are graded with no tolerance.

## How to use the panel

Use it to check yourself, in that order, rather than to find out. The productive loop is to predict a reading from the file's header and your understanding of the rules, write the prediction down, then open the panel and compare. A prediction that matches confirms the rule. A prediction that misses tells you which rule you have wrong, and the panel shows you enough intermediate detail to find out which.

There is one particular habit to build now. Whenever you read a converted depth off the panel, say the word converted when you write it down. The panel shows the native and converted values side by side precisely because a depth without its unit and its provenance is a number that will mislead someone later, and the discipline of saying which one you mean is cheap here and expensive to acquire after a mistake.

The panel below runs the import pipeline on any of the six teaching files, or on any LAS file you open with Open your own LAS files, and reports the native and converted depths, each curve's unit, kind and converted flag, and the uniformity verdict.

{{panel:wd-import-explorer}}

## Exercise

Open the panel on feet_20.las and locate all five of its readings, then open it on irregular_20.las and locate the sixth. For each reading, write one sentence naming the module that will explain it and one sentence saying what you would have to believe to get it wrong. Then answer this without looking: which three of the six are graded with no tolerance at all, and what those three have in common.

Self-check: the three with no tolerance are the two curves unit-converted, the four curve kinds recognised and the 121 depth samples in irregular_20. All three are counts, and a count is right or it is wrong. To get the converted count wrong you have to believe unit conversion is a property of the depth column alone; to get the kind count wrong you have to believe the index curve is a measurement like the others; and to get the sample count wrong you have to have opened the wrong file, since irregular_20 is the only one of the six whose reading this tier takes. Once you have done this on the teaching files, repeat it on the ODUMA files for the capstone.
