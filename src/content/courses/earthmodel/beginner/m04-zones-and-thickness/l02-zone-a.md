# Zone A

Zone A is the rock between TopA and TopB. It is the well behaved half of this model, and it is worth spending a lesson on precisely because nothing goes wrong in it. You cannot recognise the awkward zone in the next lesson unless you know what an ordinary one looks like.

## The statistics

Here is the zone A thickness grid summarised over the model frame.

| quantity | value | population |
|---|---|---|
| mean thickness | 36 m | all 500 nodes of the frame |
| maximum thickness | 42 m | all 500 nodes |
| minimum thickness | 30 m | all 500 nodes |
| nodes with positive thickness | 500 | out of 500 |

Two of those numbers are graded in the capstone. The mean thickness of 36 m is graded to a tolerance of 0.05 m and the maximum of 42 m to the same tolerance. Both are quoted over all 500 nodes of the frame, and the reason that phrase keeps appearing will become the subject of lesson 4.

## Reading the numbers

Start with the last row. Zone A has positive thickness at every one of the 500 nodes, which says the zone is present everywhere on the frame. There is no pinch-out, no zero, no absence. Wherever you drop a well inside this model you will drill some zone A.

That result agrees with something you already know from the previous module. The clamp fixed nothing on TopB, which means TopB arrived below TopA at every node without any repair. The clamp count and the positive node count are two different measurements of the same fact, taken by two different pieces of the workflow, and they agree. Cross-checks like that are how you build confidence in a framework.

Then look at the spread. Thickness runs from 30 m at its thinnest to 42 m at its thickest, and the mean of 36 m sits inside that range without hugging either end. The zone thickens and thins across the map, as any real unit does, and it does so gently. There is no part of zone A that is dramatically unlike the rest of it.

A zone that behaves like this is easy to work with. Its mean thickness is a fair description of the whole zone, a well planned anywhere in the model will find roughly what you predicted, and the mean is stable in the sense that a small change to the model frame or the cell size would move it very little.

Hold on to that sentence, because in the next two lessons every part of it stops being true.

## The engine's full precision values

Ask the engine for the same statistics without rounding and it returns the mean as 36.00000000000001 and the minimum as 29.999999999999545.

Those are 36 m and 30 m. They are not almost 36 m, or 36 m with an unresolved discrepancy, or evidence of a slow drift somewhere in the code. They are the same numbers that double precision arithmetic writes down after a resampling.

The reason is worth understanding once, because these trailing digits appear on every grid you will ever read. Each thickness is the difference of two depths of order 1600 m, and each of those depths came out of a bilinear interpolation that multiplied four neighbouring values by four weights and added them up. A double carries roughly 16 significant digits, so a number near 1600 carries an absolute rounding residue around the thirteenth decimal place. Subtract two such numbers and the residue survives into the difference. Average 500 of those differences and it survives again.

So the discrepancy from a round 36 sits in the fourteenth decimal place. Expressed as a length it is far below the diameter of an atom, and the resampling that produced it has a genuine accuracy of a metre at best. The digits beyond the second decimal place carry no information about rock at all.

## What to do with them

Two rules, and they pull in opposite directions on purpose.

When you report, round to a precision the measurement supports. Zone A has a mean thickness of 36 m. Writing 36.00000000000001 m in a report is not more accurate, it is less honest, because it advertises a precision no seismic interpretation possesses. The capstone tolerance of 0.05 m tells you the same thing about how many digits are meaningful.

When you compare, never edit the stored value. Leave the grid holding what the engine put in it and let the comparison carry a tolerance. Rounding values inside a workflow is how small inconsistencies get baked into a model permanently, and a tolerance based comparison handles the trailing digits without anyone having to touch the data.

The habit to build is that you should be able to look at 36.00000000000001, say the word thirty six out loud, and move on without a second thought. Trailing digits are a property of binary arithmetic. They are never a geological result, and a workflow that stops to worry about them is a workflow that will also stop to worry about a real error too late.

## Exercise

Write a one line report of zone A's thickness for a colleague, using the statistics above. Then answer: if a colleague reports the mean thickness of zone A as 36 m over the nodes where the zone is present, how does that differ from the number in the table?

Self check: a good line reads that zone A has a mean thickness of 36 m over all 500 nodes of the model frame, with a range from 30 m to 42 m, and is present at all 500 nodes. The colleague's number is identical, and it is identical only because the zone is present at every node, so the population where the zone exists and the population of the whole frame are the same 500 nodes. Zone B, in the next lesson, is where those two populations part company.
