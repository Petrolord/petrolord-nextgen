# Where loading starts

Loading does not start at a depth. It starts between two stations, and the profile can only name the pair.

{{panel:pd-profile-explorer}}

## The bracket, not the depth

On EBOCHA-5 at 3100.0 Mscf/d under Coleman, the deepest healthy station is 4500.0 ft at a ratio of 1.0340528848 and the shallowest loading station is 6000.0 ft at 0.9979085215. The crossing sits between those two, which puts it inside the deepest 40.0000 percent of the string and outside the deepest 20.0000 percent.

That is the honest statement. Anything narrower is an interpolation nobody computed.

## The shallowest loading station is a label

0.9979085215 is a hair under one. A station that missed by that much and a station at 0.9619521855 both report `loaded = true`, and both are reported at their own depth. What moves with the well is which station is the first to fail, and the profile can only offer the six it was given.

## The crossing walks up the hole as the well declines

The same well, the same six stations, at a contiguous set of gas rates.

| Gas rate, Mscf/d | Margin, percent | Shallowest loading station |
| --- | --- | --- |
| 2400.0 | -25.526282 | 0.0 ft |
| 2700.0 | -16.217068 | 1500.0 ft |
| 3000.0 | -6.907853 | 6000.0 ft |
| 3100.0 | -3.804781 | 6000.0 ft |
| 3200.0 | -0.701710 | 7500.0 ft |
| 3450.0 | 7.055969 | none |
| 3700.0 | 14.813648 | none |
| 4000.0 | 24.122863 | none |

At 4000.0 Mscf/d the ratios run 1.497497, 1.443182, 1.388597, 1.334262, 1.287624 and 1.241229, and nothing crosses. At 2400.0 Mscf/d they run 0.898498, 0.865909, 0.833158, 0.800557, 0.772574 and 0.744737, and everything does, including the gauge.

## The mistake

Reading that column as a smooth migration. Between 2700.0 and 3000.0 Mscf/d the shallowest loading station jumps from 1500.0 ft to 6000.0 ft, skipping 3000.0 ft and 4500.0 ft entirely. Nothing physical jumped. A 300.0 Mscf/d step moved the crossing past three stations at once, and the profile reports in station-sized steps because stations are all it has.

The other half of the mistake is reading the column upward. A well that reads loaded only at 7500.0 ft, at a margin of -0.701710 percent, is closer to a well that loads everywhere than the single flagged station suggests, because one step down from 3450.0 Mscf/d to 3200.0 Mscf/d put it there.

## What it refuses

The profile refuses to interpolate between stations, refuses to compute the pressures that would let it, and refuses to say how much liquid is falling back. It reports where a ratio computed at a supplied station crosses one, and the depth resolution of that answer is the spacing of the survey.

## Exercise

Run the panel at 2700.0 and at 3000.0 Mscf/d and write the shallowest loading station for each.

Then say which two stations the crossing must have passed between those runs and why the profile never named them.
