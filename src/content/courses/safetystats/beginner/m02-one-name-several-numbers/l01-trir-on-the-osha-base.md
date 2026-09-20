# TRIR on the OSHA base

{{panel:ss-rates-explorer}}

The United States Bureau of Labor Statistics publishes a worked example of a firm's incidence rate: (7 x 200,000) / 400,000 = 3.5. Put the same 7 recordable cases and 400000 hours through the engine on the 200,000 hour base and it returns 3.500000. The published figure, the golden figure and the engine agree, with a relative difference of 0.

| case | count | hours | base | engine rate | published |
| --- | --- | --- | --- | --- | --- |
| ABC Company, recordables | 7 | 400000 | 200000 | 3.500000 | 3.5 |
| UGHELLI, recordables | 9 | 2318640 | 200000 | 0.776317 | none |

That rate has a common name. A total recordable incident rate, TRIR, is the count of recordable cases times a base over the hours worked. On the OSHA base it is the number of recordable cases a hundred full-time workers would have in a year at the observed rate.

## One function, many names

The engine has no function called TRIR. It has `incidenceRate`, which takes a count, hours and a base, and returns count x base / exposureHours. Whether the count is recordables, DART cases or lost time cases is the caller's business. The name a company prints beside the number, TRIR, DART rate, LTIF or LTIR, is something the engine does not check.

The arithmetic is the same for every case class, so there is one function for it. Deciding which injuries count as recordable is a judgement about each case against a set of rules, and it happens before the engine is called. A rate labelled TRIR is only a TRIR if the count behind it really is every recordable case and nothing else.

## Reading the BLS example

The published line is worth reading slowly. The 7 is the count of recordable cases in the year. The 400000 is the hours all employees actually worked. The 200,000 is the base. The answer, 3.5, says that at ABC Company's rate, a hundred full-time workers would have three and a half recordable cases in a working year.

UGHELLI's 0.776317 reads the same way. Its 9 recordable cases came in far more hours than ABC Company worked. Both rates are on the same base, so the comparison is fair as arithmetic. Whether it is fair as safety performance depends on whether the two workplaces classified their recordables the same way, which the rates cannot tell you.

## The label travels with the number

When the engine returns a rate on this base it also returns the label "per 200,000 hours (OSHA/BLS: 100 full-time workers, 40 h x 50 weeks)". Keep that label beside any TRIR you report. A reader who sees 3.5 with no base could take it for a rate on the IOGP base, where it would describe a much safer workplace. The next lessons in this module show how far apart the two readings are.

## Exercise

Multiply 7 by 200,000 and divide by 400000, and confirm you reach the engine's 3.500000. Then open the rates explorer, type UGHELLI's 9 recordables and 2318640 hours on the OSHA base, and check the answer against 0.776317. Finally, put ABC Company's 3 DART cases over the same 400000 hours on the same base, check your answer against the engine's 1.500000, and write one sentence saying why the DART rate must sit below the recordable rate.
