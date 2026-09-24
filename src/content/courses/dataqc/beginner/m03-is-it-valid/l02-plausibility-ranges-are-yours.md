# Plausibility ranges are yours to supply

{{panel:dq-checks-explorer}}

A petrophysicist looking at a density log in a sand-shale sequence has a range in mind: values well below it or well above it would make them stop and look. That range is real knowledge, and it is also local knowledge. It depends on the basin, the lithologies, the tool and sometimes the logging company. The engine carries no such range for any basin or tool. When you want one checked, you pass it yourself as a minimum and a maximum, and the range check applies it the same way it applies a definitional limit.

| channel | caller minimum, stated | caller maximum, stated | checked | failed | the basis source |
| --- | --- | --- | --- | --- | --- |
| GR, sentinel converted | 0 | 150 | 236 | 0 | limits supplied by the caller |
| RHOB | 1.950000 | 2.950000 | 228 | 0 | limits supplied by the caller |

## Reading the table

Both ranges are stated inputs, chosen for this demonstration. The gamma ray, with its four sentinels converted to null, has 236 present values and none falls outside 0 to 150. The density has 228 present values and none falls outside 1.950000 to 2.950000. The basis block says where the limits came from, in the engine's words: "limits supplied by the caller". That sentence travels with the result, so anyone reading it later knows the range was a person's choice and can ask what it was based on.

## Why the engine carries none

It would be easy to ship a table of typical ranges and apply it by default. The engine does not, for a simple reason: a check should only claim what it can defend everywhere. A density range that suits one field would flag honest data in another with different mineralogy, and a gamma ray ceiling that suits one tool would flag a hot shale logged by another. A default range would produce flags that look like engine findings and are really someone's assumption about a place they never saw. Leaving the range to the caller puts the assumption where it belongs, with the person who knows the well.

## Two words to keep apart

This lesson uses "plausibility range" for a caller's minimum and maximum. The Professional tier owns a dimension called plausibility, which asks which values stand apart from the rest by a statistical measure. A caller range is a validity check with limits you chose; it asks whether each value sits inside a band you stated in advance. The two answer different questions, and this tier uses only the first.

## What 0 failures means here

Zero failures against a caller range says that every present value sits inside the band you chose. It is only as strong as the band. A band chosen wide passes almost anything; a band chosen tight flags honest variation. Neither result tells you the band was well chosen. When you report a caller range check, report the band beside the count so a reader can judge both.

## Exercise

Open the checks explorer on the view for range limits and rate rules. The values box holds a stretch of EKENE-7's neutron, and the channel is set to fraction in v/v. Read the Failed tile and the box headed WHERE THE LIMITS CAME FROM. Now set the channel to the caller limits option, type 0 as the caller minimum and 1 as the caller maximum, and read both again. Explain why the flags match while the basis box does not, and which of the two basis sentences you would want in a report.
