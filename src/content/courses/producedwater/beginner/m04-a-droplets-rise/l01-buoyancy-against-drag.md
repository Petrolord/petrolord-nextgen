# Buoyancy against drag

Everything gravity and everything centrifugal in this module comes from one balance. A droplet of oil rises because it is lighter than the water around it, and the drag it feels on the way up balances that buoyancy. When the two are equal the droplet moves at a steady velocity, and that velocity is what every device in this course is really trading in.

## Where the law itself is taught

The settling of one liquid through another under gravity is not derived here. It belongs to the separation course, which owns the law and the vessel sizing that follows from it. What this module does is take that balance as given, state the flow regime it is honest in, and report the Reynolds number of every droplet it applies it to.

## Creeping flow, which is the assumption

The closed form of the balance holds when the flow around the droplet is slow and orderly, with no wake behind it. That regime is called creeping flow. Inside it the drag is proportional to the velocity and the balance solves in one line. Outside it the drag grows faster, and the closed form starts to overstate how fast a droplet travels.

## Three numbers measured back out of the engine

Three figures in this engine can be recovered from its own answers rather than read out of its source. Take a 100 micron droplet in the UZERE water, which the engine says rises at 0.001091782327 m/s. Combine gravity, the diameter squared and the density difference against the viscosity and that velocity, and the group comes to 18.000000000000. Eighteen is the constant in the standard form of the balance, and nothing typed it into that answer: it falls out of the arithmetic.

## Gravity, on the same reasoning

The same trick recovers standard gravity. Take eighteen times the viscosity times that same rise velocity, over the diameter squared and the density difference, and the answer is 9.806650 m/s2. Nobody in this module declared or derived it. It is a property of the planet, and the engine returning it exactly is evidence that the balance inside is the one it claims.

## The third one, out of a different device

The third, which the lesson on the four kinds of number already named, comes out of the bed. The filter coefficient at the bed's reported cut size, times the bed depth, is 0.693147180560, the natural logarithm of two. A cut size is where half the volume goes and half survives, and half of an exponential is the log of two, so any device that captures by an exponential in depth defines its cut exactly there.

## Why measuring a constant out is worth doing

Reading a constant out of source code proves that somebody typed it. Recovering it from the engine's output proves that the arithmetic which produced the answer used it. Only the second survives a rewrite of the implementation.

{{panel:pw-water-explorer}}

## Exercise

State the balance a rise velocity comes from in one sentence. Then name the three figures this engine gives back when its own answers are recombined, say what each one comes out of, and explain the difference between reading 9.806650 out of a source file and recovering it from a returned velocity.
