# Net pressure from width

The two models turn the same width into net pressure through different length scales, and that is the whole reason they behave oppositely.

{{panel:st-frac-explorer}}

## The two compliances

Net pressure is what holds the fracture open, so a model that knows the width also knows the pressure. Each gets there from its own elasticity solution.

    PKN:  p_net = E' w_max / (2 hf)
    KGD:  p_net = E' w_max / (4 xf)

The numerator is the same in both. The denominator is not. PKN divides by fracture height, because there the crack is confined vertically and the rock resisting the opening is the rock over the height. KGD divides by half-length, because there the crack is a through-crack in plan view and the resisting rock spans the length.

## Why they diverge

Height is an input and does not change as the fracture extends, so in PKN the denominator is frozen while the numerator grows with the quarter power of half-length. Net pressure rises as the job proceeds.

Half-length is the thing that grows. In KGD the denominator grows faster than the numerator, since width goes as the square root of half-length, so net pressure falls.

| half-length, m | PKN net pressure, Pa | KGD net pressure, Pa |
|---|---|---|
| 40 | 2076588.0505800513 | 1166434.0645127255 |
| 100 | 2611171.234479475 | 737717.6768535987 |
| 150 | 2889735.9944400033 | 602343.9608409083 |
| 300 | 3436494.6050675157 | 425921.49931737053 |

At 40 m the two models disagree by a factor of 1.7802875565431469. At 300 m they disagree by 8.06837553533979, and in opposite directions.

## The published pressures

At the design half-length of 150 m the PKN net pressure is 2889735.9944400033 Pa and the KGD net pressure is 602343.9608409083 Pa. Adding the closure stress of 38131950.890444934 Pa gives bottomhole treating pressures of 41021686.88488494 Pa and 38734294.851285845 Pa.

Those two answers ask for different pumps and different tubulars.

## What the field data says

A treatment whose net pressure climbs through the job is behaving like PKN, which is consistent with contained height. One that falls is behaving like KGD or is growing height. That is the basis of net pressure matching, and it works because the two models disagree so loudly.

## Exercise

Sweep half-length in the panel from 40 m to 300 m. Confirm that one net pressure rises, the other falls, and the gap widens the whole way.

Then take the published PKN net pressure and work out the treating pressure if the closure stress were higher by a tenth.

Finally, say which of the two trends you would expect to see on a well with a thick, strong shale above and below the pay.
