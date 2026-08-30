# ECD at the previous shoe

The number that decides whether the job can be pumped at all.

{{panel:cm-placement-explorer}}

## What it is

The pressure the annulus exerts at the previous casing shoe, converted to an equivalent mud weight:

    ECD = (head above the shoe + friction above the shoe) / (g x TVD of the shoe)

Only the part of the annulus ABOVE the shoe is counted, because that is what is loading the formation there.

## Why that shoe and not the deepest point

Because the previous shoe is the shallowest exposed formation, and the fracture gradient generally rises with depth. The weakest point in an open hole is almost always just below the last casing shoe, which is why the leak-off test is performed there.

## Where the engine finds it

    the deepest cased hole section whose bottom is at or above the casing shoe

On the slant well that is 1400 m, with a true vertical depth of 1282.248590310811. On the horizontal well it is 1200 m at 1172.343525979085.

## The shape through the job

It is FLAT for most of the job and then rises at the end.

On the slant well's two-slurry programme it sits at 1631.9010099539694 kg/m3 from the start through the thirty-first of sixty-one steps, and finishes at 1657.6738234800569.

## Why flat

Because nothing above the previous shoe has changed. For the first two thirds of the job the annulus above 1400 m is still full of the original mud, and the cement is all below it. The head and the friction over that interval are the mud's, unchanged.

The number moves only when cement, or spacer, crosses 1400 m on its way up.

## Which means the peak is at the end

    maxEcdPrevShoeKgM3

is the maximum over the series, and on every one of the four runs in this course it occurs at the last step. The most dangerous moment of a cement job for the shoe above is the moment the plug bumps.

## The four values

| well | programme | peak ECD at the previous shoe |
|---|---|---|
| slant | lead and tail | 1657.6738234800569 |
| slant | neat | 1712.1218125074865 |
| horizontal | lead and tail | 1652.9521977452723 |
| horizontal | neat | 1715.156233904509 |

The neat programme is worse by about 55 kg/m3 on the slant well and 62 on the horizontal one, on the same total slurry.

## What it is compared against

A leak-off or formation integrity test at that shoe, expressed as an equivalent mud weight. This engine takes it as an optional input and warns:

    ECD at the previous shoe peaks at 1658 kg/m3, above the fracture EMW 1600 kg/m3.

If no limit is supplied, no warning is issued, and the peak is reported anyway for the reader to compare.

## Exercise

The slant well's previous shoe is at a true vertical depth of 1282.248590310811 m and its peak ECD is 1657.6738234800569 kg/m3.

Convert that to a pressure in pascals, and say how much higher it is than a static column of 1440 kg/m3 mud to the same depth.
