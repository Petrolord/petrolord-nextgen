# A warning that printed its own threshold

A flag that only fires below 85 printed "85 percent", and a reader who trusts arithmetic reads that as a false alarm and closes the record.

{{panel:pd-power-explorer}}

## The shape of the defect

All three ratio messages formatted their ratio with no decimal places. Each flag fires on a strict inequality and then prints the ratio it fired on, so the first tenth of a percent inside every band rendered as the threshold itself. The flag was right, the ratio was right, and the sentence a human read contradicted itself.

## The head band, both printings

`underCurve` fires below 0.85, so the collision runs across the interval from 0.845 up to but not including 0.85.

| Head ratio | Flag | Prints now | Printed before |
| --- | --- | --- | --- |
| 0.8450 | true | 84.5 percent | 85 percent |
| 0.8461 | true | 84.6 percent | 85 percent |
| 0.8470 | true | 84.7 percent | 85 percent |
| 0.8480 | true | 84.8 percent | 85 percent |
| 0.8490 | true | 84.9 percent | 85 percent |
| 0.8499 | true | 85.0 percent | 85 percent |

The message at 0.8480 now reads that the stack is making 84.8 percent of the head its curve says it should. It used to read "85 percent", under a flag that cannot fire at 85 percent.

## The other two bands

`ampsHigh` fires above 1.05, and its collision runs through 1.055. At 1.0505 the current is 63.0300 A and the message now says 105.0 percent where it once said 105 percent. At 1.0510, 63.0600 A, it says 105.1 against a previous 105. At 1.0550, 63.3000 A, the old format finally left the threshold, and it left upward: it printed 106 percent where the ratio is 105.5.

`ampsLow` fires below 0.40 over the interval from 0.395. At 0.3950 the current is 23.7000 A and the message now says 39.5 percent against a previous 40 percent. At 0.3990, 23.9400 A, it says 39.9 against 40. At 0.3900, 23.4000 A, the old print was 39 percent and had never been wrong. The defect lives only in the band beside each threshold.

## What one decimal does not fix

At 0.8495 and 0.8499 the new format still prints 85.0 percent, at 1.0505 it still prints 105.0, and at 0.3999 it still prints 40.0 percent. The collision is narrower, not gone: the band that can still print the threshold is half the width it was. Any fixed precision has a last digit, so a printed ratio beside a strict threshold always keeps a band where the two agree.

## The gate that holds it

A new gate pins all three boundary bands and asserts that the printed number is not the threshold. Reverting each format in turn turns exactly that band red and leaves the other two green, which is how a test on a message is shown to be testing something.

## Exercise

Set the head ratio to 0.8461 and to 0.8499 in the panel and write both messages out in full.

Then say which reading a shift engineer would dismiss under the old format, and name what changed about the well between the two formats.
