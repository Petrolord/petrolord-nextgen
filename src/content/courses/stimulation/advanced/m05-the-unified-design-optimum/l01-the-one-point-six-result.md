# The one point six result

The engine carries 1.6 as a published constant. A search that has never heard of it lands on it anyway.

{{panel:st-pack-explorer}}

## The constant as it is normally met

Unified fracture design states that for a fixed volume of proppant placed in a given formation, the dimensionless fracture conductivity that maximises well productivity is about 1.6. The engine carries that as a named constant, CFD_OPTIMUM, with the value 1.6. It also carries the range over which its pseudo-skin correlation is meant to be used, 0.1 to 1000.

Met that way, 1.6 is a thing you look up. You take it on the authority of the paper it came from, you design to it, and if someone asks why that value rather than a neighbouring one you have nothing to say beyond the citation.

## The same number, derived

Now take a different route. Hold the proppant volume fixed, let the half-length vary, and at each half-length compute the propped width the pack can afford, the dimensionless conductivity that follows, and the pseudo-skin from the correlation. Then run a golden-section search for the half-length that makes the pseudo-skin as negative as possible.

That search optimises the skin. It never reads CFD_OPTIMUM. It does not know the constant exists.

Here is where it stops.

| quantity | searched value |
|---|---|
| half-length | 95.62290278496067 m |
| dimensionless conductivity | 1.6363280590574483 |
| pseudo-skin | -5.4132436175894565 |
| effective wellbore radius | 24.230679198301456 m |
| published constant | 1.6 |
| ratio of the two | 1.0227050369109052 |

The searched conductivity and the published constant agree to a couple of per cent, which for a design rule of this kind is agreement.

## Why that is worth more than the constant

A constant you can only quote is a convention. It is a number the industry has agreed to use, and it is as good as the trust you place in its source.

A constant you can rederive from an independent route is a result. The optimum is not a convention here. It falls out of the interaction between two things the engine models separately, the pack the proppant can build and the skin that pack produces, and it would still be near 1.6 if nobody had ever published it.

Say that plainly to anyone who asks why you designed to 1.6. You did not look it up. You found it.

## The grid and the search do not agree, and the search is right

The discrete sweep across nine half-lengths has a best row, and it is not the same answer.

| route | half-length | conductivity | pseudo-skin |
|---|---|---|---|
| best row of the grid | 90 m | 1.8471799468076697 | -5.411369722473095 |
| golden-section search | 95.62290278496067 m | 1.6363280590574483 | -5.4132436175894565 |

The grid best sits at 1.8471799468076697 because 90 m was one of the nine half-lengths the sweep happened to include. A grid returns the best row it was given, not the best design. The search is continuous, so it can stop between the rows, and it does.

Trust the search. Use the grid to see the shape.

## Exercise

First, in the panel, read off the searched optimum and write down the four numbers it reports. Then find the two grid rows the searched half-length falls between and confirm that its pseudo-skin is better than both.

Second, state in one sentence, without using the word about, how you would answer a reviewer who asks where 1.6 comes from.
