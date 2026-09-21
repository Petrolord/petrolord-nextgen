# The sixty-minute rule and its refusals

{{panel:hy-heat-stress}}

A 45 minute WBGT record is refused on `wbgtPeriods`. A 75 minute metabolic record is refused on `metabolicPeriods`. The golden's own refusals are a 50 minute WBGT record and a 30 minute metabolic record. The NIOSH assessment accepts both sets of periods only when each totals 60 minutes, and that is judgement J9.

## The rule

NIOSH states its heat stress limits against one-hour time weighted averages, of the WBGT and of the metabolic rate. The door `nioshHeatAssessment` enforces the hour on both inputs separately. A WBGT hour and a metabolic hour must each total 60 minutes, and the worker's acclimatisation must be a boolean. The engine names the failing field every time.

| record | minutes | refused field |
| --- | --- | --- |
| WBGT periods | 45 | `wbgtPeriods` |
| WBGT periods, golden | 50 | `wbgtPeriods` |
| metabolic periods | 75 | `metabolicPeriods` |
| metabolic periods, golden | 30 | `metabolicPeriods` |
| acclimatized given as a word | not applicable | `acclimatized` |

## The engine's words

The 45 minute WBGT record:

> wbgtPeriods total 45 min: the NIOSH limits apply to a 1-hour TWA

The 75 minute metabolic record:

> metabolicPeriods total 75 min: the NIOSH limits apply to a 1-hour TWA

A word where a boolean belongs:

> acclimatized must be true (REL) or false (RAL)

## Why refuse a long record

A record of 75 minutes looks like more information, and it is tempting to average it and carry on. The engine refuses it because NIOSH states its limits against a one-hour time weighted average, so a figure over any other window is not the quantity those limits apply to, and the refusal above says exactly that. Where the extra quarter is cooler than the hour inside it, the longer average will also read below that hour. Which sixty minutes to assess is the hygienist's choice, and it belongs in the report.

A short record has the opposite problem. Forty-five minutes of readings says nothing about the other fifteen. The digest prints the two behaviours and no reason for the difference: the chemical STEL counts the remainder of a short window as zero and warns, while the NIOSH assessment refuses. As a matter of practice, zero is a real reading of clean air for a chemical exposure and a WBGT of zero degrees is no reading at all. Take that as the instructor's reading of the difference, with no printed line behind it.

## The averaging doors are looser

The rule belongs to the assessment door alone. `wbgtTwaC` and `metabolicRateTwaW` average any window they are given and refuse only a window of zero time. So a learner can always compute the one-hour averages 29.066667 C and 300.000000 W for the teaching hour on their own doors, and the averages carry no transcription-only constant. The assessment layered on top is the NIOSH 2016-106 section 8.1 equation, checked for transcription only.

## Three questions before an assessment

Does each record total 60 minutes? Is acclimatisation known for this worker, and typed as true or false? Is the time weighted metabolic rate inside the figure range? The first two are refusals and the third is a warning, and a report that passes all three still carries the transcription-only status beside every limit.

## Exercise

Take the four refused records in the table and, for each, say whether it is too long or too short and what you would change to make it an hour. Then say why the averaging doors accept a 45 minute window when the assessment door refuses one.
