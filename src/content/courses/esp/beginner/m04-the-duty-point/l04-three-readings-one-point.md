# Three readings, one point

One call at one duty returns five fields: head, efficiency, brake power, a region word and a boolean. They are not five independent facts.

{{panel:pd-stage-explorer}}

## What one duty returns

At 60 Hz on a 0.90 specific gravity fluid, three duties inside the published data:

| Rate, bbl/d | Head, ft | Efficiency | hp | Region | In range |
| --- | --- | --- | --- | --- | --- |
| 1500 | 31.985714 | 0.54942857 | 0.57943436 | downthrust | true |
| 2500 | 27.914286 | 0.73657143 | 0.62866580 | recommended | true |
| 3500 | 18.985714 | 0.64942857 | 0.67894058 | upthrust | true |

## Two of the three are independent and the third is not

Head comes off the head cubic. Efficiency comes off the efficiency cubic, fitted separately from the same five points. Brake power comes off neither: it is assembled from head, efficiency, rate and the pumped gravity. An error in a head point moves head and power together, an error in an efficiency point moves efficiency and power together, and nothing moves power alone. It carries every error the other two carry.

## Region is not a range check

The region word grades the duty against the best efficiency point: recommended unless the reference rate falls below 0.75 of the best efficiency rate, which reads as downthrust, or rises above 1.25 of it, which reads as upthrust. Inside or outside the published data is a different question with a different answer.

The two can disagree in both directions. At 3500 bbl/d and 60 Hz the region is upthrust and inside the published range is true. At 4800 bbl/d the region is still upthrust and inside the published range is false. The same word attaches to a reading you can use and to one you cannot.

## The mistake

Filtering a batch of duties on the region word and believing what survives. A run at 40 Hz and 2500 bbl/d returns 7.1087301587 ft, 0.5941607143 fraction and 0.1984706437 hp with a region of upthrust and inside the published range false, and it looks like the 3500 bbl/d row that is legitimately inside the data. Region says where the duty sits against the pump's sweet spot, not whether the numbers came from data or from arithmetic.

## What it refuses

The call refuses to grade itself. Every one of the five fields is returned with the same confidence at every input, and there is no field that says the reading should not be used. At a drive frequency of zero the head is NaN, the region is invalid and inside the published range is false, which is the only shape of answer in the set that stops the reader.

## Exercise

Read the stage at 1500, 2500 and 3500 bbl/d at 60 Hz and record all five fields at each.

Then read 2500 bbl/d at 40 Hz and say which of the five fields is the only one that separates it from the 3500 bbl/d row.
