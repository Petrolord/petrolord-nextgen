# The hydrostatic term

The load the element is already carrying before anyone touches a valve at surface.

{{panel:wi-annulus-explorer}}

## A difference of columns, not a column

    head = (annulusFluidDensity - backupDensity) * g * tvdM

with g at 9.80665 m/s2. The term the engine subtracts is a differential, because a rating is a differential. What loads a wall is the pressure inside it minus the pressure outside it, so the fluid on the far side is part of the answer and a heavy fluid over there is help, not a hazard.

Only the difference of the two densities enters. An annulus at 1200 kg/m3 with 1030 kg/m3 behind it and an annulus at 1030 with 860 behind it load the element identically at the same depth.

## The sensitivity

At the published limiting element's depth of 2048.29303343 m, one kilogramme per cubic metre of density difference is worth 20086.892876286307 Pa of allowable surface pressure.

The sign follows the sense. Add that much density to the annulus fluid and you lose that much allowable; add it to the backup fluid and you gain it. The gradient against annulus density is the negative of the one above, and it is the same magnitude because it is the same term.

## Reading the backup sweep

Same element, same annulus at 1200 kg/m3, varying only what is on the far side:

| backup, kg/m3 | head, Pa | allowable, Pa |
|---|---|---|
| 0 | 24104271.45154357 | -104271.45154356956 |
| 500 | 14060825.013400415 | 9939174.986599585 |
| 1030 | 3414771.788968672 | 20585228.21103133 |
| 1200 | 0 | 24000000 |
| 1800 | -12052135.725771785 | 36052135.725771785 |

At equal densities the head vanishes and the allowable is the rating term alone. Above 1200 the head goes negative and adds capacity, because the far side now pushes back harder than the annulus does. At the top of the table the row itself has gone negative.

The break-even sits at a backup density of 5.191019446649534 kg/m3. Below that the fixture cannot take any surface pressure at all. Holding the backup at 1030 instead and raising the annulus fluid, the same break-even is 2224.8089805533505 kg/m3.

## An evacuated far side is the hard case

Backup density defaults to zero when you omit it, and zero is a real modelling choice: a gas filled or evacuated volume on the far side. It is also the worst case in the table above, so an omitted backup is not a neutral assumption.

## Exercise

Using the sensitivity, predict the allowable at a backup of 800 kg/m3 before reading it in the panel.

Then explain in one sentence why the same fluid can buy margin on one element and cost margin on another.
