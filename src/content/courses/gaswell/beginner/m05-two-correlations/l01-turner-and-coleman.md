# Turner and Coleman

Two names, one equation. The difference between them is a single multiplier, and everything else in the calculation is shared to the last digit.

{{panel:pd-droplet-explorer}}

## The multiplier is the whole of it

The module carries two adjustments: Turner at 1.200000 and Coleman at 1.000000. The difference between them, as a percentage, is 20.000000.

Coleman applies no adjustment at all, which means the Coleman critical velocity is the terminal velocity of the droplet balance, unmodified. Every published row shows it: the terminal velocity and the Coleman critical velocity are the same number on all twelve.

## The physics underneath is identical

At 1200.0 psia, 600.0 degR and z 0.9 the Turner terminal velocity is 6.3307682001 ft/s and the Coleman terminal velocity is 6.3307682001 ft/s, a difference of 0.0000e+0 ft/s. Both routes use the same droplet constant, 1.5935346111.

At that station the Turner critical velocity is 7.5969218402 ft/s and the Coleman critical velocity is 6.3307682001 ft/s. The gap appeared in the last step, after the drag coefficient, the Weber number, the surface tension, the two densities and the constant had all already agreed.

A lesson that says the two correlations model different droplets, or different break-up, or different drag, is wrong. They model the same droplet and then one of them multiplies.

## Where the multiplier came from

Turner and his co-authors compared the theoretical velocity to their field data and found the data sat about twenty percent above it, so they applied the adjustment. Coleman and his co-authors worked on low-pressure wells and found the unadjusted equation fitted better, so they did not.

Both are field fits. Neither is a derivation, and neither claims to be. The multiplier of 1.200000 is a number two groups of engineers arrived at by looking at wells that were not this one.

## The mistake

Reading Turner as the conservative choice and Coleman as the optimistic one, then picking Turner as a matter of prudence. Turner returns the higher critical velocity, so it does flag more wells as loaded, but that is not caution. It is the claim that this well behaves like the wells in one dataset rather than the wells in another. Choosing a correlation to buy margin is choosing a physical claim for a commercial reason, and the report will not record that you did.

## What it refuses

Ask for anything other than these two and the module refuses. A correlation named guess returns ok = false and the error "Unknown loading correlation "guess". Use turner or coleman."

That refusal is worth noticing because it is not the module's habit everywhere. Hand it a fluid id it does not recognise and it falls back to water without complaint. On the correlation it stops.

## Exercise

Set the panel to 1200.0 psia, 600.0 degR and z 0.9 and read the terminal velocity under each correlation. Write down the two critical velocities and the one number that separates them.
