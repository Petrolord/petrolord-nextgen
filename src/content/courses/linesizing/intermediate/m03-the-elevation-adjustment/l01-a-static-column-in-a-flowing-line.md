# A static column in a flowing line

Every one of the four forms shares one elevation term. It is built from a dimensionless group called s, and on the SOKU trunk 1500.000000 ft of rise makes s equal to 0.0795976556.

{{panel:fc-gasline-explorer}}

## s and the exponential built from it

| elevation change ft | s | e to the s |
| --- | --- | --- |
| 0.000000 | 0.0000000000 | 1.0000000000 |
| 1500.000000 | 0.0795976556 | 1.0828513009 |
| -1500.000000 | -0.0795976556 | 0.9234878318 |
| -3000.000000 | -0.1591953113 | 0.8528297754 |

s itself is well behaved. It is proportional to the elevation change, so a rise of 1500.000000 ft and a fall of the same size give exactly opposite values, and doubling the fall to 3000.000000 ft doubles s to -0.1591953113. Everything that is awkward about a hill happens after s, when it goes into an exponential.

## What s is made of

s carries the gas gravity, the elevation change, the absolute flowing temperature and the compressibility. Those are the four things that decide how much a column of this gas weighs, which is what the term is for. A heavier gas, a taller hill, a colder line or a lower compressibility all make the column count for more.

The coefficient in front can be read out of the engine rather than taken on trust. Ask for s at a gravity of one, a rise of 1000.000000 ft, an absolute temperature of one and a compressibility of one, and the engine returns 37.500000. Divided by the thousand feet that is 0.037500000000, the published elevation coefficient of the gas forms.

## This is a static column inside a flowing calculation

The rest of a transmission form is about motion: a rate, a friction, a bore. The elevation term is about none of those. It is the weight of the gas standing in the pipe, and it would be there at no flow at all. That is why it is the same term in all four forms while the forms disagree about everything else. They disagree about friction and they agree about gravity.

## At zero it disappears cleanly

At an elevation change of 0.000000 ft, s is 0.0000000000 and e to the s is exactly 1.0000000000. The adjustment collapses and the flat form comes back unchanged. That is worth checking on any implementation, because an elevation term that leaves a residue at zero elevation is wrong on every flat line it will ever be given.

## s is a number without units

Everything entering s is arranged so that the result carries no units, which is what allows it to be handed to an exponential at all. That is a check worth keeping: a quantity about to be exponentiated that still carries feet or degrees has gone wrong somewhere upstream. It is also why the coefficient of 0.037500000000 belongs to the field units these forms are written in and would be a different number in any other system.

## The mistake

The mistake is carrying an elevation term across from a liquid line, where a hill is a static head added to the drop. Here it does not add. It multiplies, inside an exponential, and the next lesson shows where.

## Exercise

Give s and e to the s at rises of 0.000000 ft and 1500.000000 ft and at falls of 1500.000000 ft and 3000.000000 ft. Name the four quantities s is built from. Then describe how the elevation coefficient of 0.037500000000 was measured out of the engine.
