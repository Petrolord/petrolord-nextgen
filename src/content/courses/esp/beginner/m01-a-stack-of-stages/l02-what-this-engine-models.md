# What this engine models

One curve at one speed, plus a mapping. There is no separate curve at 50 Hz, and there is no impeller in the model at all.

## Three fits in rate and one law in speed

A stage here is a head fit and an efficiency fit in rate, taken at a reference frequency of 60 Hz on a fluid of specific gravity 1.0. Everything else is derived. The affinity laws carry the reading to any other drive speed: rate scales with speed, head with speed squared, power with speed cubed, and efficiency does not move at all.

The engine works that mapping backwards first, dividing the duty rate by the speed ratio to get an equivalent rate on the 60 Hz curve, reading head and efficiency there, then scaling head and power forward. At 40 Hz the speed ratio is 0.66666667, so a duty of 1800 bbl/d is read at 2700.000000 bbl/d.

## The same duty rate at two speeds

| Drive | Equivalent rate, bbl/d | Head per stage, ft | Efficiency | Brake power per stage, hp |
| --- | --- | --- | --- | --- |
| 60 Hz | 1800.000000 | 31.2742857143 | 0.6391314286 | 0.5844372708 |
| 40 Hz | 2700.000000 | 11.7853968254 | 0.7385257143 | 0.1905984074 |

Both rows are the published golden case, a duty of 1800 bbl/d on a fluid of specific gravity 0.90. Efficiency moved from 0.6391314286 to 0.7385257143, which looks like a contradiction of the law. It is not. The law holds at a fixed point on the reference curve, and slowing the drive moved the point, from 1800 bbl/d to 2700.000000 bbl/d.

## The power statement

Brake power comes out of head, rate and gravity by hp = q H SG divided by 135635.80083124, the constant the golden records. The familiar field form works in pressure instead, hp = q dP / 58824. The exact divisor behind this package, 135635.80083124 times 62.4/144, is 58775.513694, which differs from the rounded 58824 by 0.0008242606 relative.

## The mistake

Assuming the engine holds a curve per frequency, and so reading the 60 Hz curve at the duty rate when the drive is elsewhere. On the golden case that returns 31.2742857143 ft where the answer at 40 Hz is 11.7853968254 ft.

## What it refuses

The affinity laws in this module are exact for a fixed impeller, and the module carries no impeller trim, no wear factor and no stage by stage variation. Every stage in the stack is the same stage.

At zero frequency the speed ratio is not positive, so `stagePerformance` returns head NaN, region `invalid` and inside the published range false. That is one of the very few places where the reading itself declares that it failed rather than handing back a number.

## Exercise

Take the golden duty of 1800 bbl/d at 60 Hz and at 40 Hz and write down the equivalent rate on the reference curve for each.

Then say in one sentence why the two efficiencies differ even though the affinity law says efficiency does not move with speed.
