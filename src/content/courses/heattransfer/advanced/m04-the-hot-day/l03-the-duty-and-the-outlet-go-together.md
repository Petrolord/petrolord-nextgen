# The duty and the outlet go together

As the air gets hotter the duty falls and the process leaves hotter. Those two things are one thing. A rating that reports a falling duty beside a process outlet that has not moved is asserting something its own arithmetic cannot produce, and the cheapest way to find out is to compute one of the numbers from the other.

{{panel:fc-rating-explorer}}

## The two moving columns

| check ambient, degF | duty, Btu an hour | process out, degF | air rise, degF | air out, degF |
| --- | --- | --- | --- | --- |
| 86.000000 | 21161290.3226 | 144.193548 | 31.741935 | 117.741935 |
| 98.000000 | 19612903.2258 | 151.935484 | 29.419355 | 127.419355 |
| 104.000000 | 18838709.6774 | 155.806452 | 28.258065 | 132.258065 |
| 112.000000 | 17806451.6129 | 160.967742 | 26.709677 | 138.709677 |
| 124.000000 | 16258064.5161 | 168.709677 | 24.387097 | 148.387097 |

Three columns move together and one of them moves the other way. The duty falls, the outlet rises, the rise across the air falls with the duty, and the air outlet rises because the ambient underneath it has risen further than the rise has fallen.

No ratio between any two of these columns is computed here, so none should be quoted. The direction is the finding, and a reader who divides a duty by an outlet temperature has produced a number nothing stands behind.

## Closing it by hand

The consistency is checkable with two multiplications. At the design point the process capacity rate is the duty over the process temperature drop, and the air capacity rate is the duty over the air rise. On the studio bay those are 200000.0000 and 666666.6667 Btu an hour per degF.

Neither of those two rates depends on the ambient. A capacity rate is a mass flow times a heat capacity, and the weather changes neither. So both of them can be formed once at the design point and then used at every check ambient.

So at the bay's own check ambient the rated duty of 18064516.1290 Btu an hour has to equal the process capacity rate times the drop from the inlet to the new outlet, and it does. It also has to equal the air capacity rate times the new rise, and it does: both routes give 18064516.1290 Btu an hour.

## What that closure rules out

Any rating that hands back a duty, an outlet and a rise has already stated all three whether or not it computed them together. The three are tied by two capacity rates that do not change. So a sheet showing a duty that falls beside a fixed outlet is not merely imprecise. It describes a bay in which the same stream both carries less heat and leaves at the same temperature, which nothing does.

## The habit to take away

Pick the number on a result sheet that is most nearly redundant and compute it from the others. It costs one line. A result carrying several numbers has to be self-consistent, and the numbers that are not independent are the ones that catch the error.

The choice of which number to recompute is worth making deliberately. Take the one a reader is most likely to quote on its own, because that is the one that will travel furthest if it is wrong. On a hot-day sheet that is the process outlet, since it is the figure a downstream unit is designed against.

## Exercise

Record the five rows above. Form the two capacity rates from the design duty, the process drop and the air rise, then reproduce the rated duty at the bay's own check ambient from each of them in turn. Then say which pairs of columns you may compare in direction only and why.
