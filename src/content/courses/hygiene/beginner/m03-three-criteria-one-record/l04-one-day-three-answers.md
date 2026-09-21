# One day and three answers

{{panel:hy-noise-dosimeter}}

One record, one instrument and one shift give three noise doses: 27.748183 percent on the OSHA PEL, 72.054478 percent on the OSHA action level and 265.610944 percent on the NIOSH noise REL. The OBEN day is under the first, over the second and over the third. None of the three is the real noise dose. Each is the noise dose against its own criterion, and a report that quotes a noise dose without naming the criterion has not said anything.

## The three readings side by side

| criterion | criterion level, dBA | decibel exchange rate, dB | threshold, dBA | limit noise dose, percent | noise dose, percent | TWA, dBA | exceeds its limit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OSHA PEL | 90.000000 | 5.000000 | 90.000000 | 100.000000 | 27.748183 | 80.752126 | false |
| OSHA action level | 90.000000 | 5.000000 | 80.000000 | 50.000000 | 72.054478 | 87.635749 | true |
| NIOSH noise REL | 85.000000 | 3.000000 | 80.000000 | 100.000000 | 265.610944 | 89.242460 | true |

Read the table from left to right and each answer is explained by the columns before it. The PEL and the action level share a criterion level and a decibel exchange rate, and they part company on the threshold and the limit. The NIOSH noise REL differs from both in every one of its first three columns.

## Where the differences come from

Three things move a noise dose between criteria, and on the OBEN day all three are at work.

The threshold decides which periods count. The PEL integrates 2 of the 6 periods; the action level and the NIOSH noise REL integrate 5. That alone takes the OSHA figure from 27.748183 to 72.054478 percent without changing a single contribution.

The criterion level decides where the eight-hour allowance sits. NIOSH puts it at 85.000000 dBA, so every period is five decibels closer to using a full allowance than it is on OSHA.

The decibel exchange rate decides how fast the allowance shrinks with level. At 3 dB, the loud short periods cost far more. The fifth period carries 8.827030 percent on OSHA and 64.980192 percent on NIOSH.

## The TWAs tell the same story

The three TWAs are 80.752126, 87.635749 and 89.242460 dBA. They are closer together than the noise doses, because the logarithm compresses the percentages, and it is tempting to read them as three estimates of one sound level. They are not estimates of anything shared. Each is its own noise dose restated against its own criterion level with its own coefficient. A TWA quoted without its criterion is as empty as a bare noise dose.

## What to write

Name the criterion every time. "A noise dose of 72.054478 percent on the OSHA action level, TWA 87.635749 dBA" is a statement a reader can check. A percentage with the criterion left off is not, because the same record supports three different numbers and the reader cannot tell which one you meant. When a site works to more than one criterion, report all of them from the one record, as the engine does, so that no single figure is mistaken for the answer.

## Exercise

Take the OBEN PEL noise dose of 27.748183 percent and the action level noise dose of 72.054478 percent. Subtract the first from the second and compare the difference with the three action level contributions the PEL leaves out: 14.747186, 23.100555 and 6.458554 percent. Say which of the three differences between the criteria your arithmetic has isolated, and which two it has not touched.
