# The customary band, and either side of it

Two bands sit on the glycol loop and they behave differently at their edges. One is customary and warns. One is physical and refuses. Reading both from either side of both edges tells you more about the module than any single answer inside them does.

{{panel:fc-water-explorer}}

## The customary band warns, and its edges are inclusive

| gal per lb | warning |
| --- | --- |
| 1.999999 | outside the customary 2 to 5 gal per lb |
| 2.000000 | none |
| 5.000000 | none |
| 5.000001 | outside the customary 2 to 5 gal per lb |

The engine is silent at exactly 2.000000 and at exactly 5.000000, and it warns a millionth outside either. A guard that objected to its own customary limit would be as wrong as one that accepted anything at all.

It warns and still answers, which is the right behaviour for a customary range. Customary is a statement about what other people build. It is not physics, and a unit outside it is unusual rather than impossible.

## What the low end actually triggers

Below the band something else happens, and it is physical. A low ratio means each gallon of glycol has to pick up a lot of water, and the rich glycol comes back weaker.

| gal per lb | water a gallon picks up, lb | rich returns at, wt % |
| --- | --- | --- |
| 0.250000 | 4.000000000 | 69.365413534 |
| 0.500000 | 2.000000000 | 81.642477876 |
| 1.000000 | 1.000000000 | 89.568932039 |
| 2.000000 | 0.500000000 | 94.138775510 |
| 3.200000 | 0.312500000 | 95.975032510 |
| 5.000000 | 0.200000000 | 97.111578947 |

At the first three rows the engine adds a second sentence to its warning: the rich glycol returns below the 90 weight percent this module will accept as a lean strength, so the loop is carrying more water than a glycol loop is meant to. The last three rows are silent on that point.

The reason the module cares is that a glycol loop is defined by the strength it runs at. A solution that comes back at 69.365413534 weight percent is still water and glycol, and it has stopped being a dehydration loop doing a dehydration loop's job. The regenerator on that unit is sized for a different water load, the contactor for a different lean strength, and the dew point the unit is sold on comes off a chart that assumes neither of those has moved.

So the warning at a low ratio is doing two jobs at once. It says the design sits outside what people build, and it says what specifically has gone wrong at the rich end. The first half is advisory. The second half is a statement about the loop.

## The strength band refuses, and its edges are exclusive

| lean, wt % | the engine |
| --- | --- |
| 90.000000000 | refuses |
| 90.000001000 | answers, rich returns at 87.074123 wt % |
| 99.999999000 | answers, rich returns at 96.749024 wt % |
| 100.000000000 | refuses |

Both edges are excluded, and for two separate reasons. Below 90 weight percent the loop is not a dehydration loop at all. At 100 weight percent the purity is one no regenerator reaches.

## Inclusive, exclusive, and why the difference is the lesson

A customary band includes its edges because the edge value is a perfectly ordinary design. A physical band excludes its edges because the edge value is the point at which the description stops being true. Two bands, two behaviours, and the module's choice on each one says what kind of claim it is making.

## Exercise

Record what the engine does at 1.999999, 2.000000, 5.000000 and 5.000001 gal per lb, and at 90.000000000, 90.000001000 and 100.000000000 weight percent. Then say which band warns and which refuses, which edges are inclusive and which are exclusive, and give the reason for each.
