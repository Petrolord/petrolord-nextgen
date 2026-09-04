# The gradient is not a constant

The flat 0.02 psi/ft rule of thumb is wrong in both directions, and it is wrong about the direction the gradient moves as well.

{{panel:pd-column-explorer}}

## Both directions at once

The gradient is density over 144, and density goes as pressure over z and temperature. Pressure level sets it, and a flat rule has no pressure in it.

| Column | Surface, psia | Local gradient at surface, psi/ft | Ratio to 0.02 | Rule error at the packer, psi |
| --- | --- | --- | --- | --- |
| 1 | 1014.7 | 0.025405143 | 1.270257 | -41.016705 |
| 2 | 1414.7 | 0.039871956 | 1.993598 | -206.539805 |
| 3 | 614.7 | 0.013616528 | 0.680826 | 26.102397 |

The rule reads low against the 1414.7 psia column and high against the 614.7 psia one, and it misses by 48.4222 percent of column 2's whole lift and 48.4296 percent of column 3's, in opposite signs. A learner who has been told only that the rule reads low knows half of it. The ratios move as the columns are marched, to 1.244654, 1.895866 and 0.667073 at the packer, so there is no depth at which the rule becomes right. The engine's own header names the flat rule as the thing it refuses to use.

## Which way it moves with depth

| Column | Surface, psi/ft | Packer, psi/ft | Change |
| --- | --- | --- | --- |
| 1 | 0.025405143 | 0.024893071 | -2.0156 percent |
| 2 | 0.039871956 | 0.037917316 | -4.9023 percent |
| 3 | 0.013616528 | 0.013341465 | -2.0201 percent |

It falls, on all three, on ordinary linear geotherms.

## The control that settles it

Hold each column at its wellhead temperature and march again. Column 1 at 100.0 degF throughout goes from 0.025405143 to 0.032012925 psi/ft, a change of 26.0096 percent, and reaches 1243.177680881 psia instead of 1215.716705320, a difference of 27.460976 psi at the packer. Column 2 at 110.0 degF goes to 0.057162074 psi/ft, 43.3641 percent, and 1942.903602607 psia, 101.663798 psi apart. Column 3 at 90.0 degF goes to 0.014991821 psi/ft, 10.1002 percent, and 671.866399185 psia, 3.268796 psi apart.

Compression on its own raises the gradient. The real column is that effect plus the geotherm, and the geotherm wins.

## What this course got wrong

The first draft of this course's own brief said gas compresses on the way down, so the gradient grows with depth. The mechanism is real, the conclusion is false, and the reason is that the story named one of two competing effects and stopped. The isothermal control caught it, because it isolates the effect the story described from the effect the story forgot.

That is the general shape of being confidently wrong: a plausible account that is complete on its own terms and incomplete about the world. The cure is not a better story. It is a comparison where one thing is held still. It settles numerical arguments too: a march whose error refuses to shrink may be parked against a mismatched constant.

## Exercise

Read column 2 at 0.0 ft and at 11000.0 ft, then run it again held at 110.0 degF.

Write the two gradient changes with their signs, and say which one describes a well.
