# Gallons a minute out of pounds a day

Two numbers have to become a pump size. The water removed is in lb a day and the circulation ratio is in gal per lb, and a pump is specified in gpm. Getting from the first pair to the third is one multiplication and one division, and both are worth naming because the units change under you.

{{panel:fc-water-explorer}}

## The chain, in order

A load a day becomes gallons a day, and gallons a day become gallons a minute. OBIAFU removes 2879.9235 lb of water a day. At 3.200000 gal of glycol per lb of water that is 9215.7553 gallons a day. There are 1440.000000000 minutes in a day, so the circulation is 6.399830 gpm.

That is the entire calculation. A load a day, a ratio, and the minutes in a day, in that order.

## Where the minutes come from

The minutes in a day look like the least interesting number in this course and they are worth one paragraph. This module never uses the hours or the minutes separately, so there is nothing inside it to check them against individually. What can be done instead is to ask the engine for a gallons a day and a gallons a minute from the same call and divide one by the other. The answer that comes back is 1440.000000000.

That is a measurement rather than a reading. It proves that whatever the engine is dividing by, it divides by that, which is a stronger statement than finding the digits somewhere in the source.

## What a gpm figure is for

The circulation in gpm is what sizes the pump, the piping, the glycol and gas exchanger and the flash vessel. It is also the number that appears in an operator's daily life, because a circulation rate is something a plant can see on a flow meter and adjust with a valve.

| rate, MMscfd | circulation, gpm |
| --- | --- |
| 10.000000 | 1.032231 |
| 30.000000 | 3.096692 |
| 62.000000 | 6.399830 |
| 120.000000 | 12.386768 |
| 250.000000 | 25.805766 |

Record those figures and notice what the column is doing. The circulation is the load a day with the ratio and the minutes applied to it, so it carries the rate and it carries the design choice at the same time. A plant that changes its circulation on the flow meter is moving the second of those without touching the first, and the duty follows it. That is the lever an operator actually has.

## The step most often skipped

Going straight from a load a day to a gpm with a single factor. It works, and it hides the ratio inside the factor, and the ratio is the one design choice in the chain. Once it is hidden it stops being reviewed. Keeping the gallons a day visible in the middle of the calculation keeps the choice visible with it.

## Exercise

Take 2879.9235 lb a day and the ratio of 3.200000 gal per lb, and write the gallons a day and the gpm. Then say how the minutes in a day were established for this module, and why that is different from reading them out of the source.
