# Why a flowline is a thermal problem

Hydrates and wax do not care what pressure a line holds. They care that the fluid fell below a temperature, and the seabed is always colder than the reservoir.

## One pipe, three builds

The published case behind this course is a single pipe expressed three ways. The bore is 6.065 in, the steel wall runs out to 6.625 in at k 26, and the insulated build adds 2.0 in of syntactic polypropylene foam to 8.625 in at k 0.09. Inside film 250, outside film 200. The buried build drops that same pipe into a trench 4.0 ft to centreline in wet soil at k 1.2.

| Build | U, Btu/(hr ft2 degF) |
| --- | --- |
| Bare, the steel wall alone | 105.9799311355 |
| Insulated, plus 2.0 in of foam | 1.3348791131 |
| Buried, plus a 4.0 ft trench | 0.7132000377 |

Foam divides the bare U by 79.39290539. The trench on top of it divides again by 1.87167561. End to end that is 148.59776436, and no fluid, no rate and no length has been named yet.

## U is a leak rate, per square foot, per degree

The overall coefficient is Btu per hour per square foot per degF: how fast heat crosses the wall stack for every degree of difference across it, referred to a named area. It is a property of the pipe and its surroundings and of nothing else. Change the crude, change the rate, change the season, and U does not move.

## The finish line belongs to someone else

The engine draws no boundary. Its own header says hydrate and wax boundaries "are fluid properties, they come from a lab or a compositional flash, and the consumer supplies them", and the inhibition module says in as many words that it "does NOT compute where the hydrate boundary is in the first place".

So the race has a computed decay and a finish line handed in from a laboratory. The half that decides pass or fail is not arithmetic at all.

## The mistake

Reading a low U as an answer. A U of 0.7132000377 Btu/(hr ft2 degF) is not warm arrival and not a safe line: it is one of four numbers an arrival needs, and the number it will eventually be judged against was never computed here at all.

## Exercise

Write the three U values down and beside each one the ratio to the build above it.

Then say, in one sentence, which of the three quantities in a hydrate verdict this engine does not produce.
