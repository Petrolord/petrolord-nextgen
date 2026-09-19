# The capstone brief

{{panel:hy-noise-dosimeter}}
{{panel:hy-protection-chemicals}}
{{panel:hy-heat-stress}}

The Expert capstone grades 6 fields, and every one is a number. Two are heat stress averages, two are noise exposure quantities over a shift that is not eight hours, and two are chemical quantities on adjusted limits. None passes through the NIOSH RAL or the NIOSH heat REL, a WBGT built from thermometer readings, a margin or a verdict word.

## The six fields, by kind

The two heat stress fields are one-hour time weighted averages of readings the scenario states: the WBGT an instrument read out, and the metabolic rates. Both are ARITHMETIC BY DEFINITION, the kind module one worked by hand, and the doors are `wbgtTwaC` and `metabolicRateTwaW`.

The two noise exposure fields are the OSHA extended-shift action level for the stated shift, from `oshaActionLevelForShiftDbA`, and the action-level noise dose over the whole shift, from `noiseDose` on the action-level criterion. The action level rests on 16.61, the coefficient the mandatory Appendix A text writes. The noise dose rests on the reference durations of Table G-16a, and it is the sum over every period, never rescaled to eight hours.

The two chemical fields are a limit adjusted by Brief and Scala for the stated schedule, from `briefScalaAdjustedLimit`, and a mixture index on adjusted limits, from `mixtureExposureIndex`. The composition in the second is a judgement, and your working should state it the way lesson two of this module did.

| field kind | door | evidence |
| --- | --- | --- |
| one-hour WBGT average | `wbgtTwaC` | arithmetic by definition |
| one-hour metabolic average | `metabolicRateTwaW` | arithmetic by definition |
| extended-shift action level | `oshaActionLevelForShiftDbA` | published, reproduced |
| action-level noise dose over the shift | `noiseDose` | published, reproduced |
| adjusted limit | `briefScalaAdjustedLimit` | published, reproduced |
| mixture index on adjusted limits | `mixtureExposureIndex` | each step published, reproduced; the composition a stated judgement |

## What the scenario keeps clear of

No input sits on a threshold, reaches a reduction-factor cap or lands exactly on unity. The judgement calls are taught by name in this tier, and none is tested at its boundary. The Brief and Scala weekly factor on its own is ORACLE ONLY and is never a graded field.

## How to work it

Name the door for each field before you compute. Type the scenario's numbers as they are stated, in the units the engine takes: hours for the shift and the sound level periods, minutes for the heat stress averages, watts for the metabolic rates, ppm for the concentrations. Work the averages by hand as well as through the panel, because a slip in a minutes column is an easy way to lose an arithmetic-by-definition field.

Quote each answer at the precision this course prints. The tolerance of every field is made in one place and you never need to know it.

## Exercise

Before you open the capstone, write down for each of the six fields the door you will call, the inputs it needs and the units each input takes. Then say which of the six would move if the RAL constants were wrong, and give the reason from module three.
