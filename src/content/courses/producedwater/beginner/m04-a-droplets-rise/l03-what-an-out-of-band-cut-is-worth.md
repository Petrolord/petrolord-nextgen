# What an out of band cut size is worth

A cut size that sits outside creeping flow is still a number, it still prints, and it is worth less than a number inside the band. This lesson is about how much less and what to do about it.

## Every device reports the Reynolds number of its own cut droplet

The band is not something a reader has to remember and apply by hand. Every device in this module reports the Reynolds number of the droplet at its own cut size and warns the same way the rise velocity does. So a cut size arrives with the evidence about its own trustworthiness attached, and there is no separate check to run.

## What the warning sounds like

The engine's words are that the cut droplet sits outside the creeping flow Stokes is stated for, so this cut size is optimistic. That sentence carries two things a reader needs. It says which assumption was broken, and it says which way the resulting error points. A warning that only said the answer was doubtful would leave the designer guessing whether to add margin or take it away.

## A basin inside the band and a basin past it

The UZERE basin cuts at 165.003927 micron with its cut droplet at a Reynolds number of 0.714614, comfortably inside the band, and it returns no warning of any kind. Push the same basin's short-circuit allowance to 2.5 and the cut size becomes 213.019154 micron, at which point the engine reports both that the allowance is outside its customary range and that the cut droplet is outside creeping flow. Two warnings, one answer, and the answer still arrives.

## A published case on the far side, on purpose

The golden cases this engine is validated against do not all sit inside the band. One published basin row cuts at 188.080643 micron with a golden Reynolds number of 1.851949, which is past the stated limit, and it is in the file deliberately. A gate that only ever sees cases inside a band cannot tell whether the band is being policed at all. Testing the comfortable cases proves the arithmetic. Testing an uncomfortable one proves the guard.

## What a designer should actually do

Treat an out of band cut size as a coarse indication rather than a design figure. The equipment is being credited with catching finer oil than it will, so the real performance is worse than the printed one. Where the whole design rests on that number, the honest moves are to make the device larger until the cut droplet falls back inside the band, or to obtain a rise velocity from a method that does not assume creeping flow. Carrying the optimistic figure forward without saying so is the one option the warning exists to prevent.

{{panel:pw-water-explorer}}

## Exercise

Explain what the Reynolds number reported beside a cut size is telling a reader. Then say why a published case sitting outside the stated band makes a test suite stronger rather than weaker.
