# Six operations, one string

The full table, and the two velocities that produce it.

{{panel:td-string-explorer}}

## The six

| operation | axial velocity | rotary | bit condition |
|---|---|---|---|
| trip out | up | none | free |
| trip in | down | none | free |
| rotate off bottom | none | 120 rpm | free |
| rotate on bottom | none | 120 rpm | on bottom |
| slide drill | down | none | on bottom |
| back ream | up | 120 rpm | free |

Those three columns are the whole of the difference. Everything else, the string, the hole, the mud, the friction factors, is identical.

## What "on bottom" changes

Two boundary conditions at the bit: tension starts at minus the weight on bit rather than at zero, and torque starts at the bit torque rather than at zero.

That is all. There is no extra physics; the bit is a place where a known force and a known moment are applied.

## The horizontal well's table

| operation | hookload | torque | min tension | buckles from |
|---|---|---|---|---|
| trip out | 633055.5742519312 N | 0 | 0 | none |
| trip in | -16676.68507494847 N | 0 | -281944.752574833 N | 0 m |
| rotate off bottom | 322268.488329813 N | 18817.84540858303 N.m | 0 | none |
| rotate on bottom | 233268.4883298128 N | 24324.87703304575 N.m | -89000 N | 880 m |
| slide drill | -156755.75915568782 N | 2700 N.m | -422023.82665557245 N | 0 m |
| back ream | 383052.98832263396 N | 18134.35647525905 N.m | 0 | none |

Read down the torque column. Zero, zero, large, larger, bit torque only, large. That pattern is entirely the `ft` term: no rotation means no tangential friction means no torque.

Read down the hookload column. The two operations that go DOWN are the two that go negative. That is the axial friction sign, and it is the same sign for both.

## The pair that differs by exactly the weight on bit

Rotate off bottom and rotate on bottom: 322268.488329813 N and 233268.4883298128 N. The difference is 89000 N to the last digit.

That is not a coincidence and it is not general. It holds here because the axial velocity is zero in both cases, so `fa` is zero, so the weight-on-bit offset propagates up an axially frictionless string unchanged.

On the two tripping operations no such clean relationship exists, because there the friction itself depends on the tension the offset changed.

## The pair that differs by more than you would guess

Rotate off bottom at 322268.488329813 N and back ream at 383052.98832263396 N. Same rotation, same free bit; the only difference is that back reaming is also moving up at 0.3 m/s.

Adding that axial motion added 61 kN to the hookload and REMOVED 683 N.m from the torque. The friction did not change; it was re-shared between the two directions.

## Exercise

For each of the six operations, predict the sign of the torque and the sign of the difference between its hookload and the rotating-off-bottom hookload, before opening the panel.

Then check. Any prediction you got wrong is a place where the two velocity components are not yet doing what you expect.
