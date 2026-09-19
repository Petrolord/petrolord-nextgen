# A count over an exposure

{{panel:ss-rates-explorer}}

One site, one year: 9 recordable cases in 2318640 hours worked. The engine turns that pair into 0.776317 recordable cases per 200,000 hours. Every rate in this course is built the same way, and the formula the engine prints beside the answer says it plainly: count x base / exposureHours.

Three things go into that line. The count is a number of events somebody has already classified: recordable, DART or lost time. The exposure is the hours people actually worked. The base is the number of hours the answer is expressed per, so that workforces of very different size can be set side by side.

## The UGHELLI stream

The course keeps coming back to one teaching stream, the UGHELLI site. Its year is stated in full, and every figure below is the engine's own answer or the stated input.

| what UGHELLI states | value |
| --- | --- |
| hours worked | 2318640 |
| recordable cases | 9 |
| DART cases | 4 |
| lost time cases | 2 |
| fatalities | 0 |
| days lost | 96 |
| Tier 1 process safety events | 1 |
| Tier 2 process safety events | 4 |

Put the recordables through the formula on the OSHA base and the result is 0.776317. Put the DART cases through the same formula on the same base and the engine returns 0.345030. The lost time cases give 0.172515. Nothing about the arithmetic changes from one line to the next; only the count that goes in changes, and the name printed beside the answer follows the count.

## What the engine hands back

Every function in this engine returns one of two shapes. A good call returns a result object that carries the rate and a `basis` block, and the basis block is the part of the answer that says what the number means: which base, what that base is called, and the formula used. A bad call returns an object with an `error` and a `field`, where the field names the input the engine could not accept. There is no third shape. A rate never comes back without its basis, and a refusal never comes back as a number.

When you read a safety statistic in a report, you are often reading only the first half of that answer. The rest of this tier is about the second half.

## What the engine does not do

The engine does not decide whether an injury was recordable. It does not decide whether a process safety event was Tier 1 or Tier 2. It carries no benchmark rates of its own. The count arrives already classified, and the engine only checks that it is a whole number, zero or more. A rate is exactly as good as the counting behind it, and nothing in the arithmetic can repair a count that was classified wrongly.

## Exercise

Take the UGHELLI inputs from the table. Multiply the 9 recordables by 200,000 and divide by the 2318640 hours, and check that you reach 0.776317. Then do the same for the 4 DART cases and the 2 lost time cases, and compare your answers with 0.345030 and 0.172515. Finally, open the rates explorer, type the same count and hours, and confirm the basis block prints the formula you just used.
