# The BLS worked example

{{panel:ss-rates-explorer}}

The United States Bureau of Labor Statistics shows how to compute a firm's incidence rate with one line of arithmetic: (7 x 200,000) / 400,000 = 3.5. The engine, given 7 recordable cases, 400000 hours and the 200,000 hour base, returns 3.500000. The golden case agrees, and the relative difference is 0. The same page's DART example, 3 cases in the same hours, reads 1.500000 through the engine against a published 1.5.

| case | count | hours | base | engine rate | golden rate | published | relative difference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ABC Company, recordables | 7 | 400000 | 200000 | 3.500000 | 3.500000 | 3.5 | 0 |
| ABC Company, DART | 3 | 400000 | 200000 | 1.500000 | 1.500000 | 1.5 | 0 |

## Why start the report here

This module puts the whole tier together into one report, and the first step of any report is to show that the tool producing it gets a published answer right. The BLS example is ideal for that. It is public, it states its inputs in full, and its arithmetic is short enough to check by hand. If the engine could not reproduce 3.5 from 7 cases in 400000 hours, nothing else it printed would be worth reading.

Reproducing it also shows the whole chain at once. The count is recordable cases, classified before the engine sees them. The hours are all hours actually worked by all employees. The base is named: 200,000, the OSHA and BLS base of 100 full-time workers at 40 hours a week for 50 weeks. The answer comes back with its basis block, and the formula in that block, count x base / exposureHours, is the one on the BLS page.

## Reading the result as a report line

A report line built from this example says what the number is, what it was built from, and on what base. Something like: "ABC Company recorded 7 recordable cases in 400000 hours, a total recordable incident rate of 3.500000 per 200,000 hours, and 3 DART cases, a DART rate of 1.500000 on the same base." Every figure in that sentence can be checked by a reader with a calculator, and every one names its base or its count.

What that line does not yet say is how sure anyone can be that ABC Company's true rate is near 3.5, given that it rests on 7 cases. That question belongs to the next tier. An Associate report states the rate correctly and completely, and leaves room for a Professional to add how sure it is.

## The printed precision

The engine prints 3.500000 and the BLS prints 3.5. They are the same number at different precisions. This course quotes engine figures to six decimals throughout, so that a learner comparing their own arithmetic with the engine can see agreement to the last digit, and so a figure copied from a lesson is never a rounded version of what the engine printed.

## Exercise

Multiply 7 by 200,000, divide by 400000, and confirm the 3.500000. Then open the rates explorer, type 3 cases and 400000 hours on the OSHA base, and confirm the engine returns 1.500000. Finally, write the report line for ABC Company in your own words, naming the count, the hours, the base and both rates, and check every figure in it against the table.
