# The loaded flag

`loaded` is one boolean over six stations, and it says the same word for a well loading at the shoe and a well loading at the gauge.

{{panel:pd-profile-explorer}}

## The rule at a station

A station is flagged loaded when its ratio falls below one. It is a strict comparison and it fires on which side of one you are, not on how far. A rate sweep run on published golden conditions of 1000.0 psia and 540.0 degR through 2.441 in tubing, where the Turner critical rate is 1614.343766935 Mscf/d, reads 0.9911148002 at 1600.0 Mscf/d and 0.9997870547 at 1614.0 Mscf/d, both `loaded = true`, then 1.1150041502 at 1800.0 Mscf/d, `loaded = false`.

A well a fraction under the line and a well far under it get the same word.

## The rule for the well

At well level `loaded` is an OR across the stations. On EBOCHA-5 at 3100.0 Mscf/d under Coleman, four stations read false at 1.1605604334, 1.1184659554, 1.0761623743 and 1.0340528848, and two read true at 0.9979085215 and 0.9619521855. The well reports `loaded = true`.

That is the correct answer. Liquid falling back over the bottom of the string is a loaded well, whatever the top reads.

## The same word for very different wells

| Gas rate, Mscf/d | Shallowest loading station | Loaded | Margin, percent |
| --- | --- | --- | --- |
| 2400.0 | 0.0 ft | true | -25.526282 |
| 2700.0 | 1500.0 ft | true | -16.217068 |
| 3000.0 | 6000.0 ft | true | -6.907853 |
| 3100.0 | 6000.0 ft | true | -3.804781 |
| 3200.0 | 7500.0 ft | true | -0.701710 |
| 3450.0 | none | false | 7.055969 |
| 3700.0 | none | false | 14.813648 |
| 4000.0 | none | false | 24.122863 |

At 2400.0 Mscf/d the well is loading from the gauge down. At 3200.0 Mscf/d it is loading at 7500.0 ft alone, at a margin of -0.701710 percent. The flag is `true` for both.

## The mistake

Reporting the flag and stopping. It answers whether any station crossed, and then carries no further information at all. The three numbers that do are the margin, the controlling depth and the shallowest loading station, and all three come back in the same object.

The inverse mistake costs more. A `false` flag does not mean no liquid. The droplet balance models one droplet at its terminal velocity and knows nothing about film flowing on the tubing wall, which is the other way a gas well carries liquid.

## What it refuses

The flag refuses to grade. It will not say a well is mildly loaded, it will not weight a crossing by how much of the string sits below it, and it will not distinguish a station at 0.9979085215 from one at 0.744737.

## Exercise

Read the flag on EBOCHA-5 at 2400.0 and at 3200.0 Mscf/d and confirm both come back `true`.

Then write the two shallowest loading stations and say what a report carrying only the flag would have hidden.
