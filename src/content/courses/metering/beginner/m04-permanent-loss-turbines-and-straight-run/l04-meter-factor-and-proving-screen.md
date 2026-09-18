# The meter factor, and the proving screen

Proving is how a meter is compared against something better. You pass a known
volume through it, look at what it said, and the ratio of the two is the meter
factor. A factor near unity means the meter is telling the truth.

## What the factor does to the volume

| meter factor | gross, bbl | warning |
| --- | --- | --- |
| 0.985000 | 3065.7864 | fires |
| 0.990000 | 3081.3487 | fires |
| 0.995000 | 3096.9111 | silent |
| 1.000000 | 3112.4735 | silent |
| 1.005000 | 3128.0358 | silent |
| 1.010000 | 3143.5982 | fires |
| 1.015000 | 3159.1606 | fires |
| 1.040000 | 3236.9724 | fires |

Same pulses, same K factor, one input changing. The middle of the table is
quiet. Both ends carry a warning.

   the proving screen fires above a meter factor of                 1.010000

Found by bisecting the meter factor at which the returned warning stops being
null, which is the same technique as the small bore threshold in module two.

## What the screen says

   > a meter factor of 1.04 is 4.0 percent from unity. A proving run on a healthy meter
     lands within about one percent of 1, and further out than that is a proving failure, a
     wrong K factor or a damaged rotor rather than a volume. This screen is this engine's
     stated choice

The last sentence is the one to hold on to. The screen is this engine's stated
choice. It is not read from a standard and it is not a tolerance anybody has
agreed with your counterparty. It is a band the software tells you it applied,
on the screen, rather than leaving you to find it in the source.

## Why a far out factor is a fault rather than a correction

The message names three candidate causes. A proving failure, meaning the proving
run itself was not valid. A wrong K factor, meaning the meter was set up with
the constant from another meter. A damaged rotor, meaning the instrument is
broken. All three are conditions to investigate.

What they are not is a reason to apply the factor and carry on. A meter factor
is a small correction to a meter that is essentially working. Once the number
needed to make the meter agree with the prover gets large, the factor has
stopped being a correction and has become a measurement of how wrong the
instrument is.

## The screen is a screen rather than an acceptance limit

The screen only says that the software would like somebody to look. Your
operating procedure, your metering agreement and your regulator may all set
narrower bands. None of those documents is in this package, so a silent result
has cleared this engine's own check and nothing more than that.

## Exercise

Your last three provings returned factors that stayed silent on this screen, and
today's fires. Say what you would check first, using the three causes the engine
names, and say why applying today's factor to the day's volumes would be the
wrong move.
