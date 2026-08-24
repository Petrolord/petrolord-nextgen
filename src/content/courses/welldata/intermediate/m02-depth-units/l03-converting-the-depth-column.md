# Converting the depth column

Two of the six graded readings come out of this one operation, so it is worth doing slowly and out loud. The operation is: take the depth column of feet_20.las, multiply every sample by the factor for feet, and read the start and stop off the result.

## The column, not the header

Start with something the pipeline does that a hand calculation usually does not. It converts the depth column, sample by sample, and then takes the first converted sample as the start depth and the last converted sample as the stop depth. It does not convert the header entries.

That is a deliberate choice and it follows the Associate tier's rule that the header is a claim while the depth column is the fact. A file can declare a start of 4900 ft and begin its data at a different depth. Convert the header and you would report a start the well does not have. Convert the column and read its ends, and the reported start and stop are guaranteed to be depths at which data actually exists.

For this file the two agree, because feet_20 is a clean export. Its header says 4900 ft and its first data row is at 4900 ft. The agreement is a fact about this file rather than a property of the format, which is exactly why the pipeline does not rely on it.

## The two values by hand

The arithmetic is one multiplication each.

**Start.** The first sample sits at 4900 ft. Multiply by the factor:

$$4900 \times 0.3048 = 1493.52$$

so the converted start depth is 1493.52 m.

**Stop.** The last sample sits at 5200 ft. Multiply by the factor:

$$5200 \times 0.3048 = 1584.96$$

so the converted stop depth is 1584.96 m.

Now a closure check, which is a habit worth keeping for every conversion you ever do. The native span is 5200 minus 4900, or 300 ft. Converting the span directly gives 300 x 0.3048 = 91.44 m. Subtracting the two converted depths gives 1584.96 minus 1493.52, which is also 91.44 m. The span converts the same way whether you convert the ends and subtract or subtract and then convert, because multiplication by a constant is linear. If those two routes ever disagree, you have made an arithmetic slip, because the mathematics does not permit the disagreement.

## The two values as graded

The panel and the capstone carry more digits than your calculator gave you.

| reading | your hand answer | the graded value | tolerance |
|---|---|---|---|
| start depth converted | 1493.52 m | 1493.52001953125 m | 0.01 |
| stop depth converted | 1584.96 m | 1584.9599609375 m | 0.01 |

Read the two columns against the tolerance before you read anything into the extra digits. The tolerance on each reading is 0.01 m, which is a centimetre. Your hand answer and the graded value agree through the fourth decimal place in both rows, so both hand answers are inside the tolerance with a very large margin, and both pass.

Say that plainly, because it is the point of the table. The hand arithmetic is not an approximation to the graded answer in any sense that matters here. It is a correct answer, and the pipeline's answer differs from it by an amount smaller than the width of a pencil line on a log plot. Nothing you did was wrong.

The extra digits are also not noise or sloppiness. They are exactly reproducible: run the pipeline a thousand times and you get the same trailing digits every time. They come from how the numbers are stored, which is the subject of the next lesson, and the reason that lesson exists is that a data manager who cannot explain those digits will eventually be asked to and will guess.

## Reporting the two values

Three rules, and each one has bitten somebody.

Attach the unit every time. Not 1493.52, but 1493.52 m converted from 4900 ft. The two depths are the same place in the ground and the sentence is only true if both units appear.

Say converted every time. A converted depth is derived, and whoever reads it next needs to know that a factor was applied so they can go and check which one.

Report to the precision your reader needs, but store what the pipeline stored. In a memo, the well runs from about 1493.5 m to about 1585.0 m converted. In the registry, the full stored value stays exactly as it is. Rounding on the way into storage is how a small, harmless difference becomes a permanent one, and rounding on the way into a sentence for a person costs nothing and reads better.

The panel below runs the import pipeline on any of the six teaching files and shows the native and converted depths side by side, along with each curve's unit, kind and converted flag and the uniformity verdict.

{{panel:wd-import-explorer}}

## Exercise

Convert both ends of feet_20.las by hand before you open the panel, then open the panel on that file and compare your two numbers with the two it reports. Write down the difference in each case and compare it against the 0.01 m tolerance. Then answer this in one sentence: why does the pipeline take the start and stop from the first and last converted samples rather than from the STRT and STOP entries in the header.

Self-check: by hand, 4900 x 0.3048 = 1493.52 m converted and 5200 x 0.3048 = 1584.96 m converted. The panel reports 1493.52001953125 m and 1584.9599609375 m. Each pair agrees through the fourth decimal place, so the differences are far inside the 0.01 m tolerance and both hand answers pass. The pipeline reads the ends off the converted column because the header is a claim about the file while the depth column is what the file contains, and a start depth taken from the data is guaranteed to be a depth at which the well has samples.
