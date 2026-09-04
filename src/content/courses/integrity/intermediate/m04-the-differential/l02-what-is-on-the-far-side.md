# What is on the far side

The backup density field looks optional. Leaving it blank is not a neutral act, it is a declaration that the far side of the wall is gas.

{{panel:wi-annulus-explorer}}

## The default

`maaspRows` reads the far side as `el.backupDensityKgM3 ?? 0`. Supply nothing and the element is evaluated with zero density behind it.

Zero density is a void. In a real well the nearest thing to it is a gas filled annulus at low pressure, or a string that has been evacuated. It is the most severe assumption available, and the engine takes it silently because a silent severe default is safer than a silent generous one.

## What the default costs on the fixture

Hold the element at a factor of 0.8 on a limit of 30000000 Pa, at a TVD of 2048.29303343 m, with 1200 kg/m3 in the annulus, and vary only the backup:

| Backup density, kg/m3 | Differential head, Pa | Allowable surface pressure, Pa |
| --- | --- | --- |
| 0 | 24104271.45154357 | -104271.45154356956 |
| 150 | 21091237.520100623 | 2908762.4798993766 |
| 500 | 14060825.013400415 | 9939174.986599585 |
| 800 | 8034757.150514523 | 15965242.849485476 |
| 1030 | 3414771.788968672 | 20585228.21103133 |

With brine behind the wall the element allows 20585228.21103133 Pa. With the field left blank it allows nothing at all. The row returns -104271.45154356956 Pa, the engine flags it negative and the reported MAASP is clamped to 0.

So an omitted field takes this element from a healthy operating envelope to no operating envelope, and it does so without a warning of its own.

## When zero is the right answer

Sometimes it is exactly right. A gas lifted well whose tubing has unloaded to gas puts something close to a gas column on the inside of the completion string. A shallow annulus that has been bled to atmosphere and left open is close to a void over the interval that matters.

The point is that zero should be a decision you made and can defend, not a field you did not reach.

## How to fill it honestly

Write what you can prove stands there now, not what was pumped at the end of the last job. Packer fluid can be displaced, gas can migrate above a leaking gas lift valve, and an annulus that was brine filled at completion may not be brine filled after five years of sustained pressure and bleed down cycles.

## Exercise

Reproduce the sweep above and confirm the negative flag and the clamp at zero backup.

Then take the published well and, for each of its three candidates, write down the evidence you would need to justify the backup density it carries.
