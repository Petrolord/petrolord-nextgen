# Why the combination is below both

{{panel:fc-rate-explorer}}

Two steps in series share one throughput. Whatever chemistry could consume at the wall, it cannot consume faster than the flow delivers, and whatever the flow could deliver, it cannot be consumed faster than the chemistry reacts. The engine expresses that by adding the two resistances rather than the two rates: the reciprocal of the combined rate is the sum of the reciprocals of the two terms.

That form has a consequence a learner should be able to state before seeing any number. The combined rate is always below both terms, and it sits close to whichever term is the smaller of the two. The smaller term is the bottleneck, and adding capacity to the faster step moves the answer very little.

## The engine's own streams, read as a column

One stream runs a reaction term of 30.302325 mm/yr against a transport term of 5.597610 mm/yr, and the combination is 4.724817 mm/yr. Divide that combination by the smaller of the two terms and the engine reports 0.844077. A second runs 149.987114 mm/yr against 8.264482 mm/yr with a combination of 7.832881 mm/yr, giving 0.947776 against its smaller term. A third runs 10.013808 mm/yr against 0.091971 mm/yr with a combination of 0.091134 mm/yr, giving 0.990899.

Now a case where the two terms are close. One stream runs a reaction term of 44.114126 mm/yr against a transport term of 70.689594 mm/yr, and the combination is 27.162967 mm/yr, which is 0.615743 of its smaller term. Where one term dominates, the combination is nearly the smaller term. Where the two are comparable, the combination falls well below both of them.

## The identity is checked rather than asserted

This is one of the few claims in the module that needs no held constant at all. The generator behind this course checks the series identity on every row it prints and holds it to twelve figures: the reciprocal of the combined rate minus the reciprocal of each term comes out at zero. Because the check is arithmetic rather than a comparison against a fitted number, it survives whatever the correlation constants turn out to be.

That is what makes the combination a claim you can argue with. If a reported combined rate ever sat above either term, the arithmetic would be wrong and you could say so without reference to any source. The same reasoning gives you a quick sanity read on any screening: find the smaller term, and the printed combination should be near it and below it. A combination sitting near the larger term means one of the two inputs behind the smaller term has not reached the calculation, and the module has a refusal for exactly that case.

## Exercise

Take the reaction term of 44.225132 mm/yr and the transport term of 11.701938 mm/yr from the shipped case. Add their reciprocals, invert the sum, and check your answer against the combined figure of 9.253475 mm/yr the engine reports. Then repeat the arithmetic with a reaction term of 44.114126 mm/yr and a transport term of 70.689594 mm/yr against a reported combination of 27.162967 mm/yr, and say in one sentence how the closeness of the two terms shows up in the result.
