# What a verdict costs

A loading verdict is a number plus the correlation it was computed under, and quoting the first without the second changes what the well is.

{{panel:pd-profile-explorer}}

## The same six stations, scored twice

Turner and Coleman are one equation and one factor. The terminal velocity is identical under both, and Turner applies a 1.200000 adjustment where Coleman applies 1.000000, so every critical rate moves by exactly that factor.

| Depth, ft | Coleman rate, Mscf/d | Turner rate, Mscf/d | Coleman ratio | Turner ratio |
| --- | --- | --- | --- | --- |
| 0.0 | 2671.123287413 | 3205.347944896 | 1.1605604334 | 0.9671336945 |
| 1500.0 | 2771.653428599 | 3325.984114318 | 1.1184659554 | 0.9320549628 |
| 3000.0 | 2880.606192973 | 3456.727431568 | 1.0761623743 | 0.8968019786 |
| 4500.0 | 2997.912433154 | 3597.494919784 | 1.0340528848 | 0.8617107374 |
| 6000.0 | 3106.497172008 | 3727.796606410 | 0.9979085215 | 0.8315904346 |
| 7500.0 | 3222.613396799 | 3867.136076159 | 0.9619521855 | 0.8016268212 |

At the shoe the difference is 644.522679360 Mscf/d of critical rate on one well on one day.

## The verdicts that change

The two correlations disagree at 0.0, 1500.0, 3000.0 and 4500.0 ft. Under Coleman those four stations read healthy. Under Turner all four read loaded, including the gauge at 0.9671336945.

Both agree at 6000.0 ft and 7500.0 ft, so the well-level flag is `true` either way and the controlling station is 7500.0 ft either way. What moves is the margin: -3.80478145 percent under Coleman against -19.83731788 percent under Turner.

## Where the choice came from

`recommendCorrelation` at the EBOCHA-5 wellhead pressure of 880.0 psia returns coleman. Asked at every station instead of only at the gauge it returns coleman at 0.0 ft and 1500.0 ft, then turner at 3000.0, 4500.0, 6000.0 and 7500.0 ft. The wellhead choice is coleman and the controlling station would have chosen turner.

The function takes one pressure and cannot see which station it came from. It returns guidance, not a decision, and switches nothing for anybody.

## The mistake

Filing a margin without its correlation. A well at -3.80478145 percent is a candidate for watching. A well at -19.83731788 percent is a candidate for a workover, and both sentences describe EBOCHA-5 at 3100.0 Mscf/d. A verdict quoted downstream carries a factor of 1.200000 unless the correlation travels with it.

## What it refuses

The profile refuses to pick for you and refuses to run both. Hand it one correlation name and it applies that name at every station, including stations whose own pressure would have selected the other one.

## Exercise

Score EBOCHA-5 under Coleman and then under Turner and write both margins.

Then list the depths where the two verdicts disagree.
