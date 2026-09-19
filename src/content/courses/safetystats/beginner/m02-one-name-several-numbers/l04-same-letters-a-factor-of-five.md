# Same letters, a factor of five

{{panel:ss-rates-explorer}}

One site, one year, 9 recordable cases in 2318640 hours. On the OSHA base its TRIR is 0.776317. On the IOGP base its TRIR is 3.881586. Both are correct, both are called TRIR, and they differ by exactly 5.000000. OSHA TRIR and IOGP TRIR share three letters and differ by a factor of five, and that is why the engine will not pick a base for you.

| the same site, labelled TRIR | base | value |
| --- | --- | --- |
| OSHA TRIR | 200000 | 0.776317 |
| IOGP TRIR | 1000000 | 3.881586 |
| the same count on the FAR base | 100000000 | 388.158576 |

The third row shows the arithmetic taken further. The same 9 events on the 100,000,000 hour base read 388.158576, which is 500.000000 times the OSHA figure. Nobody reports a recordable rate on that base, but the engine will compute it if asked, and the number shows how completely the base controls the size of the answer.

## How the mistake happens

A contractor reports its TRIR on the OSHA base to a client that benchmarks on the IOGP base. The client's spreadsheet has a column headed TRIR. The contractor's 0.776317 goes into it next to other contractors' figures per million hours, and the contractor looks five times safer than it is. Run the same error in the other direction and a good contractor looks five times worse, and loses the work.

Nothing in either number warns the reader. Both are plausible and both carry the right three letters. The base is what distinguishes them, and it is the first thing to fall off when a figure is copied between documents.

## Why the engine refuses

This is the reason the engine takes no default base. A default would pick one of the two readings silently. Half the callers would get the right one and half would not, and nobody would see a warning. Instead the engine refuses a call with no base:

> base is required: name the base (200,000 for OSHA/BLS, 1,000,000 for IOGP, 100,000,000 for FAR); there is no default

The refusal forces the choice into the open, and the result then carries its base in `basis.base` and its label in `basis.baseLabel`.

## The definition matters too

The factor of five is the whole story only when the two counts are the same. They may not be. IOGP's TRIR counts fatalities, lost workday cases, restricted workday cases and medical treatment cases per million hours. A company TRIR on the OSHA base may count differently. UGHELLI has 0 fatalities, so that difference cannot change its count of 9, and if its other classes were counted alike, multiplying the OSHA figure by 5 converts it cleanly to the IOGP base. At a site with a fatality that its own count leaves out, the conversion is a base change and a count change, and multiplying by 5 alone would give the wrong answer.

Before comparing any two TRIRs, check two things: the same base, and the same definition of the count. Only then does the comparison mean anything.

## Exercise

Take the OSHA TRIR of 0.776317 and the IOGP TRIR of 3.881586. Divide the second by the first and confirm the 5.000000 in the lesson. Then multiply the OSHA figure by 500 and compare with 388.158576. Finally, write the two sentences you would send to a client who has placed UGHELLI's OSHA figure in a column of IOGP figures: one naming the error, one giving the corrected figure with its base.
