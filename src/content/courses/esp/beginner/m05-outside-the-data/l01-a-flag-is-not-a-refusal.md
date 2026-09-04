# A flag is not a refusal

The engine tells you the duty is outside the published data and then hands you the number anyway. Both halves of that sentence matter.

{{panel:pd-stage-explorer}}

## The golden case carries the evidence itself

The published golden set includes a row at 40 Hz and 3200 bbl/d. That maps back to 4800.0000 bbl/d on the 60 Hz curve, which is 1300.0000 bbl/d past the published range high of 3500 bbl/d.

| Field | Value |
| --- | --- |
| head per stage | 0.052063492056 ft |
| brake power per stage | 0.004290703685 hp |
| efficiency | 0.257645714294 fraction |
| region | upthrust |
| inside the published range | false |

The engine returned a number, not a refusal. The head is 0.00234792 of the head the same curve gives at that rate at 60 Hz, printed to twelve figures like every other reading in the set.

## What a refusal actually looks like

Handed two points instead of three, the curve fit returns ok false, the message that a stage curve needs at least three points from the vendor curve, and no head fit at all. Asked for a reading at a drive frequency of zero, it returns a head of NaN and a region of invalid. Those stop you.

Inside the published range false does none of that. It is one boolean beside four fully formed numbers of the same type, precision and shape as the numbers at a duty in the middle of the data.

## The only thing that changes at the edge

Reading the published curve at 60 Hz on a 0.90 gravity fluid: 20.09714286 ft at 3400 bbl/d, 18.98571429 ft at 3500 bbl/d, 17.82571429 ft at 3600 bbl/d. Inside the published range is true, true, then false. The head steps are of the same size on either side of the boundary. The boolean is the only field that knows a boundary was crossed.

## The mistake

Reading the flag as permission. A careful person sees inside the published range false, notes it, and keeps the number because it is the only one available and it looks reasonable. At 3600 bbl/d it is reasonable. At 4800 bbl/d the flag reads the same and the head is 0.052063492056 ft. The boolean carries no distance, and the distance is what matters: 100 bbl/d past the data at one, 1300.0000 bbl/d at the other.

## What it refuses

It refuses to bound the fit. A polynomial has an opinion at every rate, and the engine's contract is to report where the opinion came from, not to withhold it. What to do with a reading flagged outside the data is left to the reader, and no threshold anywhere in the package takes that decision back.

## Exercise

Read the stage at 40 Hz and 3200 bbl/d and write its head, efficiency, brake power, region and range flag.

Then write the distance in bbl/d between its equivalent rate on the 60 Hz curve and the published range high, and say why that number is not one of the five the engine returned.
