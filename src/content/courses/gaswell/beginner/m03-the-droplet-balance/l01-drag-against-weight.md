# Drag against weight

Two forces and one break-up condition, and no fitted parameter anywhere inside them.

{{panel:pd-droplet-explorer}}

## The balance itself

A droplet in rising gas feels drag upward, which goes as the gas density times the square of the velocity times the frontal area times a drag coefficient. It feels weight downward, which goes as the droplet volume times the difference between the liquid and gas densities. Buoyancy is already inside that difference, which is why a heavier gas lifts a droplet more easily quite apart from the drag it applies. In field units the two sides need `gc`, 32.1740 lbm ft / (lbf s2), and a tension in dyne/cm needs 6.852177e-5 to become lbf/ft. Both are explicit in the engine and absent from the SI oracle that checks it, which is what makes the agreement worth something.

## The constant is produced, not remembered

Set the drag coefficient to 0.4400 and the critical Weber number to 30.0000, eliminate the droplet diameter, and the balance collapses to one leading constant. The oracle publishes 1.5935357894 and the engine derives 1.5935346111, a difference of -1.1784e-6 and a relative difference of 7.3947e-7. The gate checks that the engine produces the number rather than stores it, which is the only way to tell a derivation from a remembered coefficient.

## What the constant is made of

| Drag coefficient | Constant | Ratio to the shipped 0.44 |
| --- | --- | --- |
| 0.22 | 1.8950426975 | 1.1892062356 |
| 0.33 | 1.7123643784 | 1.0745691372 |
| 0.44 | 1.5935346111 | 0.9999992605 |
| 0.55 | 1.5070719871 | 0.9457409097 |
| 0.88 | 1.3399975420 | 0.8408957934 |
| 1.10 | 1.2672914315 | 0.7952701407 |

Halving the drag coefficient does not halve anything: 0.22 gives 1.1892062356 of the shipped value and 0.88 gives 0.8408957934, so the whole span from 0.22 to 1.10 moves the constant by less than a factor of two. The relationship is a fourth root, which is why the balance tolerates a drag coefficient nobody can defend to better than a factor of two. The row at 0.44 reads 0.9999992605 rather than exactly one because the sweep is measured against the published 1.5935357894 while the engine derives 1.5935346111, and the shortfall is the same 7.3947e-7. It is worth keeping that row rather than rounding it, because it is the only place in the table where the two roads to this constant are visible at once.

## The mistake

Quoting 1.5935357894 as a constant of nature. It is 0.4400 and 30.0000 written down, and a droplet in real tubing is neither a rigid sphere nor in the Newton regime.

## What it refuses

A liquid density of 2.0 lbm/ft3 below a gas density of 5.0 lbm/ft3 returns `ok = false` with no velocity. With no submerged weight there is nothing for drag to balance, and the balance says so rather than returning a number.

## Exercise

Read the constant at drag coefficients 0.22, 0.44 and 0.88 and say which direction more drag moves it.

Then explain why the 0.44 row does not read exactly one.
