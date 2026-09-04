# No check at all for MEG

For methanol the requirement collects a second opinion and ignores it. For MEG it collects no second opinion at all, because `nielsenBucklinF` comes back null.

{{panel:pd-hydrate-explorer}}

## What the catalog decides

The inhibitor catalog carries a flag. Methanol ships with Nielsen-Bucklin available = true, MEG, DEG and TEG ship with it false. `depression` reads that flag and returns `nielsenBucklinF` as null for the three glycols at every concentration, with `spreadF` null beside it and `basis` staying hammerschmidt however high the number goes. The stated reason is that Nielsen-Bucklin was developed for methanol. The flag then does a second job nobody asked for, which is to switch off the only cross relation the requirement chain has.

## The same need, the other fluid

TEACHING LINE AKASO SPUR is a construct of this course, not a published case. On a 41.00 degF need in MEG at 89.00 weight percent lean the requirement returns `weightPct` 52.1503646614, `depressionCheck.hammerschmidtF` 41.0000000000 degF, `depressionCheck.nielsenBucklinF` null, `depressionCheck.recommendedF` 41.0000000000 degF and `basis` hammerschmidt, with a rate of 466.5311621077 bbl/d.

The shortfall reads 0.0000000000 degF, so the design reports as delivering exactly what was ordered. The check has not passed. It was never run.

## Four fluids, one mole fraction, one check

The Hammerschmidt inverse fixes the group w over the molecular weight times 100 less w at the depression over k. The mole fraction is that group over itself plus the reciprocal of 18.015, so it carries no molecular weight at all, and every inhibitor in the catalog carries the same k of 2335. Four fluids sized to one need land on one mole fraction. Engine values at a 36.0 degF need.

| Fluid | Design, weight percent | Mole fraction | Nielsen-Bucklin, degF | `depression` returns |
| --- | --- | --- | --- | --- |
| methanol | 33.0646363417 | 0.21737265128002306 | 31.7647816499 | 31.7647816499 |
| meg | 48.9005409759 | 0.21737265128002303 | 31.7647816499 | null |
| deg | 62.0653353522 | 0.21737265128002306 | 31.7647816499 | null |
| teg | 69.8364061014 | 0.21737265128002312 | 31.7647816499 | null |

Four concentrations, one mole fraction to within a single ulp, one identical Nielsen-Bucklin. The check suppressed for three of these fluids is the number the module already computes for the fourth, so suppressing it removes a check and changes no answer.

## The oracle already computes it

The published golden carries a Nielsen-Bucklin depression for all four fluids. At 50.0 weight percent MEG it reads 33.0254224092 degF against a Hammerschmidt value of 37.6123731271 degF. The independent check exists in the committed case file. Only the engine declines to report it.

## The mistake

Reading a null as an absence of disagreement. On the methanol return a reader sees two numbers and can notice they differ. On the MEG return there is one number, it equals the need exactly, and nothing says a relation was skipped rather than agreed with.

## Exercise

Size one need in all four fluids and record `weightPct`, `nielsenBucklinF` and `recommendedF` for each.

Then compute the mole fraction of each dose and say why one hand calculation covers all four returns.
