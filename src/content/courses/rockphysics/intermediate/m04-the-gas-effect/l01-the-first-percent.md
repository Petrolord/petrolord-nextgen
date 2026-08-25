# The first percent

Replacing all the brine with gas drops the compressional velocity from 3200 to 2905.70 m/s. Replacing one percent of it drops the velocity to 3078.87. This lesson is about that disproportion, which is the most consequential result in the tier.

## The numbers

| water saturation | gas fraction | $v_p$ (m/s) |
| --- | --- | --- |
| 1.00 | 0 | 3200 |
| 0.99 | 1 percent | 3078.8661575313054 |
| 0.95 | 5 percent | 2915.2644777573832 |
| 0.90 | 10 percent | 2861.023350805616 |
| 0.80 | 20 percent | 2833.1800 |
| 0.73 | 27 percent | 2830.2791905880454 |
| 0.50 | 50 percent | 2844.3861 |
| 0.20 | 80 percent | 2878.9325 |
| 0.00 | 100 percent | 2905.6972280296195 |

The velocity reaches its lowest value of 2830.2791905880454 m/s at a water saturation of 0.73, so the full drop available is 369.72080941195463 m/s.

Of that full drop, one percent of gas delivers 32.76 percent and five percent delivers 77.01 percent.

## Where the disproportion comes from

Wood's equation, from the Associate tier. A fluid mixture's compliance is the volume weighted sum of its components' compliances:

$$\frac{1}{K_{mix}} = \frac{S_w}{K_{brine}} + \frac{1 - S_w}{K_{gas}}$$

Gas is 48 times more compliant than brine, so the gas term dominates the sum almost immediately. At one percent gas:

$$\frac{1}{K_{mix}} = \frac{0.99}{2697.8113} + \frac{0.01}{55.7187} = 0.000367 + 0.000179 = 0.000546 \ \mathrm{MPa^{-1}}$$

The one percent of gas is already contributing a third of the mixture's compliance. At five percent it contributes over 70 percent. The mixture modulus falls from 2697.81 to 1830.04 MPa at one percent and to 800.32 MPa at five percent.

## Why it stops mattering

Once the fluid modulus is far below the frame's contribution, making it lower changes almost nothing.

Recall from module three that the fluid enters through $\phi / K_{fl}$ in the denominator of the forward relation, and that at gas the denominator's other terms are two hundred times smaller. Once the fluid term dominates the denominator, the fluid's contribution to the rock's stiffness is already close to zero, and reducing it further cannot take it below zero.

So the rock has run out of ways to respond. Everything after the first few percent of gas is happening in a rock whose fluid is already effectively absent.

## Reading it off the panel

The curve on the panel is exactly this table.

{{panel:rp-substitution-explorer}}

Step the saturation from 1.00 down through 0.99, 0.95 and 0.90 and watch the velocity tile fall 121, then 164, then 54 m/s. Then step 0.90 to 0.80 to 0.73 and watch it fall 28 and then 3.

Almost the entire response happens in the first tenth of the axis, and the panel draws that as a near vertical drop at the left hand edge followed by a long flat floor.

## Worked example

Work out the impedance consequence, since impedance is what a seismic amplitude reads.

At Sw 0.99 the density is 2247.8871045177934 kg/m3, barely changed, and the velocity is 3078.8661575313054. The impedance is 6,920,944, against 7,200,000 for the fully brine case: a fall of 3.9 percent.

At Sw 0.00 the impedance is 5,923,875, a fall of 17.7 percent.

So one percent of gas produces roughly a fifth of the full impedance anomaly, rather than the third it produces in velocity. The difference is the density, which is linear in saturation and has barely moved at one percent.

That is worth holding: the velocity saturates immediately and the density does not, so impedance is a slightly better saturation indicator than velocity alone. Slightly is doing a lot of work in that sentence, and the next two lessons are about how little it helps.

## Exercise

A prospect is modelled with a full gas case and the amplitude predicted from it matches the observed seismic well. State what saturations are consistent with that observation.

Self check: almost any of them above a few percent of gas. Five percent of gas already produces 77 percent of the full velocity drop, and by 20 percent the velocity is within 3 m/s of its floor. The observation is consistent with a commercial gas column and equally consistent with a residual gas saturation of a few percent, which is the subject of the next two lessons.
