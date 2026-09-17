# Buoyancy against drag

Everything gravity and everything centrifugal in this module comes from one balance. A droplet of oil rises because it is lighter than the water around it, and the drag it feels on the way up balances that buoyancy. When the two are equal the droplet moves at a steady velocity, and that velocity is what every device in this course is really trading in.

## Where the law itself is taught

The settling of one liquid through another under gravity is not derived here. It belongs to the separation course, which owns the law and the vessel sizing that follows from it. What this module does is take that balance as given, state the flow regime it is honest in, and report the Reynolds number of every droplet it applies it to.

## Creeping flow, which is the assumption

The closed form of the balance holds when the flow around the droplet is slow and orderly, with no wake behind it. That regime is called creeping flow. Inside it the drag is proportional to the velocity and the balance solves in one line. Outside it the drag grows faster, and the closed form starts to overstate how fast a droplet travels.

## Two numbers measured back out of the engine

Two figures in this module can be recovered from the engine's own answers rather than read out of its source, and both are worth seeing. Take a 100 micron droplet in the UZERE water, which the engine says rises at 0.001091782327 m/s. Combine gravity, the diameter squared and the density difference against the viscosity and that velocity, and the group comes to 18.000000000000. Eighteen is the constant in the standard form of the balance, and nothing typed it into that answer: it falls out of the arithmetic.

## Gravity, on the same reasoning

The same trick recovers standard gravity. Take eighteen times the viscosity times that same rise velocity, over the diameter squared and the density difference, and the answer is 9.806650 m/s2. That figure is neither declared nor derived by anybody in this module. It is a property of the planet, and the fact that the engine returns it exactly is evidence that the balance inside is the balance it claims to be.

## Why measuring a constant out is worth doing

Reading a constant out of source code proves that somebody typed it. Recovering it from the engine's output proves that the arithmetic which produced the answer used it. Those are different claims, and only the second one survives a rewrite of the implementation.

{{panel:pw-water-explorer}}

## Exercise

State the balance a rise velocity comes from in one sentence. Then explain the difference between reading 9.806650 out of a source file and recovering it from a returned velocity.
