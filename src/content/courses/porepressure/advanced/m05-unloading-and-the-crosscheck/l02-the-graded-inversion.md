# The graded inversion

The capstone's fifth field: the effective stress the unloading form reads from 3125.8 m/s, with sigma_max 50 MPa and U 3. Expected value, exactly 10 MPa, tolerance 0.01. This lesson computes it, explains the suspicious roundness, and prices the assumptions it stands on.

## The inversion, formally

Invert last lesson's equation from the outside in:

$$\sigma' = \sigma_{max} \left[ \frac{1}{\sigma_{max}} \left( \frac{V_{fts} - V_{ml}}{A} \right)^{1/B} \right]^{U}$$

Read the layers: undo the unit edges, undo the loading form, which leaves the loading-equivalent stress, then undo the remapping, dividing by $\sigma_{max}$, raising to the power $U$, scaling back. The outer power $U = 3$ is the flat curve read backward: steep. Hold that thought; it is the lesson's second half.

## The computation

Velocity in: 3125.808993287662 m/s. To ft/s: $3125.808993287662 / 0.3048 = 10255.27884936897$ ft/s. Less mudline: 5255.27884936897. Over A: 525.527884936897. Power $4/3$: $525.527884936897^{4/3} = 4240.929178333972$ psi, which converted is the loading-equivalent stress, $4240.929178333972 \times 6894.757293168361 = 29.240177382128643$ MPa.

Then the unloading layer, workable in SI: divide by $\sigma_{max}$, $29.240177382128643 / 50 = 0.5848035476425729$; raise to $U = 3$: $0.19999999999999968$; times 50 MPa: $9.999999999999984$ MPa. The engine returns 9.999999999999977. Report 10.00; the tolerance is 0.01 and the answer is 10 to fourteen decimals.

## Why it is exactly 10

Because the fixture built it that way: 3125.808993287662 m/s IS the unloading velocity at exactly 10 MPa, computed forward in last lesson's worked example, and the capstone asks you to run the loop backward. The graded pair, forward at 5 MPa on loading and backward to 10 MPa on unloading, tests both directions of both curves with two clean integers as the anchors.

This is the same pedagogy as the Eaton ramp: known answers, exact recovery, machinery certified. And the same epistemology warning attaches: recovering the encoded 10 certifies your arithmetic, not the parameters. The 10 is only as real as the 50 and the 3 it was computed through.

## Pricing the assumptions

So price them, one at a time, holding the velocity fixed at 3125.808993287662.

Suppose $U$ were 5, not 3, with $\sigma_{max}$ still 50: the inner ratio 0.5848035476425728 to the FIFTH power, times 50, is 3.4199518933533817 MPa. Suppose $U$ were 2: $0.5848035476425728^2 \times 50 = 17.099759466766944$ MPa. The stress answer runs from 3.4 to 17.1 MPa across ordinary values of $U$, from one velocity. In pore pressure terms, with an overburden in hand, that spread passes straight through the subtraction.

Suppose instead $\sigma_{max}$ were 40, keeping U 3, the loading-equivalent 29.240177382128643 still below it so the rock is still credibly unloaded: the answer is $40 \times (29.240177382128643/40)^3 = 15.625$ MPa, exactly, a small algebraic accident of the fixture ($50^3 \times 0.2 / 40^2$), and the engine agrees to thirteen decimals.

The table is the lesson: velocity 3125.8, honest answers between 3.4 and 17.1 MPa depending on two history parameters no log measures. Unloading analysis is powerful exactly where it is fed history, and treacherous where the history is guessed. A report using the unloading form owes its reader the sigma_max and U it assumed, and the sensitivity of its answer to both, in exactly this format.

## The roundness as a flag

One professional habit, small but real: when a computed stress lands on a suspiciously round number, check whether you are inside someone's synthetic loop before celebrating the precision. Real inversions land on 9.73 or 10.41. This course's exactness is a feature of fixtures, and recognising fixture-flavoured answers, exact integers, exact ratios like 16/9, values that match a published example to ten digits, is a working skill when auditing third-party work: it usually means a demo dataset is still wired in where field data should be.

## Worked example

The full graded chain again, compressed to the six lines you would write in the exam. V 3125.808993287662 m/s over 0.3048 is 10255.27884936897 ft/s. Minus 5000: 5255.27884936897. Over 10: 525.527884936897. To the 4/3: 4240.929178333972 psi, times 6894.757293168361 is 29.240177382128643 MPa loading-equivalent. Over 50, cubed, times 50: 10.000 MPa. Tolerance 0.01, cleared.

## Exercise

State what the same velocity, 3125.808993287662 m/s, implies for effective stress under the LOADING inversion, and reconcile the two answers in one sentence each.

Self check: the loading inversion stops at the loading-equivalent step, 29.240177382128643 MPa, since for a loading rock the remapping layer does not exist. So one velocity reads 29.24 MPa if the rock only ever loaded, and 10.00 if it unloaded from 50 MPa with U 3: the measurement is the same, the histories differ, and the 19.24 MPa gap between the readings is the subject of the next lesson, because choosing the wrong history is the single largest error available in this module.
