# A switch that jumps

{{panel:fc-inhibitor-integrity-explorer}}

This module's friction factor changes branch at a Reynolds number of 4000.000000
and the two branches do not meet there. The wall shear jumps by a factor of
2.189815 across two ten-thousandths of the Reynolds number, which is a fraction
of a percent of velocity. The engine does not smooth that step, because a
smoothing function would be a third correlation with no source behind it.

| Reynolds | branch | friction factor | wall shear Pa | nearSwitch |
| --- | --- | --- | --- | --- |
| 2000.0000 | laminar | 0.008000 | 0.001600 | false |
| 3600.0000 | laminar | 0.004444 | 0.002880 | true |
| 3960.0000 | laminar | 0.004040 | 0.003168 | true |
| 4000.0000 | laminar | 0.004000 | 0.003200 | true |
| 4040.0000 | turbulent | 0.008739 | 0.007132 | true |
| 4400.0000 | turbulent | 0.008591 | 0.008317 | false |
| 8000.0000 | turbulent | 0.007623 | 0.024394 | false |

## Read the two middle rows

At a Reynolds number of 4000.0000 the branch is laminar, this module's friction
factor is 0.004000 and the wall shear is 0.003200 Pa. At 4040.0000 the branch is
turbulent, this module's friction factor is 0.008739 and the wall shear is
0.007132 Pa.
The inputs moved by almost nothing and the answer moved by the factor of
2.189815 stated above. That is the whole of the discontinuity and it is a
property of the two expressions rather than a property of any pipe.

## The engine flags the neighbourhood

Inside ten percent of the switch the engine sets a nearSwitch flag, which is
true on four of the rows above and false on three. With the flag set it returns
a note in its own words:

> Reynolds 4080 sits on the laminar to turbulent switch at 4000, where this
> friction factor is discontinuous and the shear jumps by about a factor of
> two. Read this number as a bracket, not a value.

Read that last sentence as an instruction about the kind of quantity you are
holding. Near the switch the shear is a range with two candidates in it. Away
from the switch it is a single number.

## Reporting a discontinuity rather than hiding it

Blending the branches invents a curve. Picking one branch either side and saying
nothing is what a reader would assume is happening. This engine takes the third
route, which is to compute the branch, flag the neighbourhood and say what the
step means, and the flag with the note is the whole mechanism.

## A discontinuity is a property of the pair

Neither branch is wrong on its own ground. Nothing in either expression requires
the two to agree at any particular Reynolds number, so joining them at one
produces a step wherever the two stand at that value. Both expressions and the
switch point between them are held for literature.

None of this describes the Pipeline and Line Sizing course's friction factor,
which is computed from a different correlation with a different transition and
will not agree with this one on the same pipe.

## Where this bites in practice

Most production lines run far above the switch, and none of the streams in the
previous lesson sits near 4000.000000. So this is a latent property for most
cases and a live one for a slow, viscous or small-bore line. When you meet a
case with the flag set, quote a bracket rather than a value.

## Exercise

Record the branch, this module's friction factor and the wall shear at Reynolds
numbers of 4000.0000 and 4040.0000, and record the nearSwitch flag at each.
Then state the factor by which the wall shear jumps across the switch, and say
what the engine's own note tells you to treat a shear figure as when the flag is
set.
