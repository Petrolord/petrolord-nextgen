# Two constants, and which one applies

{{panel:fc-fire-drum-explorer}}

The API 521 pool fire duty is a constant times an environment factor times the wetted area raised to a published exponent. Which constant applies is decided by one answer: whether the plot has adequate drainage and firefighting.

## The two constants, measured out of the engine

| the duty at a wetted area of one ft2 and an environment factor of one | value |
| --- | --- |
| with adequate drainage and firefighting | 21000.000000000000 Btu/hr |
| without | 34500.000000000000 Btu/hr |
| the factor between them | 1.642857142857 |

Those figures are measured rather than typed. The question asked is a duty at a unit area and a unit environment factor, where the area term is one whatever the exponent is, so the answer is the constant alone. The factor between the two rows is computed and printed, so it may be quoted as it stands.

## Held for literature, and what that costs

Both constants and the exponent are held for literature. No route here derives them and no copy of the standard sits here, so they are taught as stated values with their reference named.

What can be checked is the unit packaging. The oracle takes the published SI pair, carries the exponent through the unit conversion, and asks whether the USC pair follows. That check is real and narrow: it catches a botched square-metre to square-foot conversion, and it would not notice wrong pool fire physics behind the published pair, because it never leaves that pair.

Nothing graded in this course reads a fire duty or a fire relief load, which is the practical consequence of the hold.

## One boolean, two answers

| the teaching vessel at an environment factor of 1.000000 | duty Btu/hr |
| --- | --- |
| drainage answered true | 4434115.2612 |
| drainage answered false | 7284617.9291 |

One field, and the duty changes by the drainage factor above. Be exact about how big a lever that is, because it is easy to overstate: the digest ranks the single-input changes to this case by what each does to the duty, and the drainage answer comes third of six at 1.642857142857, behind the environment factor at 0.300000 on 3.333333333333 and reading the vessel standing up on 3.318423022984.

What makes it worth a lesson is its shape rather than its size. It is no measurement, but a judgment about a plot: whether a spill drains away, and whether firefighting keeps the pool from establishing itself.

So the answer belongs in the case record with a reason beside it: a duty quoted without its drainage answer cannot be reproduced.

## Which answer is the honest one

The drainage question is one about the plant arriving as a boolean, and a boolean carries no uncertainty. There is no partial credit for a bund that drains a small spill and is overwhelmed by a big one.

So the answer has to be defensible on its own. Where the honest position is that you do not know, the answer in the box is false, because the duty that follows is the larger and a valve sized against it passes the smaller case too.

## The published fire cases on this branch

| wetted ft2 | drainage | environment factor | published duty | engine duty | relative difference |
| --- | --- | --- | --- | --- | --- |
| 628.3000 | true | 1.000000 | 4138017.5155 | 4137293.0505 | 1.751e-4 |
| 628.3000 | false | 1.000000 | 6791329.6724 | 6796981.4402 | 8.322e-4 |

Two rows, one geometry, both drainage answers. The relative differences sit at the fourth decimal rather than at machine precision, which is what a published figure rounded on its way into print looks like. Both branches are exercised, so a set with the constants transposed could not pass.

## Exercise

Give both pool fire constants at the precision this lesson prints and the factor between them. Say what the oracle can and cannot check, where the drainage answer ranks among the duty levers, and why it belongs in the case record.
