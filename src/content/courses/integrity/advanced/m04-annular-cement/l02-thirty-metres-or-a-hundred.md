# Thirty metres, or a hundred

Verification is worth 70 metres of cement, and this is the sharpest number in the course.

{{panel:wi-pa-explorer}}

## The two requirements

`annularBarrierCheck` picks its requirement from one boolean. With a cement evaluation log, the annular barrier needs **30 m MD**. Without one, it needs **100 m MD**.

The digest records the gap directly as 70 m. Same cement, same annulus, same well. Run the log and 70 m of required length disappears.

Both figures come from the commonly cited NORSOK D-010 rev 4 conventions carried in `D010_DEFAULT_RULES`. They are overridable, there is an armed literature gate on the module, and the standard document governs. Do not quote them as physics.

## The sweep

Nine lengths, both ways:

| Length, m MD | Logged, needs 30 m | Not logged, needs 100 m | Log changes the answer |
| --- | --- | --- | --- |
| 20 | fail | fail | no |
| 28 | fail | fail | no |
| 30 | pass | fail | **yes** |
| 40 | pass | fail | **yes** |
| 60 | pass | fail | **yes** |
| 70 | pass | fail | **yes** |
| 90 | pass | fail | **yes** |
| 100 | pass | pass | no |
| 130 | pass | pass | no |

**Five of the nine swept lengths flip from fail to pass on the log alone.** Nothing about the cement changes across that column. Only the evidence does.

Two lengths, 20 m and 28 m, are too short either way, and no log will rescue them. Two, 100 m and 130 m, are long enough that the log makes no difference to the verdict. The interesting band is everything between 30 m and 100 m, and in practice that is where a great many real cement tops sit.

## The published interval

The worked case has 40 m of annular cement from 2400 to 2440 m MD. Logged, it passes with 10 m to spare. Unlogged, it fails by 60 m.

One interval, two verdicts, decided by whether anyone ran a tool.

## What this is really saying

The standard is not claiming that 30 m of logged cement seals better than 100 m of unlogged cement. It is pricing uncertainty. Without a log you do not know where the cement is, whether it is continuous, or whether it is bonded, so you are asked to buy margin by the metre. With a log you have looked, and you are allowed to keep the margin you can demonstrate.

## Exercise

1. Grade a 70 m interval both ways and read the two margins.
2. Find the shortest swept length at which the log stops changing the answer, and say why it stops there.
3. For an interval in your own well, work out whether a log or another 70 m of cement is cheaper.
