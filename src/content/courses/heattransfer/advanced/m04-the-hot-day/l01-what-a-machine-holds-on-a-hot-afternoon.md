# What a machine holds on a hot afternoon

A bay is bought for its worst afternoon. So the question that decides a purchase is not what it does on its design day. It is what it still does when the air arrives hotter than the day the surface was chosen against.

{{panel:fc-rating-explorer}}

## What the plant actually owns

Two things survive the weather. The surface, and the air mass the fans move. Those two fix UA and both capacity rates, so they fix NTU and the capacity ratio, so they fix the effectiveness. The duty then follows from the difference between the two inlet temperatures alone, and the new process outlet and the new air rise come out with it.

On the studio bay those fixed quantities are an effectiveness of 0.645161, an NTU of 1.172829, a capacity ratio of 0.300000 and a UA of 234565.8720 Btu an hour per degF. Nothing in that list is a function of the ambient.

Notice what is absent from it. There is no duty, no outlet temperature and no driving force, because those three are properties of an afternoon rather than of a machine. Sorting a rating sheet into those two piles is most of the skill here.

## Effectiveness from its definition

The effectiveness above is not read off an arrangement relation. It is taken from the definition at the design point: the design duty over the smaller capacity rate times the span between the two inlet temperatures. That matters more than it looks.

Because the effectiveness is a definition rather than a closed form, this rating assumes no arrangement and applies no correction factor. The one number this module cannot source, the cross-flow correction, therefore never enters. The engine states the basis on every answer: "effectiveness-NTU at fixed UA and fixed air mass; no arrangement and no F correction is assumed".

## UA is what the rating can see

UA is the duty over the design log mean, so a hot-day rating cannot see the coefficient and the area separately at all. That is measurable rather than arguable. Rate the same bay at three different coefficients and read the last three columns.

| coefficient on the bare surface | bare surface, ft2 | UA, Btu an hour per degF | duty fraction | process out on the hot day, degF |
| --- | --- | --- | --- | --- |
| 4.500000 | 52125.749338 | 234565.8720 | 0.903226 | 159.677419 |
| 5.100000 | 45993.308239 | 234565.8720 | 0.903226 | 159.677419 |
| 45.000000 | 5212.574934 | 234565.8720 | 0.903226 | 159.677419 |

The surface column moves by a factor of ten and the rating does not move at all. A published row for this calculation therefore carries UA and no coefficient, which is a statement about the calculation rather than an omission in the file.

It also tells a reader where to spend their scepticism. An argument about whether a coefficient of 4.500000 is right for a finned bundle is an argument about the design surface, and it cannot change what the rating says the bay holds once that surface exists.

## What this leaves for the next lessons

The mechanism is now in one sentence: the machine is the same machine at every ambient, and what changes is the air it is given. The next lesson reads the four columns that hold still, the one after it reads the two that move, and the last one checks the whole thing by a second method.

## Exercise

Record the four fixed quantities of the studio bay. Record the three rows of the table with the surface each coefficient implies. Then write the basis string the engine reports and say which held item it keeps out of this answer, and how.
