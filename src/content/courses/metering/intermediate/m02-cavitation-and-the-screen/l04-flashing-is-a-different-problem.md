# Flashing is a different problem with a different fix

Cavitation and flashing look alike on a datasheet and behave nothing alike in a pipe. Both start with liquid vaporising in the vena contracta. What separates them is what happens after the restriction, and the remedy for one makes no difference at all to the other.

## Where the engine draws the line

The line is the outlet pressure against the vapour pressure. The course states the case directly: an outlet pressure of 26.740000 psia and a vapour pressure of 28.740000 psia. The engine returns flashing true, the regime word `flashing`, and a coefficient of 19.148480.

The crossing is printed rather than inferred. The outlet pressure where the engine turns the flashing flag on is 28.740000 psia and the stated vapour pressure is 28.740000 psia. The difference, the first less the second, is 0.000000, and the ratio, the first over the second, is 1.000000.

That is as clean a boundary as this course carries. The engine turns the flag on at exactly the vapour pressure, which means the test is the physical statement it appears to be: if the pressure downstream of the valve never recovers above the pressure at which this liquid boils, the vapour that formed in the throat has nowhere to condense back to.

## Why the fix is different

In cavitation the bubbles collapse, and the collapse is violent, local and close to the trim. Hardened trim and staged pressure letdown work because they move the collapse away from the metal or stop it happening at all.

In flashing there is no collapse. The stream leaves the valve as a two-phase mixture and stays that way. Anti-cavitation trim has nothing to suppress. What is left is a high velocity mixture of liquid droplets and vapour scouring whatever it meets, which is an erosion problem in the valve outlet and the downstream pipe rather than an implosion problem at the plug.

The engine says so in its own words:

> `the outlet is at or below the vapour pressure: this service is FLASHING, not
> cavitating, and an anti-cavitation trim will not help it. Size for two-phase flow and use hardened trim with an expanded outlet`

Three instructions sit in that message and all three are separate. Size for two-phase flow, because the mixture leaving is not the liquid that arrived. Use hardened trim, because the erosion is unavoidable. Expand the outlet, because the vapour occupies a great deal more volume than the liquid it came from.

A last point on where this sits in the march. The last two rows of the BELEMA march, at outlet pressures of 28.740000 psia and 20.000000 psia, return the regime word `flashing` while the coefficient stays at 19.148480 and the choked flag stays true. The sizing has been capped and the damage mechanism has changed underneath the cap, and the regime word and the flashing flag record the second of those two events while the choked flag cannot.

## Exercise

Write down the outlet pressure and the vapour pressure of the flashing case, and the difference and the ratio the lesson prints between the flashing crossing and the stated vapour pressure. Then say, in one sentence each, what an anti-cavitation trim does for a cavitating service and what it does for a flashing one.
