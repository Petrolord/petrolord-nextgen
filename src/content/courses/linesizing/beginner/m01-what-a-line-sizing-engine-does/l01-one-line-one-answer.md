# One line, one answer

A line-sizing engine answers one question about one pipe: what it costs in pressure, and what bore it needs. On the OGBIA crude export line that answer is 25.660631 psi through 7.981000 in of bore.

## The chain, in the order it runs

A bore gives an area. The area and the rate give a velocity. The velocity gives a Reynolds number. The Reynolds number and the relative roughness give a friction factor. The friction factor and the length give the loss.

On OGBIA that chain runs as follows. 12000.000000 bpd of 54.500000 lb/ft3 crude at 2.500000 cp passes through 7.981000 in of bore over 26400.000000 ft of commercial steel at 0.001800 in of roughness. The velocity is 2.244621 ft/s, the Reynolds number is 48431.2523, the regime is turbulent, the relative roughness is 0.0002255356, the friction factor is 0.0218149625, and the pipe spends 25.660631 psi.

## Every link carries the one before it

Six numbers, and each is the input to the next. The friction factor of 0.0218149625 exists only because the Reynolds number came back 48431.2523 at that viscosity and that bore. The 25.660631 psi exists only because the friction factor did. A single wrong condition at the top gives a line that is confidently the wrong size at the bottom, with every figure on the way down printing normally.

## This part is closed form

Work through that chain and nothing waits on anything. The area is arithmetic, the velocity is a division, the Reynolds number is a product of four things already known, and the loss follows once the friction factor is settled. The friction factor itself is the one step that iterates.

Nothing in the chain compresses either. A barrel entering the line is a barrel leaving it, so the velocity at the inlet is the velocity at the outlet. Both properties belong to this tier, and both change later.

## What one answer does not cover

The number is a cost in pressure for a single pipe. It does not say what a header full of pipes does when they share a pressure, and it does not say what happens when gas and liquid travel together. Those are different methods.

## The mistake

Reading 25.660631 psi as a property of the crude. It belongs to the whole row: that rate through that bore over that length on that roughness. Change the bore to 6.065000 in and the same duty spends 97.306913 psi. The fluid did nothing.

## Exercise

Write the OGBIA chain from 12000.000000 bpd to 25.660631 psi, naming what each step consumes from the step before it. Then say which single step in that chain iterates, and give the pressure the same duty spends at a bore of 6.065000 in.
