# What gas does to a pump

Gas does three things at once: it adds volume, it removes weight, and it changes what equipment the job needs. The engine tracks all three and models none of them.

{{panel:pd-lift-explorer}}

## One well, the separator swept

The teaching well QUA-IBOE-4, which is not a published case, was built to cross both thresholds, because both published designs come back standard.

| Separator efficiency | Through the pump, bbl/d | GVF | Density, lbm/ft3 | Verdict |
| --- | --- | --- | --- | --- |
| 0.00 | 3408.461538 | 0.25876777 | 40.019905 | separatorRequired |
| 0.10 | 3320.261538 | 0.23907755 | 40.936898 | gasHandler |
| 0.45 | 3011.561538 | 0.16107923 | 44.569356 | gasHandler |
| 0.60 | 2879.261538 | 0.12253142 | 46.364565 | gasHandler |
| 0.70 | 2791.061538 | 0.09480264 | 47.655921 | standard |
| 1.00 | 2526.461538 | 0.00000000 | 52.070972 | standard |

## What each threshold is for

The handler maximum of 0.25 is the point above which a standard pump and a gas handler are both out, so the answer is a separator or another lift method. The standard maximum of 0.10 is the point above which a standard pump alone stops coping, so a handler goes in front of it. The first crossing on this well happens between efficiencies of 0.00 and 0.10, the second between 0.60 and 0.70.

## Venting is not only a rate reduction

Read the rate and the density columns together. Taking gas out drops the rate through the pump from 3408.461538 to 2526.461538 bbl/d and raises the density from 40.019905 to 52.070972 lbm/ft3. The published golden design gassyOffshore shows the same effect at one efficiency: its separator makes the pumped fluid heavier by 3.26446175 lbm/ft3 and its gradient heavier by 0.0226698733 psi/ft.

## The mistake

Treating a separator as a way to get the duty rate down. It is, but the heavier fluid it leaves behind needs more pressure for the same feet of head. Sizing on the lighter stream density with the vented rate takes the friendly half of each.

## What it refuses

Nothing here degrades a stage. The stage curve is read at the mixture rate as though the fluid were liquid, so a duty at 0.25876777 gas is read exactly as one at 0.00000000 would be. The verdict is the only output that knows gas is present, and it is a label, not a correction.

## Exercise

Sweep the separator efficiency on QUA-IBOE-4 and record the efficiency at which each verdict first changes.

Then say which single column in that sweep tells you the head requirement is moving, and in which direction.
