# Completeness and the null fraction

{{panel:dq-checks-explorer}}

The first question to ask of any file is whether the values are there. The engine's answer is `completeness`: present over n, where n counts every entry and present counts every entry that is not missing. Beside it the engine returns `nullFraction`, the share of entries that are missing. The two always describe the same count from opposite sides. Here is EKENE-7's log, all five channels.

| EKENE-7 channel | n | missing | present | missing fraction, `nullFraction` | completeness |
| --- | --- | --- | --- | --- | --- |
| GR | 240 | 0 | 240 | 0.000000 | 1.000000 |
| RHOB | 240 | 12 | 228 | 0.050000 | 0.950000 |
| NPHI | 240 | 3 | 237 | 0.012500 | 0.987500 |
| RT | 240 | 0 | 240 | 0.000000 | 1.000000 |
| DT | 240 | 0 | 240 | 0.000000 | 1.000000 |

## Reading the table

The density has 12 missing samples out of 240, so completeness is 0.950000 and the null fraction is 0.050000. The neutron has 3 missing and reads 0.987500. The other three channels are complete. Remember the previous module: the gamma ray reads 1.000000 here because it was delivered with its sentinel in place, and the sentinel is a present number.

## The production sheet

EKENE-3's daily sheet runs for 90 days and the same function reads each column.

| EKENE-3 column | n | missing | completeness |
| --- | --- | --- | --- |
| oil | 90 | 3 | 0.966667 |
| water | 90 | 0 | 1.000000 |
| gas | 90 | 0 | 1.000000 |
| gross | 90 | 3 | 0.966667 |
| waterCut | 90 | 5 | 0.944444 |
| cumOil | 90 | 1 | 0.988889 |

The water cut is the least complete column. Some of its missing days coincide with missing oil, and some do not; the next lesson shows how to tell, because completeness alone cannot.

## What one number hides

Completeness is a count, and a count has no shape. It cannot say whether the missing samples were scattered or bunched, where in the log they fell, or whether they matter for the question you want to answer. Twelve missing density samples spread through 240 would give exactly the same 0.950000 as the twelve EKENE-7 actually lost, which sit in one block.

That is why the engine never returns completeness alone. The same call returns one flag for each run of missing values, with its start and its length, and those flags are the subject of the next lesson.

## Choosing n

Completeness depends on what you call n. For a log, n is the number of entries in the array of values you passed. If you pass only the stretch across a reservoir, you get the completeness of that stretch, which can differ from the whole log's. There is no single right choice. The engine answers for the array it is handed, and the caller states which stretch that was when the figure goes into a report.

## Exercise

Open the checks explorer on the view for completeness and coverage. The values box holds a stretch of EKENE-7's density that runs into its gap. Read the Missing tile and the completeness tile. Now delete the entries before the first `null` so the box starts at the gap, delete the same number of depths from the start of the index box, and read both tiles again. Explain why the missing count stayed the same while completeness changed, and write the sentence you would put beside each figure in a report to say which stretch it describes.
