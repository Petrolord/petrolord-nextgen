# Four questions about one exchanger

The Heat Exchanger & Cooling Studio puts three tabs over one exchanger. Sizing takes a duty and returns a surface and a bundle. Rating takes a surface and returns what it delivers. Air Cooler sizes a bay and then rates it on a hot afternoon. One machine, asked about three ways.

## The four questions

This engine answers four questions about one exchanger. What duty do these two streams exchange. What driving force do they exchange it across. What coefficient does the surface carry. How much surface, and how many tubes, does that take. Having answered those it rates a machine you already have, in both directions, and it sizes an air cooler.

This tier owns the first question, the second and the fourth. The duty is a balance over two streams. The driving force is a log mean of two end temperature differences. The surface is the duty divided by the coefficient, the correction factor and that log mean, and the tubes are the surface divided by the surface of one tube. The third question, the coefficient, is assembled out of named parts and it has a module of its own in the next tier.

## The chain is a loop

Read the four questions in order and they look like a line. They are not a line. The film inside the tubes needs a tube count to know how fast the fluid is going. The count needs an area. The area needs the coefficient. And the coefficient needs the film. The chain closes on itself.

That sounds like trouble and it is not. The map is a contraction, so plain iteration settles, and the studio shows the trail as it settles. You meet the trail at the end of this tier, once every link in it has been taken apart on its own.

## What is not in this engine

There is no shell-side film coefficient worked out from stream analysis here, no pressure drop, no vibration check, no condensation or boiling, no fin geometry and no rigorous cross-flow rating. The shell side stays an input and the module says so plainly.

Two of those belong elsewhere in this package. Pressure drop in a line belongs to the Pipeline and Line Sizing engine. Machine work, which is what a pump or a compressor does, belongs to Rotating Equipment. A fan turns up here, and its power is one line of arithmetic rather than a study of a machine.

## The discipline underneath all of it

Every answer in front of you came from one of three places. The engine computed it. You chose it and typed it. Or the engine declined to invent it and said so. Heat transfer goes wrong when those three get mixed up, and a fouling allowance somebody typed starts being read as a measurement. This course keeps asking which of the three a number is.

## Exercise

Write down the four questions this engine answers, in the order given above. Beside each one, write the quantity it produces and the quantities it consumes. Then find the place in your list where a consumed quantity is produced further down, and say in one sentence why that makes the chain a loop rather than a line.
