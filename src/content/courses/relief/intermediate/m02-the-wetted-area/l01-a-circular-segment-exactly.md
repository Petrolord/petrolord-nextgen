# A circular segment, exactly

{{panel:fc-fire-drum-explorer}}

The fire case is the one route that computes its own relief load, and the first thing it computes is geometry. A horizontal vessel wetted to a level presents a circular segment of shell to the pool below it, and the wetted area is the wetted arc times the vessel length. That is an exact expression with no correlation in it, which makes it the easiest thing in this whole module to check.

## The teaching vessel

| stated about BENISEDE | value |
| --- | --- |
| orientation | horizontal |
| diameter | 12.000000 ft |
| length | 45.000000 ft |
| liquid level | 4.200000 ft |
| wetted area | 683.6960 ft2 |

Four facts and one answer. The arc angle follows from the level and the radius, the arc length from the angle and the radius, and the area from the arc length and the vessel length. Nothing is fitted and nothing is iterated.

## Why an exact first link matters

The fire case is a chain of four links: geometry, duty, load, area. The last three all carry something published. The duty carries two constants and an exponent that came off a page. The load carries a latent heat somebody looked up. The area carries a discharge coefficient and a back pressure factor. Only the first link is pure geometry, and that makes it the one place in the chain where an answer can be right beyond argument.

So the tier starts here. Get the geometry wrong and every figure downstream is wrong, silently, because nothing further along the chain can notice that the area it was handed describes the wrong vessel.

## What the geometry deliberately leaves out

The heads are ignored. A real vessel closes with two dished ends and the engine adds no area for them, which is standard screening practice and conservative for the shell term, because a wetted head would add area and therefore duty. This course does not add them either, and a head allowance for a detailed case is yours to make outside this route.

The level is what is stated and nothing corrects it. There is no allowance for internals and no attempt to guess whether the liquid is boiling away as the fire burns. A wetted area here is a snapshot at one level.

## The orientation refuses rather than defaulting

The orientation string is matched case insensitively and trimmed of surrounding space, so a call carrying a capital letter or a stray space still resolves. Anything the route does not recognise refuses rather than falling through to a default: the answer is `orientation must be 'horizontal' or 'vertical'` and no area comes back at all. That is the right behaviour. A silent default would hand a vertical tower a horizontal segment area and nothing on the screen would say so.

## The published horizontal cases

| diameter ft | length ft | level ft | published ft2 | engine ft2 | relative difference |
| --- | --- | --- | --- | --- | --- |
| 10.000000 | 40.000000 | 5.000000 | 628.3185 | 628.3185 | 1.990e-15 |
| 10.000000 | 40.000000 | 2.500000 | 418.8790 | 418.8790 | 1.065e-13 |
| 8.000000 | 24.000000 | 7.900000 | 560.1633 | 560.1633 | 8.950e-14 |
| 12.000000 | 30.000000 | 1.200000 | 231.6604 | 231.6604 | 1.186e-13 |

Four rows, with relative differences running from 1.990e-15 to 1.186e-13, which is the size of a double's own rounding rather than the size of a modelling error. The derivation matters: the oracle walks a polyline round the real circle and extrapolates, rather than evaluating the same arc formula the engine uses. An oracle restating the engine's own algebra proves the arithmetic and nothing about the geometry.

## Exercise

Write down the four stated facts about the teaching vessel and the wetted area they produce. Then say what the geometry leaves out and why leaving it out is conservative, and state what the route answers when the orientation is a word it does not recognise.
