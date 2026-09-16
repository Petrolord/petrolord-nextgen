# The driving group changes shape

On a flat line the driving group is the inlet squared less the outlet squared. Put the line on a hill and the outlet's square is scaled by e to the s before it is subtracted.

{{panel:fc-gasline-explorer}}

## One multiplier, in one place

The group a flat gas form reads is the inlet squared less the outlet squared. With elevation it becomes the inlet squared less e to the s times the outlet squared. The inlet is untouched. The whole of the hill, as far as the group is concerned, is a single multiplier sitting on the outlet.

| elevation change ft | e to the s | what it does to the outlet's square |
| --- | --- | --- |
| 0.000000 | 1.0000000000 | leaves it exactly as it is |
| 1500.000000 | 1.0828513009 | counts it for more |
| -1500.000000 | 0.9234878318 | counts it for less |
| -3000.000000 | 0.8528297754 | counts it for less again |

## Which way the rate moves, and why

Climbing, e to the s stands above one, so the outlet's square is counted for more than it is, the group is smaller, and the line carries less. Descending, e to the s falls below one, the outlet counts for less, the group is larger, and the line carries more. The trunk bears that out: 1500.000000 ft of rise takes Weymouth to 0.932862 of its flat rate, and the same distance of fall takes it to 1.063402.

A descending line is genuinely easier to push gas down. The column of gas in it is helping, and in the group that help appears as an outlet pressure that costs less than it looks.

## Only the outlet is scaled

This is the detail worth holding onto. It is tempting to think of a hill as something applied to a line, and therefore to both of its ends. In this group it is applied to one end. A reader who scales both pressures gets a group that is simply e to the s times the flat group, which moves every answer in the wrong proportion and still looks plausible, because it is still zero when the pressures meet.

There is a second reason that particular error survives testing. Scaling both ends leaves the group proportional to the flat one, so every rate is wrong by the same factor on a given hill, and a sweep across bores or across rates stays entirely self-consistent. Nothing inside a single case contradicts anything else in it.

## Where the ceiling comes from

The group also tells you where the arithmetic runs out. It vanishes when the inlet squared equals e to the s times the outlet squared, which is a specific outlet pressure and the end of the range any solve can search. The whole of the next module is built on that pressure.

## The mistake

The mistake is applying e to the s to the inlet, or to both pressures, or outside the group altogether as a pressure to add afterwards. None of those is the same calculation, and the first and third are both zero on a flat line, so a flat test case will not catch either.

## Exercise

Write the driving group for a flat line and for a line with elevation, and say which pressure carries the multiplier. Give e to the s at a rise of 1500.000000 ft and at a fall of the same distance, and state which way each moves the rate. Then say what the group vanishing means.
