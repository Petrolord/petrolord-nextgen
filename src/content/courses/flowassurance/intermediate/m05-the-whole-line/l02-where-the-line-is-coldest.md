# Where the line is coldest

The coldest point is the far end and only the far end. That is a property of a single decaying exponential, not a fact about pipelines, and it stops holding the moment anything else is added to the balance.

{{panel:pd-line-explorer}}

## One term, one direction

The published profile at 105600.0 ft returns `ok = true`, 21 stations at a spacing of 5280.0000 ft, ntu 3.730388159740 and an arrival of 43.357693442744 degF. It starts at 180.0000000000 degF and every station falls: 95.0942515249 degF at 26400.00 ft, 61.6812610792 degF at 52800.00 ft, 43.3576934427 degF at 105600.00 ft. There is no second term to make it turn.

## Equal lengths, unequal duty

The first station interval costs 23.8220561287 degF. The last, the same 5280.0000 ft of the same pipe at the same U against the same ambient, costs 0.6884883567 degF. The ratio of those two drops is 34.60052142, and it is not exp(ntu). On this line exp(ntu) is 41.69528946, and that is the factor the whole-line excess falls by, inlet to arrival. The two intervals are equal in length, so each drop carries the same one minus exp of minus dx over Lc, and what is left is the ratio of the two starting excesses, which is exp of ntu times nineteen twentieths: 34.60052142. Reaching for 41.69528946 gets a plausible number, off by the one station interval between the start of the last interval and the end of the line.

## The line that is coldest at its inlet

`steadyStateProfile` given an inlet 20.0 degF below the 40.0 degF ambient returns `ok = true` and an arrival of 39.5203295082 degF. A line colder than its surroundings warms towards them on the same exponential, and the engine needs no special case for it. On that line the coldest point is the inlet. Coldest at the far end is a statement about warm lines.

## Where the far end stops being the coldest point

No published case sets a pressure, so the Joule-Thomson term is exactly zero in every one of them. Add it and the profile is no longer one term. The model also takes one ambient for the whole length, which was never true of a line whose seabed changes depth.

On TEACHING LINE AKASO SPUR with heat loss only, the station at which the line first falls below its 71.00 degF flowing boundary is none of the 21, the coldest point being the arrival at 89.31602995 degF. That verdict is safe because the profile is monotone, and it is worth knowing that is why.

## What it refuses

The return has no minimum field and no coldest-station field. It hands back stations and an arrival, and finding the coldest of them is the reader's work. Nobody notices, because with one ambient and no pressure term the answer is always the last station.

## Exercise

Take the published 105600.0 ft profile and write down the drop across its first interval and across its last.

Then say what would have to be added to the balance before the arrival stopped being the coldest station.
