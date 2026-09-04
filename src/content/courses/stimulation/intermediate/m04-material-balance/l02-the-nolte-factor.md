# The Nolte factor

Not every part of the fracture face has been leaking for the same length of time, and one small factor is what corrects for it.

{{panel:st-frac-explorer}}

## The problem it solves

The square root of time law needs an exposure time. Near the wellbore the face has been open since the first barrel. At the tip it opened a moment ago. If you used the total pump time everywhere you would overstate the loss, and if you used zero you would understate it.

Nolte's approximation replaces the honest integral over a growing face with a single multiplier on the simple answer.

    KL(eta) = ( (8/3) eta + pi (1 - eta) ) / 2

The multiplier depends on efficiency, because efficiency is what tells you how the face grew. When nothing leaks off, area grows in proportion to time, so the face keeps opening steadily to the end and most of it is young. When almost everything leaks off, area grows closer to the square root of time, so most of the face opened early and is old. Old face has leaked longer, so the correction is larger.

## The range

| efficiency | Nolte factor |
|---|---|
| 0.05 | 1.5589231771218184 |
| 0.2 | 1.5233037281025839 |
| 0.4 | 1.4758111294102711 |
| 0.6 | 1.4283185307179584 |
| 0.8 | 1.380825932025646 |
| 0.95 | 1.3452064830064114 |
| 1 | 1.3333333333333333 |

The formula is linear in efficiency, so the table is a straight line between its two endpoints. At an efficiency of 1 the factor is 4/3, which is the 1.3333333333333333 in the last row. At an efficiency of zero it is pi/2.

That is the entire world the factor lives in, between four thirds and half of pi.

## What to take from a narrow range

Two things.

First, the factor is not where the uncertainty in a material balance lives. The leakoff coefficient can be wrong by a factor of two. This multiplier cannot be wrong by a quarter.

Second, and more usefully, it is still what makes the balance circular. The factor needs efficiency, and efficiency is one of the things the balance is trying to find. That is the subject of the last lesson in this module.

The published case has an efficiency of 0.1728566723633056, which sits just below the 0.2 row, so its factor is a little above 1.5233037281025839.

## Exercise

Read the factor at both ends of the table and confirm the middle rows fall on the straight line between them.

Then say what physical situation an efficiency near 1 describes, and why the correction is smallest there.
